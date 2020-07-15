<p align="center">
  <img src="https://github.com/deeppatel234/react-context-devtool/blob/master/store-assets/cover.png?raw=true" width="80%"/>
</p>

<h2 align="center">Devtool for React Context and useReducer Hook</h2>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![NPM Download](https://img.shields.io/npm/dt/react-context-devtool.svg)](https://www.npmjs.com/package/react-context-devtool) [![NPM](https://img.shields.io/npm/v/react-context-devtool.svg)](https://www.npmjs.com/package/react-context-devtool)

<p align="center">
  <img src="https://github.com/deeppatel234/react-context-devtool/blob/master/store-assets/screenshots/context-tree-view.png?raw=true" width="50%"/>
</p>
<p align="center">
  <img src="https://github.com/deeppatel234/react-context-devtool/blob/master/store-assets/screenshots/context-raw-view.png?raw=true" width="30%"/>
  <img src="https://github.com/deeppatel234/react-context-devtool/blob/master/store-assets/screenshots/reducer-action-view.png?raw=true" width="30%"/>
  <img src="https://github.com/deeppatel234/react-context-devtool/blob/master/store-assets/screenshots/reducer-diff-view.png?raw=true" width="30%"/>
</p>

## Installation

- Download extension from
	- [Chrome Web Store](https://chrome.google.com/webstore/detail/oddhnidmicpefilikhgeagedibnefkcf)
    - [Firefox Addons Store](https://addons.mozilla.org/en-US/firefox/addon/react-context-devtool/)
    - [Microsoft Edge Addons Store](https://microsoftedge.microsoft.com/addons/detail/react-context-devtool/bnclaomncapgohhafjepfklgbjdjlfcd)

### Auto Mode
- Download and install npm package

```sh
npm install react-context-devtool
```

- Attach root container in debugContextDevtool method

```js
import React from "react";
import ReactDOM from "react-dom";
import { debugContextDevtool } from 'react-context-devtool';

import App from "./App";

const container = document.getElementById("root");

ReactDOM.render(<App />, container);

// Attach root container
debugContextDevtool(container, options);

```

| Name  | Type  | Default | Description  |
| ------ | ------ | ------ | ------ |
| `debugReducer`  | boolean  | `true`  | enable/disable useReducer debug |
| `debugContext`  | boolean  | `true`  | enable/disable context debug  |
| `disable`  | boolean  | `false`  |  disable react-context-devtool including manual mode  |
| `disableAutoMode`  | boolean  | `false`  | disable auto mode only  |


### Manual Mode

- if you want to debug only selected context so you can use manual mode

- Add ContextDevTool component inside your Provider.

```js

import { ContextDevTool } from 'react-context-devtool';

<MyContext.Provider value={{ a: 'hello', b: 'world' }}>
  // Add this in your context provider
  <ContextDevTool context={MyContext} id="uniqContextId" displayName="Context Display Name" />
  <YourComponent />
</MyContext.Provider>
```
2. Add _REACT_CONTEXT_DEVTOOL method in your Consumer.

```js

<MyContext.Consumer>
  {
    values => {
      if (window._REACT_CONTEXT_DEVTOOL) {
        window._REACT_CONTEXT_DEVTOOL({ id: 'uniqContextId', displayName: 'Context Display Name', values });
      }
      return null;
    }
  }
</MyContext.Consumer>

```

## Set Display name in Auto Mode

### Set Display name for Context API

- set `dispayName` props in `Provider`

```js
<MyContext.Provider value={{ a: 'hello', b: 'world' }} displayName="Context Display Name">
  <YourComponent />
</MyContext.Provider>
```

or

- assign display name in Context

```js
  MyContext.displayName = "Context Display Name";
```

### Set Display name for useReducer

- reducer function name is use as displayName in debug


## Disable in production mode

```js

debugContextDevtool(container, {
  disable: process.env.NODE_ENV === "production"
});

```



## License

MIT
