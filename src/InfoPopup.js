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
    var self = this, infoPopup, content,
        closeBt, timer, current,
        removePopup, removeInfoPopup,
        clearTimer, handler, infoHandler;

    if (!(self instanceof InfoPopup))
        return new InfoPopup(options);

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
            if ('click' !== self.options.trigger)
            {
                addEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', function leave() {
                    removeEvent(document.body, 'touchstart' === evt.type ? 'touchend' : 'mouseleave', leave, {capture:true, passive:true});
                    removeInfoPopup();
                }, {capture:true, passive:true});
            }
        }
    };
    self.options = options || {};
    self.dispose = function() {
        clearTimer();
        removePopup();
        if (closeBt) removeEvent(closeBt, 'click', removePopup, {capture:true, passive:true});
        if ('click' === self.options.trigger)
        {
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
        var infoContent, br, r, ir, x, y, vw, vh, sx, sy;

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

        removeClass(infoPopup, 'below');
        removeClass(infoPopup, 'left');
        removeClass(infoPopup, 'right');
        document.body.appendChild(infoPopup);

        if (current) removeClass(current, 'hovered');
        current = item;
        addClass(item, 'hovered');

        br = document.body.getBoundingClientRect();
        r = item.getBoundingClientRect();
        ir = infoPopup.getBoundingClientRect();
        vw = window.innerWidth;
        vh = window.innerHeight;
        sx = document.body.scrollLeft || 0;
        sy = document.body.scrollTop || 0;

        x = sx + r.left - br.left + r.width / 2 - ir.width / 2;
        y = sy + r.top - br.top - ir.height;

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
                x = sx + r.left - br.left;
                addClass(infoPopup, 'left');
            }
        }
        else if (x + ir.width > vw)
        {
            x = sx + r.left - br.left + r.width - ir.width;
            addClass(infoPopup, 'right');
        }
        if (r.top + r.height / 2 < vh / 2)
        {
            y = sy + r.top - br.top + r.height;
            addClass(infoPopup, 'below');
        }

        infoPopup.style.position = 'absolute';
        infoPopup.style.left = String(x) + 'px';
        infoPopup.style.top = String(y) + 'px';
    };

    if (!infoPopup)
    {
        infoPopup = document.createElement('div');
        addClass(infoPopup, 'info');
        if (self.options.className) addClass(infoPopup, self.options.className);

        infoPopup.appendChild(document.createElement('div'));
        addClass(infoPopup.firstChild, 'header');
        infoPopup.firstChild.appendChild(closeBt=document.createElement('button'));
        addClass(closeBt, 'close');
        closeBt.setAttribute('title', self.options.closeMsg || 'Close Popup');
        addEvent(closeBt, 'click', removePopup, {capture:true, passive:true});

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