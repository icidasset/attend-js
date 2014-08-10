(function(Namespace) {

"use strict";


function Component(el, opts) {
  this.copy_to_instance(opts);
  this.make_element(el);

  // store reference to self on element
  this.el.component = this;

  // state
  this.state = {
    bounded_events: []
  };

  // initialize
  if (this.initialize) this.initialize();
}



//
//  Utility functions
//
function extend(obj) {
  var source, prop;

  for (var i=1, j=arguments.length; i<j; ++i) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }

  return obj;
}



//
//  Setup
//
Component.prototype.copy_to_instance = function(options) {
  options = options || {};

  for (var k in options) {
    if (options.hasOwnProperty(k)) {
      var v = options[k];

      if (toString.call(v) == "[object Array]") {
        v = v.slice(0);
      } else if (typeof v == "object") {
        v = extend(v);
      }

      this[k] = v;
    }
  }
};


Component.prototype.make_element = function(original_element) {
  var tag_split = original_element.tagName.toLowerCase().split("-");
  var template_name = tag_split.splice(1, tag_split.length).join("-");
  var new_element = Namespace.Helpers.build_element_from_template(template_name, this.element);

  original_element.parentNode.replaceChild(new_element, original_element);
  original_element = null;

  this.el = new_element;
};



//
//  Destroy
//
Component.prototype.destroy = function() {
  this.stop_listening();
};



//
//  Events
//
Component.prototype.listen_to = function(thing, event, callback) {
  if (thing.on) {
    thing.on(event, callback);

    this.state.bounded_events.push({
      thing: thing,
      event: event,
      callback: callback
    });
  }
};


Component.prototype.stop_listening_to = function(thing, event, callback) {
  var events = this.state.bounded_events;
  var i, j;

  if (thing.off) {
    thing.off(event, callback);
  }

  for (i=0, j=events.length; i<j; ++i) {
    var e = events[i];

    if ((e) &&
        (e.thing === thing) && (e.event === event)
        (callback ? (e.callback === callback) : true)) {
      e.thing = null;
      e.event = null;
      e.callback = null;
      e = null;
    }
  }

  events = events.filter(function(x) { return x !== null; });
};


Component.prototype.stop_listening = function() {
  var events = this.state.bounded_events.splice(0, this.state.bounded_events.length);

  for (var i=0, j=events.length; i<j; ++i) {
    var e = events[i];

    if (e.thing.off) {
      e.thing.off(e.event, e.callback);
    }

    e.thing = null;
    e.event = null;
    e.callback = null;
    e = null;
  }
};



//
//  Exports
//
Namespace.Component = Component;


}(window.Attend));
