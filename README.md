# InfoPopup

A simple js class to show info popups easily for various items and events (Desktop and Mobile)

**version 1.0.0** (4.5 kB minified)


[Live Example](https://foo123.github.io/examples/infopopup/)


**show title attribute as popup**

```html
<a href="#foo" title="Go to Foo">Foo</a>
<a href="#bar" title="Go to Bar">bar</a>
```

```javascript
InfoPopup({
    className: 'title-info',
    trigger: 'hover',
    item: '[title]',
    content: (item) => item.getAttribute('title')
});
```

[![interactive map with InfoPopup](/screenshot.png)](https://foo123.github.io/examples/infopopup/)
