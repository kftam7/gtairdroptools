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
    logFile: "updateTokenSent-%DATE%.log",
   },
  listPerPage: 1000000,
};
module.exports = config;
