const path = require("path");
module.exports = {
  // Database access
  db: {
    type: "mongodb",
    useNewUrlParser: true,
    url: process.env.DB_URL,
    ssl: true,
    authSource: process.env.DB_AUTH_SOURCE,
    replicaSet: process.env.DB_REPLICA_SET
  },
  // Style setting
  style: {
    engine: "postcss"
  },
  // Template setting
  template: {
    engine: "twig"
  },
  // Setting cache system
  cache: {
    engine: "file",
    expire: 3600
  },
  // Setting logs
  log: {
    filename: "error.log"
  },
  //Access to mail
  mail: {
    service: "gmail",
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD
  },
  // List plugins
  plugins: ["plugins/binance", "@rapin/typeorm"]
};
