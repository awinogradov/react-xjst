'use strict';

const parseAttrs = require('posthtml-attrs-parser');
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
    'class': 'className',
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
    'for': 'htmlFor',
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
    usemap: 'useMap'
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

        const makeComponent = (args) => {
            if (args.filter(isValidReactElement).length === args.length) {
                return this.reactInstance.createElement.apply(this.reactInstance, ['div', null].concat(args));
            }

            let children = args.slice(2).map(a => Array.isArray(a) ? makeComponent(a) : a);

            if(args[1]) {
                let attrs = {};
                Object.keys(args[1]).forEach(key => {
                    if(capitalizableDict[key]) {
                        attrs[capitalizableDict[key]] = args[1][key];
                    } else {
                        attrs[key] = args[1][key];
                    }
                });
                args[1] = attrs;
            }

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
