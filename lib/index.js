'use strict';

const parseAttrs = require('posthtml-attrs-parser');
const changeCase = require('change-case');

module.exports = function (templates, reactInstance) {
    return function (bemJson) {

        let isValidReactElement = (obj) => {
            return typeof obj === 'object' && obj !== null && !!obj.$$typeof;
        };

        function makeComponent(args) {
            if (args.filter(isValidReactElement).length === args.length) {
                return reactInstance.createElement.apply(reactInstance, ['div', null].concat(args));
            }

            let children = args.slice(2).map(a => Array.isArray(a) ? makeComponent(a) : a);

            if(args[1] && args[1].style) {
                let objectStyle = parseAttrs({
                    style: args[1].style
                }).style;
                let reactStyle = {};
                Object.keys(objectStyle).forEach(key => {
                    reactStyle[changeCase.camelCase(key)] = objectStyle[key];
                });
                args[1].style = reactStyle;
            }

            return reactInstance.createElement.apply(reactInstance, args.slice(0, 2).concat(children));
        }

        var res = makeComponent(templates.apply(bemJson));
        return res;
    }
};
