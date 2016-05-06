var React = require('react');
var expect = require('expect');

var templates = {
    apply: d => d,
};

var reactXjst = require('../lib')(templates, React);

function checkResults(res, type, props) {
    expect(res.props).toEqual(props);
    expect(typeof res.$$typeof).toBe('symbol');
    expect(res.type).toBe(type);
}

describe('react-xjst', () => {

    it('should create a simple element', () => {
        var res = reactXjst(['div', { className: 'b1' }, 'hi there']);
        checkResults(res, 'div', { className: 'b1', children: 'hi there' });
    });

    it('should add already rendered react element', () => {
        var reactEl = React.createElement('div', { className: 'e1' }, 'e1-content');
        var res = reactXjst(['div', null, reactEl]);
        checkResults(res, 'div', { children: reactEl });
    });

    it('should create new react elements and add valid ones', () => {
        var b1Proto = ['div', { className: 'b1' }, 'b1-content'];
        var b2Proto = ['div', { className: 'b2' }, 'b2-content'];
        var reactEl1 = React.createElement('div', { className: 'e1' }, 'e1-content');
        var reactEl2 = React.createElement('div', { className: 'e2' }, 'e2-content');

        var res = reactXjst(['div', null, b1Proto, reactEl1, b2Proto, reactEl2]);

        var b1ReactEl = React.createElement.apply(null, b1Proto);
        var b2ReactEl = React.createElement.apply(null, b2Proto);

        checkResults(res, 'div', { children: [b1ReactEl, reactEl1, b2ReactEl, reactEl2] });
    });

    it('should handle nested items', () => {
        var reactEl1 = React.createElement('div', { className: 'e1' }, 'e1-content');
        var reactEl2 = React.createElement('div', { className: 'e2' }, 'e2-content');
        var reactEl3 = React.createElement('div', { className: 'e3' }, 'e3-content');

        var b3Proto = ['span', { className: 'b3' }, reactEl3];

        var b1Proto = ['div', { className: 'b1' }, 'b1-content', reactEl1];
        var b2Proto = ['div', { className: 'b2' }, 'b2-content', reactEl2, b3Proto];

        var res = reactXjst(['div', null, b1Proto, b2Proto]);

        var b1ReactEl = React.createElement.apply(null, b1Proto);
        var b2ReactEl = React.createElement.apply(null,
            ['div', { className: 'b2' }, 'b2-content', reactEl2, React.createElement.apply(null, b3Proto)]);
        checkResults(res, 'div', { children: [b1ReactEl, b2ReactEl] });
    });

    it('should parse style property', () => {
        var res = reactXjst(['div', { className: 'b1', style: 'top: 200px; z-index: 1000' }, 'b1-content']);
        expect(res.props.style).toEqual({
            top: '200px',
            zIndex: '1000',
        });
    });
});
