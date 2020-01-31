/**
 * Vanilla JS Magic Line Navigation
 * Author: Bastian Fießinger
 * Version: 1.0.1
 */
var magicLine = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var magicLine = function magicLine(node, settings) {
    var _this = this;

    _classCallCheck(this, magicLine);

    this.elements;

    function isDomElement(domNode) {
      if (domNode instanceof Node || domNode instanceof NodeList || domNode instanceof HTMLCollection) {
        return true;
      }

      return false;
    }

    if (isDomElement(node)) {
      this.elements = node;
    } else {
      this.elements = document.querySelectorAll(node);
    } // Build Defaults Object


    var defaults = {
      navElements: 'a',
      mode: 'line',
      lineStrength: 2,
      lineClass: 'magic-line',
      wrapper: 'div',
      animationCallback: null
    };

    var extendSettings = function extendSettings() {
      var merged = {};

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      Array.prototype.forEach.call(args, function (obj) {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            return;
          }

          merged[key] = obj[key];
        }
      });
      return merged;
    };

    this.settings = extendSettings(defaults, settings || {}); // Get all Nav Elements

    var getNavElements = function getNavElements(parent) {
      return parent.querySelectorAll(_this.settings.navElements);
    }; // Set the active Element


    var setActiveElement = function setActiveElement(links, event) {
      Array.prototype.forEach.call(links, function (el) {
        el.classList.remove('active');
      });
      event.target.classList.add('active');
    }; // get the current active Element


    var getActiveElement = function getActiveElement(elements) {
      var active = Array.prototype.filter.call(elements, function (el) {
        if (el.classList.contains('active')) {
          return el;
        }

        return null;
      });
      active = !active.length ? elements[0] : active[0];
      return {
        el: active,
        rect: active.getBoundingClientRect()
      };
    }; // Move Line


    var moveLine = function moveLine(lineEl, event) {
      var curEl = event.target;
      var cur = {
        el: curEl,
        rect: curEl.getBoundingClientRect()
      };
      drawLine(lineEl, cur);
    }; // Reset Line


    var resetLine = function resetLine(lineEl, links) {
      var active = getActiveElement(links);
      drawLine(lineEl, active);
    }; // Draw Line


    var drawLine = function drawLine(line, active, init) {
      var lineLeft = active.el.offsetLeft;
      var lineTop = active.el.offsetTop;
      var lineWidth = active.rect.width;
      var lineHeight;

      if (_this.settings.mode !== 'line') {
        lineHeight = active.rect.height;
      } else {
        lineHeight = _this.settings.lineStrength;
        lineTop += active.rect.height;
      }

      if (_this.settings.animationCallback && !init) {
        _this.settings.animationCallback(line, {
          left: lineLeft + 'px',
          top: lineTop + 'px',
          width: lineWidth + 'px',
          height: lineHeight + 'px'
        });
      } else {
        // If no animation Callback is defined use CSS Styles
        line.style.left = lineLeft + 'px';
        line.style.top = lineTop + 'px';
        line.style.width = lineWidth + 'px';
        line.style.height = lineHeight + 'px';
      }
    };

    var onLoad = function onLoad() {
      Array.prototype.forEach.call(_this.elements, function (el) {
        el.classList.add('init-magic-line', 'magic-line-mode-' + _this.settings.mode.toLowerCase()); // Build an Element Wrapper

        var linkWrapper = document.createElement(_this.settings.wrapper);
        linkWrapper.className = 'magic-line-inner'; // Create the Line Element

        var magicLineEl = document.createElement('div');
        magicLineEl.className = _this.settings.lineClass;

        if (_this.settings.animationCallback === null) {
          magicLineEl.classList.add('magic-line-css-transition');
        }

        el.appendChild(magicLineEl); // Wrap all Child Elements

        while (el.firstChild) {
          linkWrapper.appendChild(el.firstChild);
        } // Insert the wrapper Element


        el.appendChild(linkWrapper);
        var initActive = getActiveElement(getNavElements(el)); // Draw

        drawLine(magicLineEl, initActive, true);
      });
    };

    var BindEvents = function BindEvents() {
      Array.prototype.forEach.call(_this.elements, function (el) {
        var lineSelector = '.' + _this.settings.lineClass;
        var lineEl = el.querySelector(lineSelector);
        var linkWrapper = el.querySelector('.magic-line-inner');
        var links = getNavElements(linkWrapper);
        Array.prototype.forEach.call(links, function (link) {
          link.addEventListener('click', setActiveElement.bind(null, links));
          link.addEventListener('mouseover', moveLine.bind(null, lineEl));
          link.addEventListener('mouseleave', resetLine.bind(null, lineEl, links));
        });
        window.addEventListener('resize', resetLine.bind(null, lineEl, links));
      });
    }; // Initiate


    this.init = function () {
      // Set init states
      onLoad.call(this); // Bind all Events

      BindEvents.call(this);
    };
  };

  return magicLine;

}());
