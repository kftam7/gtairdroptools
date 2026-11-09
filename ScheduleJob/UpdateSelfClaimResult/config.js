const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "127.0.0.1",
    user: "gtapi",
    password: "WpNEDT1c",
    database: "gtapi",
  },
  logConfig: {
    logFolder: "./logs/",
    logFile: "updateSelfClaimResult-%DATE%.log",
  },
  alchemy: {
    apiKey: "3iqNgDWSBHMkWq9vVT5GwGNuIJ_4vlbQ",
    network: "polygon-mumbai",
  },
  listPerPage: 1000000,
};
module.exports = config;
