import { inspectHooksOfFiber } from "./react-debug-tools.development";

const uniqId = () => {
    let counter = 0;

    return () => {
        counter += 1;
        return `debugId_${counter}`;
    };
};

const getUniqId = uniqId();

const fiberNodeToDebug = {
    useReducer: {},
    context: {},
};

// for debug only
export const changeValue = (action) => {
    fiberNodeToDebug.useReducer.debugId_2.hook.queue.dispatch(action);
};

const sendDataToDevtool = () => {
    console.log(fiberNodeToDebug.context);
    // console.log(Object.values(fiberNodeToDebug.useReducer));
};

const doWorkWithHooks = (hook) => {
    if (hook.__reactContextDevtoolHookType == "useReducer") {
        let debugId = hook.queue.__reactContextDevtoolDebugId;

        if (!debugId) {
            const currentDispatch = hook.queue.lastRenderedReducer.bind(hook.queue);
            hook.queue.lastRenderedReducer = (state, action, ...rest) => {
                if (fiberNodeToDebug.useReducer[hook.queue.__reactContextDevtoolDebugId]) {
                    fiberNodeToDebug.useReducer[hook.queue.__reactContextDevtoolDebugId].actions.push(action);
                }
                currentDispatch(state, action, ...rest);
            };

            debugId = getUniqId();
            hook.queue.__reactContextDevtoolDebugId = debugId;

            fiberNodeToDebug.useReducer[debugId] = {
                actions: [{ initialState: true }],
                hook,
                state: [],
            };

            return;
        };

        const obj = fiberNodeToDebug.useReducer[debugId];

        obj.hook = hook;

        if (obj.state.length) {
            const valueChanged = obj.state[obj.state.length - 1] !== hook.queue.lastRenderedState;
            if (!valueChanged) {
                return
            }
        }

        obj.state.push(hook.queue.lastRenderedState);
    }
};

const doWorkWithContextProvider = (node) => {
    if (!node.type._context.__reactContextDevtoolDebugId) {
        node.type._context.__reactContextDevtoolDebugId = getUniqId();
    }

    const debugId = node.type._context.__reactContextDevtoolDebugId;
    const valueChanged = !(
        fiberNodeToDebug.context[debugId] &&
        node.pendingProps.value === fiberNodeToDebug.context[debugId].value
    );

    fiberNodeToDebug.context[debugId] = {
        valueChanged,
        value: node.pendingProps.value,
        displayName: node.pendingProps.displayName || node.type._context.displayName || debugId,
    };
};

const doWorkWithFiberNode = (node) => {
    if (!node) {
        return;
    }

    const { memoizedState, tag } = node;

    if (
        memoizedState &&
        Object.hasOwnProperty.call(memoizedState, "baseState")
    ) {
        inspectHooksOfFiber(node);

        let temp = memoizedState;
        while (temp && temp.queue) {
            doWorkWithHooks(temp);
            temp = temp.next;
        }
    }

    /**
     * https://github.com/facebook/react/tree/master/packages/react-reconciler/src/ReactWorkTags.js#L47
     */
    if (tag === 10) {
        doWorkWithContextProvider(node);
    }
};

/**
 * https://github.com/facebook/react/issues/7942
 *
 * @param {object} fiber
 */
const traverse = (fiber) => {
    let root = fiber.current;
    let node = fiber.current;

    while (true) {
        doWorkWithFiberNode(node);

        if (node.child) {
            node = node.child;
            continue;
        }
        if (node === root) {
            return;
        }
        while (!node.sibling) {
            if (!node.return || node.return === root) {
                return;
            }
            node = node.return;
        }
        node = node.sibling;
    }
};

const useReducerDebug = (container) => {
    let fiberRoot = null;
    if (container._internalRoot) {
        fiberRoot = container._internalRoot;
    } else {
        const {
            _reactRootContainer: { _internalRoot },
        } = container;
        fiberRoot = _internalRoot;
    }

    traverse(fiberRoot);
    sendDataToDevtool();

    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook && typeof hook.onCommitFiberRoot === "function") {
        hook.onCommitFiberRoot = ((oldFunction) => (
            rendererID,
            root,
            ...args
        ) => {
            traverse(root);
            sendDataToDevtool();
            return oldFunction(rendererID, root, ...args);
        })(hook.onCommitFiberRoot);
    } else {
        console.error("onCommitFiberRoot is not available in ReactDOM library");
    }
};

export default useReducerDebug;
