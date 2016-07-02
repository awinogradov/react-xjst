'use strict';

// const parseAttrs = require('posthtml-attrs-parser');
// const camelCase = require('camel-case');

/**
 * @param {Object} templates
 * @param {Object} reactInstance - inject React in runtime
 *
 * @return {Function}
 */
module.exports = function (templates, reactInstance) {

    /**
     * @param {Object} hash that fits BEMJSON format
     * @return {Object} ReactElement
     */
    return function (bemJson) {


        // var end = false;
        // var comps = makeComponent(templates.apply(bemJson))
        // while(end) {
        //
        // }


        // let isValidReactElement = (obj) => {
        //     return typeof obj === 'object' && obj !== null && !!obj.$$typeof;
        // };

        function makeComponent(args) {

            // TODO: LATER
            // if (args.filter(isValidReactElement).length === args.length) {
            //   console.log('!!! render component');
            //     return reactInstance.createElement.apply(reactInstance, ['div', null].concat(args));
            // }


            var i = args.length,
              children = [args[0], args[1]];

            while(i--) {children[i] = args[i]; }

            for (i = children.length; i >= 1; i--) {
              if (Array.isArray(children[i])) {
                children[i] = makeComponent(children[i]);
              }
            }


            // if (args[1] && args[1].style) {
            //     let objectStyle = parseAttrs({
            //         style: args[1].style,
            //     }).style;
            //     let reactStyle = {};
            //     Object.keys(objectStyle).forEach(key => {
            //         reactStyle[camelCase(key)] = objectStyle[key];
            //     });
            //     args[1].style = reactStyle;
            // }

            return reactInstance.createElement.apply(reactInstance, children);
        }

        return makeComponent(templates.apply(bemJson));
    };
};
