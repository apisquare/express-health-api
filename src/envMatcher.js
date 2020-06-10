const processEnvNames = require('./configs/processEnvConfig');

/**
 * Fetch configuration properties from Node Environment
 * @param {*} config - Current configuration
 */
const loadConfigPropertiesFromEnv = (config) => {
  const { apiSecurity  } = config;
  if (process.env[processEnvNames.AUTH_TOKEN]) {
    config.apiSecurity = {
      ...apiSecurity,
      authToken: process.env[processEnvNames.AUTH_TOKEN]
    };
  }
  return config;
};

module.exports = {
  loadConfigPropertiesFromEnv
};
