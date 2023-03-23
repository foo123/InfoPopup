# InfoPopup

A simple JavaScript class to show info popups easily for various combinations of items and events (Desktop and Mobile)

**version 1.0.5** (6 kB minified)


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
    // scroll window X axis for popup to show at specified position if needed
    scrollXIfNeeded: true /* true|false, default true */,
    // scroll window Y axis for popup to show at specified position if needed
    scrollYIfNeeded: true /* true|false, default true */,
    // hide popup after 1 sec
    hideDelay: 1000
});

// programmatically show/hide popup
infoPopup.show(document.querySelector('[href="#foo"]'));
infoPopup.hide();
```

[![interactive map with InfoPopup](/screenshot.png)](https://foo123.github.io/examples/infopopup/)


**see also:**

* [ModelView](https://github.com/foo123/modelview.js) a simple, fast, powerful and flexible MVVM framework for JavaScript
* [Contemplate](https://github.com/foo123/Contemplate) a fast and versatile isomorphic template engine for PHP, JavaScript, Python
* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets, made as simple as possible, both client and server, both desktop and mobile, can be used as (template) plugins and/or standalone for PHP, JavaScript, Python (can be used as [plugins for Contemplate](https://github.com/foo123/Contemplate/blob/master/src/js/plugins/plugins.txt))
* [Paginator](https://github.com/foo123/Paginator)  simple and flexible pagination controls generator for PHP, JavaScript, Python
* [ColorPicker](https://github.com/foo123/ColorPicker) a fully-featured and versatile color picker widget
* [Pikadaytime](https://github.com/foo123/Pikadaytime) a refreshing JavaScript Datetimepicker that is ightweight, with no dependencies
* [Timer](https://github.com/foo123/Timer) count down/count up JavaScript widget
* [InfoPopup](https://github.com/foo123/InfoPopup) a simple JavaScript class to show info popups easily for various items and events (Desktop and Mobile)
* [Popr2](https://github.com/foo123/Popr2) a small and simple popup menu library
* [area-select.js](https://github.com/foo123/area-select.js) a simple JavaScript class to select rectangular regions in DOM elements (image, canvas, video, etc..)
* [area-sortable.js](https://github.com/foo123/area-sortable.js) simple and light-weight JavaScript class for handling smooth drag-and-drop sortable items of an area (Desktop and Mobile)
* [css-color](https://github.com/foo123/css-color) simple class for manipulating color values and color formats for css, svg, canvas/image
* [jquery-plugins](https://github.com/foo123/jquery-plugins) a collection of custom jQuery plugins
* [jquery-ui-widgets](https://github.com/foo123/jquery-ui-widgets) a collection of custom, simple, useful jQueryUI Widgets
* [touchTouch](https://github.com/foo123/touchTouch) a variation of touchTouch jQuery Optimized Mobile Gallery in pure vanilla JavaScript
* [Imagik](https://github.com/foo123/Imagik) fully-featured, fully-customisable and extendable Responsive CSS3 Slideshow
* [Carousel3](https://github.com/foo123/Carousel3) HTML5 Photo Carousel using Three.js
* [Rubik3](https://github.com/foo123/Rubik3) intuitive 3D Rubik Cube with Three.js
* [MOD3](https://github.com/foo123/MOD3) JavaScript port of AS3DMod ActionScript 3D Modifier Library
* [RT](https://github.com/foo123/RT) unified client-side real-time communication for JavaScript using XHR polling / BOSH / WebSockets / WebRTC
* [AjaxListener.js](https://github.com/foo123/AjaxListener.js): Listen to any AJAX event on page with JavaScript, even by other scripts
* [asynchronous.js](https://github.com/foo123/asynchronous.js) simple manager for asynchronous, linear, parallel, sequential and interleaved tasks for JavaScript
* [classy.js](https://github.com/foo123/classy.js) Object-Oriented mini-framework for JavaScript

