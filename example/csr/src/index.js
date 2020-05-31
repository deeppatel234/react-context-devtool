import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import reactime from 'reactime';

// import myconnect from './myConnect';

import useReducerDebug from './useReducerDebug';

// const abcd = [];

const rootContainer = document.getElementById('root');

// window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
//     isDisabled: false,
//     supportsFiber: true,
//     inject: function() {},
//     onCommitFiberRoot: function() {},
//     onCommitFiberUnmount: function() {},
// };
// console.log();

const ddd = ReactDOM.render(<App />, rootContainer, () => {
    useReducerDebug(rootContainer);
    // reactime(rootContainer);
});

// console.log(ddd);

// ReactDOM.render(<App />, document.getElementById('root'), () => {
//     console.log('calledddd', root._reactRootContainer._internalRoot.current);

//     const p1 = root._reactRootContainer._internalRoot.current.child.child;
//     console.log('calledddd', p1);
//     abcd.push(p1);
// });

// setInterval(() => {
//     console.log(abcd.map(a => a.pendingProps.value)[0]);
// }, 1000)

// const someElement = document.getElementById("root");
// const myComp = FindReact(someElement);
// console.log(myComp);

// function FindReact(dom, traverseUp = 0) {
//     const key = Object.keys(dom).find(key=>key.startsWith("__reactInternalInstance$"));
//     const domFiber = dom[key];
//     if (domFiber == null) return null;

//     // react <16
//     if (domFiber._currentElement) {
//         let compFiber = domFiber._currentElement._owner;
//         for (let i = 0; i < traverseUp; i++) {
//             compFiber = compFiber._currentElement._owner;
//         }
//         return compFiber._instance;
//     }

//     // react 16+
//     const GetCompFiber = fiber=>{
//         //return fiber._debugOwner; // this also works, but is __DEV__ only
//         let parentFiber = fiber.return;
//         while (typeof parentFiber.type == "string") {
//             parentFiber = parentFiber.return;
//         }
//         return parentFiber;
//     };
//     let compFiber = GetCompFiber(domFiber);
//     for (let i = 0; i < traverseUp; i++) {
//         compFiber = GetCompFiber(compFiber);
//     }
//     return compFiber.stateNode;
// }
