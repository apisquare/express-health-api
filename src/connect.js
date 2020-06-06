
const configValidator = require('./configValidator');
const { doHealthCheck } = require('./doHealthCheck');

const connect = (configuration) => {

  // TODO: How to handle it for different environments
  const config = configValidator(configuration);
  
  const middleware = async (req, res, next) => {
    if (req.path === config.apiPath) {
      const response = await doHealthCheck(config);
      res.send(response);
    }
    next();
  };

  return middleware;
};

module.exports = connect;
