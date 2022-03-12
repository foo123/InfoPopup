# InfoPopup

A simple JavaScript class to show info popups easily for various combinations of items and events (Desktop and Mobile)

**version 1.0.0** (4.5 kB minified)


[Live Example](https://foo123.github.io/examples/infopopup/)


**show title attribute as popup**

```html
<a href="#foo" title="Go to Foo">Foo</a>
<a href="#bar" title="Go to Bar">Bar</a>
```

```javascript
InfoPopup({
    // custom class for custom styling
    className: 'title-info',
    // mouseenter or touchstart on mobile, alternative: trigger = 'click'
    trigger: 'hover',
    // elements that have [title] attribute
    item: '[title]',
    // get the title content to display
    content: (item) => item.getAttribute('title'),
    // close popup after 1 sec
    closeDelay: 1000
});
```

[![interactive map with InfoPopup](/screenshot.png)](https://foo123.github.io/examples/infopopup/)
