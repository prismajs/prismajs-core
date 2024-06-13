const express = require('express');
const fs = require('fs');
const path = require('path');

class Route {
  constructor() {
    this.router = express.Router();
    this.namedRoutes = {};
    this.middlewares = [];
  }

  registerRoute(method, path, controller, action, name) {
    const middlewares = [...this.middlewares];
    this.router[method](path, ...middlewares, (req, res, next) => {
      const instance = new controller();
      instance[action](req, res, next);
    });
    if (name) {
      this.namedRoutes[name] = path;
    }
    return this;
  }

  get(path, controller, action, name) {
    return this.registerRoute('get', path, controller, action, name);
  }

  post(path, controller, action, name) {
    return this.registerRoute('post', path, controller, action, name);
  }

  put(path, controller, action, name) {
    return this.registerRoute('put', path, controller, action, name);
  }

  delete(path, controller, action, name) {
    return this.registerRoute('delete', path, controller, action, name);
  }

  middleware(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  group(callback) {
    const currentMiddlewares = [...this.middlewares];
    callback(this);
    this.middlewares = currentMiddlewares;
    return this;
  }

  resource(resource, controller) {
    this.get(`/${resource}`, controller, 'index', `${resource}.index`)
      .get(`/${resource}/create`, controller, 'create', `${resource}.create`)
      .post(`/${resource}`, controller, 'store', `${resource}.store`)
      .get(`/${resource}/:id`, controller, 'show', `${resource}.show`)
      .get(`/${resource}/:id/edit`, controller, 'edit', `${resource}.edit`)
      .put(`/${resource}/:id`, controller, 'update', `${resource}.update`)
      .delete(`/${resource}/:id`, controller, 'destroy', `${resource}.destroy`);
    return this;
  }

  getRouter() {
    return this.router;
  }

  route(name) {
    return this.namedRoutes[name];
  }

  getUrl(name) {
    return this.namedRoutes[name] || '#';
  }

  cacheRoutes() {
    const cacheFile = path.join(__dirname, 'routeCache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(this.namedRoutes, null, 2));
  }

  loadCachedRoutes() {
    const cacheFile = path.join(__dirname, 'routeCache.json');
    if (fs.existsSync(cacheFile)) {
      this.namedRoutes = JSON.parse(fs.readFileSync(cacheFile));
    }
  }
}

module.exports = new Route();
