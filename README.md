# InfoPopup

A simple JavaScript class to show info popups easily for various combinations of items and events (Desktop and Mobile)

**version 1.0.2** (6 kB minified)


[Live Example](https://foo123.github.io/examples/infopopup/)


**show title attribute as popup**

```html
<a href="#foo" title="Go to Foo">Foo</a>
<a href="#bar" title="Go to Bar">Bar</a>
```

```javascript
let infoPopup = InfoPopup({
    // custom class for custom styling of popup
    infoClass: 'title-info',
    // custom class for custom styling of focused element
    focusedClass: 'focused',
    // mouseenter or touchstart on mobile, alternative: trigger = 'click'
    trigger: 'hover',
    // elements that have [title] attribute
    item: '[title]',
    // get the title content to display
    content: (item) => item.getAttribute('title'),
    // position popup at 'center' of item on X axis
    // options: 'left', 'right', 'center' (default)
    atItemX: 'center',
    // position popup differently on Y axis depending on item
    // options: 'bottom', 'center', 'top' (default)
    atItemY: (item) => item.href === '#bar' ? 'bottom' : 'top',
    // hide popup after 1 sec
    hideDelay: 1000
});

// programmatically show/hide popup
infoPopup.show(document.querySelector('[href="#foo"]'));
infoPopup.hide();
```

[![interactive map with InfoPopup](/screenshot.png)](https://foo123.github.io/examples/infopopup/)
