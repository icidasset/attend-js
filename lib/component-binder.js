(function(Namespace) {

"use strict";



//
//  Constructor
//
function ComponentBinder(el) {
  this.el = this.setup_component(el);

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
ComponentBinder.prototype.scan_element_for_new_components = function(element) {
  var elements = element.querySelectorAll("*");
  var wannabe_components = [];

  for (var i=0, j=elements.length; i<j; ++i) {
    var el = elements[i];

    if (el.tagName.toLowerCase().indexOf(Namespace.components_prefix) === 0) {
      if (!el.component) wannabe_components.push(el);
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

