# react-xjst

[![Build Status](https://travis-ci.org/bem-contrib/react-xjst.svg?branch=master)](https://travis-ci.org/bem-contrib/react-xjst)


Virtual DOM react-provider engine for XJST.

## Getting Started
Install the module with: `npm install --save react-xjst`

```js
var reactXjst = require('react-xjst');
var React = require('react');
var ReactDOM = require('react-dom');
var templates = require('./templates'); // bundle with templates and bem-xjst compiler

var provide = reactXjst(templates, React);

function MyComponent() {
    return provide({
        block: 'my-block'
    });
}

ReactDOM.render(React.createElement(MyComponent), document.getElementById('root'));
```

## License MIT
