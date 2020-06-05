
const axios = require('axios');

const REQUEST_TYPES = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  PATCH: 'PATCH',
  UPLOAD: 'UPLOAD',
  HEAD: 'HEAD',
  DELETE: 'DELETE',
};

const RESPONSE_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  UNREACHABLE: 503,
};

const BFF_REQUEST_TIMEOUT = 5000;

const performRequest = async (method, requestURL, data = null, responseTag = null) => {
  const requestParameters = {
    method,
    timeout: BFF_REQUEST_TIMEOUT,
  };

  if (data != null) {
    if (data instanceof FormData) {
      delete requestParameters.headers['content-type'];
      requestParameters.body = data;
    } else {
      requestParameters.body = JSON.stringify(data);
    }
  }

  let response = { };
  if (responseTag != null) {
    response.tag = responseTag
  }
  try {
    const requestResponse = await executeFetch(requestURL, requestParameters);
    return { ...response, ...requestResponse }; // { status, data }
  } catch (error) {
    response.error = { 
      error: 'Unknown error occurred', 
      status: RESPONSE_STATUS.UNREACHABLE
    };
    if (error && error.response) {
      const {
        status, error: responseError, message, data: errorData,
      } = error.response;

      response.error = {
        status,
        error: responseError,
        body: {
          ...errorData,
          message,
        },
      };
    }
    return response;
  }
};

const executeFetch = async (requestUrl, requestParameters) => {
  const {
    method,
    headers,
    withCredentials,
    timeout,
    ...otherParams
  } = requestParameters;

  const response = await axios({
    method,
    headers,
    timeout,
    withCredentials,
    url: requestUrl,
    data: otherParams && otherParams.body,
  });
  
  return response;
};

const doGet = async (requestURL) => performRequest(REQUEST_TYPES.GET, requestURL, null);

const doPost = async (requestURL, data = null) => performRequest(REQUEST_TYPES.POST, requestURL, data);

const doPut = async (requestURL, data = null) => performRequest(REQUEST_TYPES.PUT, requestURL, data);

const doDelete = async (requestURL, data = null) => performRequest(REQUEST_TYPES.DELETE, requestURL, data);

const doHead = async (requestURL, data = null) => performRequest(REQUEST_TYPES.HEAD, requestURL, data);

const doPatch = async (requestURL, data = null) => performRequest(REQUEST_TYPES.PATCH, requestURL, data);

module.exports = {
  doGet,
  doPost,
  doPut,
  doDelete,
  doHead,
  doPatch,
  performRequest,
  REQUEST_TYPES,
};
