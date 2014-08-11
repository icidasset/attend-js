/*

  Attend.js
  v0.1.0

*/


(function() {

"use strict";


var Attend = {
  Components: {}
};


// settings
Attend.components_prefix = "at-";
Attend.components_storage_object = Attend.Components;
Attend.template_name_prefix = "template-";
Attend.default_element_tag_name = "div";



//
//  Export
//
window.Attend = Attend;


}());

(function(Namespace) {

"use strict";


var Helpers = {

  //
  //  Templating and such
  //
  get_template_element: function(template_name, options) {
    var prefix;

    options = options || {};
    prefix = options.template_name_prefix || Namespace.template_name_prefix;

    return document.getElementById(prefix + template_name);
  },


  get_template: function(template_name, options) {
    var el = this.get_template_element(template_name, options);
    return el ? el.innerHTML : "";
  },


  build_element_from_template: function(template_name, options) {
    return this.build_element(this.get_template(template_name, options), options);
  },


  build_element: function(html, options) {
    var attributes, id, className, tagName, element;
    options = options || {};

    // gather data
    attributes = result(options, "attributes");
    id = result(options, "id");
    className = result(options, "className");
    tagName = result(options, "tagName") || Namespace.default_element_tag_name;

    // make element
    element = document.createElement(tagName);
    if (id) element.setAttribute("id", id);
    if (className) element.className = className;

    // set attributes
    if (attributes) {
      for (var k in attributes) {
        if (attributes.hasOwnProperty(k)) {
          element.setAttribute(k, attributes[k]);
        }
      }
    }

    // html
    element.innerHTML = html;

    // return
    return element;
  }


};



//
//  Utility functions
//
function result(object, property) {
  if (object == null) return void 0;
  var value = object[property];
  return is_function(value) ? value.call(object) : value;
}


function is_function(fn) {
 var get_type = {};
 return fn && get_type.toString.call(fn) === "[object Function]";
}



//
//  Exports
//
Namespace.Helpers = Helpers;


}(window.Attend));

(function(Namespace) {

"use strict";


function DOMObserver(el, callback) {
  if (!el) throw "Attend.js — DOMObserver, no element given";
  if (!callback) throw "Attend.js — DOMObserver, no callback given";

  this.el = el;
  this.callback = callback;

  this._create_mutation_observer();
};


DOMObserver.prototype.destroy = function() {
  this._destroy_mutation_observer();
};



//
//  Private
//
DOMObserver.prototype._create_mutation_observer = function() {
  if (this.mutation_observer) return;

  // new
  this.mutation_observer = new MutationObserver(
    this.callback
  );

  this.mutation_observer.observe(this.el, {
    childList: true,
    subtree: true
  });
};


DOMObserver.prototype._destroy_mutation_observer = function() {
  if (!this.mutation_observer) return;

  // delete
  this.mutation_observer.disconnect();
}



//
//  Exports
//
Namespace.DOMObserver = DOMObserver;


}(window.Attend));

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

(function(Namespace) {

"use strict";



//
//  Constructor
//
function ComponentBinder(el) {
  if (this.is_component(el)) {
    this.el = this.setup_component(el);
  } else {
    this.el = el;
  }

  this.start_watching();
  this.scan_and_initialize(this.el);
}


ComponentBinder.prototype.destroy = function() {
  this.stop_watching();
};



//
//  Watch
//
ComponentBinder.prototype.start_watching = function() {
  var callback = (function(cb) { return function() {
    cb.watch_callback.apply(cb, arguments);
  }; }(this));

  // create new dom observer if there isn't one yet
  if (!this.dom_observer) {
    this.dom_observer = new Namespace.DOMObserver(this.el, callback);
  }
};


ComponentBinder.prototype.stop_watching = function() {
  if (this.dom_observer) {
    this.dom_observer.destroy();
  }
};


ComponentBinder.prototype.watch_callback = function(mutations) {
  for (var i=0, j=mutations.length; i<j; ++i) {
    this.scan_and_initialize(mutations[i].target);
  }
};



//
//  Components
//
ComponentBinder.prototype.is_component = function(el) {
  return (el.tagName.toLowerCase().indexOf(Namespace.components_prefix) === 0);
};


ComponentBinder.prototype.scan_element_for_new_components = function(element) {
  var elements = element.querySelectorAll("*");
  var wannabe_components = [];

  for (var i=0, j=elements.length; i<j; ++i) {
    var el = elements[i];

    if (this.is_component(el) && !el.component) {
      wannabe_components.push(el);
    }
  }

  return wannabe_components;
};


ComponentBinder.prototype.initialize_components = function(elements_array) {
  for (var i=0, j=elements_array.length; i<j; ++i) {
    this.setup_component(elements_array[i]);
  }
};


ComponentBinder.prototype.scan_and_initialize = function(element) {
  var wannabe_components = this.scan_element_for_new_components(element);
  this.initialize_components(wannabe_components);
};


ComponentBinder.prototype.setup_component = function(element) {
  var title_case_regex = /((^|-|_)([a-z]))+/g;
  var component_class = element.tagName.toLowerCase();
  var component;

  component_class = component_class.replace(
    new RegExp("^" + Namespace.components_prefix),
    ""
  );

  component_class = component_class.replace(title_case_regex, function(match, p1, p2, p3) {
    return p3.toUpperCase();
  });

  component = new Namespace.Component(
    element,
    Namespace.components_storage_object[component_class]
  );

  return component.el;
};



//
//  Exports
//
Namespace.ComponentBinder = ComponentBinder;


}(window.Attend));

