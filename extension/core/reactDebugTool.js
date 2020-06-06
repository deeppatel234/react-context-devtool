/** @license React v16.13.1
 * react-debug-tools.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

(function () {
  "use strict";

  var ErrorStackParser = require("error-stack-parser");

  var NoMode = 0;

  // ATTENTION
  // When adding new symbols to this file,
  // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_ELEMENT_TYPE = 0xeac7;
  var REACT_PORTAL_TYPE = 0xeaca;
  var REACT_FRAGMENT_TYPE = 0xeacb;
  var REACT_STRICT_MODE_TYPE = 0xeacc;
  var REACT_PROFILER_TYPE = 0xead2;
  var REACT_PROVIDER_TYPE = 0xeacd;
  var REACT_CONTEXT_TYPE = 0xeace;
  var REACT_FORWARD_REF_TYPE = 0xead0;
  var REACT_SUSPENSE_TYPE = 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = 0xead8;
  var REACT_MEMO_TYPE = 0xead3;
  var REACT_LAZY_TYPE = 0xead4;
  var REACT_BLOCK_TYPE = 0xead9;
  var REACT_SERVER_BLOCK_TYPE = 0xeada;
  var REACT_FUNDAMENTAL_TYPE = 0xead5;
  var REACT_RESPONDER_TYPE = 0xead6;
  var REACT_SCOPE_TYPE = 0xead7;
  var REACT_OPAQUE_ID_TYPE = 0xeae0;
  var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
  var REACT_OFFSCREEN_TYPE = 0xeae2;
  var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

  if (typeof Symbol === "function" && Symbol.for) {
    var symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor("react.element");
    REACT_PORTAL_TYPE = symbolFor("react.portal");
    REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
    REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
    REACT_PROFILER_TYPE = symbolFor("react.profiler");
    REACT_PROVIDER_TYPE = symbolFor("react.provider");
    REACT_CONTEXT_TYPE = symbolFor("react.context");
    REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
    REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
    REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
    REACT_MEMO_TYPE = symbolFor("react.memo");
    REACT_LAZY_TYPE = symbolFor("react.lazy");
    REACT_BLOCK_TYPE = symbolFor("react.block");
    REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
    REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
    REACT_RESPONDER_TYPE = symbolFor("react.responder");
    REACT_SCOPE_TYPE = symbolFor("react.scope");
    REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
    REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
    REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
    REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
  }

  var FunctionComponent = 0;
  var ContextProvider = 10;
  var ForwardRef = 11;
  var SimpleMemoComponent = 15;
  var Block = 22;

  var hookLog = []; // Primitives

  var primitiveStackCache = null;
  var currentFiber = null;

  function getPrimitiveStackCache() {
    // This initializes a cache of all primitive hooks so that the top
    // most stack frames added by calling the primitive hook can be removed.
    if (primitiveStackCache === null) {
      var cache = new Map();
      var readHookLog;

      try {
        // Use all hooks here to add them to the hook log.
        Dispatcher.useContext({
          _currentValue: null,
        });
        Dispatcher.useState(null);
        Dispatcher.useReducer(function (s, a) {
          return s;
        }, null);
        Dispatcher.useRef(null);
        Dispatcher.useLayoutEffect(function () {});
        Dispatcher.useEffect(function () {});
        Dispatcher.useImperativeHandle(undefined, function () {
          return null;
        });
        Dispatcher.useDebugValue(null);
        Dispatcher.useCallback(function () {});
        Dispatcher.useMemo(function () {
          return null;
        });
        Dispatcher.useMutableSource(
          {
            _source: {},
            _getVersion: function () {
              return 1;
            },
            _workInProgressVersionPrimary: null,
            _workInProgressVersionSecondary: null,
          },
          function () {
            return null;
          },
          function () {
            return function () {};
          }
        );
      } finally {
        readHookLog = hookLog;
        hookLog = [];
      }

      for (var i = 0; i < readHookLog.length; i++) {
        var hook = readHookLog[i];
        cache.set(hook.primitive, ErrorStackParser.parse(hook.stackError));
      }

      primitiveStackCache = cache;
    }

    return primitiveStackCache;
  }

  var currentHook = null;

  function nextHook() {
    var hook = currentHook;

    if (hook !== null) {
      currentHook = hook.next;
    }

    return hook;
  }

  function readContext(context, observedBits) {
    // For now we don't expose readContext usage in the hooks debugging info.
    return context._currentValue;
  }

  function useContext(context, observedBits) {
    hookLog.push({
      primitive: "Context",
      stackError: new Error(),
      value: context._currentValue,
    });
    return context._currentValue;
  }

  function useState(initialState) {
    var hook = nextHook();
    var state =
      hook !== null
        ? hook.memoizedState
        : typeof initialState === "function" // $FlowFixMe: Flow doesn't like mixed types
        ? initialState()
        : initialState;
    name;
    hookLog.push({
      primitive: "State",
      stackError: new Error(),
      value: state,
    });
    return [state, function (action) {}];
  }

  function useReducer(reducer, initialArg, init) {
    var hook = nextHook();
    var state;

    if (hook !== null) {
      state = hook.memoizedState;
    } else {
      state = init !== undefined ? init(initialArg) : initialArg;
    }

    if (hook) {
      hook.__reactContextDevtoolHookType = "useReducer";
    }

    hookLog.push({
      primitive: "Reducer",
      stackError: new Error(),
      value: state,
    });
    return [state, function (action) {}];
  }

  function useRef(initialValue) {
    var hook = nextHook();
    var ref =
      hook !== null
        ? hook.memoizedState
        : {
            current: initialValue,
          };
    hookLog.push({
      primitive: "Ref",
      stackError: new Error(),
      value: ref.current,
    });
    return ref;
  }

  function useLayoutEffect(create, inputs) {
    nextHook();
    hookLog.push({
      primitive: "LayoutEffect",
      stackError: new Error(),
      value: create,
    });
  }

  function useEffect(create, inputs) {
    nextHook();
    hookLog.push({
      primitive: "Effect",
      stackError: new Error(),
      value: create,
    });
  }

  function useImperativeHandle(ref, create, inputs) {
    nextHook(); // We don't actually store the instance anywhere if there is no ref callback
    // and if there is a ref callback it might not store it but if it does we
    // have no way of knowing where. So let's only enable introspection of the
    // ref itself if it is using the object form.

    var instance = undefined;

    if (ref !== null && typeof ref === "object") {
      instance = ref.current;
    }

    hookLog.push({
      primitive: "ImperativeHandle",
      stackError: new Error(),
      value: instance,
    });
  }

  function useDebugValue(value, formatterFn) {
    hookLog.push({
      primitive: "DebugValue",
      stackError: new Error(),
      value: typeof formatterFn === "function" ? formatterFn(value) : value,
    });
  }

  function useCallback(callback, inputs) {
    var hook = nextHook();
    hookLog.push({
      primitive: "Callback",
      stackError: new Error(),
      value: hook !== null ? hook.memoizedState[0] : callback,
    });
    return callback;
  }

  function useMemo(nextCreate, inputs) {
    var hook = nextHook();
    var value = hook !== null ? hook.memoizedState[0] : nextCreate();
    hookLog.push({
      primitive: "Memo",
      stackError: new Error(),
      value: value,
    });
    return value;
  }

  function useMutableSource(source, getSnapshot, subscribe) {
    // useMutableSource() composes multiple hooks internally.
    // Advance the current hook index the same number of times
    // so that subsequent hooks have the right memoized state.
    nextHook(); // MutableSource

    nextHook(); // State

    nextHook(); // Effect

    nextHook(); // Effect

    var value = getSnapshot(source._source);
    hookLog.push({
      primitive: "MutableSource",
      stackError: new Error(),
      value: value,
    });
    return value;
  }

  function useResponder(responder, listenerProps) {
    // Don't put the actual event responder object in, just its displayName
    var value = {
      responder: responder.displayName || "EventResponder",
      props: listenerProps,
    };
    hookLog.push({
      primitive: "Responder",
      stackError: new Error(),
      value: value,
    });
    return {
      responder: responder,
      props: listenerProps,
    };
  }

  function useTransition(config) {
    // useTransition() composes multiple hooks internally.
    // Advance the current hook index the same number of times
    // so that subsequent hooks have the right memoized state.
    nextHook(); // State

    nextHook(); // Callback

    hookLog.push({
      primitive: "Transition",
      stackError: new Error(),
      value: config,
    });
    return [function (callback) {}, false];
  }

  function useDeferredValue(value, config) {
    // useDeferredValue() composes multiple hooks internally.
    // Advance the current hook index the same number of times
    // so that subsequent hooks have the right memoized state.
    nextHook(); // State

    nextHook(); // Effect

    hookLog.push({
      primitive: "DeferredValue",
      stackError: new Error(),
      value: value,
    });
    return value;
  }

  function useOpaqueIdentifier() {
    var hook = nextHook(); // State

    if (currentFiber && currentFiber.mode === NoMode) {
      nextHook(); // Effect
    }

    var value = hook === null ? undefined : hook.memoizedState;

    if (value && value.$$typeof === REACT_OPAQUE_ID_TYPE) {
      value = undefined;
    }

    hookLog.push({
      primitive: "OpaqueIdentifier",
      stackError: new Error(),
      value: value,
    });
    return value;
  }

  var Dispatcher = {
    readContext: readContext,
    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,
    useResponder: useResponder,
    useTransition: useTransition,
    useMutableSource: useMutableSource,
    useDeferredValue: useDeferredValue,
    useOpaqueIdentifier: useOpaqueIdentifier,
  }; // Inspect

  // Don't assume
  //
  // We can't assume that stack frames are nth steps away from anything.
  // E.g. we can't assume that the root call shares all frames with the stack
  // of a hook call. A simple way to demonstrate this is wrapping `new Error()`
  // in a wrapper constructor like a polyfill. That'll add an extra frame.
  // Similar things can happen with the call to the dispatcher. The top frame
  // may not be the primitive. Likewise the primitive can have fewer stack frames
  // such as when a call to useState got inlined to use dispatcher.useState.
  //
  // We also can't assume that the last frame of the root call is the same
  // frame as the last frame of the hook call because long stack traces can be
  // truncated to a stack trace limit.
  var mostLikelyAncestorIndex = 0;

  function findSharedIndex(hookStack, rootStack, rootIndex) {
    var source = rootStack[rootIndex].source;

    hookSearch: for (var i = 0; i < hookStack.length; i++) {
      if (hookStack[i].source === source) {
        // This looks like a match. Validate that the rest of both stack match up.
        for (
          var a = rootIndex + 1, b = i + 1;
          a < rootStack.length && b < hookStack.length;
          a++, b++
        ) {
          if (hookStack[b].source !== rootStack[a].source) {
            // If not, give up and try a different match.
            continue hookSearch;
          }
        }

        return i;
      }
    }

    return -1;
  }

  function findCommonAncestorIndex(rootStack, hookStack) {
    var rootIndex = findSharedIndex(
      hookStack,
      rootStack,
      mostLikelyAncestorIndex
    );

    if (rootIndex !== -1) {
      return rootIndex;
    } // If the most likely one wasn't a hit, try any other frame to see if it is shared.
    // If that takes more than 5 frames, something probably went wrong.

    for (var i = 0; i < rootStack.length && i < 5; i++) {
      rootIndex = findSharedIndex(hookStack, rootStack, i);

      if (rootIndex !== -1) {
        mostLikelyAncestorIndex = i;
        return rootIndex;
      }
    }

    return -1;
  }

  function isReactWrapper(functionName, primitiveName) {
    if (!functionName) {
      return false;
    }

    var expectedPrimitiveName = "use" + primitiveName;

    if (functionName.length < expectedPrimitiveName.length) {
      return false;
    }

    return (
      functionName.lastIndexOf(expectedPrimitiveName) ===
      functionName.length - expectedPrimitiveName.length
    );
  }

  function findPrimitiveIndex(hookStack, hook) {
    var stackCache = getPrimitiveStackCache();
    var primitiveStack = stackCache.get(hook.primitive);

    if (primitiveStack === undefined) {
      return -1;
    }

    for (var i = 0; i < primitiveStack.length && i < hookStack.length; i++) {
      if (primitiveStack[i].source !== hookStack[i].source) {
        // If the next two frames are functions called `useX` then we assume that they're part of the
        // wrappers that the React packager or other packages adds around the dispatcher.
        if (
          i < hookStack.length - 1 &&
          isReactWrapper(hookStack[i].functionName, hook.primitive)
        ) {
          i++;
        }

        if (
          i < hookStack.length - 1 &&
          isReactWrapper(hookStack[i].functionName, hook.primitive)
        ) {
          i++;
        }

        return i;
      }
    }

    return -1;
  }

  function parseTrimmedStack(rootStack, hook) {
    // Get the stack trace between the primitive hook function and
    // the root function call. I.e. the stack frames of custom hooks.
    var hookStack = ErrorStackParser.parse(hook.stackError);
    var rootIndex = findCommonAncestorIndex(rootStack, hookStack);
    var primitiveIndex = findPrimitiveIndex(hookStack, hook);

    if (
      rootIndex === -1 ||
      primitiveIndex === -1 ||
      rootIndex - primitiveIndex < 2
    ) {
      // Something went wrong. Give up.
      return null;
    }

    return hookStack.slice(primitiveIndex, rootIndex - 1);
  }

  function parseCustomHookName(functionName) {
    if (!functionName) {
      return "";
    }

    var startIndex = functionName.lastIndexOf(".");

    if (startIndex === -1) {
      startIndex = 0;
    }

    if (functionName.substr(startIndex, 3) === "use") {
      startIndex += 3;
    }

    return functionName.substr(startIndex);
  }

  function buildTree(rootStack, readHookLog) {
    var rootChildren = [];
    var prevStack = null;
    var levelChildren = rootChildren;
    var nativeHookID = 0;
    var stackOfChildren = [];

    for (var i = 0; i < readHookLog.length; i++) {
      var hook = readHookLog[i];
      var stack = parseTrimmedStack(rootStack, hook);

      if (stack !== null) {
        // Note: The indices 0 <= n < length-1 will contain the names.
        // The indices 1 <= n < length will contain the source locations.
        // That's why we get the name from n - 1 and don't check the source
        // of index 0.
        var commonSteps = 0;

        if (prevStack !== null) {
          // Compare the current level's stack to the new stack.
          while (commonSteps < stack.length && commonSteps < prevStack.length) {
            var stackSource = stack[stack.length - commonSteps - 1].source;
            var prevSource =
              prevStack[prevStack.length - commonSteps - 1].source;

            if (stackSource !== prevSource) {
              break;
            }

            commonSteps++;
          } // Pop back the stack as many steps as were not common.

          for (var j = prevStack.length - 1; j > commonSteps; j--) {
            levelChildren = stackOfChildren.pop();
          }
        } // The remaining part of the new stack are custom hooks. Push them
        // to the tree.

        for (var _j = stack.length - commonSteps - 1; _j >= 1; _j--) {
          var children = [];
          levelChildren.push({
            id: null,
            isStateEditable: false,
            name: parseCustomHookName(stack[_j - 1].functionName),
            value: undefined,
            subHooks: children,
          });
          stackOfChildren.push(levelChildren);
          levelChildren = children;
        }

        prevStack = stack;
      }

      var primitive = hook.primitive; // For now, the "id" of stateful hooks is just the stateful hook index.
      // Custom hooks have no ids, nor do non-stateful native hooks (e.g. Context, DebugValue).

      var id =
        primitive === "Context" || primitive === "DebugValue"
          ? null
          : nativeHookID++; // For the time being, only State and Reducer hooks support runtime overrides.

      var isStateEditable = primitive === "Reducer" || primitive === "State";
      levelChildren.push({
        id: id,
        isStateEditable: isStateEditable,
        name: primitive,
        value: hook.value,
        subHooks: [],
      });
    } // Associate custom hook values (useDebugValue() hook entries) with the correct hooks.

    processDebugValues(rootChildren, null);
    return rootChildren;
  } // Custom hooks support user-configurable labels (via the special useDebugValue() hook).
  // That hook adds user-provided values to the hooks tree,
  // but these values aren't intended to appear alongside of the other hooks.
  // Instead they should be attributed to their parent custom hook.
  // This method walks the tree and assigns debug values to their custom hook owners.

  function processDebugValues(hooksTree, parentHooksNode) {
    var debugValueHooksNodes = [];

    for (var i = 0; i < hooksTree.length; i++) {
      var hooksNode = hooksTree[i];

      if (hooksNode.name === "DebugValue" && hooksNode.subHooks.length === 0) {
        hooksTree.splice(i, 1);
        i--;
        debugValueHooksNodes.push(hooksNode);
      } else {
        processDebugValues(hooksNode.subHooks, hooksNode);
      }
    } // Bubble debug value labels to their custom hook owner.
    // If there is no parent hook, just ignore them for now.
    // (We may warn about this in the future.)

    if (parentHooksNode !== null) {
      if (debugValueHooksNodes.length === 1) {
        parentHooksNode.value = debugValueHooksNodes[0].value;
      } else if (debugValueHooksNodes.length > 1) {
        parentHooksNode.value = debugValueHooksNodes.map(function (_ref) {
          var value = _ref.value;
          return value;
        });
      }
    }
  }

  function inspectHooks(renderFunction, props, currentDispatcher) {
    var previousDispatcher = currentDispatcher.current;
    var readHookLog;
    currentDispatcher.current = Dispatcher;
    var ancestorStackError;

    try {
      ancestorStackError = new Error();
      renderFunction(props);
    } finally {
      readHookLog = hookLog;
      hookLog = [];
      currentDispatcher.current = previousDispatcher;
    }

    var rootStack = ErrorStackParser.parse(ancestorStackError);
    return buildTree(rootStack, readHookLog);
  }

  function setupContexts(contextMap, fiber) {
    var current = fiber;

    while (current) {
      if (current.tag === ContextProvider) {
        var providerType = current.type;
        var context = providerType._context;

        if (!contextMap.has(context)) {
          // Store the current value that we're going to restore later.
          contextMap.set(context, context._currentValue); // Set the inner most provider value on the context.

          context._currentValue = current.memoizedProps.value;
        }
      }

      current = current.return;
    }
  }

  function restoreContexts(contextMap) {
    contextMap.forEach(function (value, context) {
      return (context._currentValue = value);
    });
  }

  function inspectHooksOfForwardRef(
    renderFunction,
    props,
    ref,
    currentDispatcher
  ) {
    var previousDispatcher = currentDispatcher.current;
    var readHookLog;
    currentDispatcher.current = Dispatcher;
    var ancestorStackError;

    try {
      ancestorStackError = new Error();
      renderFunction(props, ref);
    } finally {
      readHookLog = hookLog;
      hookLog = [];
      currentDispatcher.current = previousDispatcher;
    }

    var rootStack = ErrorStackParser.parse(ancestorStackError);
    return buildTree(rootStack, readHookLog);
  }

  function resolveDefaultProps(Component, baseProps) {
    if (Component && Component.defaultProps) {
      // Resolve default props. Taken from ReactElement
      var props = Object.assign({}, baseProps);

      var defaultProps = Component.defaultProps;

      for (var propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }

      return props;
    }

    return baseProps;
  }

  function inspectHooksOfFiber(fiber, currentDispatcher) {
    currentFiber = fiber;

    if (
      fiber.tag !== FunctionComponent &&
      fiber.tag !== SimpleMemoComponent &&
      fiber.tag !== ForwardRef &&
      fiber.tag !== Block
    ) {
      throw new Error(
        "Unknown Fiber. Needs to be a function component to inspect hooks."
      );
    } // Warm up the cache so that it doesn't consume the currentHook.

    getPrimitiveStackCache();
    var type = fiber.type;
    var props = fiber.memoizedProps;

    if (type !== fiber.elementType) {
      props = resolveDefaultProps(type, props);
    } // Set up the current hook so that we can step through and read the
    // current state from them.

    currentHook = fiber.memoizedState;
    var contextMap = new Map();

    try {
      setupContexts(contextMap, fiber);

      if (fiber.tag === ForwardRef) {
        return inspectHooksOfForwardRef(
          type.render,
          props,
          fiber.ref,
          currentDispatcher
        );
      }

      return inspectHooks(type, props, currentDispatcher);
    } finally {
      currentHook = null;
      restoreContexts(contextMap);
    }
  }

  exports.inspectHooks = inspectHooks;
  exports.inspectHooksOfFiber = inspectHooksOfFiber;
})();
