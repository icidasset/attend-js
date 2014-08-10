# Attend.js

## What makes attend.js

Attend.ComponentBinder <small>(prototype)</small>  
Attend.Component <small>(prototype)</small>  
Attend.DOMObserver <small>(prototype)</small>  
Attend.Helpers <small>(object)</small>  




## How to use

### Step 1 — Component placeholder

```html
<at-test-component></at-test-component>
```



### Step 2 — Make components

Component template:

```html
<script type="text/html" id="template-test_component">
  Test component inner html
</script>
```

<small>*Notes:*</small>

- `template-` is the template name prefix (see options section)
- `test_component` is the template name, can also contain dashes

---

Component object:

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




## Options

### Components prefix

`Attend.components_prefix` is the prefix that will be used for the component tag names. For example:

```html
<at->
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
// this will retrieve the template with the id 'template-test_component'
```



### Default element tag name

`Attend.default_element_tag_name` is the default tag name for the component element. In other words, this tag name will be used when none is defined in the component object.




## To do

- Destroy components when they are removed from the DOM