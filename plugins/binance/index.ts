import Binance from "binance-api-node";

export default class BinancePlugin {
  public async afterInitRegistry({ registry }): Promise<void> {
    const binance = Binance({
      apiKey:
        "KmgdeHxD7eEJ8fvSBzxR4KDhBeO4htvcPewztmLWdsQ06BrVfSY8AOsUt4GhcgH6",
      apiSecret:
        "Ir1mEklbpur9K8YRTQ9bn7fGmXFZqgQRpUzbQZEkRZUUdNnzCC9BDM8patyy0UI5"
    });

    registry.set("binance", binance);
  }
}
