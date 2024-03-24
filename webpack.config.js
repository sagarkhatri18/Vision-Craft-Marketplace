// webpack.config.js
module.exports = {
    // other webpack configurations...
    resolve: {
      fallback: {
        "crypto": false
      }
    }
  };
  