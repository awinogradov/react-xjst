'use strict';

/**
 * @param {Object} templates
 * @param {Object} reactInstance - inject React in runtime
 *
 * @return {Function}
 */
module.exports = function (templates, reactInstance) {
    /**
     * @param {Object} hash that fits BEMJSON format
     *
     * @return {Object} ReactElement
     */
    return function (bemJson) {
        function makeComponent(args) {
            for (let i = args.length; i; i--) {
                if (Array.isArray(args[i])) {
                    args[i] = makeComponent(args[i]);
                }
            }

            return reactInstance.createElement.apply(reactInstance, args);
        }

        return makeComponent(templates.apply(bemJson));
    };
};
