import { onMessage, sendMessage } from "@ext-browser/messaging/contentWindow";

export function installHook({ settings, reactDevtoolPayload }) {
  console.log("start debuging");

  // const DATA_EVENT = "__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK_DATA_EVENT";
  // const DISPATCH_EVENT = "DISPATCH_EVENT";

  let renderer = null;
  const reactInfo = {
    reactDevtoolPayload,
  };

  const fiberNodeToDebug = {
    useReducer: {},
    context: {},
    contextKeys: [],
    useReducerKeys: [],
  };

  // const dispatchAction = (event) => {
  //   if(event.type === "useReducer" && fiberNodeToDebug.useReducer[event.debugId]) {
  //     fiberNodeToDebug.useReducer[event.debugId].hook.queue.dispatch(event.data);
  //   }
  // };

  // // copy object is used to detect compoment is removed

  const uniqId = () => {
    let counter = 0;

    return () => {
      counter += 1;
      return `${counter}`;
    };
  };

  const getUniqId = uniqId();

  const sendDataToDevtool = () => {

      const helpers = window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers;

      const dataToSend = {
        reactInfo,
        contextKeys: fiberNodeToDebug.contextKeys,
        useReducerKeys: fiberNodeToDebug.useReducerKeys,
      };

      dataToSend.context = dataToSend.contextKeys.reduce((memo, key) => {
        const debugObj = fiberNodeToDebug.context[key];

        if (debugObj.valueChanged) {
          memo[key] = {
            value: helpers.parseData(debugObj.value),
            displayName: debugObj.displayName,
          };
        }

        return memo;
      }, {});

      dataToSend.useReducer = dataToSend.useReducerKeys.reduce((memo, key) => {
        const debugObj = fiberNodeToDebug.useReducer[key];

        if (debugObj.valueChanged) {
          memo[key] = {
            actions: debugObj.actions.map(helpers.parseData),
            state: debugObj.state.map(helpers.parseData),
            displayName: debugObj.displayName,
          };
        }

        return memo;
      }, {});

    sendMessage("CONTEXT_DATA_UPDATED", helpers.parseData(dataToSend));
  };

  // /**
  //  * Debug for React useReducer API
  //  *
  //  * @param {object} hook
  //  */
  const doWorkWithHooks = (hook, hookType) => {
    if (hookType === "useReducer" && hook.queue.lastRenderedReducer) {
      let debugId = hook.queue.__reactContextDevtoolDebugId;

      if (!debugId) {
        const displayName = hook.queue.lastRenderedReducer.name;
        const currentReducer = hook.queue.lastRenderedReducer.bind(hook.queue);

        debugId = getUniqId();
        hook.queue.__reactContextDevtoolDebugId = debugId;

        hook.queue.lastRenderedReducer = (state, action, ...rest) => {
          const debugObj = fiberNodeToDebug.useReducer[debugId];
          if (debugObj && !debugObj.useDispatch) {
            debugObj.actions.push(action);
          }
          currentReducer(state, action, ...rest);
        };

        const currentDispatch = hook.queue.dispatch.bind(hook.queue);
        hook.queue.dispatch = (action, ...rest) => {
          const debugObj = fiberNodeToDebug.useReducer[debugId];
          if (debugObj) {
            debugObj.actions.push(action);
            debugObj.useDispatch = true;
          }
          currentDispatch(action, ...rest);
        };

        fiberNodeToDebug.useReducer[debugId] = {
          actions: [{ initialState: true }],
          hook,
          state: [],
          displayName,
          valueChanged: true,
        };
      }

      const debugObj = fiberNodeToDebug.useReducer[debugId];

      debugObj.hook = hook;

      if (debugObj.state.length) {
        const valueChanged =
          debugObj.state[debugObj.state.length - 1] !==
          hook.queue.lastRenderedState;
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

      fiberNodeToDebug.useReducerKeys.push(debugId);
    }
  };

  // /**
  //  * Debug for React Context API
  //  *
  //  * @param {object} node
  //  */
  const doWorkWithContextProvider = (node) => {
    if (!node.type) {
      return;
    }

    // console.log("node", node);

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
      displayName:
        node.pendingProps.displayName ||
        node.type._context.displayName ||
        (node._debugOwner?.elementType?.name
          ? `Child Of ${node._debugOwner?.elementType?.name}`
          : null) ||
        debugId,
    };

    fiberNodeToDebug.contextKeys.push(debugId);
  };

  // /**
  //  * Find supported element and attach devtool
  //  *
  //  * @param {object} fiberNode
  //  */
  const doWorkWithFiberNode = (fiberNode) => {
    if (!fiberNode) {
      return;
    }

    const { memoizedState, tag, _debugHookTypes } = fiberNode;

    if (
      settings.debugUseReducer &&
      _debugHookTypes &&
      _debugHookTypes.length &&
      memoizedState &&
      Object.hasOwnProperty.call(memoizedState, "baseState")
    ) {
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

      fiberNodeToDebug.contextKeys = [];
      fiberNodeToDebug.useReducerKeys = [];

      traverseFiberTree(fiberRoot.current);

      sendDataToDevtool();
    } catch (err) {
      if (err.message !== "Maximum call stack size exceeded") {
        console.error(err);
      }
    }
  };

  const debugFiber = (params) => {
    const reactDebtoolGlobalhook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

    renderer = params.renderer;

    reactInfo.version = renderer ? renderer.version : "";
    reactInfo.rendererPackageName = renderer
      ? renderer.rendererPackageName
      : "";

    const fiberRoot = reactDebtoolGlobalhook
      .getFiberRoots(params.id)
      .keys()
      .next().value;

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
      reactDebtoolGlobalhook.onCommitFiberRoot = (
        (debugFunction) =>
        (rendererID, root, ...args) => {
          onCommitFiberRoot(root);
          return debugFunction(rendererID, root, ...args);
        }
      )(reactDebtoolGlobalhook.onCommitFiberRoot);
    }
  };

  const startDebug = () => {
    if (
      typeof window === "undefined" ||
      !window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
      (!settings.debugUseReducer && !settings.debugContext)
    ) {
      return false;
    }

    const reactDebtoolGlobalhook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

    const firstRendererKey = reactDebtoolGlobalhook.renderers
      .keys()
      .next().value;

    debugFiber({
      id: firstRendererKey,
      renderer: reactDebtoolGlobalhook.renderers.get(firstRendererKey),
    });
  };

  startDebug();
}
