
define(['application', 'route'], function(Application, Route) {
  'use strict';
  /*
  	Router class
  */
  var Router;
  Router = (function() {

    _(Router.prototype).defaults(Backbone.Events);

    Router.prototype.enablePushState = false;

    Router.prototype.routes = {};

    Router.prototype._createdRoutes = [];

    Router.prototype._router = null;

    function Router(enablePushState) {
      this.enablePushState = enablePushState;
      this._createdRoutes = [];
      this._router = null;
    }

    Router.prototype.changeUrl = function(url) {
      if (Backbone.history == null) return;
      return Backbone.history.navigate(url, {
        trigger: true
      });
    };

    Router.prototype.bindRoutes = function() {
      var action, config, controller, controllerAction, controllerActionArr, defaultConfigs, pattern, _ref, _results;
      defaultConfigs = {
        constraints: {},
        params: {}
      };
      _ref = this.routes;
      _results = [];
      for (pattern in _ref) {
        config = _ref[pattern];
        if (_.isObject(config)) {
          config = _(defaultConfigs).extend(config);
          if (!_.has(config, 'target')) {
            throw new Error("You should provide a target controller and action pair for the " + pattern + " pattern.");
          }
          controllerAction = config.target;
        } else if (_.isString(config)) {
          controllerAction = config;
        }
        controllerActionArr = controllerAction.split("#");
        if (_.isArray(controllerActionArr) && controllerActionArr.length !== 2) {
          throw new Error("Router#bindRoutes: The format of the routing configuration for the pattern '" + pattern + "' is incorrect.");
        }
        controller = controllerActionArr[0], action = controllerActionArr[1];
        _results.push(this.match(pattern, controller, action, config.constraints, config.params));
      }
      return _results;
    };

    Router.prototype.start = function() {
      this.bindRoutes();
      if (this._createdRoutes.length === 0) {
        throw new Error('Router#start: Could you please provide at least 1 route for me?');
      }
      Backbone.history.start({
        pushState: this.enablePushState
      });
    };

    Router.prototype.match = function(pattern, controller, action, constraints, params) {
      var route;
      route = new Route(pattern, controller, action, constraints, params);
      Backbone.history || (Backbone.history = new Backbone.History);
      Backbone.history.route(route, route.handler);
      return this._createdRoutes.push(route);
    };

    Router.prototype.route = function(path) {
      var handler, _i, _len, _ref;
      path = path.replace(/^(\/#|\/)/, '');
      _ref = Backbone.history.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        if (handler.route.test(path)) {
          handler.callback(path, {
            changeURL: true
          });
          return true;
        }
      }
      return false;
    };

    return Router;

  })();
  return Router;
});
