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
    attributes = _.result(options, "attributes");
    id = _.result(options, "id");
    className = _.result(options, "className");
    tagName = _.result(options, "tagName") || Namespace.default_element_tag_name;

    // make element
    element = document.createElement(tagName);
    if (id) element.setAttribute("id", id);
    if (className) element.className = className;

    // set attributes
    if (attributes) {
      _.each(attributes, function(v, k) {
        element.setAttribute(k, v);
      });
    }

    // html
    element.innerHTML = html;

    // return
    return element;
  }


};



//
//  Exports
//
Namespace.Helpers = Helpers;


}(window.Attend));
