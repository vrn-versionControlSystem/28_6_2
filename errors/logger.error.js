const loggerError = (url, method, error, route) => {
  let value = {
    req_url: url,
    req_method: method,
    error: error || "",
    route: route || "",
  };
  return value;
};

module.exports = loggerError;
