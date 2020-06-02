
const defaultConfig = require('./configs/defaultConfig');

const configValidator = config => {
  if (!config) {
    return defaultConfig
  }

  // TODO: Add validations for config
  // 1. Change all the request methods with REQUEST_TYPES.GET/POST...
  return config
}

module.exports = configValidator
