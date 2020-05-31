
import { inspectHooksOfFiber } from './react-debug-tools.development';

import React from "react";
import ReactDOM from "react-dom";


let fiberRoot = null;

console.log(ReactDOM);

const updateTreeAndSendToDevtool = (node) => {
    // console.log("call updateTreeAndSendToDevtool");
    console.log(node.current);
    const listOFProvider = [];
    createFiberTree(node.current, listOFProvider);

    // console.log(listOFProvider.forEach(c => console.log(c.pendingProps.value, c.displayName)));

    // console.log();
    // setTimeout(() => {
        // console.log(listOFProvider.forEach(c => console.log(c)));
        console.log(listOFProvider.forEach(c => console.log(c.pendingProps.value, c.displayName)));

        // console.log(listOFProvider.forEach(c => console.log(c.elementType._context.Consumer._currentValue())));
    // }, 3000);
};

// function changeSetState(component) {
//     if (component.setState.linkFiberChanged) return;

//     // Persist the old setState and bind to component so we can continue to setState({})
//     const oldSetState = component.setState.bind(component);

//     // console.log(component);

//     component.setState = (state, callback = () => {}) => {
//         // Continue normal setState functionality, with middleware in callback
//         oldSetState(state, () => {
//             updateTreeAndSendToDevtool();
//             callback.bind(component)();
//         });
//     };
//     // Set a custom property to ensure we don't change this method again
//     component.setState.linkFiberChanged = true;
// }

// function changeUseState(component) {
//     if (component.queue.dispatch.linkFiberChanged) return;

//     // Persist the old dispatch and bind to component so we can continue to dispatch()
//     const oldDispatch = component.queue.dispatch.bind(component.queue);

//     component.queue.dispatch = (fiber, queue, action) => {
//         oldDispatch(fiber, queue, action);

//         updateTreeAndSendToDevtool();
//     };
//     // Set a custom property to ensure we don't change this method again
//     component.queue.dispatch.linkFiberChanged = true;
// }

// TODO: WE NEED TO CLEAN IT UP A BIT
// function traverseHooks(memoizedState) {
//     // While memoizedState is truthy, save the value to the object
//     while (memoizedState && memoizedState.queue) {
//         changeUseState(memoizedState);
//         memoizedState = memoizedState.next;
//     }
// }

const createFiberTree = (node, listOFProvider) => {
    if (!node) {
        return null;
    }

    const { sibling, stateNode, child, memoizedState, elementType, tag, type } = node;

    /**
     * https://github.com/facebook/react/tree/master/packages/react-reconciler/src/ReactWorkTags.js#L47
     */
    if (tag === 10) {
        // console.log(node);
        // setTimeout(() => {
        listOFProvider.push(node);
        // }, 0);
    }

    // console.log(node);
    if (tag === 9) {
        // setTimeout(() => {
        // listOFProvider.push(node);
        // }, 0);
    }

    Check if stateful component
    if (stateNode && stateNode.state) {
        // console.log(stateNode);
        changeSetState(stateNode); // Change setState functionality
    }

    Check if the component uses hooks
    if (
        memoizedState &&
        Object.hasOwnProperty.call(memoizedState, "baseState")
    ) {
        // 'catch-all' for suspense elements (experimental)
        // if (typeof elementType.$$typeof === "symbol") {
        //     console.log(node);
        //     return;
        // };

        let tempMemoizedState = memoizedState;

        while (tempMemoizedState && tempMemoizedState.queue) {
            changeUseState(tempMemoizedState);
            tempMemoizedState = tempMemoizedState.next;
        }
    }

    // Recurse on siblings
    createFiberTree(sibling, listOFProvider);
    // Recurse on children
    createFiberTree(child, listOFProvider);
};

const myConnect = (root) => {
    // if (root._internalRoot) {
    //     fiberRoot = container._internalRoot.current.child;
    // } else {
    //     const {
    //         _reactRootContainer: { _internalRoot },
    //     } = root;
    //     fiberRoot = _internalRoot.current;
    // }

    // Object.keys(root)[0];

    // console.log(root[Object.keys(root)[0]].stateNode.current);
    // console.log(fiberRoot);

    // fiberRoot = root[Object.keys(root)[0]].stateNode.current;

    // const listOFProvider = [];
    // createFiberTree(fiberRoot, listOFProvider);
    // console.log(listOFProvider);

    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = (original => (...args) => {
        // updateTreeAndSendToDevtool(args[1]);
        // console.log(args);
        const ff = original(...args);
        console.log('calleddd', ff);
        return ff;
    })(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot);

    // console.log('test', root._reactRootContainer._internalRoot.current.child.child);

    // const d = root._reactRootContainer._internalRoot.current.child.child;

    // console.log(inspectHooksOfFiber(d));
};

export default myConnect;
