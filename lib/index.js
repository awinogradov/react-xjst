'use strict';

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

            return reactInstance.createElement.apply(reactInstance, args.slice(0, 2).concat(children));
        }

        var res = makeComponent(templates.apply(bemJson));
        return res;
    }
};
