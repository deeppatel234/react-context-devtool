export function installHook(target) {
  const fiberNodeToDebug = {
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
    console.log(fiberNodeToDebug);
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

        fiberNodeToDebug.useReducer[debugId] = {
          actions: [{ initialState: true }],
          hook,
          state: [],
        };
      }

      const debugObj = fiberNodeToDebug.useReducer[debugId];

      debugObj.hook = hook;

      if (debugObj.state.length) {
        const valueChanged = debugObj.state[debugObj.state.length - 1] !== hook.queue.lastRenderedState;
        if (!valueChanged) {
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

    fiberNodeToDebug.context[debugId] = {
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

    const { memoizedState, tag } = fiberNode;

    if (
      renderer &&
      window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers &&
      window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers.inspectHooksOfFiber &&
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
    if (tag === 10) {
      doWorkWithContextProvider(fiberNode);
    }
  };

  /**
   * Traverse each fiber node and attach devtool
   *
   * https://github.com/facebook/react/issues/7942
   *
   * @param {object} fiber
   */
  const traverseFiberTree = (fiber) => {
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

  const onCommitFiberRoot = (fiberRoot) => {
    traverseFiberTree(fiberRoot);
    sendDataToDevtool();
  };

  const debugFiber = (container) => {
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

    if (!window.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.helpers) {
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

    if (!renderer) {
      console.error(
        "useReducer hook debugger is not working due to some internal issue. please report an issue"
      );
    }

    traverseFiberTree(fiberRoot);
    sendDataToDevtool();

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

  if (!target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK) {
    target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK = {};
  }

  target.__REACT_CONTEXT_DEVTOOL_GLOBAL_HOOK.debugFiber = debugFiber;
}
