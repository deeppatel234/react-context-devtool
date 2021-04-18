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

## Set Display names

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


## License

MIT
