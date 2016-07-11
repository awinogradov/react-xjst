'use strict';

const parseAttrs = require('posthtml-attrs-parser');
const camelCase = require('camel-case');

class XjstAdapter {
  /**
   * @param {Object} templates
   * @param {Object} reactInstance - inject React in runtime
   */
   use(templates, reactInstance) {
      this.templates = templates;
      this.reactInstance = reactInstance;
  }
  /**
   * @param {Object} hash that fits BEMJSON format
   * @return {Object} ReactElement
   */
    provide(bemJson) {
        let isValidReactElement = (obj) => {
            return typeof obj === 'object' && obj !== null && !!obj.$$typeof;
        };

        const makeComponent = (args) => {
            if (args.filter(isValidReactElement).length === args.length) {
                return this.reactInstance.createElement.apply(this.reactInstance, ['div', null].concat(args));
            }

            let children = args.slice(2).map(a => Array.isArray(a) ? makeComponent(a) : a);

            if (args[1] && args[1].style) {
                let objectStyle = parseAttrs({
                    style: args[1].style,
                }).style;
                let reactStyle = {};
                Object.keys(objectStyle).forEach(key => {
                    reactStyle[camelCase(key)] = objectStyle[key];
                });
                args[1].style = reactStyle;
            }

            return this.reactInstance.createElement.apply(this.reactInstance, args.slice(0, 2).concat(children));
        };

        return makeComponent(this.templates.apply(bemJson));
    }
}

module.exports = new XjstAdapter();
