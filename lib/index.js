'use strict';

const camelCase = require('camel-case');

/**
 * @param {Object} templates
 * @param {Object} reactInstance - inject React in runtime
 *
 * @return {Function}
 */
module.exports = (templates, reactInstance) => {
    /**
     * @param {Object} hash that fits BEMJSON format
     *
     * @return {Object} ReactElement
     */
    return bemJson => {
        const makeComponent = args => {
            for (let i = args.length; i; i--) {
                if (Array.isArray(args[i])) {
                    args[i] = makeComponent(args[i]);
                }
            }

            if (args[1] && args[1].style) {
                const styles = args[1].style.split(';');
                const objectStyle = {};

                for (let i = 0; i < styles.length; i++) {
                    const style = styles[i].split(':');
                    const key = style[0].trim();
                    const rule = style[1].trim();

                    objectStyle[key] = rule;
                }

                const keys = Object.keys(objectStyle);
                const reactStyle = {};

                for (let i = 0; i < keys.length; i++) {
                    reactStyle[camelCase(keys[i])] = objectStyle[keys[i]];
                }

                args[1].style = reactStyle;
            }

            return reactInstance.createElement.apply(reactInstance, args);
        };

        return makeComponent(templates.apply(bemJson));
    };
};
