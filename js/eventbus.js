
define(function() {
  'use strict';
  var EventBus, properties, readOnlyProperty;
  EventBus = {};
  _(EventBus).defaults(Backbone.Events);
  EventBus.subscribe = EventBus.on = Backbone.Events.on;
  EventBus.unsubscribe = EventBus.off = Backbone.Events.off;
  EventBus.publish = EventBus.trigger = Backbone.Events.trigger;
  if (_.isFunction(Object.defineProperties)) {
    readOnlyProperty = {
      writable: false
    };
    properties = {
      subscribe: readOnlyProperty,
      unsubscribe: readOnlyProperty,
      publish: readOnlyProperty
    };
    Object.defineProperties(EventBus, properties);
  }
  return EventBus;
});
