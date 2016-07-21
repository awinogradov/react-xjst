'use strict';

const camelCase = require('camel-case');
const capitalizableDict = {
    acceptcharset: 'acceptCharset',
    accesskey: 'accessKey',
    allowfullscreen: 'allowFullScreen',
    allowtransparency: 'allowTransparency',
    autocomplete: 'autoComplete',
    autofocus: 'autoFocus',
    autoplay: 'autoPlay',
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    charset: 'charSet',
    classid: 'classID',
    class: 'className',
    classname: 'className',
    colspan: 'colSpan',
    contenteditable: 'contentEditable',
    contextmenu: 'contextMenu',
    crossorigin: 'crossOrigin',
    datetime: 'dateTime',
    enctype: 'encType',
    formaction: 'formAction',
    formenctype: 'formEncType',
    formmethod: 'formMethod',
    formnovalidate: 'formNoValidate',
    formtarget: 'formTarget',
    frameborder: 'frameBorder',
    htmlfor: 'htmlFor',
    for: 'htmlFor',
    httpequiv: 'httpEquiv',
    marginheight: 'marginHeight',
    marginwidth: 'marginWidth',
    maxlength: 'maxLength',
    mediagroup: 'mediaGroup',
    novalidate: 'noValidate',
    radiogroup: 'radioGroup',
    readonly: 'readOnly',
    rowspan: 'rowSpan',
    spellcheck: 'spellCheck',
    srcdoc: 'srcDoc',
    srcset: 'srcSet',
    tabindex: 'tabIndex',
    usemap: 'useMap',
    value: 'defaultValue',
    checked: 'defaultChecked'
};

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

        const makeComponent = args => {
            args = [].concat(args);
            if (args.filter(isValidReactElement).length === args.length) {
                return args;
            }

            for (let i = 0; i < args.length; i++) {
                if (Array.isArray(args[i])) {
                    args[i] = makeComponent(args[i]);
                }
            }

            if (isValidReactElement(args[0])) {
                return this.reactInstance.createElement.apply(this.reactInstance, ['div', null].concat(args));
            }

            if (args[1]) {
                let attrs = {};
                Object.keys(args[1]).forEach(key => {
                    if (capitalizableDict[key]) {
                        attrs[capitalizableDict[key]] = args[1][key];
                    } else {
                        attrs[key] = args[1][key];
                    }
                });
                args[1] = attrs;

                if (args[1].style) {
                    args[1].style = args[1].style.split(';').reduce((ruleMap, ruleString) => {
                        if (ruleString) {
                            var rulePair = ruleString.split(/:(.+)/);
                            ruleMap[camelCase(rulePair[0].trim())] = rulePair[1].trim();
                        }

                        return ruleMap;
                    }, {});
                }
            }

            return this.reactInstance.createElement.apply(this.reactInstance, args);
        };

        return makeComponent(this.templates.apply(bemJson));
    }
}

module.exports = new XjstAdapter();
