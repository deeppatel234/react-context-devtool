export function installHook(target) {
  const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
  const DISPATCH_EVENT = "DISPATCH_EVENT";

  const fiberNodeToDebug = {
    useReducer: {},
    context: {},
  };

  let debugOptions = {
    debugReducer: true,
    debugContext: true,
    disable: false,
    disableAutoMode: false,
  };

  const dispatchAction = (event) => {
    if(event.type === "useReducer" && fiberNodeToDebug.useReducer[event.debugId]) {
      fiberNodeToDebug.useReducer[event.debugId].hook.queue.dispatch(event.data);
    }
  };

  window.addEventListener('message', event => {
    if (event.data.type === DATA_EVENT && event.data.subType === DISPATCH_EVENT) {
      dispatchAction(event.data.data);
    }
  });

  // copy object is used to detect compoment is removed
  const fiberNodeToDebugCopy = {
    useReducer: {},
    context: {},
  };

  const uniqId = (prefix) => {
    let counter = 0;

    return () => {
      counter += 1;
      return `${prefix}_${counter}`;
    };
  };

  const getUniqId = uniqId("debugId");

  const sendDataToDevtool = () => {
    const helpers = window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers;

    const dataToSend = {};

    dataToSend.context = Object.keys(fiberNodeToDebug.context).reduce((memo, key) => {
      if (fiberNodeToDebug.context[key].valueChanged) {
        memo[key] = {
          value: fiberNodeToDebug.context[key].value,
          displayName: fiberNodeToDebug.context[key].displayName,
          valueChanged: fiberNodeToDebug.context[key].valueChanged,
          remove: true,
        };
      } else {
        memo[key] = {
          valueChanged: fiberNodeToDebug.context[key].valueChanged,
          remove: true,
        };
      }
      return memo;
    }, {});

    dataToSend.useReducer = Object.keys(fiberNodeToDebug.useReducer).reduce((memo, key) => {
      if (fiberNodeToDebug.useReducer[key].valueChanged) {
        memo[key] = {
          actions: fiberNodeToDebug.useReducer[key].actions,
          state: fiberNodeToDebug.useReducer[key].state,
          valueChanged: fiberNodeToDebug.useReducer[key].valueChanged,
          displayName: fiberNodeToDebug.useReducer[key].displayName,
        };
      } else {
        memo[key] = {
          valueChanged: fiberNodeToDebug.useReducer[key].valueChanged,
        };
      }
      return memo;
    }, {});

    window.postMessage({
      type: "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_EVENT",
      subType: "APP_DATA",
      data: helpers.parseData(dataToSend),
    }, "*");
  };

  let renderer = null;

  /**
   * Debug for React useReducer API
   *
   * @param {object} hook
   */
  const doWorkWithHooks = (hook) => {
    if (hook.__reactContextDevtoolHookType == "useReducer") {
      let debugId = hook.queue.__reactContextDevtoolDebugId;

      if (!debugId) {
        const displayName = hook.queue.lastRenderedReducer.name;
        const currentReducer = hook.queue.lastRenderedReducer.bind(hook.queue);
        hook.queue.lastRenderedReducer = (state, action, ...rest) => {
          const debugObj = fiberNodeToDebug.useReducer[hook.queue.__reactContextDevtoolDebugId];
          if (debugObj && !debugObj.useDispatch) {
            debugObj.actions.push(action);
          }
          currentReducer(state, action, ...rest);
        };

        const currentDispatch = hook.queue.dispatch.bind(hook.queue);
        hook.queue.dispatch = (action, ...rest) => {
          const debugObj = fiberNodeToDebug.useReducer[hook.queue.__reactContextDevtoolDebugId];
          if (debugObj) {
            debugObj.actions.push(action);
            debugObj.useDispatch = true;
          }
          currentDispatch(action, ...rest);
        };

        debugId = getUniqId();
        hook.queue.__reactContextDevtoolDebugId = debugId;

        fiberNodeToDebugCopy.useReducer[debugId] = {
          actions: [{ initialState: true }],
          hook,
          state: [],
          displayName,
          valueChanged: true,
        };
      }

      const debugObj = fiberNodeToDebug.useReducer[debugId] || fiberNodeToDebugCopy.useReducer[debugId];

      fiberNodeToDebugCopy.useReducer[debugId] = debugObj;

      debugObj.hook = hook;

      if (debugObj.state.length) {
        const valueChanged = debugObj.state[debugObj.state.length - 1] !== hook.queue.lastRenderedState;
        debugObj.valueChanged = valueChanged;
        if (!valueChanged) {
          // action dispatched but return same state or wrong state handling
          const diff = debugObj.actions.length - debugObj.state.length;
          if (diff > 0) {
            for (let i = 0; i < diff; i++) {
              debugObj.state.push(debugObj.state[debugObj.state.length - 1]);
            }
            debugObj.valueChanged = true;
          }
          return;
        }
      }

      debugObj.state.push(hook.queue.lastRenderedState);
    }
  };

  /**
   * Debug for React Context API
   *
   * @param {object} node
   */
  const doWorkWithContextProvider = (node) => {
    if (!node.type._context.__reactContextDevtoolDebugId) {
      node.type._context.__reactContextDevtoolDebugId = getUniqId();
    }

    const debugId = node.type._context.__reactContextDevtoolDebugId;

    const valueChanged = !(
      fiberNodeToDebug.context[debugId] &&
      node.pendingProps.value === fiberNodeToDebug.context[debugId].value
    );
  
    const displayName =  node.pendingProps.displayName || node.type._context.displayName;
    const value = node.pendingProps.value;
    const debugName = value && (Object.keys(value).slice(0, 3).join(", ") + (value.length > 3 ? " ..." : ""));
    
    fiberNodeToDebugCopy.context[debugId] = {
      valueChanged,
      value,
      displayName: displayName || debugName || debugId,
    };
  };

  /**
   * Find supported element and attach devtool
   *
   * @param {object} fiberNode
   */
  const doWorkWithFiberNode = (fiberNode) => {
    if (!fiberNode) {
      return;
    }

    const { memoizedState, tag } = fiberNode;

    if (
      debugOptions.debugReducer &&
      renderer &&
      window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded &&
      memoizedState &&
      Object.hasOwnProperty.call(memoizedState, "baseState")
    ) {
      window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers.inspectHooksOfFiber(
        fiberNode,
        renderer
      );

      let temp = memoizedState;
      while (temp && temp.queue) {
        doWorkWithHooks(temp);
        temp = temp.next;
      }
    }

    /**
     * https://github.com/facebook/react/tree/master/packages/react-reconciler/src/ReactWorkTags.js
     *
     */
    if (debugOptions.debugContext && tag === 10) {
      doWorkWithContextProvider(fiberNode);
    }
  };

  /**
   * Traverse each fiber node and attach devtool
   *
   * https://github.com/facebook/react/issues/7942
   *
   * TODO: remove recurstion and implement this.
   * currenly find issues with fiber tree traversal algorithm
   *
   * @param {fiberNode} node
   */
  // function traverseFiberTree(fiberRoot) {
  //   let root = fiberRoot.current;
  //   let node = fiberRoot.current;

  //   while (true) {
  //     doWorkWithFiberNode(node);

  //     if (node.child) {
  //       node = node.child;
  //       continue;
  //     }
  //     if (node === root) {
  //       return;
  //     }
  //     while (!node.sibling) {
  //       if (!node.return || node.return === root) {
  //         return;
  //       }
  //       node = node.return;
  //     }
  //     node = node.sibling;
  //   }
  // };

  const onCommitFiberRoot = (fiberRoot) => {
    try {
      function traverseFiberTree(node) {
        if (!node) {
          return null;
        }
        doWorkWithFiberNode(node);

        traverseFiberTree(node.sibling);
        traverseFiberTree(node.child);
      }

      fiberNodeToDebugCopy.useReducer = {};
      fiberNodeToDebugCopy.context = {};

      traverseFiberTree(fiberRoot.current);

      fiberNodeToDebug.useReducer = fiberNodeToDebugCopy.useReducer;
      fiberNodeToDebug.context = fiberNodeToDebugCopy.context;

      sendDataToDevtool();
    } catch(err) {
      if (err.message !== "Maximum call stack size exceeded") {
        console.error(err);
      }
    }
  };

  const debugFiber = (container, options) => {
    debugOptions = { ...debugOptions, ...options };

    if (
      debugOptions.disable ||
      debugOptions.disableAutoMode ||
      typeof window === 'undefined' ||
      (!debugOptions.debugReducer && !debugOptions.debugContext)
    ) {
      return false;
    }

    /**
     * Find fiber tree from dom element
     *
     */
    let fiberRoot = null;
    if (container._internalRoot) {
      fiberRoot = container._internalRoot;
    } else if (container._reactRootContainer) {
      const {
        _reactRootContainer: { _internalRoot },
      } = container;
      fiberRoot = _internalRoot;
    }

    if (!fiberRoot) {
      const rootKey = Object.keys(container).find((k) =>
        k.startsWith("__reactContainer")
      );
      if (rootKey) {
        fiberRoot = container[rootKey];
        fiberRoot = fiberRoot.stateNode;
      }
    }

    if (!fiberRoot) {
      console.error(
        "Fiber tree is not found in dom element. please use valid dom element that used in ReactDom.render method"
      );
      return;
    }

    if (debugOptions.debugReducer && !window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded) {
      console.log(
        "useReducer hook is not working due to some internal issue. please report bug or create issue."
      );
    }

    const reactDebtoolGlobalhook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (!reactDebtoolGlobalhook) {
      console.log("Please install React Developer Tools extenstion.");
      return;
    }

    /**
     * set react renderer
     */
    if (reactDebtoolGlobalhook.renderers) {
      const firstRendererKey = reactDebtoolGlobalhook.renderers.keys().next().value;
      renderer = reactDebtoolGlobalhook.renderers.get(firstRendererKey).currentDispatcherRef;
    }

    if (debugOptions.debugReducer && !renderer) {
      console.error(
        "useReducer hook debugger is not working due to some internal issue. please report an issue"
      );
    }

    onCommitFiberRoot(fiberRoot);

    /**
     * Register react dom commit fiber callback
     *
     */
    if (
      reactDebtoolGlobalhook &&
      typeof reactDebtoolGlobalhook.onCommitFiberRoot === "function"
    ) {
      reactDebtoolGlobalhook.onCommitFiberRoot = ((debugFunction) => (
        rendererID,
        root,
        ...args
      ) => {
        onCommitFiberRoot(root);
        return debugFunction(rendererID, root, ...args);
      })(reactDebtoolGlobalhook.onCommitFiberRoot);
    } else {
      console.error("onCommitFiberRoot is not available in ReactDOM library");
    }
  };

  target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.debugFiber = debugFiber;
}
