import { Controller } from "rapin/lib/common";
import { GET } from "rapin/lib/helper/request";
import Registry from "rapin/lib/engine/registry";
import moment = require("moment");

export class ControllerCommonHome extends Controller {
  constructor(registry: Registry) {
    super(registry);
    this.load.model("trader/trader");
  }

  @GET("/common/home")
  public async index() {
    this.load.config("default");
    let data = {};

    let prices = await this.model_trader_trader.getStatsByTemplate();

    const symbol = "ETHBTC";
    let currentStat = await this.model_trader_trader.getDailyStatFromAPI(
      symbol
    );

    data["current"] = {
      price: currentStat.price,
      volume: currentStat.volume
    };

    data["prices"] = prices.map(function(val, i) {
      return {
        timeFromNow: moment(val.time).fromNow(),
        price: val.price,
        pricePercent:
          Math.round((currentStat.price / val.price) * 10000) / 100 + "%",
        volume: val.volume,
        volumePercent:
          Math.round((currentStat.volume / val.volume) * 10000) / 100 + "%"
      };
    });

    data["header"] = await this.load.controller("common/header/index");
    data["footer"] = await this.load.controller("common/footer/index");

    this.response.setOutput(await this.load.view("common/home", data));
  }

  @GET("/common/start")
  public async start() {
    this.load.config("default");
    //get the timer of the main loop
    const timer =
      this.config.get("defaultConfig").traider_loop_timer_sec * 1000;

    //start main Boot loop
    setInterval(async () => {
      //start traider Stats
      this.startStats();

      //start traider Calcs
    }, timer);

    this.response.redirect("/common/home");
  }

  public async startStats() {
    console.log("Looping...");

    this.load.config("default");
    //get the timer of the main loop
    const symbol = "ETHBTC";

    let stat = await this.model_trader_trader.getDailyStatFromAPI(symbol);

    await this.model_trader_trader.addStat(stat);
  }
}
