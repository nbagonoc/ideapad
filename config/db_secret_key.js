if (process.env.NODE_ENV === "production") {
  module.exports = require("./db_secret_key_prod");
} else {
  module.exports = require("./db_secret_key_dev");
}
