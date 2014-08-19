# Attend.js

A component system designed to be minimal and flexible.




## What makes attend.js

Attend.ComponentBinder <small>(prototype)</small>  
Attend.Component <small>(prototype)</small>  
Attend.DOMObserver <small>(prototype)</small>  
Attend.Helpers <small>(object)</small>  




## How to use

### Step 1 — Add component placeholder to the html

```html
<at-test-component></at-test-component>
```

<small>*Notes:*</small>

- `<at-test_component></at-test_component>` achieves the same thing



### Step 2 — Add component template and/or object

__Component template:__

```html
<script type="text/html" id="template-test_component">
  Test component inner html
</script>
```

<small>*Notes:*</small>

- `template-` is the template name prefix (see options section)
- `test_component` is the template name, can also contain dashes

---

__Component object:__

```javascript
Attend.Components.TestComponent = {
  
  element: {
    tagName: "section",     // optional, default is "div"
    className: "comp-test", // optional
    id: "test-component",   // optional
    attributes: {}          // optional
  },
  
  
  example_fn: function() {
    alert("Hi!");
  }
  
};
```

<small>*Notes:*</small>

- `TestComponent` is the template name camelcased
- `Attend.Components` is the object where the components are stored (see options section)

---

__You don't necessarily need both of these.__ If you only have the component object, then no html will be rendered inside of the component element. And if you only have the component template, it will be rendered inside an element with the default element tag name.



### Step 3 — Watch the DOM and create new components

```javascript
// application container, can also be 'document.body'
var element = document.querySelector("at-application");

// create new component binder
var cb = new Attend.ComponentBinder(application_element);
```



### Step 4 — Browser support & polyfills

Attend.js supports IE9 and up.  
Include the following polyfills if needed:

- [Mutation Observer](https://github.com/Polymer/MutationObservers)




## Options

### Components prefix

`Attend.components_prefix` is the prefix that will be used for the component tag names. For example:

```html
<!-- the default prefix is 'at-' -->
<at-block></at-block>
```



### Components object

`Attend.components_storage_object` is the variable that refers to the object where the components are stored. The default is:

```javascript
Attend.components_storage_object = Attend.Components;
// Attend.Components is an object
```



### Template name/id prefix

`Attend.template_name_prefix` will be used to get the template element. For example:

```javascript
Attend.Helpers.get_template_element("test_component");
// this will retrieve the template with the id 'template-test_component',
// because the template_name_prefix is equal to 'template-';
```



### Default element tag name

`Attend.default_element_tag_name` is the default tag name for the component element. In other words, this tag name will be used when none is defined in the component object.




## To do

- Destroy components when they are removed from the DOM
- Write tests & demo
