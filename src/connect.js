
const configValidator = require('./configValidator');
const { doHealthCheck } = require('./doHealthCheck');

const connect = (configuration) => {

  // TODO: How to handle it for different environments
  const config = configValidator(configuration);
  
  const middleware = async (req, res, next) => {
    if (req.path === config.apiPath) {
      if (config.apiSecurity) {
        const { headerToken } = config.apiSecurity;
        const authToken = req.headers["auth-token"];
        if (!authToken) {
          return res.status(403).json({ error: 'Authentication required' });
        }
        if (authToken !== headerToken) {
          return res.status(403).json({ error: 'Authentication failed, Invalid token' });
        }
      }
      const response = await doHealthCheck(config);
      res.send(response);
    }
    next();
  };

  return middleware;
};

module.exports = connect;
