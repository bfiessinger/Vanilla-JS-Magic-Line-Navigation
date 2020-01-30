"use strict";

export default class magicLine {

  constructor(node, settings) {

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
    }

    // Build Defaults Object
    const defaults = {
      navElements: 'a',
      mode: 'line',
      lineStrength: 2,
      lineClass: 'floating-line',
      wrapper: 'div',
      animationCallback: null
    };

    const extendSettings = (...args) => {
      var merged = {};
      Array.prototype.forEach.call(args, (obj) => {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            return;
          }
          merged[key] = obj[key];
        }
      });
      return merged;
    };

    this.settings = extendSettings(defaults, settings || {});

    // Get all Nav Elements
    const getNavElements = (parent) => parent.querySelectorAll(this.settings.navElements);

    // Set the active Element
    const setActiveElement = (links, event) => {
      Array.prototype.forEach.call(links, (el) => {
        el.classList.remove('active');
      });
      event.target.classList.add('active');
    };

    // get the current active Element
    const getActiveElement = (elements) => {

      let active = Array.prototype.filter.call(elements, (el) => {
        if (el.classList.contains('active')) {
          return el;
        }
        return null;
      });

      active = (!active.length) ? elements[0] : active[0];

      return {
        el: active,
        rect: active.getBoundingClientRect()
      }

    };

    // Move Line
    const moveLine = (lineEl, event) => {
      const curEl = event.target;
      const cur = {
        el: curEl,
        rect: curEl.getBoundingClientRect()
      };
      drawLine(lineEl, cur);
    };

    // Reset Line
    const resetLine = (lineEl, links) => {
      const active = getActiveElement(links);
      drawLine(lineEl, active);
    };

    // Draw Line
    const drawLine = (line, active, init) => {

      let lineLeft = active.el.offsetLeft;
      let lineTop = active.el.offsetTop;
      let lineWidth = active.rect.width;
      let lineHeight;

      if (this.settings.mode !== 'line') {
        lineHeight = active.rect.height;
      } else {
        lineHeight = this.settings.lineStrength;
        lineTop += active.rect.height;
      }

      if (this.settings.animationCallback && !init) {
        this.settings.animationCallback(line, {
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

    const onLoad = () => {

      Array.prototype.forEach.call(this.elements, (el) => {

        el.classList.add('init-floating-line', 'floating-line-mode-' + this.settings.mode.toLowerCase());

        // Build an Element Wrapper
        let linkWrapper = document.createElement(this.settings.wrapper);
        linkWrapper.className = 'floating-line-inner';

        // Create the Line Element
        let floatingLineEl = document.createElement('div');
        floatingLineEl.className = this.settings.lineClass;
        if (this.settings.animationCallback === null) {
          floatingLineEl.classList.add('floating-line-css-transition');
        }
        el.appendChild(floatingLineEl);

        // Wrap all Child Elements
        while (el.firstChild) {
          linkWrapper.appendChild(el.firstChild);
        }

        // Insert the wrapper Element
        el.appendChild(linkWrapper);

        let initActive = getActiveElement(getNavElements(el));

        // Draw
        drawLine(floatingLineEl, initActive, true);

      });

    };

    const BindEvents = () => {

      Array.prototype.forEach.call(this.elements, (el) => {

        let lineSelector = '.' + this.settings.lineClass;
        let lineEl = el.querySelector(lineSelector);
        let linkWrapper = el.querySelector('.floating-line-inner');
        let links = getNavElements(linkWrapper);

        Array.prototype.forEach.call(links, (link) => {
          link.addEventListener('click', setActiveElement.bind(null, links));
          link.addEventListener('mouseover', moveLine.bind(null, lineEl));
          link.addEventListener('mouseleave', resetLine.bind(null, lineEl, links));
        });

        window.addEventListener('resize', resetLine.bind(null, lineEl, links));

      });

    };

    // Initiate
    this.init = function () {

      // Set init states
      onLoad.call(this);

      // Bind all Events
      BindEvents.call(this);

    };

  }

}