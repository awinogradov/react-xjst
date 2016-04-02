'use strict';

module.exports = function (templates, reactInstance) {
    return function (bemJson) {

        let isValidReactElement = (obj) => {
            return typeof obj === 'object' && obj.$$typeof;
        };

        function makeComponent(args) {
            // if (args.filter(a => isValidReactElement(a)).length === args.length) {
            //     return React.createElement.apply(null, ['div', null].concat(args));
            // }

            let children = args.slice(2).map((a) => {
                if (Array.isArray(a)) {
                    return makeComponent(a);
                } else {
                    return a;
                }
            });

            return reactInstance.createElement.apply(reactInstance, args.slice(0, 2).concat(children));

        }

        var res = makeComponent(templates.apply(bemJson));
        return res;
    }
};
