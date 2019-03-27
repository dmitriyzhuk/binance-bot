import { isUndefined, size } from "lodash";
import { Model } from "rapin/lib/common";
import { Stat } from "entities/Stat";

/**
 * Class contains methods for working with users
 * @author Dreamvention <info@dreamvention.com>
 * @date 16/02/2019
 * (C) 2019 Instalegram
 */
export class ModelTraderTrader extends Model {
  /**
   * @async
   * Adding new user
   * @param {symbol,timer} data New user data
   * @returns {Promise<any>} New user
   */

  public async getStatFromAPI(symbol: string, timer: number): Promise<any> {
    const stat = {
      symbol: symbol,
      price: 0,
      volume: 0,
      time: ""
    };

    //get server time
    const startTime = await this.binance.time();

    //agrigated traids for the last period timer
    const aggTrades = await this.binance.aggTrades({
      symbol: stat.symbol,
      startTime: startTime - timer,
      endTime: startTime
    });

    //average Price at the current moment
    const avgPrice = await this.binance.avgPrice({ symbol: stat.symbol });

    //total volume of sales for the period timer
    let totalQuantity = aggTrades.reduce((acc, val) => {
      return acc + Number(val.quantity);
    }, 0);
    let avgQuantity = totalQuantity / aggTrades.length;

    stat.price = avgPrice.price;
    stat.volume = avgQuantity;
    stat.time = await this.binance.time();

    return stat;
  }

  public async getDailyStatFromAPI(symbol: string): Promise<any> {
    const stat = {
      symbol: symbol,
      price: 0,
      volume: 0,
      time: ""
    };

    //agrigated traids for the last period timer
    const dailyStats = await this.binance.dailyStats({
      symbol: stat.symbol
    });
    stat.price = dailyStats.lastPrice;
    stat.volume = dailyStats.quoteVolume;
    stat.time = await this.binance.time();

    return stat;
  }

  public async addStat(data: Stat): Promise<Stat> {
    const stat: Stat = await this.db.create("Stat");

    stat.symbol = data.symbol;
    stat.price = data.price;
    stat.volume = data.volume;
    stat.time = data.time;

    await this.db.save("Stat", stat);

    return stat;
  }

  public async getStats(): Promise<Stat[]> {
    let data = await this.db.find("Stat");

    let stat = data.map(function(val, i) {
      return {
        time: val.time,
        price: val.price,
        volume: val.volume
      };
    });

    return stat;
  }

  public async getStatsByTemplate(): Promise<Stat[]> {
    const time = await this.binance.time();
    const template = {
      "1m": 60,
      "2m": 120,
      "3m": 180,
      "4m": 240,
      "5m": 300,
      "10m": 600,
      "30m": 1800,
      "1h": 3600,
      "2h": 7200,
      "3h": 10800,
      "5h": 18000
    };
    let data = [];

    const entries = Object.entries(template);

    for (const i in entries) {
      let timePeriod = time - Number(entries[i][1] * 1000);
      let stat = await this.db.findOne("Stat", {
        order: { time: "DESC" },
        where: { time: { $lte: Number(timePeriod) } }
      });
      data.unshift(stat);
    }
    return data;
  }
}
