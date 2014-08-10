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
