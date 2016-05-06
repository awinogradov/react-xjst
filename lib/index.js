'use strict';

const parseAttrs = require('posthtml-attrs-parser');
const camelCase = require('camel-case');

/**
 * @param {Object} templates Object with .apply() method and all the required templates
 * @param {Object} reactInstance Inject React in runtime
 *
 * @return {Function}
 */
module.exports = function (templates, reactInstance) {

    /**
     * @param {Object} bemJson Hash that fits BEMJSON format
     * @return {Object} ReactElement
     */
    return function (bemJson) {

        let isValidReactElement = (obj) => {
            return typeof obj === 'object' && obj !== null && !!obj.$$typeof;
        };

        function makeComponent(args) {
            if (args.filter(isValidReactElement).length === args.length) {
                return reactInstance.createElement.apply(reactInstance, ['div', null].concat(args));
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

            return reactInstance.createElement.apply(reactInstance, args.slice(0, 2).concat(children));
        }

        return makeComponent(templates.apply(bemJson));
    };
};
