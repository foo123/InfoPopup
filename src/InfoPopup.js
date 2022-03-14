/**
*  InfoPopup.js
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
function rect(el)
{
    return el.getBoundingClientRect();
}
function closest(el, selector)
{
    if (el.closest) return el.closest(selector);
    while (el)
    {
        if (el.matches(selector)) return el;
        el = el.parentNode;
    }
}
function ancestor(el, other)
{
    while (el)
    {
        if (el === other) return other;
        el = el.parentNode;
    }
}

function InfoPopup(options)
{
    var self = this, infoPopup, content,
        closeBt, timer, current, positionAt,
        removePopup, removeInfoPopup, clearCurrent,
        clearTimer, handler, handler2, infoHandler;

    if (!(self instanceof InfoPopup))
        return new InfoPopup(options);

    clearTimer = function() {
        if (timer) clearTimeout(timer);
    };
    clearCurrent = function() {
        if (current)
        {
            removeClass(current, self.options.focusedClass || 'focused');
            if ('function' === typeof self.options.onBlur)
                self.options.onBlur(current);
            current = null;
        }
    };
    removePopup = function(evt) {
        evt && evt.preventDefault && evt.preventDefault();
        clearCurrent();
        if (infoPopup && infoPopup.parentNode)
            infoPopup.parentNode.removeChild(infoPopup);
    };
    removeInfoPopup = function() {
        clearTimer();
        timer = setTimeout(removePopup, +(self.options.closeDelay || 0));
    };
    handler2 = function handler2(evt) {
        if ('mouseleave' === evt.type)
        {
            var item = evt.target && closest(evt.target, self.options.item || '.info-item');
            if (item === current)
            {
                removeEvent(document.body, evt.type, handler2, {capture:true, passive:true});
                removeInfoPopup();
            }
        }
        else
        {
            removeEvent(document.body, evt.type, handler2, {capture:true, passive:true});
            removeInfoPopup();
        }
    };
    handler = function(evt) {
        var item = evt.target && closest(evt.target, self.options.item || '.info-item');
        if (item && ('function' === typeof self.options.content))
        {
            self.show(item, evt);
            if ('click' !== self.options.trigger)
            {
                addEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', handler2, {capture:true, passive:true});
            }
        }
    };
    positionAt = function(item) {
        var bodyRect, itemRect, infoRect,
            x, y, vw, vh, sx, sy;

        infoPopup.style.position = 'absolute';
        removeClass(infoPopup, 'below');
        removeClass(infoPopup, 'left');
        removeClass(infoPopup, 'right');
        bodyRect = rect(document.body);
        itemRect = rect(item);
        infoRect = rect(infoPopup);
        vw = window.innerWidth;
        vh = window.innerHeight;
        sx = document.body.scrollLeft || 0;
        sy = document.body.scrollTop || 0;

        x = sx + itemRect.left - bodyRect.left + itemRect.width / 2 - infoRect.width / 2;
        y = sy + itemRect.top - bodyRect.top - infoRect.height;

        if (x < 0)
        {
            if (sx >= -x)
            {
                document.body.scrollLeft += x;
                sx = document.body.scrollLeft;
                x = 0;
            }
            else
            {
                x = sx + itemRect.left - bodyRect.left;
                addClass(infoPopup, 'left');
            }
        }
        else if (x + infoRect.width > vw)
        {
            x = sx + itemRect.left - bodyRect.left + itemRect.width - infoRect.width;
            addClass(infoPopup, 'right');
        }
        if (itemRect.top + itemRect.height / 2 < vh / 2)
        {
            y = sy + itemRect.top - bodyRect.top + itemRect.height;
            addClass(infoPopup, 'below');
        }

        infoPopup.style.left = String(x) + 'px';
        infoPopup.style.top = String(y) + 'px';
    };
    self.options = options || {};
    self.dispose = function() {
        clearTimer();
        removePopup();
        if ('click' === self.options.trigger)
        {
            if (closeBt) removeEvent(closeBt, 'click', removePopup, {capture:true, passive:false});
            removeEvent(document.body, 'click', handler, { capture:true, passive:false});
        }
        else
        {
            if (infoPopup) removeEvent(infoPopup, 'mouseenter', infoHandler, {capture:true, passive:true});
            if (infoPopup) removeEvent(infoPopup, 'touchstart', clearTimer, {capture:true, passive:true});
            removeEvent(document.body, 'mouseenter', handler, {capture:true, passive:false});
            removeEvent(document.body, 'touchstart', handler, {capture:true, passive:false});
        }
    };
    self.show = function(item, evt) {
        var infoContent, imgs, loaded = 0;

        infoContent = self.options.content(item);
        if (null == infoContent || false === infoContent)
        {
            return;
        }
        else if (infoContent instanceof window.Node)
        {
            content.textContent = '';
            content.appendChild(infoContent);
        }
        else
        {
            content.innerHTML = trim(String(infoContent));
        }

        evt && evt.preventDefault && evt.preventDefault();

        clearTimer();

        clearCurrent();

        addClass(item, self.options.focusedClass || 'focused');
        current = item;

        document.body.appendChild(infoPopup);

        imgs = infoPopup.getElementsByTagName('img');
        if (imgs && imgs.length)
        {
            [].forEach.call(imgs, function(img) {
               if (!img.complete && ((img.src && img.src.length) || (img.currentSrc && img.currentSrc.length)))
               {
                   var load = function load() {
                       removeEvent(img, 'error', load);
                       removeEvent(img, 'load', load);
                       ++loaded;
                       if ((imgs.length === loaded) && infoPopup.parentNode && (infoPopup === ancestor(img, infoPopup)))
                       {
                           // re-position popup
                           positionAt(item);
                       }
                   };
                   addEvent(img, 'error', load);
                   addEvent(img, 'load', load);
               }
               else
               {
                   ++loaded;
               }
            });
        }
        positionAt(item);
    };

    if (!infoPopup)
    {
        infoPopup = document.createElement('div');
        addClass(infoPopup, 'info');
        if (self.options.infoClass) addClass(infoPopup, self.options.infoClass);

        if ('click' === self.options.trigger)
        {
            infoPopup.appendChild(document.createElement('div'));
            addClass(infoPopup.firstChild, 'header');
            infoPopup.firstChild.appendChild(closeBt=document.createElement('button'));
            addClass(closeBt, 'close');
            closeBt.setAttribute('title', self.options.closeMsg || 'Close Popup');
            addEvent(closeBt, 'click', removePopup, {capture:true, passive:false});
        }
        else
        {
            closeBt = null;
        }

        infoPopup.appendChild(content=document.createElement('div'));
        addClass(content, 'content');

        if ('click' === self.options.trigger)
        {
            addEvent(document.body, 'click', handler, {capture:true, passive:false});
        }
        else
        {
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