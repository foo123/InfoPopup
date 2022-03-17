/**
*  InfoPopup.js
*  A simple js class to show info popups easily for various items and events (Desktop and Mobile)
*  @VERSION: 1.0.1
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

var VERSION = '1.0.1',
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
function is_function(x)
{
    return 'function' === typeof x;
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
        timer = setTimeout(removePopup, +(self.options.hideDelay || 0));
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
        if (item && is_function(self.options.content))
        {
            self.show(item, evt);
            if ('click' !== self.options.trigger)
            {
                addEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', handler2, {capture:true, passive:true});
            }
        }
    };
    positionAt = function(item, atItemX, atItemY) {
        var bodyRect, itemRect, infoRect,
            x, y, vw, vh, sx, sy;

        if (is_function(atItemX)) atItemX = atItemX(item, self);
        if (is_function(atItemY)) atItemY = atItemY(item, self);
        infoPopup.style.position = 'absolute';
        removeClass(infoPopup, 'below');
        removeClass(infoPopup, 'left');
        removeClass(infoPopup, 'right');
        bodyRect = rect(document.body);
        itemRect = rect(item);
        infoRect = rect(infoPopup);
        vw = window.innerWidth || document.documentElement.clientWidth;
        vh = window.innerHeight || document.documentElement.clientHeight;
        sx = document.body.scrollLeft || 0;
        sy = document.body.scrollTop || 0;

        switch ((atItemX || 'center').toLowerCase())
        {
            case 'left':
                x = itemRect.left;
                addClass(infoPopup, 'left');
                if (0 > x)
                {
                    if (itemRect.right - infoRect.width > x)
                    {
                        x = itemRect.right - infoRect.width;
                        removeClass(infoPopup, 'left');
                        addClass(infoPopup, 'right');
                    }
                }
                else if (x + infoRect.width > vw)
                {
                    if (itemRect.right < x + infoRect.width)
                    {
                        x = itemRect.right - infoRect.width;
                        removeClass(infoPopup, 'left');
                        addClass(infoPopup, 'right');
                    }
                }
                break;
            case 'right':
                x = itemRect.right - infoRect.width;
                addClass(infoPopup, 'right');
                if (0 > x)
                {
                    if (itemRect.left > x)
                    {
                        x = itemRect.left;
                        removeClass(infoPopup, 'right');
                        addClass(infoPopup, 'left');
                    }
                }
                else if (itemRect.right > vw)
                {
                    if (itemRect.left + infoRect.width < itemRect.right)
                    {
                        x = itemRect.left;
                        removeClass(infoPopup, 'right');
                        addClass(infoPopup, 'left');
                    }
                }
                break;
            case 'center':
            default:
                x = itemRect.left + itemRect.width / 2 - infoRect.width / 2;
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
                        x = itemRect.left;
                        addClass(infoPopup, 'left');
                    }
                }
                else if (x + infoRect.width > vw)
                {
                    x = itemRect.right - infoRect.width;
                    addClass(infoPopup, 'right');
                }
                break;
        }
        switch ((atItemY || 'top').toLowerCase())
        {
            case 'center':
                y = itemRect.top + itemRect.height / 2 - infoRect.height;
                if (y < 0)
                {
                    if (sy >= -y)
                    {
                        document.body.scrollTop += y;
                        sy = document.body.scrollTop;
                        y = 0;
                    }
                    else
                    {
                        y = itemRect.top + itemRect.height / 2;
                        addClass(infoPopup, 'below');
                    }
                }
                break;
            case 'bottom':
                y = itemRect.bottom;
                addClass(infoPopup, 'below');
                if (y + infoRect.height > vh)
                {
                    if (infoRect.height - itemRect.top < y + infoRect.height - vh)
                    {
                        y = itemRect.top - infoRect.height;
                        removeClass(infoPopup, 'below');
                    }
                }
                break;
            case 'top':
            default:
                y = itemRect.top - infoRect.height;
                if (y < 0)
                {
                    if (sy >= -y)
                    {
                        document.body.scrollTop += y;
                        sy = document.body.scrollTop;
                        y = 0;
                    }
                    else if (vh - itemRect.bottom - infoRect.height > y)
                    {
                        y = itemRect.bottom;
                        addClass(infoPopup, 'below');
                    }
                }
                break;
        }
        infoPopup.style.left = String(x + sx - bodyRect.left) + 'px';
        infoPopup.style.top = String(y + sy - bodyRect.top) + 'px';
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
    self.hide = function() {
        clearTimer();
        removePopup();
    };
    self.show = function(item, evt) {
        if (!item || !is_function(self.options.content)) return;
        var infoContent, imgs, loaded = 0;

        infoContent = self.options.content(item, self);
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

        current = item;
        addClass(current, self.options.focusedClass || 'focused');

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
                       if (
                        (imgs.length === loaded)
                        && (item === current)
                        && infoPopup.parentNode
                        && (infoPopup === ancestor(img, infoPopup))
                        )
                       {
                           // re-position popup
                           positionAt(item, self.options.atItemX, self.options.atItemY);
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
        positionAt(item, self.options.atItemX, self.options.atItemY);
    };

    if (!infoPopup)
    {
        infoPopup = document.createElement('div');
        addClass(infoPopup, 'info-popup');
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
    show: null,
    hide: null
};
InfoPopup.VERSION = VERSION;
return InfoPopup;
});