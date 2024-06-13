const Route = require('../Route');

function route(name, params = {}) {
  let url = Route.getUrl(name);
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
}

module.exports = { route };
