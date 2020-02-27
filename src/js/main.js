"use strict";

export default class magicLine {

  constructor(node, settings) {

    this.elements;

    /**
     * Basic Helper function to check if an Element is an instance of Node
     * @param {any} domNode either a dom node or querySelector
     * @returns {boolean} either true or false
     */
    function isDomElement(domNode) {
      if (domNode instanceof Node || domNode instanceof NodeList || domNode instanceof HTMLCollection) {
        return true;
      }
      return false;
    }

    /**
     * Check this.elements and declare them based on their value
     */
    if (isDomElement(node)) {
      this.elements = node;
    } else {
      this.elements = document.querySelectorAll(node);
    }

    /**
     * Build Default Settings Object
     */
    const defaults = {
      navElements: 'a',
      mode: 'line',
      lineStrength: 2,
      lineClass: 'magic-line',
      wrapper: 'div',
      animationCallback: null
    };

    /**
     * Basic Helper Function to merge user defined settings with the defaults Object
     * @param  {...any} args Arguments to check
     * @returns {object} Merged Settings Object
     */
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

    /**
     * Build the final Settings Object
     */
    this.settings = extendSettings(defaults, settings || {});

		/**
		 * Helper function to determine if an element matches a selector
		 * @param {HTMLElement} el The HTMLElement to be checked
		 * @param {string} selector selector
		 * @returns {boolean} true or false
		 */
		const elementMatches = (el, selector) => {
			if ((el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)) {
				return true;
			}
			return false;
		};

		/**
		 * Recursive function to get the closest ancestor by
		 * @param {HTMLElement} el Source Element
		 * @param {*} selector parentselector
		 * @returns {HTMLElement} Parent Element
		 */
		function findAncestor (el, selector) {
			while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, selector)) {
				continue;
			}
			return el;
		}

    /**
     * Get all Nav Elements
     * @param {object} parent A parentNode of all Nav Elements
     * @returns {object} All Navigation Elements
     */
    const getNavElements = (parent) => parent.querySelectorAll(this.settings.navElements);

    /**
     * Set the active Element
     * @param {object} links All available Nav Elements
     * @param {object} event the event object
     * @returns {null} NULL
     */
    const setActiveElement = (links, event) => {
      Array.prototype.forEach.call(links, (el) => {
        el.classList.remove('active');
      });
      event.target.classList.add('active');
    };

    /**
     * Get the currently active Element
     * @param {object} elements All available Nav Elements
     * @uses setActiveElement
     * @returns {object} The currently active Nav Element
     */
    const getActiveElement = (elements) => {

      let active = Array.prototype.filter.call(elements, (el) => {
        if (el.classList.contains('active')) {
          return el;
        }
        return null;
      });

      if (!active.length) {
        active = elements[0];
        setActiveElement(elements, {
          target: elements[0]
        });
      } else {
        active = active[0];
      }

      return {
        el: active,
        rect: active.getBoundingClientRect()
      }

    };

    /**
     * Move Line
     * @param {object} lineEl The Magic Line Element
     * @param {object} event The Event Object
     * @uses drawLine
     * @returns {null} NULL
     */
    const moveLine = (lineEl, event) => {
			let curEl = event.target;
			if (!elementMatches(curEl, this.settings.navElements)) {
				curEl = findAncestor(curEl, this.settings.navElements);
			}

      const cur = {
        el: curEl,
        rect: curEl.getBoundingClientRect()
      };
      drawLine(lineEl, cur);
    };

    /**
     * Reset Line
     * @param {object} lineEl The Magic Line Element
     * @param {object} links All available Nav Elements
     * @uses drawLine
     * @returns {null} NULL
     */
    const resetLine = (lineEl, links) => {
      const active = getActiveElement(links);
      drawLine(lineEl, active);
    };


    /**
     * Draw Line
     * @param {object} line The Magic Line Element
     * @param {object} active The currently active Nav Element
     * @param {boolean} init Does the function run on Initialisation?
     * @returns {null} NULL
     */
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

    /**
     * Create all neccessary MagicLine Elements on Load
     * @returns {null} NULL
     */
    const onLoad = () => {

      Array.prototype.forEach.call(this.elements, (el) => {

        el.classList.add('init-magic-line', 'magic-line-mode-' + this.settings.mode.toLowerCase());

        // Build an Element Wrapper
        let linkWrapper = document.createElement(this.settings.wrapper);
        linkWrapper.className = 'magic-line-inner';

        // Create the Line Element
        let magicLineEl = document.createElement('div');
        magicLineEl.className = this.settings.lineClass;
        if (this.settings.animationCallback === null) {
          magicLineEl.classList.add('magic-line-css-transition');
        }
        el.appendChild(magicLineEl);

        // Wrap all Child Elements
        while (el.firstChild) {
          linkWrapper.appendChild(el.firstChild);
        }

        // Insert the wrapper Element
        el.appendChild(linkWrapper);

        let initActive = getActiveElement(getNavElements(el));

        // Draw
        drawLine(magicLineEl, initActive, true);

      });

    };

    /**
     * Bind Event Listeners
     * @returns {null} NULL
     */
    const BindEvents = () => {

      Array.prototype.forEach.call(this.elements, (el) => {

        let lineSelector = '.' + this.settings.lineClass;
        let lineEl = el.querySelector(lineSelector);
        let linkWrapper = el.querySelector('.magic-line-inner');
        let links = getNavElements(linkWrapper);

        Array.prototype.forEach.call(links, (link) => {
          link.addEventListener('click', setActiveElement.bind(null, links));
          link.addEventListener('mouseover', moveLine.bind(null, lineEl));
          link.addEventListener('mouseleave', resetLine.bind(null, lineEl, links));
        });

        window.addEventListener('resize', resetLine.bind(null, lineEl, links));

      });

    };

    /**
     * Init MagicLine
     * @returns {null} NULL
     */
    this.init = function () {

      // Set init states
      onLoad.call(this);

      // Bind all Events
      BindEvents.call(this);

    };

  }

}