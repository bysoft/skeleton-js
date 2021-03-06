var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  'use strict';
  /*
  	Collection Class
  */
  var Model;
  Model = (function(_super) {

    __extends(Model, _super);

    Model.prototype.disposed = false;

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
      this.initialize();
    }

    Model.prototype.initialize = function() {};

    Model.prototype.dispose = function() {};

    return Model;

  })(Backbone.Model);
  return Model;
});
