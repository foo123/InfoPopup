/**
*  InfoPopup
*  A simple js class to show info popups easily for various items and events (Desktop and Mobile)
*  @VERSION: 1.0.0
*
*  https://github.com/foo123/InfoPopup
*
**/
!function(root, name, factory) {
"use strict";
if ('object' === typeof exports)
    // CommonJS module
    module.exports = factory();
else if ('function' === typeof define && define.amd)
    // AMD. Register as an anonymous module.
    define(function(req) {return factory();});
else
    root[name] = factory();
}('undefined' !== typeof self ? self : this, 'InfoPopup', function(undef) {
"use strict";

var VERSION = '1.0.0',
    trim_re = /^\s+|\s+$/g,
    trim = String.prototype.trim
        ? function(s) {return s.trim();}
        : function(s) {return s.replace(trim_re, '');},
    eventOptionsSupported = null
;

function hasEventOptions()
{
    var passiveSupported = false, options = {};
    try {
        Object.defineProperty(options, 'passive', {
            get: function(){
                passiveSupported = true;
                return false;
            }
        });
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch(e) {
        passiveSupported = false;
    }
    return passiveSupported;
}
function hasClass(el, className)
{
    return el.classList
        ? el.classList.contains(className)
        : -1 !== (' ' + el.className + ' ').indexOf(' ' + className + ' ')
    ;
}
function addClass(el, className)
{
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className = '' === el.className ? className : (el.className + ' ' + className);
}
function removeClass(el, className)
{
    if (el.classList) el.classList.remove(className);
    else el.className = trim((' ' + el.className + ' ').replace(' ' + className + ' ', ' '));
}
function addEvent(target, event, handler, options)
{
    if (null == eventOptionsSupported) eventOptionsSupported = hasEventOptions();
    if (target.attachEvent) target.attachEvent('on' + event, handler);
    else target.addEventListener(event, handler, eventOptionsSupported ? options : ('object' === typeof(options) ? !!options.capture : !!options));
}
function removeEvent(target, event, handler, options)
{
    if (null == eventOptionsSupported) eventOptionsSupported = hasEventOptions();
    // if (el.removeEventListener) not working in IE11
    if (target.detachEvent) target.detachEvent('on' + event, handler);
    else target.removeEventListener(event, handler, eventOptionsSupported ? options : ('object' === typeof(options) ? !!options.capture : !!options));
}

function InfoPopup(options)
{
    var self = this, infoPopup, content, close, timer, current,
        removePopup, removeInfoPopup, clearTimer, handler, infoHandler;
    if (!(self instanceof InfoPopup)) return new InfoPopup(options);

    clearTimer = function() {
        if (timer) clearTimeout(timer);
    };
    removePopup = function() {
        if (current)
            removeClass(current, 'hovered');
        if (infoPopup && infoPopup.parentNode)
            infoPopup.parentNode.removeChild(infoPopup);
        current = null;
    };
    removeInfoPopup = function() {
        clearTimer();
        timer = setTimeout(removePopup, +(self.options.closeDelay || 0));
    };
    handler = function(evt) {
        var item = evt.target && evt.target.closest(self.options.item || '.info-item');
        if (item && ('function' === typeof self.options.content))
        {
            self.show(item, evt);
            addEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', function leave() {
                removeEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', leave, {capture:true, passive:true});
                removeInfoPopup();
            }, {capture:true, passive:true});
        }
    };
    self.options = options || {};
    self.dispose = function() {
        clearTimer();
        removePopup();
        if (close) removeEvent(close, 'click', removePopup, {capture:true, passive:true});
        if (infoPopup) removeEvent(infoPopup, 'mouseenter', infoHandler, {capture:true, passive:true});
        if (infoPopup) removeEvent(infoPopup, 'touchstart', clearTimer, {capture:true, passive:true});
        removeEvent(document.body, 'mouseenter', handler, {capture:true, passive:false});
        removeEvent(document.body, 'touchstart', handler, {capture:true, passive:false});
    };
    self.show = function(item, evt) {
        var infoContent,
            r = item.getBoundingClientRect(), ir, x, y,
            vw = window.innerWidth,
            vh = window.innerHeight,
            sx = document.scrollingElement.scrollLeft || 0,
            sy = document.scrollingElement.scrollTop || 0;

        evt && evt.preventDefault && evt.preventDefault();

        removeClass(infoPopup, 'below');
        removeClass(infoPopup, 'left');
        removeClass(infoPopup, 'right');

        infoContent = self.options.content(item);
        if (infoContent instanceof window.Node)
        {
            content.textContent = '';
            content.appendChild(infoContent);
        }
        else
        {
            content.innerHTML = trim(String(infoContent));
        }

        document.body.appendChild(infoPopup);

        if (current) removeClass(current, 'hovered');
        current = item;
        addClass(item, 'hovered');

        ir = infoPopup.getBoundingClientRect();
        x = sx + r.left + r.width / 2 - ir.width / 2;
        y = sy + r.top - ir.height;
        if (x < 0)
        {
            if (sx >= -x)
            {
                document.scrollingElement.scrollLeft += x;
                sx = document.scrollingElement.scrollLeft;
                x = 0;
            }
            else
            {
                x = sx + r.left;
                addClass(infoPopup, 'left');
            }
        }
        else if (x + ir.width > vw)
        {
            x = sx + r.left + r.width - ir.width;
            addClass(infoPopup, 'right');
        }
        if (r.top + r.height / 2 < vh / 2)
        {
            y = sy + r.top + r.height;
            addClass(infoPopup, 'below');
        }

        infoPopup.style.left = String(x) + 'px';
        infoPopup.style.top = String(y) + 'px';

        clearTimer();
    };

    if (!infoPopup)
    {
        infoPopup = document.createElement('div');
        addClass(infoPopup, 'info');
        if (self.options.className) addClass(infoPopup, self.options.className);

        infoPopup.appendChild(document.createElement('div'));
        addClass(infoPopup.firstChild, 'header');
        infoPopup.firstChild.appendChild(close=document.createElement('button'));
        addClass(close, 'close');
        close.setAttribute('title', self.options.closeMsg || 'Close Popup');
        addEvent(close, 'click', removePopup, {capture:true, passive:true});

        infoPopup.appendChild(content=document.createElement('div'));
        addClass(content, 'content');

        addEvent(infoPopup, 'mouseenter', infoHandler = function(evt) {
            clearTimer();
            addEvent(infoPopup, 'mouseleave', function leave(evt) {
                removeEvent(infoPopup, 'mouseleave', leave, {capture:true, passive:true});
                removeInfoPopup();
            }, {capture:true, passive:true});
        }, {capture:true, passive:true});

        addEvent(infoPopup, 'touchstart', clearTimer, {capture:true, passive:true});

        addEvent(document.body, 'mouseenter', handler, {capture:true, passive:false});
        addEvent(document.body, 'touchstart', handler, {capture:true, passive:false});
    }
}
InfoPopup.prototype = {
    constructor: InfoPopup,
    options: null,
    dispose: null,
    show: null
};
InfoPopup.VERSION = VERSION;
return InfoPopup;
});