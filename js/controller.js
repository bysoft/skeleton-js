// Generated by CoffeeScript 1.3.1

define(function() {
  'use strict';

  /*
  		Controller Class
  */

  var Controller;
  Controller = (function() {

    Controller.name = 'Controller';

    Controller.prototype.id = void 0;

    Controller.prototype.disposed = false;

    Controller.prototype.currentView = null;

    Controller.prototype._registeredCollections = {};

    Controller.prototype._registeredModels = {};

    function Controller(id) {
      this.id = id;
      if (!(this.id != null)) {
        throw new Error('Controller instances must have an id');
      }
      this.initialize();
    }

    Controller.prototype.initialize = function() {};

    Controller.prototype.renderView = function(viewName, viewOptions) {
      var loadDef, templateFile, viewFile;
      if (viewOptions == null) {
        viewOptions = {};
      }
      viewFile = "views/" + this.id + "/" + viewName + "_view";
      templateFile = "plugins/text!/templates/" + this.id + "/" + viewName + ".html";
      loadDef = $.Deferred();
      require([viewFile, templateFile], function(ViewClass, viewTemplate) {
        var viewInstance;
        _.extend(viewOptions, {
          template: viewTemplate
        });
        viewInstance = new ViewClass(viewOptions);
        return loadDef.resolve(viewInstance, viewTemplate);
      });
      return loadDef;
    };

    Controller.prototype.registerModel = function(name, model) {
      if (!_.has(this._registeredModels, name)) {
        return this._registeredModels[name] = model;
      }
    };

    Controller.prototype.getModel = function(name) {
      if (!_.has(this._registeredModels, name)) {
        throw new Error("The model with name " + name + " is not registered on the controller " + this.id);
      }
      return this._registeredModels[name];
    };

    Controller.prototype.getModels = function() {
      return _(this._registeredModels).values();
    };

    Controller.prototype.registerCollection = function(name, collection) {
      if (!_.has(this._registeredCollections, name)) {
        return this._registeredCollections[name] = collection;
      }
    };

    Controller.prototype.getCollection = function(name) {
      if (!_.has(this._registeredCollections, name)) {
        throw new Error("The collection with name " + name + " is not registered on the controller " + this.id);
      }
      return this._registeredCollections[name];
    };

    Controller.prototype.getCollections = function() {
      return _(this._registeredCollections).values();
    };

    Controller.prototype.dispose = function() {
      var collection, model, name, _ref, _ref1;
      if (this.disposed) {
        return;
      }
      _ref = this._registeredModels;
      for (name in _ref) {
        model = _ref[name];
        model.dispose();
        delete this._registeredModels[name];
      }
      _ref1 = this._registeredCollections;
      for (name in _ref1) {
        collection = _ref1[name];
        collection.dispose();
        delete this._registeredCollections[name];
      }
      return this.disposed = true;
    };

    return Controller;

  })();
  return Controller;
});
