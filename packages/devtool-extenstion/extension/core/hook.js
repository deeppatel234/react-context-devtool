export function installHook(target, settings) {
  const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
  const DISPATCH_EVENT = "DISPATCH_EVENT";

  const fiberNodeToDebug = {
    useReducer: {},
    context: {},
  };

  let renderer = null;
  let isDebuggingStarted = false;

  const reactInfo = {};

  const dispatchAction = (event) => {
    if(event.type === "useReducer" && fiberNodeToDebug.useReducer[event.debugId]) {
      fiberNodeToDebug.useReducer[event.debugId].hook.queue.dispatch(event.data);
    }
  };

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

    const dataToSend = {
      reactInfo,
    };

    dataToSend.context = Object.keys(fiberNodeToDebug.context).reduce((memo, key) => {
      const debugObj = fiberNodeToDebug.context[key];
      if (debugObj.valueChanged) {
        memo[key] = {
          value: helpers.parseData(debugObj.value),
          displayName: debugObj.displayName,
          valueChanged: debugObj.valueChanged,
          remove: true,
        };
      } else {
        memo[key] = {
          valueChanged: debugObj.valueChanged,
          remove: true,
        };
      }
      return memo;
    }, {});

    dataToSend.useReducer = Object.keys(fiberNodeToDebug.useReducer).reduce((memo, key) => {
      const debugObj = fiberNodeToDebug.useReducer[key];
      if (debugObj.valueChanged) {
        memo[key] = {
          actions: debugObj.actions,
          state: helpers.parseData(debugObj.state),
          valueChanged: debugObj.valueChanged,
          displayName: debugObj.displayName,
        };
      } else {
        memo[key] = {
          valueChanged: debugObj.valueChanged,
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

  /**
   * Debug for React useReducer API
   *
   * @param {object} hook
   */
  const doWorkWithHooks = (hook, hookType) => {
    if (
      (
        hookType === "useReducer" ||
        hook.__reactContextDevtoolHookType == "useReducer"
      ) && hook.queue.lastRenderedReducer
    ) {
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
    if (!node.type) {
      return;
    }

    if (!node.type._context.__reactContextDevtoolDebugId) {
      node.type._context.__reactContextDevtoolDebugId = getUniqId();
    }

    const debugId = node.type._context.__reactContextDevtoolDebugId;

    const valueChanged = !(
      fiberNodeToDebug.context[debugId] &&
      node.pendingProps.value === fiberNodeToDebug.context[debugId].value
    );

    fiberNodeToDebugCopy.context[debugId] = {
      valueChanged,
      value: node.pendingProps.value,
      displayName:
        node.pendingProps.displayName ||
        node.type._context.displayName ||
        debugId,
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

    const { memoizedState, tag, _debugHookTypes } = fiberNode;

    if (
      settings.debugUseReducer &&
      _debugHookTypes &&
      _debugHookTypes.length &&
      // renderer &&
      // window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded &&
      memoizedState &&
      Object.hasOwnProperty.call(memoizedState, "baseState")
    ) {
      // if (!_debugHookTypes || !_debugHookTypes.length) {
      //   try {
      //     window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers.inspectHooksOfFiber(
      //       fiberNode,
      //       renderer
      //     );
      //   } catch(err) {}
      // }

      let temp = memoizedState;
      const hookTypes = _debugHookTypes || [];
      let counter = 0;
      while (temp && temp.queue) {
        doWorkWithHooks(temp, hookTypes[counter]);
        temp = temp.next;
        counter += 1;
      }
    }

    /**
     * https://github.com/facebook/react/tree/master/packages/react-reconciler/src/ReactWorkTags.js
     *
     */
    if (settings.debugContext && tag === 10) {
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

  const debugFiber = (params) => {
    const reactDebtoolGlobalhook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

    renderer = params.renderer;

    reactInfo.version = renderer ? renderer.version : "";
    reactInfo.rendererPackageName = renderer ? renderer.rendererPackageName : "";

    const fiberRoot = reactDebtoolGlobalhook.getFiberRoots(params.id).keys().next().value;

    if (fiberRoot) {
      onCommitFiberRoot(fiberRoot);
    }

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
    }
  };

  const loadHelperAndDebugFiber = (params) => {
    isDebuggingStarted = true;

    debugFiber(params);
    // if (settings.debugUseReducer && !window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.hookHelperLoaded) {
    //   target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers.loadHookHelper().then(() => {
    //     debugFiber(params);
    //   });
    // } else {
    //   debugFiber(params);
    // }
  };

  const startDebug = () => {
    if (
      typeof window === 'undefined' ||
      !window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
      (!settings.debugUseReducer && !settings.debugContext)
    ) {
      return false;
    }

    const reactDebtoolGlobalhook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (settings.startDebugWhen === "extensionLoad") {
      reactDebtoolGlobalhook.on("renderer-attached", (params) => {
        if (!isDebuggingStarted) {
          loadHelperAndDebugFiber(params);
        }
      });
    } else if (
      settings.startDebugWhen === "pageLoad" &&
      reactDebtoolGlobalhook.renderers &&
      !isDebuggingStarted
    ) {
      const firstRendererKey = reactDebtoolGlobalhook.renderers.keys().next().value;
      loadHelperAndDebugFiber({
        id: firstRendererKey,
        renderer: reactDebtoolGlobalhook.renderers.get(firstRendererKey),
      });
    }
  };

  if (settings.startDebugWhen === "extensionLoad") {
    startDebug();
  }

  window.addEventListener('message', event => {
    if (event.data.source === "react-devtools-detector") {
      reactInfo.mode = event.data.reactBuildType;
      if (settings.startDebugWhen === "pageLoad") {
        startDebug();
      }
    }

    if (event.data.type === DATA_EVENT) {
      if (event.data.subType === DISPATCH_EVENT) {
        dispatchAction(event.data.data);
      }
    }
  });
}
