var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../ponto_comum/node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "../../../ponto_comum/node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.7";
  }
});

// ../../../ponto_comum/node_modules/react/index.js
var require_react = __commonJS({
  "../../../ponto_comum/node_modules/react/index.js"(exports, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_production();
    } else {
      module2.exports = null;
    }
  }
});

// ../../../ponto_comum/node_modules/scheduler/cjs/scheduler.production.js
var require_scheduler_production = __commonJS({
  "../../../ponto_comum/node_modules/scheduler/cjs/scheduler.production.js"(exports) {
    "use strict";
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      a: for (; 0 < index; ) {
        var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
        if (0 < compare(parent, node))
          heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        else break a;
      }
    }
    function peek(heap) {
      return 0 === heap.length ? null : heap[0];
    }
    function pop(heap) {
      if (0 === heap.length) return null;
      var first = heap[0], last = heap.pop();
      if (last !== first) {
        heap[0] = last;
        a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
          var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
          if (0 > compare(left, last))
            rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
          else if (rightIndex < length && 0 > compare(right, last))
            heap[index] = right, heap[rightIndex] = last, index = rightIndex;
          else break a;
        }
      }
      return first;
    }
    function compare(a, b) {
      var diff = a.sortIndex - b.sortIndex;
      return 0 !== diff ? diff : a.id - b.id;
    }
    exports.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      localDate = Date, initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }
    var localPerformance;
    var localDate;
    var initialTime;
    var taskQueue = [];
    var timerQueue = [];
    var taskIdCounter = 1;
    var currentTask = null;
    var currentPriorityLevel = 3;
    var isPerformingWork = false;
    var isHostCallbackScheduled = false;
    var isHostTimeoutScheduled = false;
    var needsPaint = false;
    var localSetTimeout = "function" === typeof setTimeout ? setTimeout : null;
    var localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null;
    var localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
    function advanceTimers(currentTime) {
      for (var timer = peek(timerQueue); null !== timer; ) {
        if (null === timer.callback) pop(timerQueue);
        else if (timer.startTime <= currentTime)
          pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else break;
        timer = peek(timerQueue);
      }
    }
    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);
      if (!isHostCallbackScheduled)
        if (null !== peek(taskQueue))
          isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
        else {
          var firstTimer = peek(timerQueue);
          null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
    var isMessageLoopRunning = false;
    var taskTimeoutID = -1;
    var frameInterval = 5;
    var startTime = -1;
    function shouldYieldToHost() {
      return needsPaint ? true : exports.unstable_now() - startTime < frameInterval ? false : true;
    }
    function performWorkUntilDeadline() {
      needsPaint = false;
      if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = true;
        try {
          a: {
            isHostCallbackScheduled = false;
            isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
            isPerformingWork = true;
            var previousPriorityLevel = currentPriorityLevel;
            try {
              b: {
                advanceTimers(currentTime);
                for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                  var callback = currentTask.callback;
                  if ("function" === typeof callback) {
                    currentTask.callback = null;
                    currentPriorityLevel = currentTask.priorityLevel;
                    var continuationCallback = callback(
                      currentTask.expirationTime <= currentTime
                    );
                    currentTime = exports.unstable_now();
                    if ("function" === typeof continuationCallback) {
                      currentTask.callback = continuationCallback;
                      advanceTimers(currentTime);
                      hasMoreWork = true;
                      break b;
                    }
                    currentTask === peek(taskQueue) && pop(taskQueue);
                    advanceTimers(currentTime);
                  } else pop(taskQueue);
                  currentTask = peek(taskQueue);
                }
                if (null !== currentTask) hasMoreWork = true;
                else {
                  var firstTimer = peek(timerQueue);
                  null !== firstTimer && requestHostTimeout(
                    handleTimeout,
                    firstTimer.startTime - currentTime
                  );
                  hasMoreWork = false;
                }
              }
              break a;
            } finally {
              currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
            }
            hasMoreWork = void 0;
          }
        } finally {
          hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
        }
      }
    }
    var schedulePerformWorkUntilDeadline;
    if ("function" === typeof localSetImmediate)
      schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    else if ("undefined" !== typeof MessageChannel) {
      channel = new MessageChannel(), port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;
      schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    var channel;
    var port;
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    };
    exports.unstable_forceFrameRate = function(fps) {
      0 > fps || 125 < fps ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    };
    exports.unstable_next = function(eventHandler) {
      switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
          var priorityLevel = 3;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_requestPaint = function() {
      needsPaint = true;
    };
    exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          priorityLevel = 3;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
      switch (priorityLevel) {
        case 1:
          var timeout = -1;
          break;
        case 2:
          timeout = 250;
          break;
        case 5:
          timeout = 1073741823;
          break;
        case 4:
          timeout = 1e4;
          break;
        default:
          timeout = 5e3;
      }
      timeout = options + timeout;
      priorityLevel = {
        id: taskIdCounter++,
        callback,
        priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
      };
      options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
      return priorityLevel;
    };
    exports.unstable_shouldYield = shouldYieldToHost;
    exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    };
  }
});

// ../../../ponto_comum/node_modules/scheduler/index.js
var require_scheduler = __commonJS({
  "../../../ponto_comum/node_modules/scheduler/index.js"(exports, module2) {
    "use strict";
    if (true) {
      module2.exports = require_scheduler_production();
    } else {
      module2.exports = null;
    }
  }
});

// ../../../ponto_comum/node_modules/react-dom/cjs/react-dom.production.js
var require_react_dom_production = __commonJS({
  "../../../ponto_comum/node_modules/react-dom/cjs/react-dom.production.js"(exports) {
    "use strict";
    var React = require_react();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop() {
    }
    var Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    };
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    exports.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    exports.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    exports.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    exports.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    exports.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    exports.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    exports.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          });
        } else Internals.d.m(href);
    };
    exports.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    exports.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    exports.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    exports.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    exports.version = "19.2.7";
  }
});

// ../../../ponto_comum/node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "../../../ponto_comum/node_modules/react-dom/index.js"(exports, module2) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module2.exports = require_react_dom_production();
    } else {
      module2.exports = null;
    }
  }
});

// ../../../ponto_comum/node_modules/react-dom/cjs/react-dom-client.production.js
var require_react_dom_client_production = __commonJS({
  "../../../ponto_comum/node_modules/react-dom/cjs/react-dom-client.production.js"(exports) {
    "use strict";
    var Scheduler = require_scheduler();
    var React = require_react();
    var ReactDOM = require_react_dom();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function isValidContainer(node) {
      return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
    }
    function getNearestMountedFiber(fiber) {
      var node = fiber, nearestMounted = fiber;
      if (fiber.alternate) for (; node.return; ) node = node.return;
      else {
        fiber = node;
        do
          node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
        while (fiber);
      }
      return 3 === node.tag ? nearestMounted : null;
    }
    function getSuspenseInstanceFromFiber(fiber) {
      if (13 === fiber.tag) {
        var suspenseState = fiber.memoizedState;
        null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
        if (null !== suspenseState) return suspenseState.dehydrated;
      }
      return null;
    }
    function getActivityInstanceFromFiber(fiber) {
      if (31 === fiber.tag) {
        var activityState = fiber.memoizedState;
        null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
        if (null !== activityState) return activityState.dehydrated;
      }
      return null;
    }
    function assertIsMounted(fiber) {
      if (getNearestMountedFiber(fiber) !== fiber)
        throw Error(formatProdErrorMessage(188));
    }
    function findCurrentFiberUsingSlowPath(fiber) {
      var alternate = fiber.alternate;
      if (!alternate) {
        alternate = getNearestMountedFiber(fiber);
        if (null === alternate) throw Error(formatProdErrorMessage(188));
        return alternate !== fiber ? null : fiber;
      }
      for (var a = fiber, b = alternate; ; ) {
        var parentA = a.return;
        if (null === parentA) break;
        var parentB = parentA.alternate;
        if (null === parentB) {
          b = parentA.return;
          if (null !== b) {
            a = b;
            continue;
          }
          break;
        }
        if (parentA.child === parentB.child) {
          for (parentB = parentA.child; parentB; ) {
            if (parentB === a) return assertIsMounted(parentA), fiber;
            if (parentB === b) return assertIsMounted(parentA), alternate;
            parentB = parentB.sibling;
          }
          throw Error(formatProdErrorMessage(188));
        }
        if (a.return !== b.return) a = parentA, b = parentB;
        else {
          for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
            if (child$0 === a) {
              didFindChild = true;
              a = parentA;
              b = parentB;
              break;
            }
            if (child$0 === b) {
              didFindChild = true;
              b = parentA;
              a = parentB;
              break;
            }
            child$0 = child$0.sibling;
          }
          if (!didFindChild) {
            for (child$0 = parentB.child; child$0; ) {
              if (child$0 === a) {
                didFindChild = true;
                a = parentB;
                b = parentA;
                break;
              }
              if (child$0 === b) {
                didFindChild = true;
                b = parentB;
                a = parentA;
                break;
              }
              child$0 = child$0.sibling;
            }
            if (!didFindChild) throw Error(formatProdErrorMessage(189));
          }
        }
        if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
      }
      if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
      return a.stateNode.current === a ? fiber : alternate;
    }
    function findCurrentHostFiberImpl(node) {
      var tag = node.tag;
      if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
      for (node = node.child; null !== node; ) {
        tag = findCurrentHostFiberImpl(node);
        if (null !== tag) return tag;
        node = node.sibling;
      }
      return null;
    }
    var assign = Object.assign;
    var REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var isArrayImpl = Array.isArray;
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var valueStack = [];
    var index = -1;
    function createCursor(defaultValue) {
      return { current: defaultValue };
    }
    function pop(cursor) {
      0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
    }
    function push(cursor, value) {
      index++;
      valueStack[index] = cursor.current;
      cursor.current = value;
    }
    var contextStackCursor = createCursor(null);
    var contextFiberStackCursor = createCursor(null);
    var rootInstanceStackCursor = createCursor(null);
    var hostTransitionProviderCursor = createCursor(null);
    function pushHostContainer(fiber, nextRootInstance) {
      push(rootInstanceStackCursor, nextRootInstance);
      push(contextFiberStackCursor, fiber);
      push(contextStackCursor, null);
      switch (nextRootInstance.nodeType) {
        case 9:
        case 11:
          fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
          break;
        default:
          if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
            nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
          else
            switch (fiber) {
              case "svg":
                fiber = 1;
                break;
              case "math":
                fiber = 2;
                break;
              default:
                fiber = 0;
            }
      }
      pop(contextStackCursor);
      push(contextStackCursor, fiber);
    }
    function popHostContainer() {
      pop(contextStackCursor);
      pop(contextFiberStackCursor);
      pop(rootInstanceStackCursor);
    }
    function pushHostContext(fiber) {
      null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
      var context = contextStackCursor.current;
      var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
      context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
    }
    function popHostContext(fiber) {
      contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
      hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
    }
    var prefix;
    var suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$1) {
                    control = x$1;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x$2) {
                  control = x$2;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeFiber(fiber, childFiber) {
      switch (fiber.tag) {
        case 26:
        case 27:
        case 5:
          return describeBuiltInComponentFrame(fiber.type);
        case 16:
          return describeBuiltInComponentFrame("Lazy");
        case 13:
          return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
        case 19:
          return describeBuiltInComponentFrame("SuspenseList");
        case 0:
        case 15:
          return describeNativeComponentFrame(fiber.type, false);
        case 11:
          return describeNativeComponentFrame(fiber.type.render, false);
        case 1:
          return describeNativeComponentFrame(fiber.type, true);
        case 31:
          return describeBuiltInComponentFrame("Activity");
        default:
          return "";
      }
    }
    function getStackByFiberInDevAndProd(workInProgress2) {
      try {
        var info = "", previous = null;
        do
          info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
        while (workInProgress2);
        return info;
      } catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
      }
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var scheduleCallback$3 = Scheduler.unstable_scheduleCallback;
    var cancelCallback$1 = Scheduler.unstable_cancelCallback;
    var shouldYield = Scheduler.unstable_shouldYield;
    var requestPaint = Scheduler.unstable_requestPaint;
    var now = Scheduler.unstable_now;
    var getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel;
    var ImmediatePriority = Scheduler.unstable_ImmediatePriority;
    var UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
    var NormalPriority$1 = Scheduler.unstable_NormalPriority;
    var LowPriority = Scheduler.unstable_LowPriority;
    var IdlePriority = Scheduler.unstable_IdlePriority;
    var log$1 = Scheduler.log;
    var unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue;
    var rendererID = null;
    var injectedHook = null;
    function setIsStrictModeForDevtools(newIsStrictMode) {
      "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
      if (injectedHook && "function" === typeof injectedHook.setStrictMode)
        try {
          injectedHook.setStrictMode(rendererID, newIsStrictMode);
        } catch (err) {
        }
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
    var log = Math.log;
    var LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    var nextTransitionUpdateLane = 256;
    var nextTransitionDeferredLane = 262144;
    var nextRetryLane = 4194304;
    function getHighestPriorityLanes(lanes) {
      var pendingSyncLanes = lanes & 42;
      if (0 !== pendingSyncLanes) return pendingSyncLanes;
      switch (lanes & -lanes) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return lanes & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return lanes & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return lanes & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return lanes;
      }
    }
    function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
      var pendingLanes = root2.pendingLanes;
      if (0 === pendingLanes) return 0;
      var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
      root2 = root2.warmLanes;
      var nonIdlePendingLanes = pendingLanes & 134217727;
      0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
      return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
    }
    function checkIfRootIsPrerendering(root2, renderLanes2) {
      return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
    }
    function computeExpirationTime(lane, currentTime) {
      switch (lane) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return currentTime + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return currentTime + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function claimNextRetryLane() {
      var lane = nextRetryLane;
      nextRetryLane <<= 1;
      0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
      return lane;
    }
    function createLaneMap(initial) {
      for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
      return laneMap;
    }
    function markRootUpdated$1(root2, updateLane) {
      root2.pendingLanes |= updateLane;
      268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
    }
    function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
      var previouslyPendingLanes = root2.pendingLanes;
      root2.pendingLanes = remainingLanes;
      root2.suspendedLanes = 0;
      root2.pingedLanes = 0;
      root2.warmLanes = 0;
      root2.expiredLanes &= remainingLanes;
      root2.entangledLanes &= remainingLanes;
      root2.errorRecoveryDisabledLanes &= remainingLanes;
      root2.shellSuspendCounter = 0;
      var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
      for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
        var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
        entanglements[index$7] = 0;
        expirationTimes[index$7] = -1;
        var hiddenUpdatesForLane = hiddenUpdates[index$7];
        if (null !== hiddenUpdatesForLane)
          for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
            var update = hiddenUpdatesForLane[index$7];
            null !== update && (update.lane &= -536870913);
          }
        remainingLanes &= ~lane;
      }
      0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
      0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
    }
    function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
      root2.pendingLanes |= spawnedLane;
      root2.suspendedLanes &= ~spawnedLane;
      var spawnedLaneIndex = 31 - clz32(spawnedLane);
      root2.entangledLanes |= spawnedLane;
      root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
    }
    function markRootEntangled(root2, entangledLanes) {
      var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
      for (root2 = root2.entanglements; rootEntangledLanes; ) {
        var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
        lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
        rootEntangledLanes &= ~lane;
      }
    }
    function getBumpedLaneForHydration(root2, renderLanes2) {
      var renderLane = renderLanes2 & -renderLanes2;
      renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
      return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
    }
    function getBumpedLaneForHydrationByLane(lane) {
      switch (lane) {
        case 2:
          lane = 1;
          break;
        case 8:
          lane = 4;
          break;
        case 32:
          lane = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          lane = 128;
          break;
        case 268435456:
          lane = 134217728;
          break;
        default:
          lane = 0;
      }
      return lane;
    }
    function lanesToEventPriority(lanes) {
      lanes &= -lanes;
      return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
    }
    function resolveUpdatePriority() {
      var updatePriority = ReactDOMSharedInternals.p;
      if (0 !== updatePriority) return updatePriority;
      updatePriority = window.event;
      return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
    }
    function runWithPriority(priority, fn) {
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        return ReactDOMSharedInternals.p = priority, fn();
      } finally {
        ReactDOMSharedInternals.p = previousPriority;
      }
    }
    var randomKey = Math.random().toString(36).slice(2);
    var internalInstanceKey = "__reactFiber$" + randomKey;
    var internalPropsKey = "__reactProps$" + randomKey;
    var internalContainerInstanceKey = "__reactContainer$" + randomKey;
    var internalEventHandlersKey = "__reactEvents$" + randomKey;
    var internalEventHandlerListenersKey = "__reactListeners$" + randomKey;
    var internalEventHandlesSetKey = "__reactHandles$" + randomKey;
    var internalRootNodeResourcesKey = "__reactResources$" + randomKey;
    var internalHoistableMarker = "__reactMarker$" + randomKey;
    function detachDeletedInstance(node) {
      delete node[internalInstanceKey];
      delete node[internalPropsKey];
      delete node[internalEventHandlersKey];
      delete node[internalEventHandlerListenersKey];
      delete node[internalEventHandlesSetKey];
    }
    function getClosestInstanceFromNode(targetNode) {
      var targetInst = targetNode[internalInstanceKey];
      if (targetInst) return targetInst;
      for (var parentNode = targetNode.parentNode; parentNode; ) {
        if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
          parentNode = targetInst.alternate;
          if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
            for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
              if (parentNode = targetNode[internalInstanceKey]) return parentNode;
              targetNode = getParentHydrationBoundary(targetNode);
            }
          return targetInst;
        }
        targetNode = parentNode;
        parentNode = targetNode.parentNode;
      }
      return null;
    }
    function getInstanceFromNode(node) {
      if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
        var tag = node.tag;
        if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
          return node;
      }
      return null;
    }
    function getNodeFromInstance(inst) {
      var tag = inst.tag;
      if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
      throw Error(formatProdErrorMessage(33));
    }
    function getResourcesFromRoot(root2) {
      var resources = root2[internalRootNodeResourcesKey];
      resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
      return resources;
    }
    function markNodeAsHoistable(node) {
      node[internalHoistableMarker] = true;
    }
    var allNativeEvents = /* @__PURE__ */ new Set();
    var registrationNameDependencies = {};
    function registerTwoPhaseEvent(registrationName, dependencies) {
      registerDirectEvent(registrationName, dependencies);
      registerDirectEvent(registrationName + "Capture", dependencies);
    }
    function registerDirectEvent(registrationName, dependencies) {
      registrationNameDependencies[registrationName] = dependencies;
      for (registrationName = 0; registrationName < dependencies.length; registrationName++)
        allNativeEvents.add(dependencies[registrationName]);
    }
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    function setValueForAttribute(node, name, value) {
      if (isAttributeNameSafe(name))
        if (null === value) node.removeAttribute(name);
        else {
          switch (typeof value) {
            case "undefined":
            case "function":
            case "symbol":
              node.removeAttribute(name);
              return;
            case "boolean":
              var prefix$10 = name.toLowerCase().slice(0, 5);
              if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
                node.removeAttribute(name);
                return;
              }
          }
          node.setAttribute(name, "" + value);
        }
    }
    function setValueForKnownAttribute(node, name, value) {
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            node.removeAttribute(name);
            return;
        }
        node.setAttribute(name, "" + value);
      }
    }
    function setValueForNamespacedAttribute(node, namespace, name, value) {
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            node.removeAttribute(name);
            return;
        }
        node.setAttributeNS(namespace, name, "" + value);
      }
    }
    function getToStringValue(value) {
      switch (typeof value) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return value;
        case "object":
          return value;
        default:
          return "";
      }
    }
    function isCheckable(elem) {
      var type = elem.type;
      return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
    }
    function trackValueOnNode(node, valueField, currentValue) {
      var descriptor = Object.getOwnPropertyDescriptor(
        node.constructor.prototype,
        valueField
      );
      if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
        var get = descriptor.get, set = descriptor.set;
        Object.defineProperty(node, valueField, {
          configurable: true,
          get: function() {
            return get.call(this);
          },
          set: function(value) {
            currentValue = "" + value;
            set.call(this, value);
          }
        });
        Object.defineProperty(node, valueField, {
          enumerable: descriptor.enumerable
        });
        return {
          getValue: function() {
            return currentValue;
          },
          setValue: function(value) {
            currentValue = "" + value;
          },
          stopTracking: function() {
            node._valueTracker = null;
            delete node[valueField];
          }
        };
      }
    }
    function track(node) {
      if (!node._valueTracker) {
        var valueField = isCheckable(node) ? "checked" : "value";
        node._valueTracker = trackValueOnNode(
          node,
          valueField,
          "" + node[valueField]
        );
      }
    }
    function updateValueIfChanged(node) {
      if (!node) return false;
      var tracker = node._valueTracker;
      if (!tracker) return true;
      var lastValue = tracker.getValue();
      var value = "";
      node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
      node = value;
      return node !== lastValue ? (tracker.setValue(node), true) : false;
    }
    function getActiveElement(doc) {
      doc = doc || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof doc) return null;
      try {
        return doc.activeElement || doc.body;
      } catch (e) {
        return doc.body;
      }
    }
    var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
    function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
      return value.replace(
        escapeSelectorAttributeValueInsideDoubleQuotesRegex,
        function(ch) {
          return "\\" + ch.charCodeAt(0).toString(16) + " ";
        }
      );
    }
    function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
      element.name = "";
      null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
      if (null != value)
        if ("number" === type) {
          if (0 === value && "" === element.value || element.value != value)
            element.value = "" + getToStringValue(value);
        } else
          element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
      else
        "submit" !== type && "reset" !== type || element.removeAttribute("value");
      null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
      null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
      null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
      null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
    }
    function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
      null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
      if (null != value || null != defaultValue) {
        if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
          track(element);
          return;
        }
        defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
        value = null != value ? "" + getToStringValue(value) : defaultValue;
        isHydrating2 || value === element.value || (element.value = value);
        element.defaultValue = value;
      }
      checked = null != checked ? checked : defaultChecked;
      checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
      element.checked = isHydrating2 ? element.checked : !!checked;
      element.defaultChecked = !!checked;
      null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
      track(element);
    }
    function setDefaultValue(node, type, value) {
      "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
    }
    function updateOptions(node, multiple, propValue, setDefaultSelected) {
      node = node.options;
      if (multiple) {
        multiple = {};
        for (var i = 0; i < propValue.length; i++)
          multiple["$" + propValue[i]] = true;
        for (propValue = 0; propValue < node.length; propValue++)
          i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
      } else {
        propValue = "" + getToStringValue(propValue);
        multiple = null;
        for (i = 0; i < node.length; i++) {
          if (node[i].value === propValue) {
            node[i].selected = true;
            setDefaultSelected && (node[i].defaultSelected = true);
            return;
          }
          null !== multiple || node[i].disabled || (multiple = node[i]);
        }
        null !== multiple && (multiple.selected = true);
      }
    }
    function updateTextarea(element, value, defaultValue) {
      if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
        element.defaultValue !== value && (element.defaultValue = value);
        return;
      }
      element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
    }
    function initTextarea(element, value, defaultValue, children) {
      if (null == value) {
        if (null != children) {
          if (null != defaultValue) throw Error(formatProdErrorMessage(92));
          if (isArrayImpl(children)) {
            if (1 < children.length) throw Error(formatProdErrorMessage(93));
            children = children[0];
          }
          defaultValue = children;
        }
        null == defaultValue && (defaultValue = "");
        value = defaultValue;
      }
      defaultValue = getToStringValue(value);
      element.defaultValue = defaultValue;
      children = element.textContent;
      children === defaultValue && "" !== children && null !== children && (element.value = children);
      track(element);
    }
    function setTextContent(node, text) {
      if (text) {
        var firstChild = node.firstChild;
        if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
          firstChild.nodeValue = text;
          return;
        }
      }
      node.textContent = text;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    function setValueForStyle(style2, styleName, value) {
      var isCustomProperty = 0 === styleName.indexOf("--");
      null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
    }
    function setValueForStyles(node, styles, prevStyles) {
      if (null != styles && "object" !== typeof styles)
        throw Error(formatProdErrorMessage(62));
      node = node.style;
      if (null != prevStyles) {
        for (var styleName in prevStyles)
          !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
        for (var styleName$16 in styles)
          styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
      } else
        for (var styleName$17 in styles)
          styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
    }
    function isCustomElement(tagName) {
      if (-1 === tagName.indexOf("-")) return false;
      switch (tagName) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    function noop$1() {
    }
    var currentReplayingEvent = null;
    function getEventTarget(nativeEvent) {
      nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
      nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
      return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
    }
    var restoreTarget = null;
    var restoreQueue = null;
    function restoreStateOfTarget(target) {
      var internalInstance = getInstanceFromNode(target);
      if (internalInstance && (target = internalInstance.stateNode)) {
        var props = target[internalPropsKey] || null;
        a: switch (target = internalInstance.stateNode, internalInstance.type) {
          case "input":
            updateInput(
              target,
              props.value,
              props.defaultValue,
              props.defaultValue,
              props.checked,
              props.defaultChecked,
              props.type,
              props.name
            );
            internalInstance = props.name;
            if ("radio" === props.type && null != internalInstance) {
              for (props = target; props.parentNode; ) props = props.parentNode;
              props = props.querySelectorAll(
                'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
                  "" + internalInstance
                ) + '"][type="radio"]'
              );
              for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
                var otherNode = props[internalInstance];
                if (otherNode !== target && otherNode.form === target.form) {
                  var otherProps = otherNode[internalPropsKey] || null;
                  if (!otherProps) throw Error(formatProdErrorMessage(90));
                  updateInput(
                    otherNode,
                    otherProps.value,
                    otherProps.defaultValue,
                    otherProps.defaultValue,
                    otherProps.checked,
                    otherProps.defaultChecked,
                    otherProps.type,
                    otherProps.name
                  );
                }
              }
              for (internalInstance = 0; internalInstance < props.length; internalInstance++)
                otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
            }
            break a;
          case "textarea":
            updateTextarea(target, props.value, props.defaultValue);
            break a;
          case "select":
            internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
        }
      }
    }
    var isInsideEventHandler = false;
    function batchedUpdates$1(fn, a, b) {
      if (isInsideEventHandler) return fn(a, b);
      isInsideEventHandler = true;
      try {
        var JSCompiler_inline_result = fn(a);
        return JSCompiler_inline_result;
      } finally {
        if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
          if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
            for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
        }
      }
    }
    function getListener(inst, registrationName) {
      var stateNode = inst.stateNode;
      if (null === stateNode) return null;
      var props = stateNode[internalPropsKey] || null;
      if (null === props) return null;
      stateNode = props[registrationName];
      a: switch (registrationName) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
          inst = !props;
          break a;
        default:
          inst = false;
      }
      if (inst) return null;
      if (stateNode && "function" !== typeof stateNode)
        throw Error(
          formatProdErrorMessage(231, registrationName, typeof stateNode)
        );
      return stateNode;
    }
    var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
    var passiveBrowserEventsSupported = false;
    if (canUseDOM)
      try {
        options = {};
        Object.defineProperty(options, "passive", {
          get: function() {
            passiveBrowserEventsSupported = true;
          }
        });
        window.addEventListener("test", options, options);
        window.removeEventListener("test", options, options);
      } catch (e) {
        passiveBrowserEventsSupported = false;
      }
    var options;
    var root = null;
    var startText = null;
    var fallbackText = null;
    function getData() {
      if (fallbackText) return fallbackText;
      var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
      for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
      var minEnd = startLength - start;
      for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
      return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
    }
    function getEventCharCode(nativeEvent) {
      var keyCode = nativeEvent.keyCode;
      "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
      10 === nativeEvent && (nativeEvent = 13);
      return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
    }
    function functionThatReturnsTrue() {
      return true;
    }
    function functionThatReturnsFalse() {
      return false;
    }
    function createSyntheticEvent(Interface) {
      function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = reactEventType;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        this.currentTarget = null;
        for (var propName in Interface)
          Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
        this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
        this.isPropagationStopped = functionThatReturnsFalse;
        return this;
      }
      assign(SyntheticBaseEvent.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var event = this.nativeEvent;
          event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
        },
        stopPropagation: function() {
          var event = this.nativeEvent;
          event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
        },
        persist: function() {
        },
        isPersistent: functionThatReturnsTrue
      });
      return SyntheticBaseEvent;
    }
    var EventInterface = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(event) {
        return event.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    };
    var SyntheticEvent = createSyntheticEvent(EventInterface);
    var UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 });
    var SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
    var lastMovementX;
    var lastMovementY;
    var lastMouseEvent;
    var MouseEventInterface = assign({}, UIEventInterface, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: getEventModifierState,
      button: 0,
      buttons: 0,
      relatedTarget: function(event) {
        return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
      },
      movementX: function(event) {
        if ("movementX" in event) return event.movementX;
        event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
        return lastMovementX;
      },
      movementY: function(event) {
        return "movementY" in event ? event.movementY : lastMovementY;
      }
    });
    var SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
    var DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 });
    var SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
    var FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 });
    var SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
    var AnimationEventInterface = assign({}, EventInterface, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    });
    var SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface);
    var ClipboardEventInterface = assign({}, EventInterface, {
      clipboardData: function(event) {
        return "clipboardData" in event ? event.clipboardData : window.clipboardData;
      }
    });
    var SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface);
    var CompositionEventInterface = assign({}, EventInterface, { data: 0 });
    var SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface);
    var normalizeKey = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    };
    var translateToKey = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    var modifierKeyToProp = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function modifierStateGetter(keyArg) {
      var nativeEvent = this.nativeEvent;
      return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
    }
    function getEventModifierState() {
      return modifierStateGetter;
    }
    var KeyboardEventInterface = assign({}, UIEventInterface, {
      key: function(nativeEvent) {
        if (nativeEvent.key) {
          var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
          if ("Unidentified" !== key) return key;
        }
        return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: getEventModifierState,
      charCode: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : 0;
      },
      keyCode: function(event) {
        return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
      },
      which: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
      }
    });
    var SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
    var PointerEventInterface = assign({}, MouseEventInterface, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    });
    var SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
    var TouchEventInterface = assign({}, UIEventInterface, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: getEventModifierState
    });
    var SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
    var TransitionEventInterface = assign({}, EventInterface, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    });
    var SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
    var WheelEventInterface = assign({}, MouseEventInterface, {
      deltaX: function(event) {
        return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
      },
      deltaY: function(event) {
        return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    });
    var SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
    var ToggleEventInterface = assign({}, EventInterface, {
      newState: 0,
      oldState: 0
    });
    var SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface);
    var END_KEYCODES = [9, 13, 27, 32];
    var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
    var documentMode = null;
    canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
    var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
    var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode);
    var SPACEBAR_CHAR = String.fromCharCode(32);
    var hasSpaceKeypress = false;
    function isFallbackCompositionEnd(domEventName, nativeEvent) {
      switch (domEventName) {
        case "keyup":
          return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
        case "keydown":
          return 229 !== nativeEvent.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function getDataFromCustomEvent(nativeEvent) {
      nativeEvent = nativeEvent.detail;
      return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
    }
    var isComposing = false;
    function getNativeBeforeInputChars(domEventName, nativeEvent) {
      switch (domEventName) {
        case "compositionend":
          return getDataFromCustomEvent(nativeEvent);
        case "keypress":
          if (32 !== nativeEvent.which) return null;
          hasSpaceKeypress = true;
          return SPACEBAR_CHAR;
        case "textInput":
          return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
        default:
          return null;
      }
    }
    function getFallbackBeforeInputChars(domEventName, nativeEvent) {
      if (isComposing)
        return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
      switch (domEventName) {
        case "paste":
          return null;
        case "keypress":
          if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
            if (nativeEvent.char && 1 < nativeEvent.char.length)
              return nativeEvent.char;
            if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
          }
          return null;
        case "compositionend":
          return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
        default:
          return null;
      }
    }
    var supportedInputTypes = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true
    };
    function isTextInputElement(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
      return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
    }
    function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
      restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
      inst = accumulateTwoPhaseListeners(inst, "onChange");
      0 < inst.length && (nativeEvent = new SyntheticEvent(
        "onChange",
        "change",
        null,
        nativeEvent,
        target
      ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
    }
    var activeElement$1 = null;
    var activeElementInst$1 = null;
    function runEventInBatch(dispatchQueue) {
      processDispatchQueue(dispatchQueue, 0);
    }
    function getInstIfValueChanged(targetInst) {
      var targetNode = getNodeFromInstance(targetInst);
      if (updateValueIfChanged(targetNode)) return targetInst;
    }
    function getTargetInstForChangeEvent(domEventName, targetInst) {
      if ("change" === domEventName) return targetInst;
    }
    var isInputEventSupported = false;
    if (canUseDOM) {
      if (canUseDOM) {
        isSupported$jscomp$inline_427 = "oninput" in document;
        if (!isSupported$jscomp$inline_427) {
          element$jscomp$inline_428 = document.createElement("div");
          element$jscomp$inline_428.setAttribute("oninput", "return;");
          isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
        }
        JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
      } else JSCompiler_inline_result$jscomp$286 = false;
      isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
    }
    var JSCompiler_inline_result$jscomp$286;
    var isSupported$jscomp$inline_427;
    var element$jscomp$inline_428;
    function stopWatchingForValueChange() {
      activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
    }
    function handlePropertyChange(nativeEvent) {
      if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
        var dispatchQueue = [];
        createAndAccumulateChangeEvent(
          dispatchQueue,
          activeElementInst$1,
          nativeEvent,
          getEventTarget(nativeEvent)
        );
        batchedUpdates$1(runEventInBatch, dispatchQueue);
      }
    }
    function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
      "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
    }
    function getTargetInstForInputEventPolyfill(domEventName) {
      if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
        return getInstIfValueChanged(activeElementInst$1);
    }
    function getTargetInstForClickEvent(domEventName, targetInst) {
      if ("click" === domEventName) return getInstIfValueChanged(targetInst);
    }
    function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
      if ("input" === domEventName || "change" === domEventName)
        return getInstIfValueChanged(targetInst);
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    function shallowEqual(objA, objB) {
      if (objectIs(objA, objB)) return true;
      if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
        return false;
      var keysA = Object.keys(objA), keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) return false;
      for (keysB = 0; keysB < keysA.length; keysB++) {
        var currentKey = keysA[keysB];
        if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
          return false;
      }
      return true;
    }
    function getLeafNode(node) {
      for (; node && node.firstChild; ) node = node.firstChild;
      return node;
    }
    function getNodeForCharacterOffset(root2, offset) {
      var node = getLeafNode(root2);
      root2 = 0;
      for (var nodeEnd; node; ) {
        if (3 === node.nodeType) {
          nodeEnd = root2 + node.textContent.length;
          if (root2 <= offset && nodeEnd >= offset)
            return { node, offset: offset - root2 };
          root2 = nodeEnd;
        }
        a: {
          for (; node; ) {
            if (node.nextSibling) {
              node = node.nextSibling;
              break a;
            }
            node = node.parentNode;
          }
          node = void 0;
        }
        node = getLeafNode(node);
      }
    }
    function containsNode(outerNode, innerNode) {
      return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
    }
    function getActiveElementDeep(containerInfo) {
      containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
      for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
        try {
          var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
        } catch (err) {
          JSCompiler_inline_result = false;
        }
        if (JSCompiler_inline_result) containerInfo = element.contentWindow;
        else break;
        element = getActiveElement(containerInfo.document);
      }
      return element;
    }
    function hasSelectionCapabilities(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
      return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
    }
    var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode;
    var activeElement = null;
    var activeElementInst = null;
    var lastSelection = null;
    var mouseDown = false;
    function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
      var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
      mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
        anchorNode: doc.anchorNode,
        anchorOffset: doc.anchorOffset,
        focusNode: doc.focusNode,
        focusOffset: doc.focusOffset
      }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
        "onSelect",
        "select",
        null,
        nativeEvent,
        nativeEventTarget
      ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
    }
    function makePrefixMap(styleProp, eventName) {
      var prefixes = {};
      prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
      prefixes["Webkit" + styleProp] = "webkit" + eventName;
      prefixes["Moz" + styleProp] = "moz" + eventName;
      return prefixes;
    }
    var vendorPrefixes = {
      animationend: makePrefixMap("Animation", "AnimationEnd"),
      animationiteration: makePrefixMap("Animation", "AnimationIteration"),
      animationstart: makePrefixMap("Animation", "AnimationStart"),
      transitionrun: makePrefixMap("Transition", "TransitionRun"),
      transitionstart: makePrefixMap("Transition", "TransitionStart"),
      transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
      transitionend: makePrefixMap("Transition", "TransitionEnd")
    };
    var prefixedEventNames = {};
    var style = {};
    canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
    function getVendorPrefixedEventName(eventName) {
      if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
      if (!vendorPrefixes[eventName]) return eventName;
      var prefixMap = vendorPrefixes[eventName], styleProp;
      for (styleProp in prefixMap)
        if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
          return prefixedEventNames[eventName] = prefixMap[styleProp];
      return eventName;
    }
    var ANIMATION_END = getVendorPrefixedEventName("animationend");
    var ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration");
    var ANIMATION_START = getVendorPrefixedEventName("animationstart");
    var TRANSITION_RUN = getVendorPrefixedEventName("transitionrun");
    var TRANSITION_START = getVendorPrefixedEventName("transitionstart");
    var TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel");
    var TRANSITION_END = getVendorPrefixedEventName("transitionend");
    var topLevelEventsToReactNames = /* @__PURE__ */ new Map();
    var simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
    simpleEventPluginEvents.push("scrollEnd");
    function registerSimpleEvent(domEventName, reactName) {
      topLevelEventsToReactNames.set(domEventName, reactName);
      registerTwoPhaseEvent(reactName, [domEventName]);
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var concurrentQueues = [];
    var concurrentQueuesIndex = 0;
    var concurrentlyUpdatedLanes = 0;
    function finishQueueingConcurrentUpdates() {
      for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
        var fiber = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var queue = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var update = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var lane = concurrentQueues[i];
        concurrentQueues[i++] = null;
        if (null !== queue && null !== update) {
          var pending = queue.pending;
          null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
          queue.pending = update;
        }
        0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
      }
    }
    function enqueueUpdate$1(fiber, queue, update, lane) {
      concurrentQueues[concurrentQueuesIndex++] = fiber;
      concurrentQueues[concurrentQueuesIndex++] = queue;
      concurrentQueues[concurrentQueuesIndex++] = update;
      concurrentQueues[concurrentQueuesIndex++] = lane;
      concurrentlyUpdatedLanes |= lane;
      fiber.lanes |= lane;
      fiber = fiber.alternate;
      null !== fiber && (fiber.lanes |= lane);
    }
    function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
      enqueueUpdate$1(fiber, queue, update, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function enqueueConcurrentRenderForLane(fiber, lane) {
      enqueueUpdate$1(fiber, null, null, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
      sourceFiber.lanes |= lane;
      var alternate = sourceFiber.alternate;
      null !== alternate && (alternate.lanes |= lane);
      for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
        parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
      return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
    }
    function getRootForUpdatedFiber(sourceFiber) {
      if (50 < nestedUpdateCount)
        throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
      for (var parent = sourceFiber.return; null !== parent; )
        sourceFiber = parent, parent = sourceFiber.return;
      return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
    }
    var emptyContextObject = {};
    function FiberNode(tag, pendingProps, key, mode) {
      this.tag = tag;
      this.key = key;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.refCleanup = this.ref = null;
      this.pendingProps = pendingProps;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = mode;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function createFiberImplClass(tag, pendingProps, key, mode) {
      return new FiberNode(tag, pendingProps, key, mode);
    }
    function shouldConstruct(Component) {
      Component = Component.prototype;
      return !(!Component || !Component.isReactComponent);
    }
    function createWorkInProgress(current, pendingProps) {
      var workInProgress2 = current.alternate;
      null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
        current.tag,
        pendingProps,
        current.key,
        current.mode
      ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
      workInProgress2.flags = current.flags & 65011712;
      workInProgress2.childLanes = current.childLanes;
      workInProgress2.lanes = current.lanes;
      workInProgress2.child = current.child;
      workInProgress2.memoizedProps = current.memoizedProps;
      workInProgress2.memoizedState = current.memoizedState;
      workInProgress2.updateQueue = current.updateQueue;
      pendingProps = current.dependencies;
      workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
      workInProgress2.sibling = current.sibling;
      workInProgress2.index = current.index;
      workInProgress2.ref = current.ref;
      workInProgress2.refCleanup = current.refCleanup;
      return workInProgress2;
    }
    function resetWorkInProgress(workInProgress2, renderLanes2) {
      workInProgress2.flags &= 65011714;
      var current = workInProgress2.alternate;
      null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
        lanes: renderLanes2.lanes,
        firstContext: renderLanes2.firstContext
      });
      return workInProgress2;
    }
    function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
      var fiberTag = 0;
      owner = type;
      if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
      else if ("string" === typeof type)
        fiberTag = isHostHoistableType(
          type,
          pendingProps,
          contextStackCursor.current
        ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
      else
        a: switch (type) {
          case REACT_ACTIVITY_TYPE:
            return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
          case REACT_FRAGMENT_TYPE:
            return createFiberFromFragment(pendingProps.children, mode, lanes, key);
          case REACT_STRICT_MODE_TYPE:
            fiberTag = 8;
            mode |= 24;
            break;
          case REACT_PROFILER_TYPE:
            return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
          case REACT_SUSPENSE_TYPE:
            return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
          case REACT_SUSPENSE_LIST_TYPE:
            return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
          default:
            if ("object" === typeof type && null !== type)
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  fiberTag = 10;
                  break a;
                case REACT_CONSUMER_TYPE:
                  fiberTag = 9;
                  break a;
                case REACT_FORWARD_REF_TYPE:
                  fiberTag = 11;
                  break a;
                case REACT_MEMO_TYPE:
                  fiberTag = 14;
                  break a;
                case REACT_LAZY_TYPE:
                  fiberTag = 16;
                  owner = null;
                  break a;
              }
            fiberTag = 29;
            pendingProps = Error(
              formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
            );
            owner = null;
        }
      key = createFiberImplClass(fiberTag, pendingProps, key, mode);
      key.elementType = type;
      key.type = owner;
      key.lanes = lanes;
      return key;
    }
    function createFiberFromFragment(elements, mode, lanes, key) {
      elements = createFiberImplClass(7, elements, key, mode);
      elements.lanes = lanes;
      return elements;
    }
    function createFiberFromText(content, mode, lanes) {
      content = createFiberImplClass(6, content, null, mode);
      content.lanes = lanes;
      return content;
    }
    function createFiberFromDehydratedFragment(dehydratedNode) {
      var fiber = createFiberImplClass(18, null, null, 0);
      fiber.stateNode = dehydratedNode;
      return fiber;
    }
    function createFiberFromPortal(portal, mode, lanes) {
      mode = createFiberImplClass(
        4,
        null !== portal.children ? portal.children : [],
        portal.key,
        mode
      );
      mode.lanes = lanes;
      mode.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
        implementation: portal.implementation
      };
      return mode;
    }
    var CapturedStacks = /* @__PURE__ */ new WeakMap();
    function createCapturedValueAtFiber(value, source) {
      if ("object" === typeof value && null !== value) {
        var existing = CapturedStacks.get(value);
        if (void 0 !== existing) return existing;
        source = {
          value,
          source,
          stack: getStackByFiberInDevAndProd(source)
        };
        CapturedStacks.set(value, source);
        return source;
      }
      return {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
    }
    var forkStack = [];
    var forkStackIndex = 0;
    var treeForkProvider = null;
    var treeForkCount = 0;
    var idStack = [];
    var idStackIndex = 0;
    var treeContextProvider = null;
    var treeContextId = 1;
    var treeContextOverflow = "";
    function pushTreeFork(workInProgress2, totalChildren) {
      forkStack[forkStackIndex++] = treeForkCount;
      forkStack[forkStackIndex++] = treeForkProvider;
      treeForkProvider = workInProgress2;
      treeForkCount = totalChildren;
    }
    function pushTreeId(workInProgress2, totalChildren, index2) {
      idStack[idStackIndex++] = treeContextId;
      idStack[idStackIndex++] = treeContextOverflow;
      idStack[idStackIndex++] = treeContextProvider;
      treeContextProvider = workInProgress2;
      var baseIdWithLeadingBit = treeContextId;
      workInProgress2 = treeContextOverflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index2 += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
        treeContextOverflow = length + workInProgress2;
      } else
        treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
    }
    function pushMaterializedTreeId(workInProgress2) {
      null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
    }
    function popTreeContext(workInProgress2) {
      for (; workInProgress2 === treeForkProvider; )
        treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
      for (; workInProgress2 === treeContextProvider; )
        treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
    }
    function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
      idStack[idStackIndex++] = treeContextId;
      idStack[idStackIndex++] = treeContextOverflow;
      idStack[idStackIndex++] = treeContextProvider;
      treeContextId = suspendedContext.id;
      treeContextOverflow = suspendedContext.overflow;
      treeContextProvider = workInProgress2;
    }
    var hydrationParentFiber = null;
    var nextHydratableInstance = null;
    var isHydrating = false;
    var hydrationErrors = null;
    var rootOrSingletonContext = false;
    var HydrationMismatchException = Error(formatProdErrorMessage(519));
    function throwOnHydrationMismatch(fiber) {
      var error = Error(
        formatProdErrorMessage(
          418,
          1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
          ""
        )
      );
      queueHydrationError(createCapturedValueAtFiber(error, fiber));
      throw HydrationMismatchException;
    }
    function prepareToHydrateHostInstance(fiber) {
      var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
      instance[internalInstanceKey] = fiber;
      instance[internalPropsKey] = props;
      switch (type) {
        case "dialog":
          listenToNonDelegatedEvent("cancel", instance);
          listenToNonDelegatedEvent("close", instance);
          break;
        case "iframe":
        case "object":
        case "embed":
          listenToNonDelegatedEvent("load", instance);
          break;
        case "video":
        case "audio":
          for (type = 0; type < mediaEventTypes.length; type++)
            listenToNonDelegatedEvent(mediaEventTypes[type], instance);
          break;
        case "source":
          listenToNonDelegatedEvent("error", instance);
          break;
        case "img":
        case "image":
        case "link":
          listenToNonDelegatedEvent("error", instance);
          listenToNonDelegatedEvent("load", instance);
          break;
        case "details":
          listenToNonDelegatedEvent("toggle", instance);
          break;
        case "input":
          listenToNonDelegatedEvent("invalid", instance);
          initInput(
            instance,
            props.value,
            props.defaultValue,
            props.checked,
            props.defaultChecked,
            props.type,
            props.name,
            true
          );
          break;
        case "select":
          listenToNonDelegatedEvent("invalid", instance);
          break;
        case "textarea":
          listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
      }
      type = props.children;
      "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
      instance || throwOnHydrationMismatch(fiber, true);
    }
    function popToNextHostParent(fiber) {
      for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
        switch (hydrationParentFiber.tag) {
          case 5:
          case 31:
          case 13:
            rootOrSingletonContext = false;
            return;
          case 27:
          case 3:
            rootOrSingletonContext = true;
            return;
          default:
            hydrationParentFiber = hydrationParentFiber.return;
        }
    }
    function popHydrationState(fiber) {
      if (fiber !== hydrationParentFiber) return false;
      if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
      var tag = fiber.tag, JSCompiler_temp;
      if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
        if (JSCompiler_temp = 5 === tag)
          JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
        JSCompiler_temp = !JSCompiler_temp;
      }
      JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
      popToNextHostParent(fiber);
      if (13 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
      } else if (31 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
      } else
        27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
      return true;
    }
    function resetHydrationState() {
      nextHydratableInstance = hydrationParentFiber = null;
      isHydrating = false;
    }
    function upgradeHydrationErrorsToRecoverable() {
      var queuedErrors = hydrationErrors;
      null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
        workInProgressRootRecoverableErrors,
        queuedErrors
      ), hydrationErrors = null);
      return queuedErrors;
    }
    function queueHydrationError(error) {
      null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
    }
    var valueCursor = createCursor(null);
    var currentlyRenderingFiber$1 = null;
    var lastContextDependency = null;
    function pushProvider(providerFiber, context, nextValue) {
      push(valueCursor, context._currentValue);
      context._currentValue = nextValue;
    }
    function popProvider(context) {
      context._currentValue = valueCursor.current;
      pop(valueCursor);
    }
    function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
      for (; null !== parent; ) {
        var alternate = parent.alternate;
        (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
        if (parent === propagationRoot) break;
        parent = parent.return;
      }
    }
    function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
      var fiber = workInProgress2.child;
      null !== fiber && (fiber.return = workInProgress2);
      for (; null !== fiber; ) {
        var list = fiber.dependencies;
        if (null !== list) {
          var nextFiber = fiber.child;
          list = list.firstContext;
          a: for (; null !== list; ) {
            var dependency = list;
            list = fiber;
            for (var i = 0; i < contexts.length; i++)
              if (dependency.context === contexts[i]) {
                list.lanes |= renderLanes2;
                dependency = list.alternate;
                null !== dependency && (dependency.lanes |= renderLanes2);
                scheduleContextWorkOnParentPath(
                  list.return,
                  renderLanes2,
                  workInProgress2
                );
                forcePropagateEntireTree || (nextFiber = null);
                break a;
              }
            list = dependency.next;
          }
        } else if (18 === fiber.tag) {
          nextFiber = fiber.return;
          if (null === nextFiber) throw Error(formatProdErrorMessage(341));
          nextFiber.lanes |= renderLanes2;
          list = nextFiber.alternate;
          null !== list && (list.lanes |= renderLanes2);
          scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
          nextFiber = null;
        } else nextFiber = fiber.child;
        if (null !== nextFiber) nextFiber.return = fiber;
        else
          for (nextFiber = fiber; null !== nextFiber; ) {
            if (nextFiber === workInProgress2) {
              nextFiber = null;
              break;
            }
            fiber = nextFiber.sibling;
            if (null !== fiber) {
              fiber.return = nextFiber.return;
              nextFiber = fiber;
              break;
            }
            nextFiber = nextFiber.return;
          }
        fiber = nextFiber;
      }
    }
    function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
      current = null;
      for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
        if (!isInsidePropagationBailout) {
          if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
          else if (0 !== (parent.flags & 262144)) break;
        }
        if (10 === parent.tag) {
          var currentParent = parent.alternate;
          if (null === currentParent) throw Error(formatProdErrorMessage(387));
          currentParent = currentParent.memoizedProps;
          if (null !== currentParent) {
            var context = parent.type;
            objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
          }
        } else if (parent === hostTransitionProviderCursor.current) {
          currentParent = parent.alternate;
          if (null === currentParent) throw Error(formatProdErrorMessage(387));
          currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
        }
        parent = parent.return;
      }
      null !== current && propagateContextChanges(
        workInProgress2,
        current,
        renderLanes2,
        forcePropagateEntireTree
      );
      workInProgress2.flags |= 262144;
    }
    function checkIfContextChanged(currentDependencies) {
      for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
        if (!objectIs(
          currentDependencies.context._currentValue,
          currentDependencies.memoizedValue
        ))
          return true;
        currentDependencies = currentDependencies.next;
      }
      return false;
    }
    function prepareToReadContext(workInProgress2) {
      currentlyRenderingFiber$1 = workInProgress2;
      lastContextDependency = null;
      workInProgress2 = workInProgress2.dependencies;
      null !== workInProgress2 && (workInProgress2.firstContext = null);
    }
    function readContext(context) {
      return readContextForConsumer(currentlyRenderingFiber$1, context);
    }
    function readContextDuringReconciliation(consumer, context) {
      null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
      return readContextForConsumer(consumer, context);
    }
    function readContextForConsumer(consumer, context) {
      var value = context._currentValue;
      context = { context, memoizedValue: value, next: null };
      if (null === lastContextDependency) {
        if (null === consumer) throw Error(formatProdErrorMessage(308));
        lastContextDependency = context;
        consumer.dependencies = { lanes: 0, firstContext: context };
        consumer.flags |= 524288;
      } else lastContextDependency = lastContextDependency.next = context;
      return value;
    }
    var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
      var listeners = [], signal = this.signal = {
        aborted: false,
        addEventListener: function(type, listener) {
          listeners.push(listener);
        }
      };
      this.abort = function() {
        signal.aborted = true;
        listeners.forEach(function(listener) {
          return listener();
        });
      };
    };
    var scheduleCallback$2 = Scheduler.unstable_scheduleCallback;
    var NormalPriority = Scheduler.unstable_NormalPriority;
    var CacheContext = {
      $$typeof: REACT_CONTEXT_TYPE,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function createCache() {
      return {
        controller: new AbortControllerLocal(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function releaseCache(cache) {
      cache.refCount--;
      0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
        cache.controller.abort();
      });
    }
    var currentEntangledListeners = null;
    var currentEntangledPendingCount = 0;
    var currentEntangledLane = 0;
    var currentEntangledActionThenable = null;
    function entangleAsyncAction(transition, thenable) {
      if (null === currentEntangledListeners) {
        var entangledListeners = currentEntangledListeners = [];
        currentEntangledPendingCount = 0;
        currentEntangledLane = requestTransitionLane();
        currentEntangledActionThenable = {
          status: "pending",
          value: void 0,
          then: function(resolve) {
            entangledListeners.push(resolve);
          }
        };
      }
      currentEntangledPendingCount++;
      thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
      return thenable;
    }
    function pingEngtangledActionScope() {
      if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
        null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
        var listeners = currentEntangledListeners;
        currentEntangledListeners = null;
        currentEntangledLane = 0;
        currentEntangledActionThenable = null;
        for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
      }
    }
    function chainThenableValue(thenable, result) {
      var listeners = [], thenableWithOverride = {
        status: "pending",
        value: null,
        reason: null,
        then: function(resolve) {
          listeners.push(resolve);
        }
      };
      thenable.then(
        function() {
          thenableWithOverride.status = "fulfilled";
          thenableWithOverride.value = result;
          for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
        },
        function(error) {
          thenableWithOverride.status = "rejected";
          thenableWithOverride.reason = error;
          for (error = 0; error < listeners.length; error++)
            (0, listeners[error])(void 0);
        }
      );
      return thenableWithOverride;
    }
    var prevOnStartTransitionFinish = ReactSharedInternals.S;
    ReactSharedInternals.S = function(transition, returnValue) {
      globalMostRecentTransitionTime = now();
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
      null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
    };
    var resumedCache = createCursor(null);
    function peekCacheFromPool() {
      var cacheResumedFromPreviousRender = resumedCache.current;
      return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
    }
    function pushTransition(offscreenWorkInProgress, prevCachePool) {
      null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
    }
    function getSuspendedCache() {
      var cacheFromPool = peekCacheFromPool();
      return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
    }
    var SuspenseException = Error(formatProdErrorMessage(460));
    var SuspenseyCommitException = Error(formatProdErrorMessage(474));
    var SuspenseActionException = Error(formatProdErrorMessage(542));
    var noopSuspenseyCommitThenable = { then: function() {
    } };
    function isThenableResolved(thenable) {
      thenable = thenable.status;
      return "fulfilled" === thenable || "rejected" === thenable;
    }
    function trackUsedThenable(thenableState2, thenable, index2) {
      index2 = thenableState2[index2];
      void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        default:
          if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
          else {
            thenableState2 = workInProgressRoot;
            if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
              throw Error(formatProdErrorMessage(482));
            thenableState2 = thenable;
            thenableState2.status = "pending";
            thenableState2.then(
              function(fulfilledValue) {
                if ("pending" === thenable.status) {
                  var fulfilledThenable = thenable;
                  fulfilledThenable.status = "fulfilled";
                  fulfilledThenable.value = fulfilledValue;
                }
              },
              function(error) {
                if ("pending" === thenable.status) {
                  var rejectedThenable = thenable;
                  rejectedThenable.status = "rejected";
                  rejectedThenable.reason = error;
                }
              }
            );
          }
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    function resolveLazy(lazyType) {
      try {
        var init = lazyType._init;
        return init(lazyType._payload);
      } catch (x) {
        if (null !== x && "object" === typeof x && "function" === typeof x.then)
          throw suspendedThenable = x, SuspenseException;
        throw x;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function checkIfUseWrappedInAsyncCatch(rejectedReason) {
      if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
        throw Error(formatProdErrorMessage(483));
    }
    var thenableState$1 = null;
    var thenableIndexCounter$1 = 0;
    function unwrapThenable(thenable) {
      var index2 = thenableIndexCounter$1;
      thenableIndexCounter$1 += 1;
      null === thenableState$1 && (thenableState$1 = []);
      return trackUsedThenable(thenableState$1, thenable, index2);
    }
    function coerceRef(workInProgress2, element) {
      element = element.props.ref;
      workInProgress2.ref = void 0 !== element ? element : null;
    }
    function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
      if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
        throw Error(formatProdErrorMessage(525));
      returnFiber = Object.prototype.toString.call(newChild);
      throw Error(
        formatProdErrorMessage(
          31,
          "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
        )
      );
    }
    function createChildReconciler(shouldTrackSideEffects) {
      function deleteChild(returnFiber, childToDelete) {
        if (shouldTrackSideEffects) {
          var deletions = returnFiber.deletions;
          null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
        }
      }
      function deleteRemainingChildren(returnFiber, currentFirstChild) {
        if (!shouldTrackSideEffects) return null;
        for (; null !== currentFirstChild; )
          deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return null;
      }
      function mapRemainingChildren(currentFirstChild) {
        for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild; )
          null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return existingChildren;
      }
      function useFiber(fiber, pendingProps) {
        fiber = createWorkInProgress(fiber, pendingProps);
        fiber.index = 0;
        fiber.sibling = null;
        return fiber;
      }
      function placeChild(newFiber, lastPlacedIndex, newIndex) {
        newFiber.index = newIndex;
        if (!shouldTrackSideEffects)
          return newFiber.flags |= 1048576, lastPlacedIndex;
        newIndex = newFiber.alternate;
        if (null !== newIndex)
          return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
        newFiber.flags |= 67108866;
        return lastPlacedIndex;
      }
      function placeSingleChild(newFiber) {
        shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
        return newFiber;
      }
      function updateTextNode(returnFiber, current, textContent, lanes) {
        if (null === current || 6 !== current.tag)
          return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, textContent);
        current.return = returnFiber;
        return current;
      }
      function updateElement(returnFiber, current, element, lanes) {
        var elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE)
          return updateFragment(
            returnFiber,
            current,
            element.props.children,
            lanes,
            element.key
          );
        if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
          return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
        current = createFiberFromTypeAndProps(
          element.type,
          element.key,
          element.props,
          null,
          returnFiber.mode,
          lanes
        );
        coerceRef(current, element);
        current.return = returnFiber;
        return current;
      }
      function updatePortal(returnFiber, current, portal, lanes) {
        if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
          return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, portal.children || []);
        current.return = returnFiber;
        return current;
      }
      function updateFragment(returnFiber, current, fragment, lanes, key) {
        if (null === current || 7 !== current.tag)
          return current = createFiberFromFragment(
            fragment,
            returnFiber.mode,
            lanes,
            key
          ), current.return = returnFiber, current;
        current = useFiber(current, fragment);
        current.return = returnFiber;
        return current;
      }
      function createChild(returnFiber, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return newChild = createFiberFromText(
            "" + newChild,
            returnFiber.mode,
            lanes
          ), newChild.return = returnFiber, newChild;
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return lanes = createFiberFromTypeAndProps(
                newChild.type,
                newChild.key,
                newChild.props,
                null,
                returnFiber.mode,
                lanes
              ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
            case REACT_PORTAL_TYPE:
              return newChild = createFiberFromPortal(
                newChild,
                returnFiber.mode,
                lanes
              ), newChild.return = returnFiber, newChild;
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return newChild = createFiberFromFragment(
              newChild,
              returnFiber.mode,
              lanes,
              null
            ), newChild.return = returnFiber, newChild;
          if ("function" === typeof newChild.then)
            return createChild(returnFiber, unwrapThenable(newChild), lanes);
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return createChild(
              returnFiber,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function updateSlot(returnFiber, oldFiber, newChild, lanes) {
        var key = null !== oldFiber ? oldFiber.key : null;
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
            case REACT_PORTAL_TYPE:
              return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
          if ("function" === typeof newChild.then)
            return updateSlot(
              returnFiber,
              oldFiber,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateSlot(
              returnFiber,
              oldFiber,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return existingChildren = existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
            case REACT_PORTAL_TYPE:
              return existingChildren = existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), updateFromMap(
                existingChildren,
                returnFiber,
                newIdx,
                newChild,
                lanes
              );
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
          if ("function" === typeof newChild.then)
            return updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
        for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(
            returnFiber,
            oldFiber,
            newChildren[newIdx],
            lanes
          );
          if (null === newFiber) {
            null === oldFiber && (oldFiber = nextOldFiber);
            break;
          }
          shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
          currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
          null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
        if (newIdx === newChildren.length)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
          for (; newIdx < newChildren.length; newIdx++)
            oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
              oldFiber,
              currentFirstChild,
              newIdx
            ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
          nextOldFiber = updateFromMap(
            oldFiber,
            returnFiber,
            newIdx,
            newChildren[newIdx],
            lanes
          ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
            null === nextOldFiber.key ? newIdx : nextOldFiber.key
          ), currentFirstChild = placeChild(
            nextOldFiber,
            currentFirstChild,
            newIdx
          ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
        if (null == newChildren) throw Error(formatProdErrorMessage(151));
        for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
          if (null === newFiber) {
            null === oldFiber && (oldFiber = nextOldFiber);
            break;
          }
          shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
          currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
          null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
        if (step.done)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
          for (; !step.done; newIdx++, step = newChildren.next())
            step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
          step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
        "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              a: {
                for (var key = newChild.key; null !== currentFirstChild; ) {
                  if (currentFirstChild.key === key) {
                    key = newChild.type;
                    if (key === REACT_FRAGMENT_TYPE) {
                      if (7 === currentFirstChild.tag) {
                        deleteRemainingChildren(
                          returnFiber,
                          currentFirstChild.sibling
                        );
                        lanes = useFiber(
                          currentFirstChild,
                          newChild.props.children
                        );
                        lanes.return = returnFiber;
                        returnFiber = lanes;
                        break a;
                      }
                    } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(currentFirstChild, newChild.props);
                      coerceRef(lanes, newChild);
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    }
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  } else deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
                  newChild.props.children,
                  returnFiber.mode,
                  lanes,
                  newChild.key
                ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
                  newChild.type,
                  newChild.key,
                  newChild.props,
                  null,
                  returnFiber.mode,
                  lanes
                ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
              }
              return placeSingleChild(returnFiber);
            case REACT_PORTAL_TYPE:
              a: {
                for (key = newChild.key; null !== currentFirstChild; ) {
                  if (currentFirstChild.key === key)
                    if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(currentFirstChild, newChild.children || []);
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    } else {
                      deleteRemainingChildren(returnFiber, currentFirstChild);
                      break;
                    }
                  else deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
                lanes.return = returnFiber;
                returnFiber = lanes;
              }
              return placeSingleChild(returnFiber);
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes
              );
          }
          if (isArrayImpl(newChild))
            return reconcileChildrenArray(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
          if (getIteratorFn(newChild)) {
            key = getIteratorFn(newChild);
            if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
            newChild = key.call(newChild);
            return reconcileChildrenIterator(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
          }
          if ("function" === typeof newChild.then)
            return reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
      }
      return function(returnFiber, currentFirstChild, newChild, lanes) {
        try {
          thenableIndexCounter$1 = 0;
          var firstChildFiber = reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
          thenableState$1 = null;
          return firstChildFiber;
        } catch (x) {
          if (x === SuspenseException || x === SuspenseActionException) throw x;
          var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
          fiber.lanes = lanes;
          fiber.return = returnFiber;
          return fiber;
        } finally {
        }
      };
    }
    var reconcileChildFibers = createChildReconciler(true);
    var mountChildFibers = createChildReconciler(false);
    var hasForceUpdate = false;
    function initializeUpdateQueue(fiber) {
      fiber.updateQueue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function cloneUpdateQueue(current, workInProgress2) {
      current = current.updateQueue;
      workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
        baseState: current.baseState,
        firstBaseUpdate: current.firstBaseUpdate,
        lastBaseUpdate: current.lastBaseUpdate,
        shared: current.shared,
        callbacks: null
      });
    }
    function createUpdate(lane) {
      return { lane, tag: 0, payload: null, callback: null, next: null };
    }
    function enqueueUpdate(fiber, update, lane) {
      var updateQueue = fiber.updateQueue;
      if (null === updateQueue) return null;
      updateQueue = updateQueue.shared;
      if (0 !== (executionContext & 2)) {
        var pending = updateQueue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        updateQueue.pending = update;
        update = getRootForUpdatedFiber(fiber);
        markUpdateLaneFromFiberToRoot(fiber, null, lane);
        return update;
      }
      enqueueUpdate$1(fiber, updateQueue, update, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function entangleTransitions(root2, fiber, lane) {
      fiber = fiber.updateQueue;
      if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
        var queueLanes = fiber.lanes;
        queueLanes &= root2.pendingLanes;
        lane |= queueLanes;
        fiber.lanes = lane;
        markRootEntangled(root2, lane);
      }
    }
    function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
      var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
      if (null !== current && (current = current.updateQueue, queue === current)) {
        var newFirst = null, newLast = null;
        queue = queue.firstBaseUpdate;
        if (null !== queue) {
          do {
            var clone = {
              lane: queue.lane,
              tag: queue.tag,
              payload: queue.payload,
              callback: null,
              next: null
            };
            null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
            queue = queue.next;
          } while (null !== queue);
          null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
        } else newFirst = newLast = capturedUpdate;
        queue = {
          baseState: current.baseState,
          firstBaseUpdate: newFirst,
          lastBaseUpdate: newLast,
          shared: current.shared,
          callbacks: current.callbacks
        };
        workInProgress2.updateQueue = queue;
        return;
      }
      workInProgress2 = queue.lastBaseUpdate;
      null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
      queue.lastBaseUpdate = capturedUpdate;
    }
    var didReadFromEntangledAsyncAction = false;
    function suspendIfUpdateReadFromEntangledAsyncAction() {
      if (didReadFromEntangledAsyncAction) {
        var entangledActionThenable = currentEntangledActionThenable;
        if (null !== entangledActionThenable) throw entangledActionThenable;
      }
    }
    function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
      didReadFromEntangledAsyncAction = false;
      var queue = workInProgress$jscomp$0.updateQueue;
      hasForceUpdate = false;
      var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
      if (null !== pendingQueue) {
        queue.shared.pending = null;
        var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null;
        null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
        lastBaseUpdate = lastPendingUpdate;
        var current = workInProgress$jscomp$0.alternate;
        null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
      }
      if (null !== firstBaseUpdate) {
        var newState = queue.baseState;
        lastBaseUpdate = 0;
        current = firstPendingUpdate = lastPendingUpdate = null;
        pendingQueue = firstBaseUpdate;
        do {
          var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
          if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
            0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
            null !== current && (current = current.next = {
              lane: 0,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: null,
              next: null
            });
            a: {
              var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
              updateLane = props;
              var instance = instance$jscomp$0;
              switch (update.tag) {
                case 1:
                  workInProgress2 = update.payload;
                  if ("function" === typeof workInProgress2) {
                    newState = workInProgress2.call(instance, newState, updateLane);
                    break a;
                  }
                  newState = workInProgress2;
                  break a;
                case 3:
                  workInProgress2.flags = workInProgress2.flags & -65537 | 128;
                case 0:
                  workInProgress2 = update.payload;
                  updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                  if (null === updateLane || void 0 === updateLane) break a;
                  newState = assign({}, newState, updateLane);
                  break a;
                case 2:
                  hasForceUpdate = true;
              }
            }
            updateLane = pendingQueue.callback;
            null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
          } else
            isHiddenUpdate = {
              lane: updateLane,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: pendingQueue.callback,
              next: null
            }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
          pendingQueue = pendingQueue.next;
          if (null === pendingQueue)
            if (pendingQueue = queue.shared.pending, null === pendingQueue)
              break;
            else
              isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
        } while (1);
        null === current && (lastPendingUpdate = newState);
        queue.baseState = lastPendingUpdate;
        queue.firstBaseUpdate = firstPendingUpdate;
        queue.lastBaseUpdate = current;
        null === firstBaseUpdate && (queue.shared.lanes = 0);
        workInProgressRootSkippedLanes |= lastBaseUpdate;
        workInProgress$jscomp$0.lanes = lastBaseUpdate;
        workInProgress$jscomp$0.memoizedState = newState;
      }
    }
    function callCallback(callback, context) {
      if ("function" !== typeof callback)
        throw Error(formatProdErrorMessage(191, callback));
      callback.call(context);
    }
    function commitCallbacks(updateQueue, context) {
      var callbacks = updateQueue.callbacks;
      if (null !== callbacks)
        for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
          callCallback(callbacks[updateQueue], context);
    }
    var currentTreeHiddenStackCursor = createCursor(null);
    var prevEntangledRenderLanesCursor = createCursor(0);
    function pushHiddenContext(fiber, context) {
      fiber = entangledRenderLanes;
      push(prevEntangledRenderLanesCursor, fiber);
      push(currentTreeHiddenStackCursor, context);
      entangledRenderLanes = fiber | context.baseLanes;
    }
    function reuseHiddenContextOnStack() {
      push(prevEntangledRenderLanesCursor, entangledRenderLanes);
      push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
    }
    function popHiddenContext() {
      entangledRenderLanes = prevEntangledRenderLanesCursor.current;
      pop(currentTreeHiddenStackCursor);
      pop(prevEntangledRenderLanesCursor);
    }
    var suspenseHandlerStackCursor = createCursor(null);
    var shellBoundary = null;
    function pushPrimaryTreeSuspenseHandler(handler) {
      var current = handler.alternate;
      push(suspenseStackCursor, suspenseStackCursor.current & 1);
      push(suspenseHandlerStackCursor, handler);
      null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
    }
    function pushDehydratedActivitySuspenseHandler(fiber) {
      push(suspenseStackCursor, suspenseStackCursor.current);
      push(suspenseHandlerStackCursor, fiber);
      null === shellBoundary && (shellBoundary = fiber);
    }
    function pushOffscreenSuspenseHandler(fiber) {
      22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack(fiber);
    }
    function reuseSuspenseHandlerOnStack() {
      push(suspenseStackCursor, suspenseStackCursor.current);
      push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
    }
    function popSuspenseHandler(fiber) {
      pop(suspenseHandlerStackCursor);
      shellBoundary === fiber && (shellBoundary = null);
      pop(suspenseStackCursor);
    }
    var suspenseStackCursor = createCursor(0);
    function findFirstSuspended(row) {
      for (var node = row; null !== node; ) {
        if (13 === node.tag) {
          var state = node.memoizedState;
          if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
            return node;
        } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
          if (0 !== (node.flags & 128)) return node;
        } else if (null !== node.child) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        if (node === row) break;
        for (; null === node.sibling; ) {
          if (null === node.return || node.return === row) return null;
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
      return null;
    }
    var renderLanes = 0;
    var currentlyRenderingFiber = null;
    var currentHook = null;
    var workInProgressHook = null;
    var didScheduleRenderPhaseUpdate = false;
    var didScheduleRenderPhaseUpdateDuringThisPass = false;
    var shouldDoubleInvokeUserFnsInHooksDEV = false;
    var localIdCounter = 0;
    var thenableIndexCounter = 0;
    var thenableState = null;
    var globalClientIdCounter = 0;
    function throwInvalidHookError() {
      throw Error(formatProdErrorMessage(321));
    }
    function areHookInputsEqual(nextDeps, prevDeps) {
      if (null === prevDeps) return false;
      for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
        if (!objectIs(nextDeps[i], prevDeps[i])) return false;
      return true;
    }
    function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
      renderLanes = nextRenderLanes;
      currentlyRenderingFiber = workInProgress2;
      workInProgress2.memoizedState = null;
      workInProgress2.updateQueue = null;
      workInProgress2.lanes = 0;
      ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
      shouldDoubleInvokeUserFnsInHooksDEV = false;
      nextRenderLanes = Component(props, secondArg);
      shouldDoubleInvokeUserFnsInHooksDEV = false;
      didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
        workInProgress2,
        Component,
        props,
        secondArg
      ));
      finishRenderingHooks(current);
      return nextRenderLanes;
    }
    function finishRenderingHooks(current) {
      ReactSharedInternals.H = ContextOnlyDispatcher;
      var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
      renderLanes = 0;
      workInProgressHook = currentHook = currentlyRenderingFiber = null;
      didScheduleRenderPhaseUpdate = false;
      thenableIndexCounter = 0;
      thenableState = null;
      if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
      null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
    }
    function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
      currentlyRenderingFiber = workInProgress2;
      var numberOfReRenders = 0;
      do {
        didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
        thenableIndexCounter = 0;
        didScheduleRenderPhaseUpdateDuringThisPass = false;
        if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
        numberOfReRenders += 1;
        workInProgressHook = currentHook = null;
        if (null != workInProgress2.updateQueue) {
          var children = workInProgress2.updateQueue;
          children.lastEffect = null;
          children.events = null;
          children.stores = null;
          null != children.memoCache && (children.memoCache.index = 0);
        }
        ReactSharedInternals.H = HooksDispatcherOnRerender;
        children = Component(props, secondArg);
      } while (didScheduleRenderPhaseUpdateDuringThisPass);
      return children;
    }
    function TransitionAwareHostComponent() {
      var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
      maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
      dispatcher = dispatcher.useState()[0];
      (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
      return maybeThenable;
    }
    function checkDidRenderIdHook() {
      var didRenderIdHook = 0 !== localIdCounter;
      localIdCounter = 0;
      return didRenderIdHook;
    }
    function bailoutHooks(current, workInProgress2, lanes) {
      workInProgress2.updateQueue = current.updateQueue;
      workInProgress2.flags &= -2053;
      current.lanes &= ~lanes;
    }
    function resetHooksOnUnwind(workInProgress2) {
      if (didScheduleRenderPhaseUpdate) {
        for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
          var queue = workInProgress2.queue;
          null !== queue && (queue.pending = null);
          workInProgress2 = workInProgress2.next;
        }
        didScheduleRenderPhaseUpdate = false;
      }
      renderLanes = 0;
      workInProgressHook = currentHook = currentlyRenderingFiber = null;
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      thenableIndexCounter = localIdCounter = 0;
      thenableState = null;
    }
    function mountWorkInProgressHook() {
      var hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
      return workInProgressHook;
    }
    function updateWorkInProgressHook() {
      if (null === currentHook) {
        var nextCurrentHook = currentlyRenderingFiber.alternate;
        nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
      } else nextCurrentHook = currentHook.next;
      var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
      if (null !== nextWorkInProgressHook)
        workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
      else {
        if (null === nextCurrentHook) {
          if (null === currentlyRenderingFiber.alternate)
            throw Error(formatProdErrorMessage(467));
          throw Error(formatProdErrorMessage(310));
        }
        currentHook = nextCurrentHook;
        nextCurrentHook = {
          memoizedState: currentHook.memoizedState,
          baseState: currentHook.baseState,
          baseQueue: currentHook.baseQueue,
          queue: currentHook.queue,
          next: null
        };
        null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
      }
      return workInProgressHook;
    }
    function createFunctionComponentUpdateQueue() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function useThenable(thenable) {
      var index2 = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      thenable = trackUsedThenable(thenableState, thenable, index2);
      index2 = currentlyRenderingFiber;
      null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
      return thenable;
    }
    function use(usable) {
      if (null !== usable && "object" === typeof usable) {
        if ("function" === typeof usable.then) return useThenable(usable);
        if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
      }
      throw Error(formatProdErrorMessage(438, String(usable)));
    }
    function useMemoCache(size) {
      var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
      null !== updateQueue && (memoCache = updateQueue.memoCache);
      if (null == memoCache) {
        var current = currentlyRenderingFiber.alternate;
        null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
          data: current.data.map(function(array) {
            return array.slice();
          }),
          index: 0
        })));
      }
      null == memoCache && (memoCache = { data: [], index: 0 });
      null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
      updateQueue.memoCache = memoCache;
      updateQueue = memoCache.data[memoCache.index];
      if (void 0 === updateQueue)
        for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
          updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
      memoCache.index++;
      return updateQueue;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function updateReducer(reducer) {
      var hook = updateWorkInProgressHook();
      return updateReducerImpl(hook, currentHook, reducer);
    }
    function updateReducerImpl(hook, current, reducer) {
      var queue = hook.queue;
      if (null === queue) throw Error(formatProdErrorMessage(311));
      queue.lastRenderedReducer = reducer;
      var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
      if (null !== pendingQueue) {
        if (null !== baseQueue) {
          var baseFirst = baseQueue.next;
          baseQueue.next = pendingQueue.next;
          pendingQueue.next = baseFirst;
        }
        current.baseQueue = baseQueue = pendingQueue;
        queue.pending = null;
      }
      pendingQueue = hook.baseState;
      if (null === baseQueue) hook.memoizedState = pendingQueue;
      else {
        current = baseQueue.next;
        var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
        do {
          var updateLane = update.lane & -536870913;
          if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
            var revertLane = update.revertLane;
            if (0 === revertLane)
              null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
            else if ((renderLanes & revertLane) === revertLane) {
              update = update.next;
              revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
              continue;
            } else
              updateLane = {
                lane: 0,
                revertLane: update.revertLane,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
            updateLane = update.action;
            shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
            pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
          } else
            revertLane = {
              lane: updateLane,
              revertLane: update.revertLane,
              gesture: update.gesture,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
          update = update.next;
        } while (null !== update && update !== current);
        null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
        if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
          throw reducer;
        hook.memoizedState = pendingQueue;
        hook.baseState = baseFirst;
        hook.baseQueue = newBaseQueueLast;
        queue.lastRenderedState = pendingQueue;
      }
      null === baseQueue && (queue.lanes = 0);
      return [hook.memoizedState, queue.dispatch];
    }
    function rerenderReducer(reducer) {
      var hook = updateWorkInProgressHook(), queue = hook.queue;
      if (null === queue) throw Error(formatProdErrorMessage(311));
      queue.lastRenderedReducer = reducer;
      var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
      if (null !== lastRenderPhaseUpdate) {
        queue.pending = null;
        var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        do
          newState = reducer(newState, update.action), update = update.next;
        while (update !== lastRenderPhaseUpdate);
        objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
        hook.memoizedState = newState;
        null === hook.baseQueue && (hook.baseState = newState);
        queue.lastRenderedState = newState;
      }
      return [newState, dispatch];
    }
    function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
      if (isHydrating$jscomp$0) {
        if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
      } else getServerSnapshot = getSnapshot();
      var snapshotChanged = !objectIs(
        (currentHook || hook).memoizedState,
        getServerSnapshot
      );
      snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
      hook = hook.queue;
      updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
        subscribe
      ]);
      if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
        fiber.flags |= 2048;
        pushSimpleEffect(
          9,
          { destroy: void 0 },
          updateStoreInstance.bind(
            null,
            fiber,
            hook,
            getServerSnapshot,
            getSnapshot
          ),
          null
        );
        if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
        isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      return getServerSnapshot;
    }
    function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
      fiber.flags |= 16384;
      fiber = { getSnapshot, value: renderedSnapshot };
      getSnapshot = currentlyRenderingFiber.updateQueue;
      null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
    }
    function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
      inst.value = nextSnapshot;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    }
    function subscribeToStore(fiber, inst, subscribe) {
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
      });
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function forceStoreRerender(fiber) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 2);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
    }
    function mountStateImpl(initialState) {
      var hook = mountWorkInProgressHook();
      if ("function" === typeof initialState) {
        var initialStateInitializer = initialState;
        initialState = initialStateInitializer();
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            initialStateInitializer();
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
      }
      hook.memoizedState = hook.baseState = initialState;
      hook.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
      };
      return hook;
    }
    function updateOptimisticImpl(hook, current, passthrough, reducer) {
      hook.baseState = passthrough;
      return updateReducerImpl(
        hook,
        currentHook,
        "function" === typeof reducer ? reducer : basicStateReducer
      );
    }
    function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
      if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
      fiber = actionQueue.action;
      if (null !== fiber) {
        var actionNode = {
          payload,
          action: fiber,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(listener) {
            actionNode.listeners.push(listener);
          }
        };
        null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
        setState(actionNode);
        setPendingState = actionQueue.pending;
        null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
      }
    }
    function runActionStateAction(actionQueue, node) {
      var action = node.action, payload = node.payload, prevState = actionQueue.state;
      if (node.isTransition) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          handleActionReturnValue(actionQueue, node, returnValue);
        } catch (error) {
          onActionError(actionQueue, node, error);
        } finally {
          null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      } else
        try {
          prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
        } catch (error$66) {
          onActionError(actionQueue, node, error$66);
        }
    }
    function handleActionReturnValue(actionQueue, node, returnValue) {
      null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
        function(nextState) {
          onActionSuccess(actionQueue, node, nextState);
        },
        function(error) {
          return onActionError(actionQueue, node, error);
        }
      ) : onActionSuccess(actionQueue, node, returnValue);
    }
    function onActionSuccess(actionQueue, actionNode, nextState) {
      actionNode.status = "fulfilled";
      actionNode.value = nextState;
      notifyActionListeners(actionNode);
      actionQueue.state = nextState;
      actionNode = actionQueue.pending;
      null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
    }
    function onActionError(actionQueue, actionNode, error) {
      var last = actionQueue.pending;
      actionQueue.pending = null;
      if (null !== last) {
        last = last.next;
        do
          actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
        while (actionNode !== last);
      }
      actionQueue.action = null;
    }
    function notifyActionListeners(actionNode) {
      actionNode = actionNode.listeners;
      for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
    }
    function actionStateReducer(oldState, newState) {
      return newState;
    }
    function mountActionState(action, initialStateProp) {
      if (isHydrating) {
        var ssrFormState = workInProgressRoot.formState;
        if (null !== ssrFormState) {
          a: {
            var JSCompiler_inline_result = currentlyRenderingFiber;
            if (isHydrating) {
              if (nextHydratableInstance) {
                b: {
                  var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                  for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                    if (!inRootOrSingleton) {
                      JSCompiler_inline_result$jscomp$0 = null;
                      break b;
                    }
                    JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                      JSCompiler_inline_result$jscomp$0.nextSibling
                    );
                    if (null === JSCompiler_inline_result$jscomp$0) {
                      JSCompiler_inline_result$jscomp$0 = null;
                      break b;
                    }
                  }
                  inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                  JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
                }
                if (JSCompiler_inline_result$jscomp$0) {
                  nextHydratableInstance = getNextHydratable(
                    JSCompiler_inline_result$jscomp$0.nextSibling
                  );
                  JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                  break a;
                }
              }
              throwOnHydrationMismatch(JSCompiler_inline_result);
            }
            JSCompiler_inline_result = false;
          }
          JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
        }
      }
      ssrFormState = mountWorkInProgressHook();
      ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
      JSCompiler_inline_result = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: actionStateReducer,
        lastRenderedState: initialStateProp
      };
      ssrFormState.queue = JSCompiler_inline_result;
      ssrFormState = dispatchSetState.bind(
        null,
        currentlyRenderingFiber,
        JSCompiler_inline_result
      );
      JSCompiler_inline_result.dispatch = ssrFormState;
      JSCompiler_inline_result = mountStateImpl(false);
      inRootOrSingleton = dispatchOptimisticSetState.bind(
        null,
        currentlyRenderingFiber,
        false,
        JSCompiler_inline_result.queue
      );
      JSCompiler_inline_result = mountWorkInProgressHook();
      JSCompiler_inline_result$jscomp$0 = {
        state: initialStateProp,
        dispatch: null,
        action,
        pending: null
      };
      JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
      ssrFormState = dispatchActionState.bind(
        null,
        currentlyRenderingFiber,
        JSCompiler_inline_result$jscomp$0,
        inRootOrSingleton,
        ssrFormState
      );
      JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
      JSCompiler_inline_result.memoizedState = action;
      return [initialStateProp, ssrFormState, false];
    }
    function updateActionState(action) {
      var stateHook = updateWorkInProgressHook();
      return updateActionStateImpl(stateHook, currentHook, action);
    }
    function updateActionStateImpl(stateHook, currentStateHook, action) {
      currentStateHook = updateReducerImpl(
        stateHook,
        currentStateHook,
        actionStateReducer
      )[0];
      stateHook = updateReducer(basicStateReducer)[0];
      if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
        try {
          var state = useThenable(currentStateHook);
        } catch (x) {
          if (x === SuspenseException) throw SuspenseActionException;
          throw x;
        }
      else state = currentStateHook;
      currentStateHook = updateWorkInProgressHook();
      var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
      action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
        9,
        { destroy: void 0 },
        actionStateActionEffect.bind(null, actionQueue, action),
        null
      ));
      return [state, dispatch, stateHook];
    }
    function actionStateActionEffect(actionQueue, action) {
      actionQueue.action = action;
    }
    function rerenderActionState(action) {
      var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
      if (null !== currentStateHook)
        return updateActionStateImpl(stateHook, currentStateHook, action);
      updateWorkInProgressHook();
      stateHook = stateHook.memoizedState;
      currentStateHook = updateWorkInProgressHook();
      var dispatch = currentStateHook.queue.dispatch;
      currentStateHook.memoizedState = action;
      return [stateHook, dispatch, false];
    }
    function pushSimpleEffect(tag, inst, create, deps) {
      tag = { tag, create, deps, inst, next: null };
      inst = currentlyRenderingFiber.updateQueue;
      null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
      create = inst.lastEffect;
      null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
      return tag;
    }
    function updateRef() {
      return updateWorkInProgressHook().memoizedState;
    }
    function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = mountWorkInProgressHook();
      currentlyRenderingFiber.flags |= fiberFlags;
      hook.memoizedState = pushSimpleEffect(
        1 | hookFlags,
        { destroy: void 0 },
        create,
        void 0 === deps ? null : deps
      );
    }
    function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var inst = hook.memoizedState.inst;
      null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
        1 | hookFlags,
        inst,
        create,
        deps
      ));
    }
    function mountEffect(create, deps) {
      mountEffectImpl(8390656, 8, create, deps);
    }
    function updateEffect(create, deps) {
      updateEffectImpl(2048, 8, create, deps);
    }
    function useEffectEventImpl(payload) {
      currentlyRenderingFiber.flags |= 4;
      var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
      if (null === componentUpdateQueue)
        componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
      else {
        var events = componentUpdateQueue.events;
        null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
      }
    }
    function updateEvent(callback) {
      var ref = updateWorkInProgressHook().memoizedState;
      useEffectEventImpl({ ref, nextImpl: callback });
      return function() {
        if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
      };
    }
    function updateInsertionEffect(create, deps) {
      return updateEffectImpl(4, 2, create, deps);
    }
    function updateLayoutEffect(create, deps) {
      return updateEffectImpl(4, 4, create, deps);
    }
    function imperativeHandleEffect(create, ref) {
      if ("function" === typeof ref) {
        create = create();
        var refCleanup = ref(create);
        return function() {
          "function" === typeof refCleanup ? refCleanup() : ref(null);
        };
      }
      if (null !== ref && void 0 !== ref)
        return create = create(), ref.current = create, function() {
          ref.current = null;
        };
    }
    function updateImperativeHandle(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
    }
    function mountDebugValue() {
    }
    function updateCallback(callback, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (null !== deps && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      hook.memoizedState = [callback, deps];
      return callback;
    }
    function updateMemo(nextCreate, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (null !== deps && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      prevState = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
      hook.memoizedState = [prevState, deps];
      return prevState;
    }
    function mountDeferredValueImpl(hook, value, initialValue) {
      if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
        return hook.memoizedState = value;
      hook.memoizedState = initialValue;
      hook = requestDeferredLane();
      currentlyRenderingFiber.lanes |= hook;
      workInProgressRootSkippedLanes |= hook;
      return initialValue;
    }
    function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
      if (objectIs(value, prevValue)) return value;
      if (null !== currentTreeHiddenStackCursor.current)
        return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
      if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
        return didReceiveUpdate = true, hook.memoizedState = value;
      hook = requestDeferredLane();
      currentlyRenderingFiber.lanes |= hook;
      workInProgressRootSkippedLanes |= hook;
      return prevValue;
    }
    function startTransition(fiber, queue, pendingState, finishedState, callback) {
      var previousPriority = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      dispatchOptimisticSetState(fiber, false, queue, pendingState);
      try {
        var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
          var thenableForFinishedState = chainThenableValue(
            returnValue,
            finishedState
          );
          dispatchSetStateInternal(
            fiber,
            queue,
            thenableForFinishedState,
            requestUpdateLane(fiber)
          );
        } else
          dispatchSetStateInternal(
            fiber,
            queue,
            finishedState,
            requestUpdateLane(fiber)
          );
      } catch (error) {
        dispatchSetStateInternal(
          fiber,
          queue,
          { then: function() {
          }, status: "rejected", reason: error },
          requestUpdateLane()
        );
      } finally {
        ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    }
    function noop() {
    }
    function startHostTransition(formFiber, pendingState, action, formData) {
      if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
      var queue = ensureFormComponentIsStateful(formFiber).queue;
      startTransition(
        formFiber,
        queue,
        pendingState,
        sharedNotPendingObject,
        null === action ? noop : function() {
          requestFormReset$1(formFiber);
          return action(formData);
        }
      );
    }
    function ensureFormComponentIsStateful(formFiber) {
      var existingStateHook = formFiber.memoizedState;
      if (null !== existingStateHook) return existingStateHook;
      existingStateHook = {
        memoizedState: sharedNotPendingObject,
        baseState: sharedNotPendingObject,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: sharedNotPendingObject
        },
        next: null
      };
      var initialResetState = {};
      existingStateHook.next = {
        memoizedState: initialResetState,
        baseState: initialResetState,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: initialResetState
        },
        next: null
      };
      formFiber.memoizedState = existingStateHook;
      formFiber = formFiber.alternate;
      null !== formFiber && (formFiber.memoizedState = existingStateHook);
      return existingStateHook;
    }
    function requestFormReset$1(formFiber) {
      var stateHook = ensureFormComponentIsStateful(formFiber);
      null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
      dispatchSetStateInternal(
        formFiber,
        stateHook.next.queue,
        {},
        requestUpdateLane()
      );
    }
    function useHostTransitionStatus() {
      return readContext(HostTransitionContext);
    }
    function updateId() {
      return updateWorkInProgressHook().memoizedState;
    }
    function updateRefresh() {
      return updateWorkInProgressHook().memoizedState;
    }
    function refreshCache(fiber) {
      for (var provider = fiber.return; null !== provider; ) {
        switch (provider.tag) {
          case 24:
          case 3:
            var lane = requestUpdateLane();
            fiber = createUpdate(lane);
            var root$69 = enqueueUpdate(provider, fiber, lane);
            null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
            provider = { cache: createCache() };
            fiber.payload = provider;
            return;
        }
        provider = provider.return;
      }
    }
    function dispatchReducerAction(fiber, queue, action) {
      var lane = requestUpdateLane();
      action = {
        lane,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
    }
    function dispatchSetState(fiber, queue, action) {
      var lane = requestUpdateLane();
      dispatchSetStateInternal(fiber, queue, action, lane);
    }
    function dispatchSetStateInternal(fiber, queue, action, lane) {
      var update = {
        lane,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
      else {
        var alternate = fiber.alternate;
        if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
          try {
            var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
            update.hasEagerState = true;
            update.eagerState = eagerState;
            if (objectIs(eagerState, currentState))
              return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
          } catch (error) {
          } finally {
          }
        action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
        if (null !== action)
          return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
      }
      return false;
    }
    function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
      action = {
        lane: 2,
        revertLane: requestTransitionLane(),
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (isRenderPhaseUpdate(fiber)) {
        if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
      } else
        throwIfDuringRender = enqueueConcurrentHookUpdate(
          fiber,
          queue,
          action,
          2
        ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
    }
    function isRenderPhaseUpdate(fiber) {
      var alternate = fiber.alternate;
      return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
    }
    function enqueueRenderPhaseUpdate(queue, update) {
      didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
      var pending = queue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      queue.pending = update;
    }
    function entangleTransitionUpdate(root2, queue, lane) {
      if (0 !== (lane & 4194048)) {
        var queueLanes = queue.lanes;
        queueLanes &= root2.pendingLanes;
        lane |= queueLanes;
        queue.lanes = lane;
        markRootEntangled(root2, lane);
      }
    }
    var ContextOnlyDispatcher = {
      readContext,
      use,
      useCallback: throwInvalidHookError,
      useContext: throwInvalidHookError,
      useEffect: throwInvalidHookError,
      useImperativeHandle: throwInvalidHookError,
      useLayoutEffect: throwInvalidHookError,
      useInsertionEffect: throwInvalidHookError,
      useMemo: throwInvalidHookError,
      useReducer: throwInvalidHookError,
      useRef: throwInvalidHookError,
      useState: throwInvalidHookError,
      useDebugValue: throwInvalidHookError,
      useDeferredValue: throwInvalidHookError,
      useTransition: throwInvalidHookError,
      useSyncExternalStore: throwInvalidHookError,
      useId: throwInvalidHookError,
      useHostTransitionStatus: throwInvalidHookError,
      useFormState: throwInvalidHookError,
      useActionState: throwInvalidHookError,
      useOptimistic: throwInvalidHookError,
      useMemoCache: throwInvalidHookError,
      useCacheRefresh: throwInvalidHookError
    };
    ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
    var HooksDispatcherOnMount = {
      readContext,
      use,
      useCallback: function(callback, deps) {
        mountWorkInProgressHook().memoizedState = [
          callback,
          void 0 === deps ? null : deps
        ];
        return callback;
      },
      useContext: readContext,
      useEffect: mountEffect,
      useImperativeHandle: function(ref, create, deps) {
        deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
        mountEffectImpl(
          4194308,
          4,
          imperativeHandleEffect.bind(null, create, ref),
          deps
        );
      },
      useLayoutEffect: function(create, deps) {
        return mountEffectImpl(4194308, 4, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        mountEffectImpl(4, 2, create, deps);
      },
      useMemo: function(nextCreate, deps) {
        var hook = mountWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var nextValue = nextCreate();
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            nextCreate();
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
        hook.memoizedState = [nextValue, deps];
        return nextValue;
      },
      useReducer: function(reducer, initialArg, init) {
        var hook = mountWorkInProgressHook();
        if (void 0 !== init) {
          var initialState = init(initialArg);
          if (shouldDoubleInvokeUserFnsInHooksDEV) {
            setIsStrictModeForDevtools(true);
            try {
              init(initialArg);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
        } else initialState = initialArg;
        hook.memoizedState = hook.baseState = initialState;
        reducer = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: reducer,
          lastRenderedState: initialState
        };
        hook.queue = reducer;
        reducer = reducer.dispatch = dispatchReducerAction.bind(
          null,
          currentlyRenderingFiber,
          reducer
        );
        return [hook.memoizedState, reducer];
      },
      useRef: function(initialValue) {
        var hook = mountWorkInProgressHook();
        initialValue = { current: initialValue };
        return hook.memoizedState = initialValue;
      },
      useState: function(initialState) {
        initialState = mountStateImpl(initialState);
        var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
        queue.dispatch = dispatch;
        return [initialState.memoizedState, dispatch];
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = mountWorkInProgressHook();
        return mountDeferredValueImpl(hook, value, initialValue);
      },
      useTransition: function() {
        var stateHook = mountStateImpl(false);
        stateHook = startTransition.bind(
          null,
          currentlyRenderingFiber,
          stateHook.queue,
          true,
          false
        );
        mountWorkInProgressHook().memoizedState = stateHook;
        return [false, stateHook];
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
        if (isHydrating) {
          if (void 0 === getServerSnapshot)
            throw Error(formatProdErrorMessage(407));
          getServerSnapshot = getServerSnapshot();
        } else {
          getServerSnapshot = getSnapshot();
          if (null === workInProgressRoot)
            throw Error(formatProdErrorMessage(349));
          0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
        }
        hook.memoizedState = getServerSnapshot;
        var inst = { value: getServerSnapshot, getSnapshot };
        hook.queue = inst;
        mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
          subscribe
        ]);
        fiber.flags |= 2048;
        pushSimpleEffect(
          9,
          { destroy: void 0 },
          updateStoreInstance.bind(
            null,
            fiber,
            inst,
            getServerSnapshot,
            getSnapshot
          ),
          null
        );
        return getServerSnapshot;
      },
      useId: function() {
        var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
        if (isHydrating) {
          var JSCompiler_inline_result = treeContextOverflow;
          var idWithLeadingBit = treeContextId;
          JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
          identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
          JSCompiler_inline_result = localIdCounter++;
          0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
          identifierPrefix += "_";
        } else
          JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
        return hook.memoizedState = identifierPrefix;
      },
      useHostTransitionStatus,
      useFormState: mountActionState,
      useActionState: mountActionState,
      useOptimistic: function(passthrough) {
        var hook = mountWorkInProgressHook();
        hook.memoizedState = hook.baseState = passthrough;
        var queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        hook.queue = queue;
        hook = dispatchOptimisticSetState.bind(
          null,
          currentlyRenderingFiber,
          true,
          queue
        );
        queue.dispatch = hook;
        return [passthrough, hook];
      },
      useMemoCache,
      useCacheRefresh: function() {
        return mountWorkInProgressHook().memoizedState = refreshCache.bind(
          null,
          currentlyRenderingFiber
        );
      },
      useEffectEvent: function(callback) {
        var hook = mountWorkInProgressHook(), ref = { impl: callback };
        hook.memoizedState = ref;
        return function() {
          if (0 !== (executionContext & 2))
            throw Error(formatProdErrorMessage(440));
          return ref.impl.apply(void 0, arguments);
        };
      }
    };
    var HooksDispatcherOnUpdate = {
      readContext,
      use,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useInsertionEffect: updateInsertionEffect,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: updateReducer,
      useRef: updateRef,
      useState: function() {
        return updateReducer(basicStateReducer);
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return updateDeferredValueImpl(
          hook,
          currentHook.memoizedState,
          value,
          initialValue
        );
      },
      useTransition: function() {
        var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
          "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
          start
        ];
      },
      useSyncExternalStore: updateSyncExternalStore,
      useId: updateId,
      useHostTransitionStatus,
      useFormState: updateActionState,
      useActionState: updateActionState,
      useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      },
      useMemoCache,
      useCacheRefresh: updateRefresh
    };
    HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
    var HooksDispatcherOnRerender = {
      readContext,
      use,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useInsertionEffect: updateInsertionEffect,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: rerenderReducer,
      useRef: updateRef,
      useState: function() {
        return rerenderReducer(basicStateReducer);
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
          hook,
          currentHook.memoizedState,
          value,
          initialValue
        );
      },
      useTransition: function() {
        var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
          "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
          start
        ];
      },
      useSyncExternalStore: updateSyncExternalStore,
      useId: updateId,
      useHostTransitionStatus,
      useFormState: rerenderActionState,
      useActionState: rerenderActionState,
      useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        if (null !== currentHook)
          return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
        hook.baseState = passthrough;
        return [passthrough, hook.queue.dispatch];
      },
      useMemoCache,
      useCacheRefresh: updateRefresh
    };
    HooksDispatcherOnRerender.useEffectEvent = updateEvent;
    function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
      ctor = workInProgress2.memoizedState;
      getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
      getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
      workInProgress2.memoizedState = getDerivedStateFromProps;
      0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueReplaceState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 1;
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueForceUpdate: function(inst, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 2;
        void 0 !== callback && null !== callback && (update.callback = callback);
        callback = enqueueUpdate(inst, update, lane);
        null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
      }
    };
    function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
      workInProgress2 = workInProgress2.stateNode;
      return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
    }
    function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
      workInProgress2 = instance.state;
      "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
      "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
      instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
    }
    function resolveClassComponentProps(Component, baseProps) {
      var newProps = baseProps;
      if ("ref" in baseProps) {
        newProps = {};
        for (var propName in baseProps)
          "ref" !== propName && (newProps[propName] = baseProps[propName]);
      }
      if (Component = Component.defaultProps) {
        newProps === baseProps && (newProps = assign({}, newProps));
        for (var propName$73 in Component)
          void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
      }
      return newProps;
    }
    function defaultOnUncaughtError(error) {
      reportGlobalError(error);
    }
    function defaultOnCaughtError(error) {
      console.error(error);
    }
    function defaultOnRecoverableError(error) {
      reportGlobalError(error);
    }
    function logUncaughtError(root2, errorInfo) {
      try {
        var onUncaughtError = root2.onUncaughtError;
        onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
      } catch (e$74) {
        setTimeout(function() {
          throw e$74;
        });
      }
    }
    function logCaughtError(root2, boundary, errorInfo) {
      try {
        var onCaughtError = root2.onCaughtError;
        onCaughtError(errorInfo.value, {
          componentStack: errorInfo.stack,
          errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
        });
      } catch (e$75) {
        setTimeout(function() {
          throw e$75;
        });
      }
    }
    function createRootErrorUpdate(root2, errorInfo, lane) {
      lane = createUpdate(lane);
      lane.tag = 3;
      lane.payload = { element: null };
      lane.callback = function() {
        logUncaughtError(root2, errorInfo);
      };
      return lane;
    }
    function createClassErrorUpdate(lane) {
      lane = createUpdate(lane);
      lane.tag = 3;
      return lane;
    }
    function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
      var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
      if ("function" === typeof getDerivedStateFromError) {
        var error = errorInfo.value;
        update.payload = function() {
          return getDerivedStateFromError(error);
        };
        update.callback = function() {
          logCaughtError(root2, fiber, errorInfo);
        };
      }
      var inst = fiber.stateNode;
      null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
        logCaughtError(root2, fiber, errorInfo);
        "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
        var stack = errorInfo.stack;
        this.componentDidCatch(errorInfo.value, {
          componentStack: null !== stack ? stack : ""
        });
      });
    }
    function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
      sourceFiber.flags |= 32768;
      if (null !== value && "object" === typeof value && "function" === typeof value.then) {
        returnFiber = sourceFiber.alternate;
        null !== returnFiber && propagateParentContextChanges(
          returnFiber,
          sourceFiber,
          rootRenderLanes,
          true
        );
        sourceFiber = suspenseHandlerStackCursor.current;
        if (null !== sourceFiber) {
          switch (sourceFiber.tag) {
            case 31:
            case 13:
              return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
            case 22:
              return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([value])
              }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
          }
          throw Error(formatProdErrorMessage(435, sourceFiber.tag));
        }
        attachPingListener(root2, value, rootRenderLanes);
        renderDidSuspendDelayIfPossible();
        return false;
      }
      if (isHydrating)
        return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
          cause: value
        }), queueHydrationError(
          createCapturedValueAtFiber(returnFiber, sourceFiber)
        )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
          root2.stateNode,
          value,
          rootRenderLanes
        ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
      var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
      wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
      null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
      4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
      if (null === returnFiber) return true;
      value = createCapturedValueAtFiber(value, sourceFiber);
      sourceFiber = returnFiber;
      do {
        switch (sourceFiber.tag) {
          case 3:
            return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
          case 1:
            if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
              return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
                rootRenderLanes,
                root2,
                sourceFiber,
                value
              ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
        }
        sourceFiber = sourceFiber.return;
      } while (null !== sourceFiber);
      return false;
    }
    var SelectiveHydrationException = Error(formatProdErrorMessage(461));
    var didReceiveUpdate = false;
    function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
      workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
        workInProgress2,
        current.child,
        nextChildren,
        renderLanes2
      );
    }
    function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
      Component = Component.render;
      var ref = workInProgress2.ref;
      if ("ref" in nextProps) {
        var propsWithoutRef = {};
        for (var key in nextProps)
          "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
      } else propsWithoutRef = nextProps;
      prepareToReadContext(workInProgress2);
      nextProps = renderWithHooks(
        current,
        workInProgress2,
        Component,
        propsWithoutRef,
        ref,
        renderLanes2
      );
      key = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && key && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      return workInProgress2.child;
    }
    function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      if (null === current) {
        var type = Component.type;
        if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
          return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
            current,
            workInProgress2,
            type,
            nextProps,
            renderLanes2
          );
        current = createFiberFromTypeAndProps(
          Component.type,
          null,
          nextProps,
          workInProgress2,
          workInProgress2.mode,
          renderLanes2
        );
        current.ref = workInProgress2.ref;
        current.return = workInProgress2;
        return workInProgress2.child = current;
      }
      type = current.child;
      if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
        var prevProps = type.memoizedProps;
        Component = Component.compare;
        Component = null !== Component ? Component : shallowEqual;
        if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
          return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      }
      workInProgress2.flags |= 1;
      current = createWorkInProgress(type, nextProps);
      current.ref = workInProgress2.ref;
      current.return = workInProgress2;
      return workInProgress2.child = current;
    }
    function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      if (null !== current) {
        var prevProps = current.memoizedProps;
        if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
          if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
            0 !== (current.flags & 131072) && (didReceiveUpdate = true);
          else
            return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      }
      return updateFunctionComponent(
        current,
        workInProgress2,
        Component,
        nextProps,
        renderLanes2
      );
    }
    function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
      var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
      null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      if ("hidden" === nextProps.mode) {
        if (0 !== (workInProgress2.flags & 128)) {
          prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
          if (null !== current) {
            nextProps = workInProgress2.child = current.child;
            for (nextChildren = 0; null !== nextProps; )
              nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
            nextProps = nextChildren & ~prevState;
          } else nextProps = 0, workInProgress2.child = null;
          return deferHiddenOffscreenComponent(
            current,
            workInProgress2,
            prevState,
            renderLanes2,
            nextProps
          );
        }
        if (0 !== (renderLanes2 & 536870912))
          workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
            workInProgress2,
            null !== prevState ? prevState.cachePool : null
          ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
        else
          return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
            current,
            workInProgress2,
            null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
            renderLanes2,
            nextProps
          );
      } else
        null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack(workInProgress2));
      reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
      return workInProgress2.child;
    }
    function bailoutOffscreenComponent(current, workInProgress2) {
      null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      return workInProgress2.sibling;
    }
    function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
      var JSCompiler_inline_result = peekCacheFromPool();
      JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
      workInProgress2.memoizedState = {
        baseLanes: nextBaseLanes,
        cachePool: JSCompiler_inline_result
      };
      null !== current && pushTransition(workInProgress2, null);
      reuseHiddenContextOnStack();
      pushOffscreenSuspenseHandler(workInProgress2);
      null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
      workInProgress2.childLanes = remainingChildLanes;
      return null;
    }
    function mountActivityChildren(workInProgress2, nextProps) {
      nextProps = mountWorkInProgressOffscreenFiber(
        { mode: nextProps.mode, children: nextProps.children },
        workInProgress2.mode
      );
      nextProps.ref = workInProgress2.ref;
      workInProgress2.child = nextProps;
      nextProps.return = workInProgress2;
      return nextProps;
    }
    function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
      reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
      current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
      current.flags |= 2;
      popSuspenseHandler(workInProgress2);
      workInProgress2.memoizedState = null;
      return current;
    }
    function updateActivityComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
      workInProgress2.flags &= -129;
      if (null === current) {
        if (isHydrating) {
          if ("hidden" === nextProps.mode)
            return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
          pushDehydratedActivitySuspenseHandler(workInProgress2);
          (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
            current,
            rootOrSingletonContext
          ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
            dehydrated: current,
            treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
          if (null === current) throw throwOnHydrationMismatch(workInProgress2);
          workInProgress2.lanes = 536870912;
          return null;
        }
        return mountActivityChildren(workInProgress2, nextProps);
      }
      var prevState = current.memoizedState;
      if (null !== prevState) {
        var dehydrated = prevState.dehydrated;
        pushDehydratedActivitySuspenseHandler(workInProgress2);
        if (didSuspend)
          if (workInProgress2.flags & 256)
            workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            );
          else if (null !== workInProgress2.memoizedState)
            workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
          else throw Error(formatProdErrorMessage(558));
        else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
          nextProps = workInProgressRoot;
          if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
            throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
          renderDidSuspendDelayIfPossible();
          workInProgress2 = retryActivityComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else
          current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
        return workInProgress2;
      }
      current = createWorkInProgress(current.child, {
        mode: nextProps.mode,
        children: nextProps.children
      });
      current.ref = workInProgress2.ref;
      workInProgress2.child = current;
      current.return = workInProgress2;
      return current;
    }
    function markRef(current, workInProgress2) {
      var ref = workInProgress2.ref;
      if (null === ref)
        null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
      else {
        if ("function" !== typeof ref && "object" !== typeof ref)
          throw Error(formatProdErrorMessage(284));
        if (null === current || current.ref !== ref)
          workInProgress2.flags |= 4194816;
      }
    }
    function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      prepareToReadContext(workInProgress2);
      Component = renderWithHooks(
        current,
        workInProgress2,
        Component,
        nextProps,
        void 0,
        renderLanes2
      );
      nextProps = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, Component, renderLanes2);
      return workInProgress2.child;
    }
    function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
      prepareToReadContext(workInProgress2);
      workInProgress2.updateQueue = null;
      nextProps = renderWithHooksAgain(
        workInProgress2,
        Component,
        nextProps,
        secondArg
      );
      finishRenderingHooks(current);
      Component = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && Component && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      return workInProgress2.child;
    }
    function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      prepareToReadContext(workInProgress2);
      if (null === workInProgress2.stateNode) {
        var context = emptyContextObject, contextType = Component.contextType;
        "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
        context = new Component(nextProps, context);
        workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
        context.updater = classComponentUpdater;
        workInProgress2.stateNode = context;
        context._reactInternals = workInProgress2;
        context = workInProgress2.stateNode;
        context.props = nextProps;
        context.state = workInProgress2.memoizedState;
        context.refs = {};
        initializeUpdateQueue(workInProgress2);
        contextType = Component.contextType;
        context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
        context.state = workInProgress2.memoizedState;
        contextType = Component.getDerivedStateFromProps;
        "function" === typeof contextType && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          contextType,
          nextProps
        ), context.state = workInProgress2.memoizedState);
        "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
        "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
        nextProps = true;
      } else if (null === current) {
        context = workInProgress2.stateNode;
        var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
        context.props = oldProps;
        var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
        contextType = emptyContextObject;
        "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
        var getDerivedStateFromProps = Component.getDerivedStateFromProps;
        contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
        unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
        contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
          workInProgress2,
          context,
          nextProps,
          contextType
        );
        hasForceUpdate = false;
        var oldState = workInProgress2.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
        suspendIfUpdateReadFromEntangledAsyncAction();
        oldContext = workInProgress2.memoizedState;
        unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          getDerivedStateFromProps,
          nextProps
        ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
          workInProgress2,
          Component,
          oldProps,
          nextProps,
          oldState,
          oldContext,
          contextType
        )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
      } else {
        context = workInProgress2.stateNode;
        cloneUpdateQueue(current, workInProgress2);
        contextType = workInProgress2.memoizedProps;
        contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
        context.props = contextType$jscomp$0;
        getDerivedStateFromProps = workInProgress2.pendingProps;
        oldState = context.context;
        oldContext = Component.contextType;
        oldProps = emptyContextObject;
        "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
        unresolvedOldProps = Component.getDerivedStateFromProps;
        (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
          workInProgress2,
          context,
          nextProps,
          oldProps
        );
        hasForceUpdate = false;
        oldState = workInProgress2.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
        suspendIfUpdateReadFromEntangledAsyncAction();
        var newState = workInProgress2.memoizedState;
        contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          unresolvedOldProps,
          nextProps
        ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
          workInProgress2,
          Component,
          contextType$jscomp$0,
          nextProps,
          oldState,
          newState,
          oldProps
        ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
          nextProps,
          newState,
          oldProps
        )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
      }
      context = nextProps;
      markRef(current, workInProgress2);
      nextProps = 0 !== (workInProgress2.flags & 128);
      context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
        workInProgress2,
        current.child,
        null,
        renderLanes2
      ), workInProgress2.child = reconcileChildFibers(
        workInProgress2,
        null,
        Component,
        renderLanes2
      )) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
        current,
        workInProgress2,
        renderLanes2
      );
      return current;
    }
    function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
      resetHydrationState();
      workInProgress2.flags |= 256;
      reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
      return workInProgress2.child;
    }
    var SUSPENDED_MARKER = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function mountSuspenseOffscreenState(renderLanes2) {
      return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
    }
    function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
      current = null !== current ? current.childLanes & ~renderLanes2 : 0;
      primaryTreeDidDefer && (current |= workInProgressDeferredLane);
      return current;
    }
    function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
      (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
      JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
      JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
      workInProgress2.flags &= -33;
      if (null === current) {
        if (isHydrating) {
          showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack(workInProgress2);
          (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
            current,
            rootOrSingletonContext
          ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
            dehydrated: current,
            treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
          if (null === current) throw throwOnHydrationMismatch(workInProgress2);
          isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
          return null;
        }
        var nextPrimaryChildren = nextProps.children;
        nextProps = nextProps.fallback;
        if (showFallback)
          return reuseSuspenseHandlerOnStack(workInProgress2), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
            { mode: "hidden", children: nextPrimaryChildren },
            showFallback
          ), nextProps = createFiberFromFragment(
            nextProps,
            showFallback,
            renderLanes2,
            null
          ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
            current,
            JSCompiler_temp,
            renderLanes2
          ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
      }
      var prevState = current.memoizedState;
      if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
        if (didSuspend)
          workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
            { mode: "visible", children: nextProps.children },
            showFallback
          ), nextPrimaryChildren = createFiberFromFragment(
            nextPrimaryChildren,
            showFallback,
            renderLanes2,
            null
          ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
            workInProgress2,
            current.child,
            null,
            renderLanes2
          ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
            current,
            JSCompiler_temp,
            renderLanes2
          ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
        else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
          JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
          if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
          JSCompiler_temp = digest;
          nextProps = Error(formatProdErrorMessage(419));
          nextProps.stack = "";
          nextProps.digest = JSCompiler_temp;
          queueHydrationError({ value: nextProps, source: null, stack: null });
          workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
          JSCompiler_temp = workInProgressRoot;
          if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
            throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
          isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
          workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else
          isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
            nextPrimaryChildren.nextSibling
          ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
            workInProgress2,
            nextProps.children
          ), workInProgress2.flags |= 4096);
        return workInProgress2;
      }
      if (showFallback)
        return reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
          mode: "hidden",
          children: nextProps.children
        }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
          digest,
          nextPrimaryChildren
        ) : (nextPrimaryChildren = createFiberFromFragment(
          nextPrimaryChildren,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
          baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
          cachePool: showFallback
        }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      renderLanes2 = current.child;
      current = renderLanes2.sibling;
      renderLanes2 = createWorkInProgress(renderLanes2, {
        mode: "visible",
        children: nextProps.children
      });
      renderLanes2.return = workInProgress2;
      renderLanes2.sibling = null;
      null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
      workInProgress2.child = renderLanes2;
      workInProgress2.memoizedState = null;
      return renderLanes2;
    }
    function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
      primaryChildren = mountWorkInProgressOffscreenFiber(
        { mode: "visible", children: primaryChildren },
        workInProgress2.mode
      );
      primaryChildren.return = workInProgress2;
      return workInProgress2.child = primaryChildren;
    }
    function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
      offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
      offscreenProps.lanes = 0;
      return offscreenProps;
    }
    function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
      reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
      current = mountSuspensePrimaryChildren(
        workInProgress2,
        workInProgress2.pendingProps.children
      );
      current.flags |= 2;
      workInProgress2.memoizedState = null;
      return current;
    }
    function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
      fiber.lanes |= renderLanes2;
      var alternate = fiber.alternate;
      null !== alternate && (alternate.lanes |= renderLanes2);
      scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
    }
    function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
      var renderState = workInProgress2.memoizedState;
      null === renderState ? workInProgress2.memoizedState = {
        isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: lastContentRow,
        tail,
        tailMode,
        treeForkCount: treeForkCount2
      } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
    }
    function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
      nextProps = nextProps.children;
      var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
      shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
      push(suspenseStackCursor, suspenseContext);
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      nextProps = isHydrating ? treeForkCount : 0;
      if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
        a: for (current = workInProgress2.child; null !== current; ) {
          if (13 === current.tag)
            null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
          else if (19 === current.tag)
            scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
          else if (null !== current.child) {
            current.child.return = current;
            current = current.child;
            continue;
          }
          if (current === workInProgress2) break a;
          for (; null === current.sibling; ) {
            if (null === current.return || current.return === workInProgress2)
              break a;
            current = current.return;
          }
          current.sibling.return = current.return;
          current = current.sibling;
        }
      switch (revealOrder) {
        case "forwards":
          renderLanes2 = workInProgress2.child;
          for (revealOrder = null; null !== renderLanes2; )
            current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
          renderLanes2 = revealOrder;
          null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
          initSuspenseListRenderState(
            workInProgress2,
            false,
            revealOrder,
            renderLanes2,
            tailMode,
            nextProps
          );
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          renderLanes2 = null;
          revealOrder = workInProgress2.child;
          for (workInProgress2.child = null; null !== revealOrder; ) {
            current = revealOrder.alternate;
            if (null !== current && null === findFirstSuspended(current)) {
              workInProgress2.child = revealOrder;
              break;
            }
            current = revealOrder.sibling;
            revealOrder.sibling = renderLanes2;
            renderLanes2 = revealOrder;
            revealOrder = current;
          }
          initSuspenseListRenderState(
            workInProgress2,
            true,
            renderLanes2,
            null,
            tailMode,
            nextProps
          );
          break;
        case "together":
          initSuspenseListRenderState(
            workInProgress2,
            false,
            null,
            null,
            void 0,
            nextProps
          );
          break;
        default:
          workInProgress2.memoizedState = null;
      }
      return workInProgress2.child;
    }
    function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
      null !== current && (workInProgress2.dependencies = current.dependencies);
      workInProgressRootSkippedLanes |= workInProgress2.lanes;
      if (0 === (renderLanes2 & workInProgress2.childLanes))
        if (null !== current) {
          if (propagateParentContextChanges(
            current,
            workInProgress2,
            renderLanes2,
            false
          ), 0 === (renderLanes2 & workInProgress2.childLanes))
            return null;
        } else return null;
      if (null !== current && workInProgress2.child !== current.child)
        throw Error(formatProdErrorMessage(153));
      if (null !== workInProgress2.child) {
        current = workInProgress2.child;
        renderLanes2 = createWorkInProgress(current, current.pendingProps);
        workInProgress2.child = renderLanes2;
        for (renderLanes2.return = workInProgress2; null !== current.sibling; )
          current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
        renderLanes2.sibling = null;
      }
      return workInProgress2.child;
    }
    function checkScheduledUpdateOrContext(current, renderLanes2) {
      if (0 !== (current.lanes & renderLanes2)) return true;
      current = current.dependencies;
      return null !== current && checkIfContextChanged(current) ? true : false;
    }
    function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
      switch (workInProgress2.tag) {
        case 3:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
          resetHydrationState();
          break;
        case 27:
        case 5:
          pushHostContext(workInProgress2);
          break;
        case 4:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          break;
        case 10:
          pushProvider(
            workInProgress2,
            workInProgress2.type,
            workInProgress2.memoizedProps.value
          );
          break;
        case 31:
          if (null !== workInProgress2.memoizedState)
            return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
          break;
        case 13:
          var state$102 = workInProgress2.memoizedState;
          if (null !== state$102) {
            if (null !== state$102.dehydrated)
              return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
            if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
              return updateSuspenseComponent(current, workInProgress2, renderLanes2);
            pushPrimaryTreeSuspenseHandler(workInProgress2);
            current = bailoutOnAlreadyFinishedWork(
              current,
              workInProgress2,
              renderLanes2
            );
            return null !== current ? current.sibling : null;
          }
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          break;
        case 19:
          var didSuspendBefore = 0 !== (current.flags & 128);
          state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
          state$102 || (propagateParentContextChanges(
            current,
            workInProgress2,
            renderLanes2,
            false
          ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
          if (didSuspendBefore) {
            if (state$102)
              return updateSuspenseListComponent(
                current,
                workInProgress2,
                renderLanes2
              );
            workInProgress2.flags |= 128;
          }
          didSuspendBefore = workInProgress2.memoizedState;
          null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
          push(suspenseStackCursor, suspenseStackCursor.current);
          if (state$102) break;
          else return null;
        case 22:
          return workInProgress2.lanes = 0, updateOffscreenComponent(
            current,
            workInProgress2,
            renderLanes2,
            workInProgress2.pendingProps
          );
        case 24:
          pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
      }
      return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    function beginWork(current, workInProgress2, renderLanes2) {
      if (null !== current)
        if (current.memoizedProps !== workInProgress2.pendingProps)
          didReceiveUpdate = true;
        else {
          if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
            return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
              current,
              workInProgress2,
              renderLanes2
            );
          didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
        }
      else
        didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
      workInProgress2.lanes = 0;
      switch (workInProgress2.tag) {
        case 16:
          a: {
            var props = workInProgress2.pendingProps;
            current = resolveLazy(workInProgress2.elementType);
            workInProgress2.type = current;
            if ("function" === typeof current)
              shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              ));
            else {
              if (void 0 !== current && null !== current) {
                var $$typeof = current.$$typeof;
                if ($$typeof === REACT_FORWARD_REF_TYPE) {
                  workInProgress2.tag = 11;
                  workInProgress2 = updateForwardRef(
                    null,
                    workInProgress2,
                    current,
                    props,
                    renderLanes2
                  );
                  break a;
                } else if ($$typeof === REACT_MEMO_TYPE) {
                  workInProgress2.tag = 14;
                  workInProgress2 = updateMemoComponent(
                    null,
                    workInProgress2,
                    current,
                    props,
                    renderLanes2
                  );
                  break a;
                }
              }
              workInProgress2 = getComponentNameFromType(current) || current;
              throw Error(formatProdErrorMessage(306, workInProgress2, ""));
            }
          }
          return workInProgress2;
        case 0:
          return updateFunctionComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 1:
          return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
            props,
            workInProgress2.pendingProps
          ), updateClassComponent(
            current,
            workInProgress2,
            props,
            $$typeof,
            renderLanes2
          );
        case 3:
          a: {
            pushHostContainer(
              workInProgress2,
              workInProgress2.stateNode.containerInfo
            );
            if (null === current) throw Error(formatProdErrorMessage(387));
            props = workInProgress2.pendingProps;
            var prevState = workInProgress2.memoizedState;
            $$typeof = prevState.element;
            cloneUpdateQueue(current, workInProgress2);
            processUpdateQueue(workInProgress2, props, null, renderLanes2);
            var nextState = workInProgress2.memoizedState;
            props = nextState.cache;
            pushProvider(workInProgress2, CacheContext, props);
            props !== prevState.cache && propagateContextChanges(
              workInProgress2,
              [CacheContext],
              renderLanes2,
              true
            );
            suspendIfUpdateReadFromEntangledAsyncAction();
            props = nextState.element;
            if (prevState.isDehydrated)
              if (prevState = {
                element: props,
                isDehydrated: false,
                cache: nextState.cache
              }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
                workInProgress2 = mountHostRootWithoutHydrating(
                  current,
                  workInProgress2,
                  props,
                  renderLanes2
                );
                break a;
              } else if (props !== $$typeof) {
                $$typeof = createCapturedValueAtFiber(
                  Error(formatProdErrorMessage(424)),
                  workInProgress2
                );
                queueHydrationError($$typeof);
                workInProgress2 = mountHostRootWithoutHydrating(
                  current,
                  workInProgress2,
                  props,
                  renderLanes2
                );
                break a;
              } else {
                current = workInProgress2.stateNode.containerInfo;
                switch (current.nodeType) {
                  case 9:
                    current = current.body;
                    break;
                  default:
                    current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
                }
                nextHydratableInstance = getNextHydratable(current.firstChild);
                hydrationParentFiber = workInProgress2;
                isHydrating = true;
                hydrationErrors = null;
                rootOrSingletonContext = true;
                renderLanes2 = mountChildFibers(
                  workInProgress2,
                  null,
                  props,
                  renderLanes2
                );
                for (workInProgress2.child = renderLanes2; renderLanes2; )
                  renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
              }
            else {
              resetHydrationState();
              if (props === $$typeof) {
                workInProgress2 = bailoutOnAlreadyFinishedWork(
                  current,
                  workInProgress2,
                  renderLanes2
                );
                break a;
              }
              reconcileChildren(current, workInProgress2, props, renderLanes2);
            }
            workInProgress2 = workInProgress2.child;
          }
          return workInProgress2;
        case 26:
          return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
            workInProgress2.type,
            null,
            workInProgress2.pendingProps,
            null
          )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
            rootInstanceStackCursor.current
          ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
            workInProgress2.type,
            current.memoizedProps,
            workInProgress2.pendingProps,
            current.memoizedState
          ), null;
        case 27:
          return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
            workInProgress2.type,
            workInProgress2.pendingProps,
            rootInstanceStackCursor.current
          ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
        case 5:
          if (null === current && isHydrating) {
            if ($$typeof = props = nextHydratableInstance)
              props = canHydrateInstance(
                props,
                workInProgress2.type,
                workInProgress2.pendingProps,
                rootOrSingletonContext
              ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
            $$typeof || throwOnHydrationMismatch(workInProgress2);
          }
          pushHostContext(workInProgress2);
          $$typeof = workInProgress2.type;
          prevState = workInProgress2.pendingProps;
          nextState = null !== current ? current.memoizedProps : null;
          props = prevState.children;
          shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
          null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
            current,
            workInProgress2,
            TransitionAwareHostComponent,
            null,
            null,
            renderLanes2
          ), HostTransitionContext._currentValue = $$typeof);
          markRef(current, workInProgress2);
          reconcileChildren(current, workInProgress2, props, renderLanes2);
          return workInProgress2.child;
        case 6:
          if (null === current && isHydrating) {
            if (current = renderLanes2 = nextHydratableInstance)
              renderLanes2 = canHydrateTextInstance(
                renderLanes2,
                workInProgress2.pendingProps,
                rootOrSingletonContext
              ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
            current || throwOnHydrationMismatch(workInProgress2);
          }
          return null;
        case 13:
          return updateSuspenseComponent(current, workInProgress2, renderLanes2);
        case 4:
          return pushHostContainer(
            workInProgress2,
            workInProgress2.stateNode.containerInfo
          ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
            workInProgress2,
            null,
            props,
            renderLanes2
          ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
        case 11:
          return updateForwardRef(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 7:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps,
            renderLanes2
          ), workInProgress2.child;
        case 8:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 12:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 10:
          return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
        case 9:
          return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
        case 14:
          return updateMemoComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 15:
          return updateSimpleMemoComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 19:
          return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
        case 31:
          return updateActivityComponent(current, workInProgress2, renderLanes2);
        case 22:
          return updateOffscreenComponent(
            current,
            workInProgress2,
            renderLanes2,
            workInProgress2.pendingProps
          );
        case 24:
          return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
            workInProgress2,
            [CacheContext],
            renderLanes2,
            true
          ))), reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 29:
          throw workInProgress2.pendingProps;
      }
      throw Error(formatProdErrorMessage(156, workInProgress2.tag));
    }
    function markUpdate(workInProgress2) {
      workInProgress2.flags |= 4;
    }
    function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
      if (type = 0 !== (workInProgress2.mode & 32)) type = false;
      if (type) {
        if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
          if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
          else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
          else
            throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
      } else workInProgress2.flags &= -16777217;
    }
    function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
      if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
        workInProgress2.flags &= -16777217;
      else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
        if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
        else
          throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    }
    function scheduleRetryEffect(workInProgress2, retryQueue) {
      null !== retryQueue && (workInProgress2.flags |= 4);
      workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
    }
    function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
      if (!isHydrating)
        switch (renderState.tailMode) {
          case "hidden":
            hasRenderedATailFallback = renderState.tail;
            for (var lastTailNode = null; null !== hasRenderedATailFallback; )
              null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
            null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
            break;
          case "collapsed":
            lastTailNode = renderState.tail;
            for (var lastTailNode$106 = null; null !== lastTailNode; )
              null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
            null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
        }
    }
    function bubbleProperties(completedWork) {
      var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
      if (didBailout)
        for (var child$107 = completedWork.child; null !== child$107; )
          newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
      else
        for (child$107 = completedWork.child; null !== child$107; )
          newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
      completedWork.subtreeFlags |= subtreeFlags;
      completedWork.childLanes = newChildLanes;
      return didBailout;
    }
    function completeWork(current, workInProgress2, renderLanes2) {
      var newProps = workInProgress2.pendingProps;
      popTreeContext(workInProgress2);
      switch (workInProgress2.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return bubbleProperties(workInProgress2), null;
        case 1:
          return bubbleProperties(workInProgress2), null;
        case 3:
          renderLanes2 = workInProgress2.stateNode;
          newProps = null;
          null !== current && (newProps = current.memoizedState.cache);
          workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
          popProvider(CacheContext);
          popHostContainer();
          renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
          if (null === current || null === current.child)
            popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
          bubbleProperties(workInProgress2);
          return null;
        case 26:
          var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
          null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            type,
            null,
            newProps,
            renderLanes2
          ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            type,
            current,
            newProps,
            renderLanes2
          ));
          return null;
        case 27:
          popHostContext(workInProgress2);
          renderLanes2 = rootInstanceStackCursor.current;
          type = workInProgress2.type;
          if (null !== current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if (!newProps) {
              if (null === workInProgress2.stateNode)
                throw Error(formatProdErrorMessage(166));
              bubbleProperties(workInProgress2);
              return null;
            }
            current = contextStackCursor.current;
            popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2, current) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
          }
          bubbleProperties(workInProgress2);
          return null;
        case 5:
          popHostContext(workInProgress2);
          type = workInProgress2.type;
          if (null !== current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if (!newProps) {
              if (null === workInProgress2.stateNode)
                throw Error(formatProdErrorMessage(166));
              bubbleProperties(workInProgress2);
              return null;
            }
            nextResource = contextStackCursor.current;
            if (popHydrationState(workInProgress2))
              prepareToHydrateHostInstance(workInProgress2, nextResource);
            else {
              var ownerDocument = getOwnerDocumentFromRootContainer(
                rootInstanceStackCursor.current
              );
              switch (nextResource) {
                case 1:
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/2000/svg",
                    type
                  );
                  break;
                case 2:
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/1998/Math/MathML",
                    type
                  );
                  break;
                default:
                  switch (type) {
                    case "svg":
                      nextResource = ownerDocument.createElementNS(
                        "http://www.w3.org/2000/svg",
                        type
                      );
                      break;
                    case "math":
                      nextResource = ownerDocument.createElementNS(
                        "http://www.w3.org/1998/Math/MathML",
                        type
                      );
                      break;
                    case "script":
                      nextResource = ownerDocument.createElement("div");
                      nextResource.innerHTML = "<script><\/script>";
                      nextResource = nextResource.removeChild(
                        nextResource.firstChild
                      );
                      break;
                    case "select":
                      nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                        is: newProps.is
                      }) : ownerDocument.createElement("select");
                      newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                      break;
                    default:
                      nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                  }
              }
              nextResource[internalInstanceKey] = workInProgress2;
              nextResource[internalPropsKey] = newProps;
              a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
                if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                  nextResource.appendChild(ownerDocument.stateNode);
                else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                  ownerDocument.child.return = ownerDocument;
                  ownerDocument = ownerDocument.child;
                  continue;
                }
                if (ownerDocument === workInProgress2) break a;
                for (; null === ownerDocument.sibling; ) {
                  if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                    break a;
                  ownerDocument = ownerDocument.return;
                }
                ownerDocument.sibling.return = ownerDocument.return;
                ownerDocument = ownerDocument.sibling;
              }
              workInProgress2.stateNode = nextResource;
              a: switch (setInitialProperties(nextResource, type, newProps), type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  newProps = !!newProps.autoFocus;
                  break a;
                case "img":
                  newProps = true;
                  break a;
                default:
                  newProps = false;
              }
              newProps && markUpdate(workInProgress2);
            }
          }
          bubbleProperties(workInProgress2);
          preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            workInProgress2.type,
            null === current ? null : current.memoizedProps,
            workInProgress2.pendingProps,
            renderLanes2
          );
          return null;
        case 6:
          if (current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if ("string" !== typeof newProps && null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            current = rootInstanceStackCursor.current;
            if (popHydrationState(workInProgress2)) {
              current = workInProgress2.stateNode;
              renderLanes2 = workInProgress2.memoizedProps;
              newProps = null;
              type = hydrationParentFiber;
              if (null !== type)
                switch (type.tag) {
                  case 27:
                  case 5:
                    newProps = type.memoizedProps;
                }
              current[internalInstanceKey] = workInProgress2;
              current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
              current || throwOnHydrationMismatch(workInProgress2, true);
            } else
              current = getOwnerDocumentFromRootContainer(current).createTextNode(
                newProps
              ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
          }
          bubbleProperties(workInProgress2);
          return null;
        case 31:
          renderLanes2 = workInProgress2.memoizedState;
          if (null === current || null !== current.memoizedState) {
            newProps = popHydrationState(workInProgress2);
            if (null !== renderLanes2) {
              if (null === current) {
                if (!newProps) throw Error(formatProdErrorMessage(318));
                current = workInProgress2.memoizedState;
                current = null !== current ? current.dehydrated : null;
                if (!current) throw Error(formatProdErrorMessage(557));
                current[internalInstanceKey] = workInProgress2;
              } else
                resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
              bubbleProperties(workInProgress2);
              current = false;
            } else
              renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
            if (!current) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              popSuspenseHandler(workInProgress2);
              return null;
            }
            if (0 !== (workInProgress2.flags & 128))
              throw Error(formatProdErrorMessage(558));
          }
          bubbleProperties(workInProgress2);
          return null;
        case 13:
          newProps = workInProgress2.memoizedState;
          if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
            type = popHydrationState(workInProgress2);
            if (null !== newProps && null !== newProps.dehydrated) {
              if (null === current) {
                if (!type) throw Error(formatProdErrorMessage(318));
                type = workInProgress2.memoizedState;
                type = null !== type ? type.dehydrated : null;
                if (!type) throw Error(formatProdErrorMessage(317));
                type[internalInstanceKey] = workInProgress2;
              } else
                resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
              bubbleProperties(workInProgress2);
              type = false;
            } else
              type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
            if (!type) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              popSuspenseHandler(workInProgress2);
              return null;
            }
          }
          popSuspenseHandler(workInProgress2);
          if (0 !== (workInProgress2.flags & 128))
            return workInProgress2.lanes = renderLanes2, workInProgress2;
          renderLanes2 = null !== newProps;
          current = null !== current && null !== current.memoizedState;
          renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
          renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
          scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
          bubbleProperties(workInProgress2);
          return null;
        case 4:
          return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
        case 10:
          return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
        case 19:
          pop(suspenseStackCursor);
          newProps = workInProgress2.memoizedState;
          if (null === newProps) return bubbleProperties(workInProgress2), null;
          type = 0 !== (workInProgress2.flags & 128);
          nextResource = newProps.rendering;
          if (null === nextResource)
            if (type) cutOffTailIfNeeded(newProps, false);
            else {
              if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
                for (current = workInProgress2.child; null !== current; ) {
                  nextResource = findFirstSuspended(current);
                  if (null !== nextResource) {
                    workInProgress2.flags |= 128;
                    cutOffTailIfNeeded(newProps, false);
                    current = nextResource.updateQueue;
                    workInProgress2.updateQueue = current;
                    scheduleRetryEffect(workInProgress2, current);
                    workInProgress2.subtreeFlags = 0;
                    current = renderLanes2;
                    for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                      resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                    push(
                      suspenseStackCursor,
                      suspenseStackCursor.current & 1 | 2
                    );
                    isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                    return workInProgress2.child;
                  }
                  current = current.sibling;
                }
              null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
            }
          else {
            if (!type)
              if (current = findFirstSuspended(nextResource), null !== current) {
                if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
                  return bubbleProperties(workInProgress2), null;
              } else
                2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
            newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
          }
          if (null !== newProps.tail)
            return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
              suspenseStackCursor,
              type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
            ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
          bubbleProperties(workInProgress2);
          return null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
        case 24:
          return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(formatProdErrorMessage(156, workInProgress2.tag));
    }
    function unwindWork(current, workInProgress2) {
      popTreeContext(workInProgress2);
      switch (workInProgress2.tag) {
        case 1:
          return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 3:
          return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 26:
        case 27:
        case 5:
          return popHostContext(workInProgress2), null;
        case 31:
          if (null !== workInProgress2.memoizedState) {
            popSuspenseHandler(workInProgress2);
            if (null === workInProgress2.alternate)
              throw Error(formatProdErrorMessage(340));
            resetHydrationState();
          }
          current = workInProgress2.flags;
          return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 13:
          popSuspenseHandler(workInProgress2);
          current = workInProgress2.memoizedState;
          if (null !== current && null !== current.dehydrated) {
            if (null === workInProgress2.alternate)
              throw Error(formatProdErrorMessage(340));
            resetHydrationState();
          }
          current = workInProgress2.flags;
          return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 19:
          return pop(suspenseStackCursor), null;
        case 4:
          return popHostContainer(), null;
        case 10:
          return popProvider(workInProgress2.type), null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 24:
          return popProvider(CacheContext), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function unwindInterruptedWork(current, interruptedWork) {
      popTreeContext(interruptedWork);
      switch (interruptedWork.tag) {
        case 3:
          popProvider(CacheContext);
          popHostContainer();
          break;
        case 26:
        case 27:
        case 5:
          popHostContext(interruptedWork);
          break;
        case 4:
          popHostContainer();
          break;
        case 31:
          null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
          break;
        case 13:
          popSuspenseHandler(interruptedWork);
          break;
        case 19:
          pop(suspenseStackCursor);
          break;
        case 10:
          popProvider(interruptedWork.type);
          break;
        case 22:
        case 23:
          popSuspenseHandler(interruptedWork);
          popHiddenContext();
          null !== current && pop(resumedCache);
          break;
        case 24:
          popProvider(CacheContext);
      }
    }
    function commitHookEffectListMount(flags, finishedWork) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags) {
              lastEffect = void 0;
              var create = updateQueue.create, inst = updateQueue.inst;
              lastEffect = create();
              inst.destroy = lastEffect;
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags) {
              var inst = updateQueue.inst, destroy = inst.destroy;
              if (void 0 !== destroy) {
                inst.destroy = void 0;
                lastEffect = finishedWork;
                var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
                try {
                  destroy_();
                } catch (error) {
                  captureCommitPhaseError(
                    lastEffect,
                    nearestMountedAncestor,
                    error
                  );
                }
              }
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitClassCallbacks(finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      if (null !== updateQueue) {
        var instance = finishedWork.stateNode;
        try {
          commitCallbacks(updateQueue, instance);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
    function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
      instance.props = resolveClassComponentProps(
        current.type,
        current.memoizedProps
      );
      instance.state = current.memoizedState;
      try {
        instance.componentWillUnmount();
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    }
    function safelyAttachRef(current, nearestMountedAncestor) {
      try {
        var ref = current.ref;
        if (null !== ref) {
          switch (current.tag) {
            case 26:
            case 27:
            case 5:
              var instanceToUse = current.stateNode;
              break;
            case 30:
              instanceToUse = current.stateNode;
              break;
            default:
              instanceToUse = current.stateNode;
          }
          "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    }
    function safelyDetachRef(current, nearestMountedAncestor) {
      var ref = current.ref, refCleanup = current.refCleanup;
      if (null !== ref)
        if ("function" === typeof refCleanup)
          try {
            refCleanup();
          } catch (error) {
            captureCommitPhaseError(current, nearestMountedAncestor, error);
          } finally {
            current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
          }
        else if ("function" === typeof ref)
          try {
            ref(null);
          } catch (error$140) {
            captureCommitPhaseError(current, nearestMountedAncestor, error$140);
          }
        else ref.current = null;
    }
    function commitHostMount(finishedWork) {
      var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
      try {
        a: switch (type) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            props.autoFocus && instance.focus();
            break a;
          case "img":
            props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitHostUpdate(finishedWork, newProps, oldProps) {
      try {
        var domElement = finishedWork.stateNode;
        updateProperties(domElement, finishedWork.type, oldProps, newProps);
        domElement[internalPropsKey] = newProps;
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function isHostParent(fiber) {
      return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
    }
    function getHostSibling(fiber) {
      a: for (; ; ) {
        for (; null === fiber.sibling; ) {
          if (null === fiber.return || isHostParent(fiber.return)) return null;
          fiber = fiber.return;
        }
        fiber.sibling.return = fiber.return;
        for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
          if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
          if (fiber.flags & 2) continue a;
          if (null === fiber.child || 4 === fiber.tag) continue a;
          else fiber.child.return = fiber, fiber = fiber.child;
        }
        if (!(fiber.flags & 2)) return fiber.stateNode;
      }
    }
    function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
      var tag = node.tag;
      if (5 === tag || 6 === tag)
        node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
      else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
        for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
          insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
    }
    function insertOrAppendPlacementNode(node, before, parent) {
      var tag = node.tag;
      if (5 === tag || 6 === tag)
        node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
      else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
        for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
          insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
    }
    function commitHostSingletonAcquisition(finishedWork) {
      var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
      try {
        for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
          singleton.removeAttributeNode(attributes[0]);
        setInitialProperties(singleton, type, props);
        singleton[internalInstanceKey] = finishedWork;
        singleton[internalPropsKey] = props;
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    var offscreenSubtreeIsHidden = false;
    var offscreenSubtreeWasHidden = false;
    var needsFormReset = false;
    var PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set;
    var nextEffect = null;
    function commitBeforeMutationEffects(root2, firstChild) {
      root2 = root2.containerInfo;
      eventsEnabled = _enabled;
      root2 = getActiveElementDeep(root2);
      if (hasSelectionCapabilities(root2)) {
        if ("selectionStart" in root2)
          var JSCompiler_temp = {
            start: root2.selectionStart,
            end: root2.selectionEnd
          };
        else
          a: {
            JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
            var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
            if (selection && 0 !== selection.rangeCount) {
              JSCompiler_temp = selection.anchorNode;
              var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
              selection = selection.focusOffset;
              try {
                JSCompiler_temp.nodeType, focusNode.nodeType;
              } catch (e$20) {
                JSCompiler_temp = null;
                break a;
              }
              var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
              b: for (; ; ) {
                for (var next; ; ) {
                  node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                  node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                  3 === node.nodeType && (length += node.nodeValue.length);
                  if (null === (next = node.firstChild)) break;
                  parentNode = node;
                  node = next;
                }
                for (; ; ) {
                  if (node === root2) break b;
                  parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                  parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                  if (null !== (next = node.nextSibling)) break;
                  node = parentNode;
                  parentNode = node.parentNode;
                }
                node = next;
              }
              JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
            } else JSCompiler_temp = null;
          }
        JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
      } else JSCompiler_temp = null;
      selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
      _enabled = false;
      for (nextEffect = firstChild; null !== nextEffect; )
        if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
          root2.return = firstChild, nextEffect = root2;
        else
          for (; null !== nextEffect; ) {
            firstChild = nextEffect;
            focusNode = firstChild.alternate;
            root2 = firstChild.flags;
            switch (firstChild.tag) {
              case 0:
                if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
                  for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                    anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (0 !== (root2 & 1024) && null !== focusNode) {
                  root2 = void 0;
                  JSCompiler_temp = firstChild;
                  anchorOffset = focusNode.memoizedProps;
                  focusNode = focusNode.memoizedState;
                  selection = JSCompiler_temp.stateNode;
                  try {
                    var resolvedPrevProps = resolveClassComponentProps(
                      JSCompiler_temp.type,
                      anchorOffset
                    );
                    root2 = selection.getSnapshotBeforeUpdate(
                      resolvedPrevProps,
                      focusNode
                    );
                    selection.__reactInternalSnapshotBeforeUpdate = root2;
                  } catch (error) {
                    captureCommitPhaseError(
                      JSCompiler_temp,
                      JSCompiler_temp.return,
                      error
                    );
                  }
                }
                break;
              case 3:
                if (0 !== (root2 & 1024)) {
                  if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                    clearContainerSparingly(root2);
                  else if (1 === JSCompiler_temp)
                    switch (root2.nodeName) {
                      case "HEAD":
                      case "HTML":
                      case "BODY":
                        clearContainerSparingly(root2);
                        break;
                      default:
                        root2.textContent = "";
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
            }
            root2 = firstChild.sibling;
            if (null !== root2) {
              root2.return = firstChild.return;
              nextEffect = root2;
              break;
            }
            nextEffect = firstChild.return;
          }
    }
    function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
      var flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitHookEffectListMount(5, finishedWork);
          break;
        case 1:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          if (flags & 4)
            if (finishedRoot = finishedWork.stateNode, null === current)
              try {
                finishedRoot.componentDidMount();
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            else {
              var prevProps = resolveClassComponentProps(
                finishedWork.type,
                current.memoizedProps
              );
              current = current.memoizedState;
              try {
                finishedRoot.componentDidUpdate(
                  prevProps,
                  current,
                  finishedRoot.__reactInternalSnapshotBeforeUpdate
                );
              } catch (error$139) {
                captureCommitPhaseError(
                  finishedWork,
                  finishedWork.return,
                  error$139
                );
              }
            }
          flags & 64 && commitClassCallbacks(finishedWork);
          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 3:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
            current = null;
            if (null !== finishedWork.child)
              switch (finishedWork.child.tag) {
                case 27:
                case 5:
                  current = finishedWork.child.stateNode;
                  break;
                case 1:
                  current = finishedWork.child.stateNode;
              }
            try {
              commitCallbacks(finishedRoot, current);
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          break;
        case 27:
          null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          null === current && flags & 4 && commitHostMount(finishedWork);
          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          break;
        case 31:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
            null,
            finishedWork
          ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
          break;
        case 22:
          flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
          if (!flags) {
            current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
            prevProps = offscreenSubtreeIsHidden;
            var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = flags;
            (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              0 !== (finishedWork.subtreeFlags & 8772)
            ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            offscreenSubtreeIsHidden = prevProps;
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          }
          break;
        case 30:
          break;
        default:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      }
    }
    function detachFiberAfterEffects(fiber) {
      var alternate = fiber.alternate;
      null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
      fiber.child = null;
      fiber.deletions = null;
      fiber.sibling = null;
      5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
      fiber.stateNode = null;
      fiber.return = null;
      fiber.dependencies = null;
      fiber.memoizedProps = null;
      fiber.memoizedState = null;
      fiber.pendingProps = null;
      fiber.stateNode = null;
      fiber.updateQueue = null;
    }
    var hostParent = null;
    var hostParentIsContainer = false;
    function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
      for (parent = parent.child; null !== parent; )
        commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
    }
    function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
      if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
        try {
          injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
        } catch (err) {
        }
      switch (deletedFiber.tag) {
        case 26:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
          break;
        case 27:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
          var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
          isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          releaseSingletonInstance(deletedFiber.stateNode);
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          break;
        case 5:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        case 6:
          prevHostParent = hostParent;
          prevHostParentIsContainer = hostParentIsContainer;
          hostParent = null;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          if (null !== hostParent)
            if (hostParentIsContainer)
              try {
                (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
              } catch (error) {
                captureCommitPhaseError(
                  deletedFiber,
                  nearestMountedAncestor,
                  error
                );
              }
            else
              try {
                hostParent.removeChild(deletedFiber.stateNode);
              } catch (error) {
                captureCommitPhaseError(
                  deletedFiber,
                  nearestMountedAncestor,
                  error
                );
              }
          break;
        case 18:
          null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
            9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
            deletedFiber.stateNode
          ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
          break;
        case 4:
          prevHostParent = hostParent;
          prevHostParentIsContainer = hostParentIsContainer;
          hostParent = deletedFiber.stateNode.containerInfo;
          hostParentIsContainer = true;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
          offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 1:
          offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
            deletedFiber,
            nearestMountedAncestor,
            prevHostParent
          ));
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 21:
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 22:
          offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          offscreenSubtreeWasHidden = prevHostParent;
          break;
        default:
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
      }
    }
    function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
      if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
        finishedRoot = finishedRoot.dehydrated;
        try {
          retryIfBlockedOn(finishedRoot);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
    function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
      if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
        try {
          retryIfBlockedOn(finishedRoot);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
    }
    function getRetryCache(finishedWork) {
      switch (finishedWork.tag) {
        case 31:
        case 13:
        case 19:
          var retryCache = finishedWork.stateNode;
          null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
          return retryCache;
        case 22:
          return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
        default:
          throw Error(formatProdErrorMessage(435, finishedWork.tag));
      }
    }
    function attachSuspenseRetryListeners(finishedWork, wakeables) {
      var retryCache = getRetryCache(finishedWork);
      wakeables.forEach(function(wakeable) {
        if (!retryCache.has(wakeable)) {
          retryCache.add(wakeable);
          var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
          wakeable.then(retry, retry);
        }
      });
    }
    function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
      var deletions = parentFiber.deletions;
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
          a: for (; null !== parent; ) {
            switch (parent.tag) {
              case 27:
                if (isSingletonScope(parent.type)) {
                  hostParent = parent.stateNode;
                  hostParentIsContainer = false;
                  break a;
                }
                break;
              case 5:
                hostParent = parent.stateNode;
                hostParentIsContainer = false;
                break a;
              case 3:
              case 4:
                hostParent = parent.stateNode.containerInfo;
                hostParentIsContainer = true;
                break a;
            }
            parent = parent.return;
          }
          if (null === hostParent) throw Error(formatProdErrorMessage(160));
          commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
          hostParent = null;
          hostParentIsContainer = false;
          root2 = childToDelete.alternate;
          null !== root2 && (root2.return = null);
          childToDelete.return = null;
        }
      if (parentFiber.subtreeFlags & 13886)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
    }
    var currentHoistableRoot = null;
    function commitMutationEffectsOnFiber(finishedWork, root2) {
      var current = finishedWork.alternate, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
          break;
        case 1:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
          break;
        case 26:
          var hoistableRoot = currentHoistableRoot;
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          if (flags & 4) {
            var currentResource = null !== current ? current.memoizedState : null;
            flags = finishedWork.memoizedState;
            if (null === current)
              if (null === flags)
                if (null === finishedWork.stateNode) {
                  a: {
                    flags = finishedWork.type;
                    current = finishedWork.memoizedProps;
                    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                    b: switch (flags) {
                      case "title":
                        currentResource = hoistableRoot.getElementsByTagName("title")[0];
                        if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                          currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                            currentResource,
                            hoistableRoot.querySelector("head > title")
                          );
                        setInitialProperties(currentResource, flags, current);
                        currentResource[internalInstanceKey] = finishedWork;
                        markNodeAsHoistable(currentResource);
                        flags = currentResource;
                        break a;
                      case "link":
                        var maybeNodes = getHydratableHoistableCache(
                          "link",
                          "href",
                          hoistableRoot
                        ).get(flags + (current.href || ""));
                        if (maybeNodes) {
                          for (var i = 0; i < maybeNodes.length; i++)
                            if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                              maybeNodes.splice(i, 1);
                              break b;
                            }
                        }
                        currentResource = hoistableRoot.createElement(flags);
                        setInitialProperties(currentResource, flags, current);
                        hoistableRoot.head.appendChild(currentResource);
                        break;
                      case "meta":
                        if (maybeNodes = getHydratableHoistableCache(
                          "meta",
                          "content",
                          hoistableRoot
                        ).get(flags + (current.content || ""))) {
                          for (i = 0; i < maybeNodes.length; i++)
                            if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                              maybeNodes.splice(i, 1);
                              break b;
                            }
                        }
                        currentResource = hoistableRoot.createElement(flags);
                        setInitialProperties(currentResource, flags, current);
                        hoistableRoot.head.appendChild(currentResource);
                        break;
                      default:
                        throw Error(formatProdErrorMessage(468, flags));
                    }
                    currentResource[internalInstanceKey] = finishedWork;
                    markNodeAsHoistable(currentResource);
                    flags = currentResource;
                  }
                  finishedWork.stateNode = flags;
                } else
                  mountHoistable(
                    hoistableRoot,
                    finishedWork.type,
                    finishedWork.stateNode
                  );
              else
                finishedWork.stateNode = acquireResource(
                  hoistableRoot,
                  flags,
                  finishedWork.memoizedProps
                );
            else
              currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
                hoistableRoot,
                finishedWork.type,
                finishedWork.stateNode
              ) : acquireResource(
                hoistableRoot,
                flags,
                finishedWork.memoizedProps
              )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
                finishedWork,
                finishedWork.memoizedProps,
                current.memoizedProps
              );
          }
          break;
        case 27:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          null !== current && flags & 4 && commitHostUpdate(
            finishedWork,
            finishedWork.memoizedProps,
            current.memoizedProps
          );
          break;
        case 5:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          if (finishedWork.flags & 32) {
            hoistableRoot = finishedWork.stateNode;
            try {
              setTextContent(hoistableRoot, "");
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
            finishedWork,
            hoistableRoot,
            null !== current ? current.memoizedProps : hoistableRoot
          ));
          flags & 1024 && (needsFormReset = true);
          break;
        case 6:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          if (flags & 4) {
            if (null === finishedWork.stateNode)
              throw Error(formatProdErrorMessage(162));
            flags = finishedWork.memoizedProps;
            current = finishedWork.stateNode;
            try {
              current.nodeValue = flags;
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          break;
        case 3:
          tagCaches = null;
          hoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(root2.containerInfo);
          recursivelyTraverseMutationEffects(root2, finishedWork);
          currentHoistableRoot = hoistableRoot;
          commitReconciliationEffects(finishedWork);
          if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
            try {
              retryIfBlockedOn(root2.containerInfo);
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
          break;
        case 4:
          flags = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(
            finishedWork.stateNode.containerInfo
          );
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          currentHoistableRoot = flags;
          break;
        case 12:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          break;
        case 31:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 13:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 22:
          hoistableRoot = null !== finishedWork.memoizedState;
          var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
          recursivelyTraverseMutationEffects(root2, finishedWork);
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
          commitReconciliationEffects(finishedWork);
          if (flags & 8192)
            a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
              if (5 === root2.tag || 26 === root2.tag) {
                if (null === current) {
                  wasHidden = current = root2;
                  try {
                    if (currentResource = wasHidden.stateNode, hoistableRoot)
                      maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                    else {
                      i = wasHidden.stateNode;
                      var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                      i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                    }
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if (6 === root2.tag) {
                if (null === current) {
                  wasHidden = root2;
                  try {
                    wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if (18 === root2.tag) {
                if (null === current) {
                  wasHidden = root2;
                  try {
                    var instance = wasHidden.stateNode;
                    hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
                root2.child.return = root2;
                root2 = root2.child;
                continue;
              }
              if (root2 === finishedWork) break a;
              for (; null === root2.sibling; ) {
                if (null === root2.return || root2.return === finishedWork) break a;
                current === root2 && (current = null);
                root2 = root2.return;
              }
              current === root2 && (current = null);
              root2.sibling.return = root2.return;
              root2 = root2.sibling;
            }
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
          break;
        case 19:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
      }
    }
    function commitReconciliationEffects(finishedWork) {
      var flags = finishedWork.flags;
      if (flags & 2) {
        try {
          for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
            if (isHostParent(parentFiber)) {
              hostParentFiber = parentFiber;
              break;
            }
            parentFiber = parentFiber.return;
          }
          if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
          switch (hostParentFiber.tag) {
            case 27:
              var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
              insertOrAppendPlacementNode(finishedWork, before, parent);
              break;
            case 5:
              var parent$141 = hostParentFiber.stateNode;
              hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
              var before$142 = getHostSibling(finishedWork);
              insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
              break;
            case 3:
            case 4:
              var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
              insertOrAppendPlacementNodeIntoContainer(
                finishedWork,
                before$144,
                parent$143
              );
              break;
            default:
              throw Error(formatProdErrorMessage(161));
          }
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
        finishedWork.flags &= -3;
      }
      flags & 4096 && (finishedWork.flags &= -4097);
    }
    function recursivelyResetForms(parentFiber) {
      if (parentFiber.subtreeFlags & 1024)
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var fiber = parentFiber;
          recursivelyResetForms(fiber);
          5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
          parentFiber = parentFiber.sibling;
        }
    }
    function recursivelyTraverseLayoutEffects(root2, parentFiber) {
      if (parentFiber.subtreeFlags & 8772)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
    }
    function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedWork = parentFiber;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 1:
            safelyDetachRef(finishedWork, finishedWork.return);
            var instance = finishedWork.stateNode;
            "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
              finishedWork,
              finishedWork.return,
              instance
            );
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 27:
            releaseSingletonInstance(finishedWork.stateNode);
          case 26:
          case 5:
            safelyDetachRef(finishedWork, finishedWork.return);
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 22:
            null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 30:
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          default:
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            commitHookEffectListMount(4, finishedWork);
            break;
          case 1:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            current = finishedWork;
            finishedRoot = current.stateNode;
            if ("function" === typeof finishedRoot.componentDidMount)
              try {
                finishedRoot.componentDidMount();
              } catch (error) {
                captureCommitPhaseError(current, current.return, error);
              }
            current = finishedWork;
            finishedRoot = current.updateQueue;
            if (null !== finishedRoot) {
              var instance = current.stateNode;
              try {
                var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
                if (null !== hiddenCallbacks)
                  for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                    callCallback(hiddenCallbacks[finishedRoot], instance);
              } catch (error) {
                captureCommitPhaseError(current, current.return, error);
              }
            }
            includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 27:
            commitHostSingletonAcquisition(finishedWork);
          case 26:
          case 5:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 12:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            break;
          case 31:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
            break;
          case 13:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
            break;
          case 22:
            null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 30:
            break;
          default:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function commitOffscreenPassiveMountEffects(current, finishedWork) {
      var previousCache = null;
      null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
      current = null;
      null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
      current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
    }
    function commitCachePassiveMountEffect(current, finishedWork) {
      current = null;
      null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
      finishedWork = finishedWork.memoizedState.cache;
      finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
    }
    function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitPassiveMountOnFiber(
            root2,
            parentFiber,
            committedLanes,
            committedTransitions
          ), parentFiber = parentFiber.sibling;
    }
    function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
      var flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && commitHookEffectListMount(9, finishedWork);
          break;
        case 1:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 3:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
          break;
        case 12:
          if (flags & 2048) {
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            finishedRoot = finishedWork.stateNode;
            try {
              var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
              "function" === typeof onPostCommit && onPostCommit(
                id,
                null === finishedWork.alternate ? "mount" : "update",
                finishedRoot.passiveEffectDuration,
                -0
              );
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          } else
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
          break;
        case 31:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 13:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 23:
          break;
        case 22:
          _finishedWork$memoize2 = finishedWork.stateNode;
          id = finishedWork.alternate;
          null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            0 !== (finishedWork.subtreeFlags & 10256) || false
          ));
          flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
          break;
        case 24:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
      }
    }
    function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
            commitHookEffectListMount(8, finishedWork);
            break;
          case 23:
            break;
          case 22:
            var instance = finishedWork.stateNode;
            null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            ) : recursivelyTraverseAtomicPassiveEffects(
              finishedRoot,
              finishedWork
            ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            ));
            includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
              finishedWork.alternate,
              finishedWork
            );
            break;
          case 24:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
          switch (finishedWork.tag) {
            case 22:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              flags & 2048 && commitOffscreenPassiveMountEffects(
                finishedWork.alternate,
                finishedWork
              );
              break;
            case 24:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
              break;
            default:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
          }
          parentFiber = parentFiber.sibling;
        }
    }
    var suspenseyCommitFlag = 8192;
    function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
      if (parentFiber.subtreeFlags & suspenseyCommitFlag)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          accumulateSuspenseyCommitOnFiber(
            parentFiber,
            committedLanes,
            suspendedState
          ), parentFiber = parentFiber.sibling;
    }
    function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
      switch (fiber.tag) {
        case 26:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
            suspendedState,
            currentHoistableRoot,
            fiber.memoizedState,
            fiber.memoizedProps
          );
          break;
        case 5:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          break;
        case 3:
        case 4:
          var previousHoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          currentHoistableRoot = previousHoistableRoot;
          break;
        case 22:
          null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          ));
          break;
        default:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
      }
    }
    function detachAlternateSiblings(parentFiber) {
      var previousFiber = parentFiber.alternate;
      if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
        previousFiber.child = null;
        do
          previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
        while (null !== parentFiber);
      }
    }
    function recursivelyTraversePassiveUnmountEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions)
          for (var i = 0; i < deletions.length; i++) {
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
              childToDelete,
              parentFiber
            );
          }
        detachAlternateSiblings(parentFiber);
      }
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
    }
    function commitPassiveUnmountOnFiber(finishedWork) {
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
          break;
        case 3:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        case 12:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        case 22:
          var instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        default:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
      }
    }
    function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions)
          for (var i = 0; i < deletions.length; i++) {
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
              childToDelete,
              parentFiber
            );
          }
        detachAlternateSiblings(parentFiber);
      }
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        deletions = parentFiber;
        switch (deletions.tag) {
          case 0:
          case 11:
          case 15:
            commitHookEffectListUnmount(8, deletions, deletions.return);
            recursivelyTraverseDisconnectPassiveEffects(deletions);
            break;
          case 22:
            i = deletions.stateNode;
            i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
            break;
          default:
            recursivelyTraverseDisconnectPassiveEffects(deletions);
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
      for (; null !== nextEffect; ) {
        var fiber = nextEffect;
        switch (fiber.tag) {
          case 0:
          case 11:
          case 15:
            commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
            break;
          case 23:
          case 22:
            if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
              var cache = fiber.memoizedState.cachePool.pool;
              null != cache && cache.refCount++;
            }
            break;
          case 24:
            releaseCache(fiber.memoizedState.cache);
        }
        cache = fiber.child;
        if (null !== cache) cache.return = fiber, nextEffect = cache;
        else
          a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
            cache = nextEffect;
            var sibling = cache.sibling, returnFiber = cache.return;
            detachFiberAfterEffects(cache);
            if (cache === fiber) {
              nextEffect = null;
              break a;
            }
            if (null !== sibling) {
              sibling.return = returnFiber;
              nextEffect = sibling;
              break a;
            }
            nextEffect = returnFiber;
          }
      }
    }
    var DefaultAsyncDispatcher = {
      getCacheForType: function(resourceType) {
        var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
        void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
        return cacheForType;
      },
      cacheSignal: function() {
        return readContext(CacheContext).controller.signal;
      }
    };
    var PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map;
    var executionContext = 0;
    var workInProgressRoot = null;
    var workInProgress = null;
    var workInProgressRootRenderLanes = 0;
    var workInProgressSuspendedReason = 0;
    var workInProgressThrownValue = null;
    var workInProgressRootDidSkipSuspendedSiblings = false;
    var workInProgressRootIsPrerendering = false;
    var workInProgressRootDidAttachPingListener = false;
    var entangledRenderLanes = 0;
    var workInProgressRootExitStatus = 0;
    var workInProgressRootSkippedLanes = 0;
    var workInProgressRootInterleavedUpdatedLanes = 0;
    var workInProgressRootPingedLanes = 0;
    var workInProgressDeferredLane = 0;
    var workInProgressSuspendedRetryLanes = 0;
    var workInProgressRootConcurrentErrors = null;
    var workInProgressRootRecoverableErrors = null;
    var workInProgressRootDidIncludeRecursiveRenderUpdate = false;
    var globalMostRecentFallbackTime = 0;
    var globalMostRecentTransitionTime = 0;
    var workInProgressRootRenderTargetTime = Infinity;
    var workInProgressTransitions = null;
    var legacyErrorBoundariesThatAlreadyFailed = null;
    var pendingEffectsStatus = 0;
    var pendingEffectsRoot = null;
    var pendingFinishedWork = null;
    var pendingEffectsLanes = 0;
    var pendingEffectsRemainingLanes = 0;
    var pendingPassiveTransitions = null;
    var pendingRecoverableErrors = null;
    var nestedUpdateCount = 0;
    var rootWithNestedUpdates = null;
    function requestUpdateLane() {
      return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
    }
    function requestDeferredLane() {
      if (0 === workInProgressDeferredLane)
        if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
          var lane = nextTransitionDeferredLane;
          nextTransitionDeferredLane <<= 1;
          0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
          workInProgressDeferredLane = lane;
        } else workInProgressDeferredLane = 536870912;
      lane = suspenseHandlerStackCursor.current;
      null !== lane && (lane.flags |= 32);
      return workInProgressDeferredLane;
    }
    function scheduleUpdateOnFiber(root2, fiber, lane) {
      if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
        prepareFreshStack(root2, 0), markRootSuspended(
          root2,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          false
        );
      markRootUpdated$1(root2, lane);
      if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
        root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
          root2,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          false
        )), ensureRootIsScheduled(root2);
    }
    function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
      var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
      do {
        if (0 === exitStatus) {
          workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
          break;
        } else {
          forceSync = root$jscomp$0.current.alternate;
          if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
            exitStatus = renderRootSync(root$jscomp$0, lanes, false);
            renderWasConcurrent = false;
            continue;
          }
          if (2 === exitStatus) {
            renderWasConcurrent = lanes;
            if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
              var JSCompiler_inline_result = 0;
            else
              JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
            if (0 !== JSCompiler_inline_result) {
              lanes = JSCompiler_inline_result;
              a: {
                var root2 = root$jscomp$0;
                exitStatus = workInProgressRootConcurrentErrors;
                var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
                wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
                JSCompiler_inline_result = renderRootSync(
                  root2,
                  JSCompiler_inline_result,
                  false
                );
                if (2 !== JSCompiler_inline_result) {
                  if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                    root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                    workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                    exitStatus = 4;
                    break a;
                  }
                  renderWasConcurrent = workInProgressRootRecoverableErrors;
                  workInProgressRootRecoverableErrors = exitStatus;
                  null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                    workInProgressRootRecoverableErrors,
                    renderWasConcurrent
                  ));
                }
                exitStatus = JSCompiler_inline_result;
              }
              renderWasConcurrent = false;
              if (2 !== exitStatus) continue;
            }
          }
          if (1 === exitStatus) {
            prepareFreshStack(root$jscomp$0, 0);
            markRootSuspended(root$jscomp$0, lanes, 0, true);
            break;
          }
          a: {
            shouldTimeSlice = root$jscomp$0;
            renderWasConcurrent = exitStatus;
            switch (renderWasConcurrent) {
              case 0:
              case 1:
                throw Error(formatProdErrorMessage(345));
              case 4:
                if ((lanes & 4194048) !== lanes) break;
              case 6:
                markRootSuspended(
                  shouldTimeSlice,
                  lanes,
                  workInProgressDeferredLane,
                  !workInProgressRootDidSkipSuspendedSiblings
                );
                break a;
              case 2:
                workInProgressRootRecoverableErrors = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(formatProdErrorMessage(329));
            }
            if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
              markRootSuspended(
                shouldTimeSlice,
                lanes,
                workInProgressDeferredLane,
                !workInProgressRootDidSkipSuspendedSiblings
              );
              if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
              pendingEffectsLanes = lanes;
              shouldTimeSlice.timeoutHandle = scheduleTimeout(
                commitRootWhenReady.bind(
                  null,
                  shouldTimeSlice,
                  forceSync,
                  workInProgressRootRecoverableErrors,
                  workInProgressTransitions,
                  workInProgressRootDidIncludeRecursiveRenderUpdate,
                  lanes,
                  workInProgressDeferredLane,
                  workInProgressRootInterleavedUpdatedLanes,
                  workInProgressSuspendedRetryLanes,
                  workInProgressRootDidSkipSuspendedSiblings,
                  renderWasConcurrent,
                  "Throttled",
                  -0,
                  0
                ),
                exitStatus
              );
              break a;
            }
            commitRootWhenReady(
              shouldTimeSlice,
              forceSync,
              workInProgressRootRecoverableErrors,
              workInProgressTransitions,
              workInProgressRootDidIncludeRecursiveRenderUpdate,
              lanes,
              workInProgressDeferredLane,
              workInProgressRootInterleavedUpdatedLanes,
              workInProgressSuspendedRetryLanes,
              workInProgressRootDidSkipSuspendedSiblings,
              renderWasConcurrent,
              null,
              -0,
              0
            );
          }
        }
        break;
      } while (1);
      ensureRootIsScheduled(root$jscomp$0);
    }
    function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
      root2.timeoutHandle = -1;
      suspendedCommitReason = finishedWork.subtreeFlags;
      if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
        suspendedCommitReason = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: noop$1
        };
        accumulateSuspenseyCommitOnFiber(
          finishedWork,
          lanes,
          suspendedCommitReason
        );
        var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
        timeoutOffset = waitForCommitToBeReady(
          suspendedCommitReason,
          timeoutOffset
        );
        if (null !== timeoutOffset) {
          pendingEffectsLanes = lanes;
          root2.cancelPendingCommit = timeoutOffset(
            commitRoot.bind(
              null,
              root2,
              finishedWork,
              lanes,
              recoverableErrors,
              transitions,
              didIncludeRenderPhaseUpdate,
              spawnedLane,
              updatedLanes,
              suspendedRetryLanes,
              exitStatus,
              suspendedCommitReason,
              null,
              completedRenderStartTime,
              completedRenderEndTime
            )
          );
          markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
          return;
        }
      }
      commitRoot(
        root2,
        finishedWork,
        lanes,
        recoverableErrors,
        transitions,
        didIncludeRenderPhaseUpdate,
        spawnedLane,
        updatedLanes,
        suspendedRetryLanes
      );
    }
    function isRenderConsistentWithExternalStores(finishedWork) {
      for (var node = finishedWork; ; ) {
        var tag = node.tag;
        if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
          for (var i = 0; i < tag.length; i++) {
            var check = tag[i], getSnapshot = check.getSnapshot;
            check = check.value;
            try {
              if (!objectIs(getSnapshot(), check)) return false;
            } catch (error) {
              return false;
            }
          }
        tag = node.child;
        if (node.subtreeFlags & 16384 && null !== tag)
          tag.return = node, node = tag;
        else {
          if (node === finishedWork) break;
          for (; null === node.sibling; ) {
            if (null === node.return || node.return === finishedWork) return true;
            node = node.return;
          }
          node.sibling.return = node.return;
          node = node.sibling;
        }
      }
      return true;
    }
    function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
      suspendedLanes &= ~workInProgressRootPingedLanes;
      suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
      root2.suspendedLanes |= suspendedLanes;
      root2.pingedLanes &= ~suspendedLanes;
      didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
      didAttemptEntireTree = root2.expirationTimes;
      for (var lanes = suspendedLanes; 0 < lanes; ) {
        var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
        didAttemptEntireTree[index$6] = -1;
        lanes &= ~lane;
      }
      0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
    }
    function flushSyncWork$1() {
      return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0, false), false) : true;
    }
    function resetWorkInProgressStack() {
      if (null !== workInProgress) {
        if (0 === workInProgressSuspendedReason)
          var interruptedWork = workInProgress.return;
        else
          interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
        for (; null !== interruptedWork; )
          unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
        workInProgress = null;
      }
    }
    function prepareFreshStack(root2, lanes) {
      var timeoutHandle = root2.timeoutHandle;
      -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
      timeoutHandle = root2.cancelPendingCommit;
      null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
      pendingEffectsLanes = 0;
      resetWorkInProgressStack();
      workInProgressRoot = root2;
      workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
      workInProgressRootRenderLanes = lanes;
      workInProgressSuspendedReason = 0;
      workInProgressThrownValue = null;
      workInProgressRootDidSkipSuspendedSiblings = false;
      workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
      workInProgressRootDidAttachPingListener = false;
      workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
      workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
      workInProgressRootDidIncludeRecursiveRenderUpdate = false;
      0 !== (lanes & 8) && (lanes |= lanes & 32);
      var allEntangledLanes = root2.entangledLanes;
      if (0 !== allEntangledLanes)
        for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
          var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
          lanes |= root2[index$4];
          allEntangledLanes &= ~lane;
        }
      entangledRenderLanes = lanes;
      finishQueueingConcurrentUpdates();
      return timeoutHandle;
    }
    function handleThrow(root2, thrownValue) {
      currentlyRenderingFiber = null;
      ReactSharedInternals.H = ContextOnlyDispatcher;
      thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
      workInProgressThrownValue = thrownValue;
      null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
        root2,
        createCapturedValueAtFiber(thrownValue, root2.current)
      ));
    }
    function shouldRemainOnPreviousScreen() {
      var handler = suspenseHandlerStackCursor.current;
      return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
    }
    function pushDispatcher() {
      var prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = ContextOnlyDispatcher;
      return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
    }
    function pushAsyncDispatcher() {
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      return prevAsyncDispatcher;
    }
    function renderDidSuspendDelayIfPossible() {
      workInProgressRootExitStatus = 4;
      workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
      0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
        workInProgressRoot,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      );
    }
    function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
      var prevExecutionContext = executionContext;
      executionContext |= 2;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
        workInProgressTransitions = null, prepareFreshStack(root2, lanes);
      lanes = false;
      var exitStatus = workInProgressRootExitStatus;
      a: do
        try {
          if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
            switch (workInProgressSuspendedReason) {
              case 8:
                resetWorkInProgressStack();
                exitStatus = 6;
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                null === suspenseHandlerStackCursor.current && (lanes = true);
                var reason = workInProgressSuspendedReason;
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
                if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                  exitStatus = 0;
                  break a;
                }
                break;
              default:
                reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
            }
          }
          workLoopSync();
          exitStatus = workInProgressRootExitStatus;
          break;
        } catch (thrownValue$165) {
          handleThrow(root2, thrownValue$165);
        }
      while (1);
      lanes && root2.shellSuspendCounter++;
      lastContextDependency = currentlyRenderingFiber$1 = null;
      executionContext = prevExecutionContext;
      ReactSharedInternals.H = prevDispatcher;
      ReactSharedInternals.A = prevAsyncDispatcher;
      null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
      return exitStatus;
    }
    function workLoopSync() {
      for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
    }
    function renderRootConcurrent(root2, lanes) {
      var prevExecutionContext = executionContext;
      executionContext |= 2;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
        root2,
        lanes
      );
      a: do
        try {
          if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            lanes = workInProgress;
            var thrownValue = workInProgressThrownValue;
            b: switch (workInProgressSuspendedReason) {
              case 1:
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
                break;
              case 2:
              case 9:
                if (isThenableResolved(thrownValue)) {
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  replaySuspendedUnitOfWork(lanes);
                  break;
                }
                lanes = function() {
                  2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                  ensureRootIsScheduled(root2);
                };
                thrownValue.then(lanes, lanes);
                break a;
              case 3:
                workInProgressSuspendedReason = 7;
                break a;
              case 4:
                workInProgressSuspendedReason = 5;
                break a;
              case 7:
                isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
                break;
              case 5:
                var resource = null;
                switch (workInProgress.tag) {
                  case 26:
                    resource = workInProgress.memoizedState;
                  case 5:
                  case 27:
                    var hostFiber = workInProgress;
                    if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                      workInProgressSuspendedReason = 0;
                      workInProgressThrownValue = null;
                      var sibling = hostFiber.sibling;
                      if (null !== sibling) workInProgress = sibling;
                      else {
                        var returnFiber = hostFiber.return;
                        null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                      }
                      break b;
                    }
                }
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
                break;
              case 6:
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
                break;
              case 8:
                resetWorkInProgressStack();
                workInProgressRootExitStatus = 6;
                break a;
              default:
                throw Error(formatProdErrorMessage(462));
            }
          }
          workLoopConcurrentByScheduler();
          break;
        } catch (thrownValue$167) {
          handleThrow(root2, thrownValue$167);
        }
      while (1);
      lastContextDependency = currentlyRenderingFiber$1 = null;
      ReactSharedInternals.H = prevDispatcher;
      ReactSharedInternals.A = prevAsyncDispatcher;
      executionContext = prevExecutionContext;
      if (null !== workInProgress) return 0;
      workInProgressRoot = null;
      workInProgressRootRenderLanes = 0;
      finishQueueingConcurrentUpdates();
      return workInProgressRootExitStatus;
    }
    function workLoopConcurrentByScheduler() {
      for (; null !== workInProgress && !shouldYield(); )
        performUnitOfWork(workInProgress);
    }
    function performUnitOfWork(unitOfWork) {
      var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
      unitOfWork.memoizedProps = unitOfWork.pendingProps;
      null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
    }
    function replaySuspendedUnitOfWork(unitOfWork) {
      var next = unitOfWork;
      var current = next.alternate;
      switch (next.tag) {
        case 15:
        case 0:
          next = replayFunctionComponent(
            current,
            next,
            next.pendingProps,
            next.type,
            void 0,
            workInProgressRootRenderLanes
          );
          break;
        case 11:
          next = replayFunctionComponent(
            current,
            next,
            next.pendingProps,
            next.type.render,
            next.ref,
            workInProgressRootRenderLanes
          );
          break;
        case 5:
          resetHooksOnUnwind(next);
        default:
          unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
      }
      unitOfWork.memoizedProps = unitOfWork.pendingProps;
      null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
    }
    function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
      lastContextDependency = currentlyRenderingFiber$1 = null;
      resetHooksOnUnwind(unitOfWork);
      thenableState$1 = null;
      thenableIndexCounter$1 = 0;
      var returnFiber = unitOfWork.return;
      try {
        if (throwException(
          root2,
          returnFiber,
          unitOfWork,
          thrownValue,
          workInProgressRootRenderLanes
        )) {
          workInProgressRootExitStatus = 1;
          logUncaughtError(
            root2,
            createCapturedValueAtFiber(thrownValue, root2.current)
          );
          workInProgress = null;
          return;
        }
      } catch (error) {
        if (null !== returnFiber) throw workInProgress = returnFiber, error;
        workInProgressRootExitStatus = 1;
        logUncaughtError(
          root2,
          createCapturedValueAtFiber(thrownValue, root2.current)
        );
        workInProgress = null;
        return;
      }
      if (unitOfWork.flags & 32768) {
        if (isHydrating || 1 === suspendedReason) root2 = true;
        else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
          root2 = false;
        else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
          suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
        unwindUnitOfWork(unitOfWork, root2);
      } else completeUnitOfWork(unitOfWork);
    }
    function completeUnitOfWork(unitOfWork) {
      var completedWork = unitOfWork;
      do {
        if (0 !== (completedWork.flags & 32768)) {
          unwindUnitOfWork(
            completedWork,
            workInProgressRootDidSkipSuspendedSiblings
          );
          return;
        }
        unitOfWork = completedWork.return;
        var next = completeWork(
          completedWork.alternate,
          completedWork,
          entangledRenderLanes
        );
        if (null !== next) {
          workInProgress = next;
          return;
        }
        completedWork = completedWork.sibling;
        if (null !== completedWork) {
          workInProgress = completedWork;
          return;
        }
        workInProgress = completedWork = unitOfWork;
      } while (null !== completedWork);
      0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
    }
    function unwindUnitOfWork(unitOfWork, skipSiblings) {
      do {
        var next = unwindWork(unitOfWork.alternate, unitOfWork);
        if (null !== next) {
          next.flags &= 32767;
          workInProgress = next;
          return;
        }
        next = unitOfWork.return;
        null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
        if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
          workInProgress = unitOfWork;
          return;
        }
        workInProgress = unitOfWork = next;
      } while (null !== unitOfWork);
      workInProgressRootExitStatus = 6;
      workInProgress = null;
    }
    function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
      root2.cancelPendingCommit = null;
      do
        flushPendingEffects();
      while (0 !== pendingEffectsStatus);
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
      if (null !== finishedWork) {
        if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
        didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
        didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
        markRootFinished(
          root2,
          lanes,
          didIncludeRenderPhaseUpdate,
          spawnedLane,
          updatedLanes,
          suspendedRetryLanes
        );
        root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
        pendingFinishedWork = finishedWork;
        pendingEffectsRoot = root2;
        pendingEffectsLanes = lanes;
        pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
        pendingPassiveTransitions = transitions;
        pendingRecoverableErrors = recoverableErrors;
        0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
          flushPassiveEffects();
          return null;
        })) : (root2.callbackNode = null, root2.callbackPriority = 0);
        recoverableErrors = 0 !== (finishedWork.flags & 13878);
        if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
          recoverableErrors = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          transitions = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          spawnedLane = executionContext;
          executionContext |= 4;
          try {
            commitBeforeMutationEffects(root2, finishedWork, lanes);
          } finally {
            executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
          }
        }
        pendingEffectsStatus = 1;
        flushMutationEffects();
        flushLayoutEffects();
        flushSpawnedWork();
      }
    }
    function flushMutationEffects() {
      if (1 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
        if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
          rootMutationHasEffect = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          var previousPriority = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          var prevExecutionContext = executionContext;
          executionContext |= 4;
          try {
            commitMutationEffectsOnFiber(finishedWork, root2);
            var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
            if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
              priorFocusedElem.ownerDocument.documentElement,
              priorFocusedElem
            )) {
              if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
                var start = priorSelectionRange.start, end = priorSelectionRange.end;
                void 0 === end && (end = start);
                if ("selectionStart" in priorFocusedElem)
                  priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                    end,
                    priorFocusedElem.value.length
                  );
                else {
                  var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                  if (win.getSelection) {
                    var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                    !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                    var startMarker = getNodeForCharacterOffset(
                      priorFocusedElem,
                      start$jscomp$0
                    ), endMarker = getNodeForCharacterOffset(
                      priorFocusedElem,
                      end$jscomp$0
                    );
                    if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                      var range = doc.createRange();
                      range.setStart(startMarker.node, startMarker.offset);
                      selection.removeAllRanges();
                      start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                    }
                  }
                }
              }
              doc = [];
              for (selection = priorFocusedElem; selection = selection.parentNode; )
                1 === selection.nodeType && doc.push({
                  element: selection,
                  left: selection.scrollLeft,
                  top: selection.scrollTop
                });
              "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
              for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
                var info = doc[priorFocusedElem];
                info.element.scrollLeft = info.left;
                info.element.scrollTop = info.top;
              }
            }
            _enabled = !!eventsEnabled;
            selectionInformation = eventsEnabled = null;
          } finally {
            executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
          }
        }
        root2.current = finishedWork;
        pendingEffectsStatus = 2;
      }
    }
    function flushLayoutEffects() {
      if (2 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
        if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
          rootHasLayoutEffect = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          var previousPriority = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          var prevExecutionContext = executionContext;
          executionContext |= 4;
          try {
            commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
          } finally {
            executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
          }
        }
        pendingEffectsStatus = 3;
      }
    }
    function flushSpawnedWork() {
      if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        requestPaint();
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
        0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
        var remainingLanes = root2.pendingLanes;
        0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
        lanesToEventPriority(lanes);
        finishedWork = finishedWork.stateNode;
        if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
          try {
            injectedHook.onCommitFiberRoot(
              rendererID,
              finishedWork,
              void 0,
              128 === (finishedWork.current.flags & 128)
            );
          } catch (err) {
          }
        if (null !== recoverableErrors) {
          finishedWork = ReactSharedInternals.T;
          remainingLanes = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          ReactSharedInternals.T = null;
          try {
            for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
              var recoverableError = recoverableErrors[i];
              onRecoverableError(recoverableError.value, {
                componentStack: recoverableError.stack
              });
            }
          } finally {
            ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
          }
        }
        0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
        ensureRootIsScheduled(root2);
        remainingLanes = root2.pendingLanes;
        0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
        flushSyncWorkAcrossRoots_impl(0, false);
      }
    }
    function releaseRootPooledCache(root2, remainingLanes) {
      0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
    }
    function flushPendingEffects() {
      flushMutationEffects();
      flushLayoutEffects();
      flushSpawnedWork();
      return flushPassiveEffects();
    }
    function flushPassiveEffects() {
      if (5 !== pendingEffectsStatus) return false;
      var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
      pendingEffectsRemainingLanes = 0;
      var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
        ReactSharedInternals.T = null;
        renderPriority = pendingPassiveTransitions;
        pendingPassiveTransitions = null;
        var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
        pendingEffectsStatus = 0;
        pendingFinishedWork = pendingEffectsRoot = null;
        pendingEffectsLanes = 0;
        if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        commitPassiveUnmountOnFiber(root$jscomp$0.current);
        commitPassiveMountOnFiber(
          root$jscomp$0,
          root$jscomp$0.current,
          lanes,
          renderPriority
        );
        executionContext = prevExecutionContext;
        flushSyncWorkAcrossRoots_impl(0, false);
        if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
          try {
            injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
          } catch (err) {
          }
        return true;
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
      }
    }
    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
      sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
      sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
      rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
      null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
    }
    function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
      if (3 === sourceFiber.tag)
        captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
      else
        for (; null !== nearestMountedAncestor; ) {
          if (3 === nearestMountedAncestor.tag) {
            captureCommitPhaseErrorOnRoot(
              nearestMountedAncestor,
              sourceFiber,
              error
            );
            break;
          } else if (1 === nearestMountedAncestor.tag) {
            var instance = nearestMountedAncestor.stateNode;
            if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
              sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
              error = createClassErrorUpdate(2);
              instance = enqueueUpdate(nearestMountedAncestor, error, 2);
              null !== instance && (initializeClassErrorUpdate(
                error,
                instance,
                nearestMountedAncestor,
                sourceFiber
              ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
              break;
            }
          }
          nearestMountedAncestor = nearestMountedAncestor.return;
        }
    }
    function attachPingListener(root2, wakeable, lanes) {
      var pingCache = root2.pingCache;
      if (null === pingCache) {
        pingCache = root2.pingCache = new PossiblyWeakMap();
        var threadIDs = /* @__PURE__ */ new Set();
        pingCache.set(wakeable, threadIDs);
      } else
        threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
      threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
    }
    function pingSuspendedRoot(root2, wakeable, pingedLanes) {
      var pingCache = root2.pingCache;
      null !== pingCache && pingCache.delete(wakeable);
      root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
      root2.warmLanes &= ~pingedLanes;
      workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
      ensureRootIsScheduled(root2);
    }
    function retryTimedOutBoundary(boundaryFiber, retryLane) {
      0 === retryLane && (retryLane = claimNextRetryLane());
      boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
      null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
    }
    function retryDehydratedSuspenseBoundary(boundaryFiber) {
      var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
      null !== suspenseState && (retryLane = suspenseState.retryLane);
      retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function resolveRetryWakeable(boundaryFiber, wakeable) {
      var retryLane = 0;
      switch (boundaryFiber.tag) {
        case 31:
        case 13:
          var retryCache = boundaryFiber.stateNode;
          var suspenseState = boundaryFiber.memoizedState;
          null !== suspenseState && (retryLane = suspenseState.retryLane);
          break;
        case 19:
          retryCache = boundaryFiber.stateNode;
          break;
        case 22:
          retryCache = boundaryFiber.stateNode._retryCache;
          break;
        default:
          throw Error(formatProdErrorMessage(314));
      }
      null !== retryCache && retryCache.delete(wakeable);
      retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function scheduleCallback$1(priorityLevel, callback) {
      return scheduleCallback$3(priorityLevel, callback);
    }
    var firstScheduledRoot = null;
    var lastScheduledRoot = null;
    var didScheduleMicrotask = false;
    var mightHavePendingSyncWork = false;
    var isFlushingWork = false;
    var currentEventTransitionLane = 0;
    function ensureRootIsScheduled(root2) {
      root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
      mightHavePendingSyncWork = true;
      didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
    }
    function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
      if (!isFlushingWork && mightHavePendingSyncWork) {
        isFlushingWork = true;
        do {
          var didPerformSomeWork = false;
          for (var root$170 = firstScheduledRoot; null !== root$170; ) {
            if (!onlyLegacy)
              if (0 !== syncTransitionLanes) {
                var pendingLanes = root$170.pendingLanes;
                if (0 === pendingLanes) var JSCompiler_inline_result = 0;
                else {
                  var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
                  JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
                  JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
                  JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
                }
                0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
              } else
                JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
                  root$170,
                  root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
                  null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
                ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
            root$170 = root$170.next;
          }
        } while (didPerformSomeWork);
        isFlushingWork = false;
      }
    }
    function processRootScheduleInImmediateTask() {
      processRootScheduleInMicrotask();
    }
    function processRootScheduleInMicrotask() {
      mightHavePendingSyncWork = didScheduleMicrotask = false;
      var syncTransitionLanes = 0;
      0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
      for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
        var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
        if (0 === nextLanes)
          root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
        else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
          mightHavePendingSyncWork = true;
        root2 = next;
      }
      0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes, false);
      0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
    }
    function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
      for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
        var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
        if (-1 === expirationTime) {
          if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
            expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
        } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
        lanes &= ~lane;
      }
      currentTime = workInProgressRoot;
      suspendedLanes = workInProgressRootRenderLanes;
      suspendedLanes = getNextLanes(
        root2,
        root2 === currentTime ? suspendedLanes : 0,
        null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
      );
      pingedLanes = root2.callbackNode;
      if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
        return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
      if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
        currentTime = suspendedLanes & -suspendedLanes;
        if (currentTime === root2.callbackPriority) return currentTime;
        null !== pingedLanes && cancelCallback$1(pingedLanes);
        switch (lanesToEventPriority(suspendedLanes)) {
          case 2:
          case 8:
            suspendedLanes = UserBlockingPriority;
            break;
          case 32:
            suspendedLanes = NormalPriority$1;
            break;
          case 268435456:
            suspendedLanes = IdlePriority;
            break;
          default:
            suspendedLanes = NormalPriority$1;
        }
        pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
        suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
        root2.callbackPriority = currentTime;
        root2.callbackNode = suspendedLanes;
        return currentTime;
      }
      null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
      root2.callbackPriority = 2;
      root2.callbackNode = null;
      return 2;
    }
    function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
      if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
        return root2.callbackNode = null, root2.callbackPriority = 0, null;
      var originalCallbackNode = root2.callbackNode;
      if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
        return null;
      var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
      workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
        root2,
        root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
        null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
      );
      if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
      performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
      scheduleTaskForRootDuringMicrotask(root2, now());
      return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
    }
    function performSyncWorkOnRoot(root2, lanes) {
      if (flushPendingEffects()) return null;
      performWorkOnRoot(root2, lanes, true);
    }
    function scheduleImmediateRootScheduleTask() {
      scheduleMicrotask(function() {
        0 !== (executionContext & 6) ? scheduleCallback$3(
          ImmediatePriority,
          processRootScheduleInImmediateTask
        ) : processRootScheduleInMicrotask();
      });
    }
    function requestTransitionLane() {
      if (0 === currentEventTransitionLane) {
        var actionScopeLane = currentEntangledLane;
        0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
        currentEventTransitionLane = actionScopeLane;
      }
      return currentEventTransitionLane;
    }
    function coerceFormActionProp(actionProp) {
      return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
    }
    function createFormDataWithSubmitter(form, submitter) {
      var temp = submitter.ownerDocument.createElement("input");
      temp.name = submitter.name;
      temp.value = submitter.value;
      form.id && temp.setAttribute("form", form.id);
      submitter.parentNode.insertBefore(temp, submitter);
      form = new FormData(form);
      temp.parentNode.removeChild(temp);
      return form;
    }
    function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
      if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
        var action = coerceFormActionProp(
          (nativeEventTarget[internalPropsKey] || null).action
        ), submitter = nativeEvent.submitter;
        submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
        var event = new SyntheticEvent(
          "action",
          "action",
          null,
          nativeEvent,
          nativeEventTarget
        );
        dispatchQueue.push({
          event,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (nativeEvent.defaultPrevented) {
                  if (0 !== currentEventTransitionLane) {
                    var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                    startHostTransition(
                      maybeTargetInst,
                      {
                        pending: true,
                        data: formData,
                        method: nativeEventTarget.method,
                        action
                      },
                      null,
                      formData
                    );
                  }
                } else
                  "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                    maybeTargetInst,
                    {
                      pending: true,
                      data: formData,
                      method: nativeEventTarget.method,
                      action
                    },
                    action,
                    formData
                  ));
              },
              currentTarget: nativeEventTarget
            }
          ]
        });
      }
    }
    for (i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
      eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
      registerSimpleEvent(
        domEventName$jscomp$inline_1579,
        "on" + capitalizedEvent$jscomp$inline_1580
      );
    }
    var eventName$jscomp$inline_1578;
    var domEventName$jscomp$inline_1579;
    var capitalizedEvent$jscomp$inline_1580;
    var i$jscomp$inline_1577;
    registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
    registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
    registerSimpleEvent(ANIMATION_START, "onAnimationStart");
    registerSimpleEvent("dblclick", "onDoubleClick");
    registerSimpleEvent("focusin", "onFocus");
    registerSimpleEvent("focusout", "onBlur");
    registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
    registerSimpleEvent(TRANSITION_START, "onTransitionStart");
    registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
    registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
    registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
    registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
    registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
    registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
    registerTwoPhaseEvent(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(" ")
    );
    registerTwoPhaseEvent(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    );
    registerTwoPhaseEvent("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]);
    registerTwoPhaseEvent(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    );
    registerTwoPhaseEvent(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    );
    registerTwoPhaseEvent(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
    var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    );
    var nonDelegatedEvents = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
    );
    function processDispatchQueue(dispatchQueue, eventSystemFlags) {
      eventSystemFlags = 0 !== (eventSystemFlags & 4);
      for (var i = 0; i < dispatchQueue.length; i++) {
        var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
        _dispatchQueue$i = _dispatchQueue$i.listeners;
        a: {
          var previousInstance = void 0;
          if (eventSystemFlags)
            for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
              var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
              _dispatchListeners$i = _dispatchListeners$i.listener;
              if (instance !== previousInstance && event.isPropagationStopped())
                break a;
              previousInstance = _dispatchListeners$i;
              event.currentTarget = currentTarget;
              try {
                previousInstance(event);
              } catch (error) {
                reportGlobalError(error);
              }
              event.currentTarget = null;
              previousInstance = instance;
            }
          else
            for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
              _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
              instance = _dispatchListeners$i.instance;
              currentTarget = _dispatchListeners$i.currentTarget;
              _dispatchListeners$i = _dispatchListeners$i.listener;
              if (instance !== previousInstance && event.isPropagationStopped())
                break a;
              previousInstance = _dispatchListeners$i;
              event.currentTarget = currentTarget;
              try {
                previousInstance(event);
              } catch (error) {
                reportGlobalError(error);
              }
              event.currentTarget = null;
              previousInstance = instance;
            }
        }
      }
    }
    function listenToNonDelegatedEvent(domEventName, targetElement) {
      var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
      void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
      var listenerSetKey = domEventName + "__bubble";
      JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
    }
    function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
      var eventSystemFlags = 0;
      isCapturePhaseListener && (eventSystemFlags |= 4);
      addTrappedEventListener(
        target,
        domEventName,
        eventSystemFlags,
        isCapturePhaseListener
      );
    }
    var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
    function listenToAllSupportedEvents(rootContainerElement) {
      if (!rootContainerElement[listeningMarker]) {
        rootContainerElement[listeningMarker] = true;
        allNativeEvents.forEach(function(domEventName) {
          "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
        });
        var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
        null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
      }
    }
    function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
      switch (getEventPriority(domEventName)) {
        case 2:
          var listenerWrapper = dispatchDiscreteEvent;
          break;
        case 8:
          listenerWrapper = dispatchContinuousEvent;
          break;
        default:
          listenerWrapper = dispatchEvent;
      }
      eventSystemFlags = listenerWrapper.bind(
        null,
        domEventName,
        eventSystemFlags,
        targetContainer
      );
      listenerWrapper = void 0;
      !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
      isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        capture: true,
        passive: listenerWrapper
      }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        passive: listenerWrapper
      }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
    }
    function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
      var ancestorInst = targetInst$jscomp$0;
      if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
        a: for (; ; ) {
          if (null === targetInst$jscomp$0) return;
          var nodeTag = targetInst$jscomp$0.tag;
          if (3 === nodeTag || 4 === nodeTag) {
            var container = targetInst$jscomp$0.stateNode.containerInfo;
            if (container === targetContainer) break;
            if (4 === nodeTag)
              for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
                var grandTag = nodeTag.tag;
                if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                  return;
                nodeTag = nodeTag.return;
              }
            for (; null !== container; ) {
              nodeTag = getClosestInstanceFromNode(container);
              if (null === nodeTag) return;
              grandTag = nodeTag.tag;
              if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
                targetInst$jscomp$0 = ancestorInst = nodeTag;
                continue a;
              }
              container = container.parentNode;
            }
          }
          targetInst$jscomp$0 = targetInst$jscomp$0.return;
        }
      batchedUpdates$1(function() {
        var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
        a: {
          var reactName = topLevelEventsToReactNames.get(domEventName);
          if (void 0 !== reactName) {
            var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
            switch (domEventName) {
              case "keypress":
                if (0 === getEventCharCode(nativeEvent)) break a;
              case "keydown":
              case "keyup":
                SyntheticEventCtor = SyntheticKeyboardEvent;
                break;
              case "focusin":
                reactEventType = "focus";
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "focusout":
                reactEventType = "blur";
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "beforeblur":
              case "afterblur":
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "click":
                if (2 === nativeEvent.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                SyntheticEventCtor = SyntheticMouseEvent;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                SyntheticEventCtor = SyntheticDragEvent;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                SyntheticEventCtor = SyntheticTouchEvent;
                break;
              case ANIMATION_END:
              case ANIMATION_ITERATION:
              case ANIMATION_START:
                SyntheticEventCtor = SyntheticAnimationEvent;
                break;
              case TRANSITION_END:
                SyntheticEventCtor = SyntheticTransitionEvent;
                break;
              case "scroll":
              case "scrollend":
                SyntheticEventCtor = SyntheticUIEvent;
                break;
              case "wheel":
                SyntheticEventCtor = SyntheticWheelEvent;
                break;
              case "copy":
              case "cut":
              case "paste":
                SyntheticEventCtor = SyntheticClipboardEvent;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                SyntheticEventCtor = SyntheticPointerEvent;
                break;
              case "toggle":
              case "beforetoggle":
                SyntheticEventCtor = SyntheticToggleEvent;
            }
            var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
            inCapturePhase = [];
            for (var instance = targetInst, lastHostComponent; null !== instance; ) {
              var _instance = instance;
              lastHostComponent = _instance.stateNode;
              _instance = _instance.tag;
              5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
                createDispatchListener(instance, _instance, lastHostComponent)
              ));
              if (accumulateTargetOnly) break;
              instance = instance.return;
            }
            0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
              reactName,
              reactEventType,
              null,
              nativeEvent,
              nativeEventTarget
            ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
          }
        }
        if (0 === (eventSystemFlags & 7)) {
          a: {
            reactName = "mouseover" === domEventName || "pointerover" === domEventName;
            SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
            if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
              break a;
            if (SyntheticEventCtor || reactName) {
              reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
              if (SyntheticEventCtor) {
                if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                  reactEventType = null;
              } else SyntheticEventCtor = null, reactEventType = targetInst;
              if (SyntheticEventCtor !== reactEventType) {
                inCapturePhase = SyntheticMouseEvent;
                _instance = "onMouseLeave";
                reactEventName = "onMouseEnter";
                instance = "mouse";
                if ("pointerout" === domEventName || "pointerover" === domEventName)
                  inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
                accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
                lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
                reactName = new inCapturePhase(
                  _instance,
                  instance + "leave",
                  SyntheticEventCtor,
                  nativeEvent,
                  nativeEventTarget
                );
                reactName.target = accumulateTargetOnly;
                reactName.relatedTarget = lastHostComponent;
                _instance = null;
                getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
                  reactEventName,
                  instance + "enter",
                  reactEventType,
                  nativeEvent,
                  nativeEventTarget
                ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
                accumulateTargetOnly = _instance;
                if (SyntheticEventCtor && reactEventType)
                  b: {
                    inCapturePhase = getParent;
                    reactEventName = SyntheticEventCtor;
                    instance = reactEventType;
                    lastHostComponent = 0;
                    for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                      lastHostComponent++;
                    _instance = 0;
                    for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                      _instance++;
                    for (; 0 < lastHostComponent - _instance; )
                      reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                    for (; 0 < _instance - lastHostComponent; )
                      instance = inCapturePhase(instance), _instance--;
                    for (; lastHostComponent--; ) {
                      if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                        inCapturePhase = reactEventName;
                        break b;
                      }
                      reactEventName = inCapturePhase(reactEventName);
                      instance = inCapturePhase(instance);
                    }
                    inCapturePhase = null;
                  }
                else inCapturePhase = null;
                null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
                  dispatchQueue,
                  reactName,
                  SyntheticEventCtor,
                  inCapturePhase,
                  false
                );
                null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
                  dispatchQueue,
                  accumulateTargetOnly,
                  reactEventType,
                  inCapturePhase,
                  true
                );
              }
            }
          }
          a: {
            reactName = targetInst ? getNodeFromInstance(targetInst) : window;
            SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
            if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
              var getTargetInstFunc = getTargetInstForChangeEvent;
            else if (isTextInputElement(reactName))
              if (isInputEventSupported)
                getTargetInstFunc = getTargetInstForInputOrChangeEvent;
              else {
                getTargetInstFunc = getTargetInstForInputEventPolyfill;
                var handleEventFunc = handleEventsForInputEventPolyfill;
              }
            else
              SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
            if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
              createAndAccumulateChangeEvent(
                dispatchQueue,
                getTargetInstFunc,
                nativeEvent,
                nativeEventTarget
              );
              break a;
            }
            handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
            "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
          }
          handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
          switch (domEventName) {
            case "focusin":
              if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
                activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
              break;
            case "focusout":
              lastSelection = activeElementInst = activeElement = null;
              break;
            case "mousedown":
              mouseDown = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              mouseDown = false;
              constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
              break;
            case "selectionchange":
              if (skipSelectionChangeEvent) break;
            case "keydown":
            case "keyup":
              constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
          }
          var fallbackData;
          if (canUseCompositionEvent)
            b: {
              switch (domEventName) {
                case "compositionstart":
                  var eventType = "onCompositionStart";
                  break b;
                case "compositionend":
                  eventType = "onCompositionEnd";
                  break b;
                case "compositionupdate":
                  eventType = "onCompositionUpdate";
                  break b;
              }
              eventType = void 0;
            }
          else
            isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
          eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
            eventType,
            domEventName,
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
          if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
            eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
              "onBeforeInput",
              "beforeinput",
              null,
              nativeEvent,
              nativeEventTarget
            ), dispatchQueue.push({
              event: handleEventFunc,
              listeners: eventType
            }), handleEventFunc.data = fallbackData);
          extractEvents$1(
            dispatchQueue,
            domEventName,
            targetInst,
            nativeEvent,
            nativeEventTarget
          );
        }
        processDispatchQueue(dispatchQueue, eventSystemFlags);
      });
    }
    function createDispatchListener(instance, listener, currentTarget) {
      return {
        instance,
        listener,
        currentTarget
      };
    }
    function accumulateTwoPhaseListeners(targetFiber, reactName) {
      for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
        var _instance2 = targetFiber, stateNode = _instance2.stateNode;
        _instance2 = _instance2.tag;
        5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
          createDispatchListener(targetFiber, _instance2, stateNode)
        ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
          createDispatchListener(targetFiber, _instance2, stateNode)
        ));
        if (3 === targetFiber.tag) return listeners;
        targetFiber = targetFiber.return;
      }
      return [];
    }
    function getParent(inst) {
      if (null === inst) return null;
      do
        inst = inst.return;
      while (inst && 5 !== inst.tag && 27 !== inst.tag);
      return inst ? inst : null;
    }
    function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
      for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
        var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
        _instance3 = _instance3.tag;
        if (null !== alternate && alternate === common) break;
        5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
          createDispatchListener(target, stateNode, alternate)
        )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
          createDispatchListener(target, stateNode, alternate)
        )));
        target = target.return;
      }
      0 !== listeners.length && dispatchQueue.push({ event, listeners });
    }
    var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
    var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
    function normalizeMarkupForTextOrAttribute(markup) {
      return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
    }
    function checkForUnmatchedText(serverText, clientText) {
      clientText = normalizeMarkupForTextOrAttribute(clientText);
      return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
    }
    function setProp(domElement, tag, key, value, props, prevValue) {
      switch (key) {
        case "children":
          "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
          break;
        case "className":
          setValueForKnownAttribute(domElement, "class", value);
          break;
        case "tabIndex":
          setValueForKnownAttribute(domElement, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          setValueForKnownAttribute(domElement, key, value);
          break;
        case "style":
          setValueForStyles(domElement, value, prevValue);
          break;
        case "data":
          if ("object" !== tag) {
            setValueForKnownAttribute(domElement, "data", value);
            break;
          }
        case "src":
        case "href":
          if ("" === value && ("a" !== tag || "href" !== key)) {
            domElement.removeAttribute(key);
            break;
          }
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
            domElement.removeAttribute(key);
            break;
          }
          value = sanitizeURL("" + value);
          domElement.setAttribute(key, value);
          break;
        case "action":
        case "formAction":
          if ("function" === typeof value) {
            domElement.setAttribute(
              key,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            );
            break;
          } else
            "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
              domElement,
              tag,
              "formEncType",
              props.formEncType,
              props,
              null
            ), setProp(
              domElement,
              tag,
              "formMethod",
              props.formMethod,
              props,
              null
            ), setProp(
              domElement,
              tag,
              "formTarget",
              props.formTarget,
              props,
              null
            )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
          if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
            domElement.removeAttribute(key);
            break;
          }
          value = sanitizeURL("" + value);
          domElement.setAttribute(key, value);
          break;
        case "onClick":
          null != value && (domElement.onclick = noop$1);
          break;
        case "onScroll":
          null != value && listenToNonDelegatedEvent("scroll", domElement);
          break;
        case "onScrollEnd":
          null != value && listenToNonDelegatedEvent("scrollend", domElement);
          break;
        case "dangerouslySetInnerHTML":
          if (null != value) {
            if ("object" !== typeof value || !("__html" in value))
              throw Error(formatProdErrorMessage(61));
            key = value.__html;
            if (null != key) {
              if (null != props.children) throw Error(formatProdErrorMessage(60));
              domElement.innerHTML = key;
            }
          }
          break;
        case "multiple":
          domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
          break;
        case "muted":
          domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
            domElement.removeAttribute("xlink:href");
            break;
          }
          key = sanitizeURL("" + value);
          domElement.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            key
          );
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
          break;
        case "capture":
        case "download":
          true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
          break;
        case "rowSpan":
        case "start":
          null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
          break;
        case "popover":
          listenToNonDelegatedEvent("beforetoggle", domElement);
          listenToNonDelegatedEvent("toggle", domElement);
          setValueForAttribute(domElement, "popover", value);
          break;
        case "xlinkActuate":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:actuate",
            value
          );
          break;
        case "xlinkArcrole":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:arcrole",
            value
          );
          break;
        case "xlinkRole":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:role",
            value
          );
          break;
        case "xlinkShow":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:show",
            value
          );
          break;
        case "xlinkTitle":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:title",
            value
          );
          break;
        case "xlinkType":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:type",
            value
          );
          break;
        case "xmlBase":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:base",
            value
          );
          break;
        case "xmlLang":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:lang",
            value
          );
          break;
        case "xmlSpace":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:space",
            value
          );
          break;
        case "is":
          setValueForAttribute(domElement, "is", value);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
            key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
      }
    }
    function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
      switch (key) {
        case "style":
          setValueForStyles(domElement, value, prevValue);
          break;
        case "dangerouslySetInnerHTML":
          if (null != value) {
            if ("object" !== typeof value || !("__html" in value))
              throw Error(formatProdErrorMessage(61));
            key = value.__html;
            if (null != key) {
              if (null != props.children) throw Error(formatProdErrorMessage(60));
              domElement.innerHTML = key;
            }
          }
          break;
        case "children":
          "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
          break;
        case "onScroll":
          null != value && listenToNonDelegatedEvent("scroll", domElement);
          break;
        case "onScrollEnd":
          null != value && listenToNonDelegatedEvent("scrollend", domElement);
          break;
        case "onClick":
          null != value && (domElement.onclick = noop$1);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!registrationNameDependencies.hasOwnProperty(key))
            a: {
              if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
                "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
                domElement.addEventListener(tag, value, props);
                break a;
              }
              key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
            }
      }
    }
    function setInitialProperties(domElement, tag, props) {
      switch (tag) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          var hasSrc = false, hasSrcSet = false, propKey;
          for (propKey in props)
            if (props.hasOwnProperty(propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "src":
                    hasSrc = true;
                    break;
                  case "srcSet":
                    hasSrcSet = true;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(formatProdErrorMessage(137, tag));
                  default:
                    setProp(domElement, tag, propKey, propValue, props, null);
                }
            }
          hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
          hasSrc && setProp(domElement, tag, "src", props.src, props, null);
          return;
        case "input":
          listenToNonDelegatedEvent("invalid", domElement);
          var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
          for (hasSrc in props)
            if (props.hasOwnProperty(hasSrc)) {
              var propValue$184 = props[hasSrc];
              if (null != propValue$184)
                switch (hasSrc) {
                  case "name":
                    hasSrcSet = propValue$184;
                    break;
                  case "type":
                    propValue = propValue$184;
                    break;
                  case "checked":
                    checked = propValue$184;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$184;
                    break;
                  case "value":
                    propKey = propValue$184;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$184;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != propValue$184)
                      throw Error(formatProdErrorMessage(137, tag));
                    break;
                  default:
                    setProp(domElement, tag, hasSrc, propValue$184, props, null);
                }
            }
          initInput(
            domElement,
            propKey,
            defaultValue,
            checked,
            defaultChecked,
            propValue,
            hasSrcSet,
            false
          );
          return;
        case "select":
          listenToNonDelegatedEvent("invalid", domElement);
          hasSrc = propValue = propKey = null;
          for (hasSrcSet in props)
            if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
              switch (hasSrcSet) {
                case "value":
                  propKey = defaultValue;
                  break;
                case "defaultValue":
                  propValue = defaultValue;
                  break;
                case "multiple":
                  hasSrc = defaultValue;
                default:
                  setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
              }
          tag = propKey;
          props = propValue;
          domElement.multiple = !!hasSrc;
          null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
          return;
        case "textarea":
          listenToNonDelegatedEvent("invalid", domElement);
          propKey = hasSrcSet = hasSrc = null;
          for (propValue in props)
            if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
              switch (propValue) {
                case "value":
                  hasSrc = defaultValue;
                  break;
                case "defaultValue":
                  hasSrcSet = defaultValue;
                  break;
                case "children":
                  propKey = defaultValue;
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                  break;
                default:
                  setProp(domElement, tag, propValue, defaultValue, props, null);
              }
          initTextarea(domElement, hasSrc, hasSrcSet, propKey);
          return;
        case "option":
          for (checked in props)
            if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
              switch (checked) {
                case "selected":
                  domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                  break;
                default:
                  setProp(domElement, tag, checked, hasSrc, props, null);
              }
          return;
        case "dialog":
          listenToNonDelegatedEvent("beforetoggle", domElement);
          listenToNonDelegatedEvent("toggle", domElement);
          listenToNonDelegatedEvent("cancel", domElement);
          listenToNonDelegatedEvent("close", domElement);
          break;
        case "iframe":
        case "object":
          listenToNonDelegatedEvent("load", domElement);
          break;
        case "video":
        case "audio":
          for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
            listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
          break;
        case "image":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          break;
        case "details":
          listenToNonDelegatedEvent("toggle", domElement);
          break;
        case "embed":
        case "source":
        case "link":
          listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (defaultChecked in props)
            if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
              switch (defaultChecked) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(137, tag));
                default:
                  setProp(domElement, tag, defaultChecked, hasSrc, props, null);
              }
          return;
        default:
          if (isCustomElement(tag)) {
            for (propValue$184 in props)
              props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
                domElement,
                tag,
                propValue$184,
                hasSrc,
                props,
                void 0
              ));
            return;
          }
      }
      for (defaultValue in props)
        props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
    }
    function updateProperties(domElement, tag, lastProps, nextProps) {
      switch (tag) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
          for (propKey in lastProps) {
            var lastProp = lastProps[propKey];
            if (lastProps.hasOwnProperty(propKey) && null != lastProp)
              switch (propKey) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  lastDefaultValue = lastProp;
                default:
                  nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
              }
          }
          for (var propKey$201 in nextProps) {
            var propKey = nextProps[propKey$201];
            lastProp = lastProps[propKey$201];
            if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
              switch (propKey$201) {
                case "type":
                  type = propKey;
                  break;
                case "name":
                  name = propKey;
                  break;
                case "checked":
                  checked = propKey;
                  break;
                case "defaultChecked":
                  defaultChecked = propKey;
                  break;
                case "value":
                  value = propKey;
                  break;
                case "defaultValue":
                  defaultValue = propKey;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propKey)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  propKey !== lastProp && setProp(
                    domElement,
                    tag,
                    propKey$201,
                    propKey,
                    nextProps,
                    lastProp
                  );
              }
          }
          updateInput(
            domElement,
            value,
            defaultValue,
            lastDefaultValue,
            checked,
            defaultChecked,
            type,
            name
          );
          return;
        case "select":
          propKey = value = defaultValue = propKey$201 = null;
          for (type in lastProps)
            if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
              switch (type) {
                case "value":
                  break;
                case "multiple":
                  propKey = lastDefaultValue;
                default:
                  nextProps.hasOwnProperty(type) || setProp(
                    domElement,
                    tag,
                    type,
                    null,
                    nextProps,
                    lastDefaultValue
                  );
              }
          for (name in nextProps)
            if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
              switch (name) {
                case "value":
                  propKey$201 = type;
                  break;
                case "defaultValue":
                  defaultValue = type;
                  break;
                case "multiple":
                  value = type;
                default:
                  type !== lastDefaultValue && setProp(
                    domElement,
                    tag,
                    name,
                    type,
                    nextProps,
                    lastDefaultValue
                  );
              }
          tag = defaultValue;
          lastProps = value;
          nextProps = propKey;
          null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
          return;
        case "textarea":
          propKey = propKey$201 = null;
          for (defaultValue in lastProps)
            if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
              switch (defaultValue) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  setProp(domElement, tag, defaultValue, null, nextProps, name);
              }
          for (value in nextProps)
            if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
              switch (value) {
                case "value":
                  propKey$201 = name;
                  break;
                case "defaultValue":
                  propKey = name;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != name) throw Error(formatProdErrorMessage(91));
                  break;
                default:
                  name !== type && setProp(domElement, tag, value, name, nextProps, type);
              }
          updateTextarea(domElement, propKey$201, propKey);
          return;
        case "option":
          for (var propKey$217 in lastProps)
            if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
              switch (propKey$217) {
                case "selected":
                  domElement.selected = false;
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    propKey$217,
                    null,
                    nextProps,
                    propKey$201
                  );
              }
          for (lastDefaultValue in nextProps)
            if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
              switch (lastDefaultValue) {
                case "selected":
                  domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    lastDefaultValue,
                    propKey$201,
                    nextProps,
                    propKey
                  );
              }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var propKey$222 in lastProps)
            propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
          for (checked in nextProps)
            if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
              switch (checked) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propKey$201)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    checked,
                    propKey$201,
                    nextProps,
                    propKey
                  );
              }
          return;
        default:
          if (isCustomElement(tag)) {
            for (var propKey$227 in lastProps)
              propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
                domElement,
                tag,
                propKey$227,
                void 0,
                nextProps,
                propKey$201
              );
            for (defaultChecked in nextProps)
              propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
                domElement,
                tag,
                defaultChecked,
                propKey$201,
                nextProps,
                propKey
              );
            return;
          }
      }
      for (var propKey$232 in lastProps)
        propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
      for (lastProp in nextProps)
        propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
    }
    function isLikelyStaticResource(initiatorType) {
      switch (initiatorType) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function estimateBandwidth() {
      if ("function" === typeof performance.getEntriesByType) {
        for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
          var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
          if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
            initiatorType = 0;
            duration = entry.responseEnd;
            for (i += 1; i < resourceEntries.length; i++) {
              var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
              if (overlapStartTime > duration) break;
              var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
              overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
            }
            --i;
            bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
            count++;
            if (10 < count) break;
          }
        }
        if (0 < count) return bits / count / 1e6;
      }
      return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
    }
    var eventsEnabled = null;
    var selectionInformation = null;
    function getOwnerDocumentFromRootContainer(rootContainerElement) {
      return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
    }
    function getOwnHostContext(namespaceURI) {
      switch (namespaceURI) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function getChildHostContextProd(parentNamespace, type) {
      if (0 === parentNamespace)
        switch (type) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
    }
    function shouldSetTextContent(type, props) {
      return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
    }
    var currentPopstateTransitionEvent = null;
    function shouldAttemptEagerTransition() {
      var event = window.event;
      if (event && "popstate" === event.type) {
        if (event === currentPopstateTransitionEvent) return false;
        currentPopstateTransitionEvent = event;
        return true;
      }
      currentPopstateTransitionEvent = null;
      return false;
    }
    var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0;
    var cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0;
    var localPromise = "function" === typeof Promise ? Promise : void 0;
    var scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
      return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
    } : scheduleTimeout;
    function handleErrorInNextTick(error) {
      setTimeout(function() {
        throw error;
      });
    }
    function isSingletonScope(type) {
      return "head" === type;
    }
    function clearHydrationBoundary(parentInstance, hydrationInstance) {
      var node = hydrationInstance, depth = 0;
      do {
        var nextNode = node.nextSibling;
        parentInstance.removeChild(node);
        if (nextNode && 8 === nextNode.nodeType)
          if (node = nextNode.data, "/$" === node || "/&" === node) {
            if (0 === depth) {
              parentInstance.removeChild(nextNode);
              retryIfBlockedOn(hydrationInstance);
              return;
            }
            depth--;
          } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
            depth++;
          else if ("html" === node)
            releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
          else if ("head" === node) {
            node = parentInstance.ownerDocument.head;
            releaseSingletonInstance(node);
            for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
              var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
              node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
              node$jscomp$0 = nextNode$jscomp$0;
            }
          } else
            "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
        node = nextNode;
      } while (node);
      retryIfBlockedOn(hydrationInstance);
    }
    function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
      var node = suspenseInstance;
      suspenseInstance = 0;
      do {
        var nextNode = node.nextSibling;
        1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
        if (nextNode && 8 === nextNode.nodeType)
          if (node = nextNode.data, "/$" === node)
            if (0 === suspenseInstance) break;
            else suspenseInstance--;
          else
            "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
        node = nextNode;
      } while (node);
    }
    function clearContainerSparingly(container) {
      var nextNode = container.firstChild;
      nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
      for (; nextNode; ) {
        var node = nextNode;
        nextNode = nextNode.nextSibling;
        switch (node.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            clearContainerSparingly(node);
            detachDeletedInstance(node);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if ("stylesheet" === node.rel.toLowerCase()) continue;
        }
        container.removeChild(node);
      }
    }
    function canHydrateInstance(instance, type, props, inRootOrSingleton) {
      for (; 1 === instance.nodeType; ) {
        var anyProps = props;
        if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
          if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
            break;
        } else if (!inRootOrSingleton)
          if ("input" === type && "hidden" === instance.type) {
            var name = null == anyProps.name ? null : "" + anyProps.name;
            if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
              return instance;
          } else return instance;
        else if (!instance[internalHoistableMarker])
          switch (type) {
            case "meta":
              if (!instance.hasAttribute("itemprop")) break;
              return instance;
            case "link":
              name = instance.getAttribute("rel");
              if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
                break;
              else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
                break;
              return instance;
            case "style":
              if (instance.hasAttribute("data-precedence")) break;
              return instance;
            case "script":
              name = instance.getAttribute("src");
              if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
                break;
              return instance;
            default:
              return instance;
          }
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) break;
      }
      return null;
    }
    function canHydrateTextInstance(instance, text, inRootOrSingleton) {
      if ("" === text) return null;
      for (; 3 !== instance.nodeType; ) {
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
          return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
      }
      return instance;
    }
    function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
      for (; 8 !== instance.nodeType; ) {
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
          return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
      }
      return instance;
    }
    function isSuspenseInstancePending(instance) {
      return "$?" === instance.data || "$~" === instance.data;
    }
    function isSuspenseInstanceFallback(instance) {
      return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
    }
    function registerSuspenseInstanceRetry(instance, callback) {
      var ownerDocument = instance.ownerDocument;
      if ("$~" === instance.data) instance._reactRetry = callback;
      else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
        callback();
      else {
        var listener = function() {
          callback();
          ownerDocument.removeEventListener("DOMContentLoaded", listener);
        };
        ownerDocument.addEventListener("DOMContentLoaded", listener);
        instance._reactRetry = listener;
      }
    }
    function getNextHydratable(node) {
      for (; null != node; node = node.nextSibling) {
        var nodeType = node.nodeType;
        if (1 === nodeType || 3 === nodeType) break;
        if (8 === nodeType) {
          nodeType = node.data;
          if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
            break;
          if ("/$" === nodeType || "/&" === nodeType) return null;
        }
      }
      return node;
    }
    var previousHydratableOnEnteringScopedSingleton = null;
    function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
      hydrationInstance = hydrationInstance.nextSibling;
      for (var depth = 0; hydrationInstance; ) {
        if (8 === hydrationInstance.nodeType) {
          var data = hydrationInstance.data;
          if ("/$" === data || "/&" === data) {
            if (0 === depth)
              return getNextHydratable(hydrationInstance.nextSibling);
            depth--;
          } else
            "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
        }
        hydrationInstance = hydrationInstance.nextSibling;
      }
      return null;
    }
    function getParentHydrationBoundary(targetInstance) {
      targetInstance = targetInstance.previousSibling;
      for (var depth = 0; targetInstance; ) {
        if (8 === targetInstance.nodeType) {
          var data = targetInstance.data;
          if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
            if (0 === depth) return targetInstance;
            depth--;
          } else "/$" !== data && "/&" !== data || depth++;
        }
        targetInstance = targetInstance.previousSibling;
      }
      return null;
    }
    function resolveSingletonInstance(type, props, rootContainerInstance) {
      props = getOwnerDocumentFromRootContainer(rootContainerInstance);
      switch (type) {
        case "html":
          type = props.documentElement;
          if (!type) throw Error(formatProdErrorMessage(452));
          return type;
        case "head":
          type = props.head;
          if (!type) throw Error(formatProdErrorMessage(453));
          return type;
        case "body":
          type = props.body;
          if (!type) throw Error(formatProdErrorMessage(454));
          return type;
        default:
          throw Error(formatProdErrorMessage(451));
      }
    }
    function releaseSingletonInstance(instance) {
      for (var attributes = instance.attributes; attributes.length; )
        instance.removeAttributeNode(attributes[0]);
      detachDeletedInstance(instance);
    }
    var preloadPropsMap = /* @__PURE__ */ new Map();
    var preconnectsSet = /* @__PURE__ */ new Set();
    function getHoistableRoot(container) {
      return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
    }
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: flushSyncWork,
      r: requestFormReset,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    function flushSyncWork() {
      var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
      return previousWasRendering || wasRendering;
    }
    function requestFormReset(form) {
      var formInst = getInstanceFromNode(form);
      null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
    }
    var globalDocument = "undefined" === typeof document ? null : document;
    function preconnectAs(rel, href, crossOrigin) {
      var ownerDocument = globalDocument;
      if (ownerDocument && "string" === typeof href && href) {
        var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
        limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
        "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
        preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
      }
    }
    function prefetchDNS(href) {
      previousDispatcher.D(href);
      preconnectAs("dns-prefetch", href, null);
    }
    function preconnect(href, crossOrigin) {
      previousDispatcher.C(href, crossOrigin);
      preconnectAs("preconnect", href, crossOrigin);
    }
    function preload(href, as, options2) {
      previousDispatcher.L(href, as, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href && as) {
        var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
        "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
          options2.imageSrcSet
        ) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
          options2.imageSizes
        ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
        var key = preloadSelector;
        switch (as) {
          case "style":
            key = getStyleKey(href);
            break;
          case "script":
            key = getScriptKey(href);
        }
        preloadPropsMap.has(key) || (href = assign(
          {
            rel: "preload",
            href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
            as
          },
          options2
        ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
      }
    }
    function preloadModule(href, options2) {
      previousDispatcher.m(href, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href) {
        var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
        switch (as) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            key = getScriptKey(href);
        }
        if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
          switch (as) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
                return;
          }
          as = ownerDocument.createElement("link");
          setInitialProperties(as, "link", href);
          markNodeAsHoistable(as);
          ownerDocument.head.appendChild(as);
        }
      }
    }
    function preinitStyle(href, precedence, options2) {
      previousDispatcher.S(href, precedence, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href) {
        var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
        precedence = precedence || "default";
        var resource = styles.get(key);
        if (!resource) {
          var state = { loading: 0, preload: null };
          if (resource = ownerDocument.querySelector(
            getStylesheetSelectorFromKey(key)
          ))
            state.loading = 5;
          else {
            href = assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options2
            );
            (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
            var link = resource = ownerDocument.createElement("link");
            markNodeAsHoistable(link);
            setInitialProperties(link, "link", href);
            link._p = new Promise(function(resolve, reject) {
              link.onload = resolve;
              link.onerror = reject;
            });
            link.addEventListener("load", function() {
              state.loading |= 1;
            });
            link.addEventListener("error", function() {
              state.loading |= 2;
            });
            state.loading |= 4;
            insertStylesheet(resource, precedence, ownerDocument);
          }
          resource = {
            type: "stylesheet",
            instance: resource,
            count: 1,
            state
          };
          styles.set(key, resource);
        }
      }
    }
    function preinitScript(src, options2) {
      previousDispatcher.X(src, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
          type: "script",
          instance: resource,
          count: 1,
          state: null
        }, scripts.set(key, resource));
      }
    }
    function preinitModuleScript(src, options2) {
      previousDispatcher.M(src, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
          type: "script",
          instance: resource,
          count: 1,
          state: null
        }, scripts.set(key, resource));
      }
    }
    function getResource(type, currentProps, pendingProps, currentResource) {
      var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
      if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
      switch (type) {
        case "meta":
        case "title":
          return null;
        case "style":
          return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
            type = getStyleKey(pendingProps.href);
            var styles$243 = getResourcesFromRoot(
              JSCompiler_inline_result
            ).hoistableStyles, resource$244 = styles$243.get(type);
            resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: { loading: 0, preload: null }
            }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
              getStylesheetSelectorFromKey(type)
            )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
              rel: "preload",
              as: "style",
              href: pendingProps.href,
              crossOrigin: pendingProps.crossOrigin,
              integrity: pendingProps.integrity,
              media: pendingProps.media,
              hrefLang: pendingProps.hrefLang,
              referrerPolicy: pendingProps.referrerPolicy
            }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
              JSCompiler_inline_result,
              type,
              pendingProps,
              resource$244.state
            )));
            if (currentProps && null === currentResource)
              throw Error(formatProdErrorMessage(528, ""));
            return resource$244;
          }
          if (currentProps && null !== currentResource)
            throw Error(formatProdErrorMessage(529, ""));
          return null;
        case "script":
          return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(formatProdErrorMessage(444, type));
      }
    }
    function getStyleKey(href) {
      return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
    }
    function getStylesheetSelectorFromKey(key) {
      return 'link[rel="stylesheet"][' + key + "]";
    }
    function stylesheetPropsFromRawProps(rawProps) {
      return assign({}, rawProps, {
        "data-precedence": rawProps.precedence,
        precedence: null
      });
    }
    function preloadStylesheet(ownerDocument, key, preloadProps, state) {
      ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
        return state.loading |= 1;
      }), key.addEventListener("error", function() {
        return state.loading |= 2;
      }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
    }
    function getScriptKey(src) {
      return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
    }
    function getScriptSelectorFromKey(key) {
      return "script[async]" + key;
    }
    function acquireResource(hoistableRoot, resource, props) {
      resource.count++;
      if (null === resource.instance)
        switch (resource.type) {
          case "style":
            var instance = hoistableRoot.querySelector(
              'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
            );
            if (instance)
              return resource.instance = instance, markNodeAsHoistable(instance), instance;
            var styleProps = assign({}, props, {
              "data-href": props.href,
              "data-precedence": props.precedence,
              href: null,
              precedence: null
            });
            instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
              "style"
            );
            markNodeAsHoistable(instance);
            setInitialProperties(instance, "style", styleProps);
            insertStylesheet(instance, props.precedence, hoistableRoot);
            return resource.instance = instance;
          case "stylesheet":
            styleProps = getStyleKey(props.href);
            var instance$249 = hoistableRoot.querySelector(
              getStylesheetSelectorFromKey(styleProps)
            );
            if (instance$249)
              return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
            instance = stylesheetPropsFromRawProps(props);
            (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
            instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
            markNodeAsHoistable(instance$249);
            var linkInstance = instance$249;
            linkInstance._p = new Promise(function(resolve, reject) {
              linkInstance.onload = resolve;
              linkInstance.onerror = reject;
            });
            setInitialProperties(instance$249, "link", instance);
            resource.state.loading |= 4;
            insertStylesheet(instance$249, props.precedence, hoistableRoot);
            return resource.instance = instance$249;
          case "script":
            instance$249 = getScriptKey(props.src);
            if (styleProps = hoistableRoot.querySelector(
              getScriptSelectorFromKey(instance$249)
            ))
              return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
            instance = props;
            if (styleProps = preloadPropsMap.get(instance$249))
              instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
            hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
            styleProps = hoistableRoot.createElement("script");
            markNodeAsHoistable(styleProps);
            setInitialProperties(styleProps, "link", instance);
            hoistableRoot.head.appendChild(styleProps);
            return resource.instance = styleProps;
          case "void":
            return null;
          default:
            throw Error(formatProdErrorMessage(443, resource.type));
        }
      else
        "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
      return resource.instance;
    }
    function insertStylesheet(instance, precedence, root2) {
      for (var nodes = root2.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.dataset.precedence === precedence) prior = node;
        else if (prior !== last) break;
      }
      prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
    }
    function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
      null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
      null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
      null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
    }
    function adoptPreloadPropsForScript(scriptProps, preloadProps) {
      null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
      null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
      null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
    }
    var tagCaches = null;
    function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
      if (null === tagCaches) {
        var cache = /* @__PURE__ */ new Map();
        var caches = tagCaches = /* @__PURE__ */ new Map();
        caches.set(ownerDocument, cache);
      } else
        caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
      if (cache.has(type)) return cache;
      cache.set(type, null);
      ownerDocument = ownerDocument.getElementsByTagName(type);
      for (caches = 0; caches < ownerDocument.length; caches++) {
        var node = ownerDocument[caches];
        if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
          var nodeKey = node.getAttribute(keyAttribute) || "";
          nodeKey = type + nodeKey;
          var existing = cache.get(nodeKey);
          existing ? existing.push(node) : cache.set(nodeKey, [node]);
        }
      }
      return cache;
    }
    function mountHoistable(hoistableRoot, type, instance) {
      hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
      hoistableRoot.head.insertBefore(
        instance,
        "title" === type ? hoistableRoot.querySelector("head > title") : null
      );
    }
    function isHostHoistableType(type, props, hostContext) {
      if (1 === hostContext || null != props.itemProp) return false;
      switch (type) {
        case "meta":
        case "title":
          return true;
        case "style":
          if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
            break;
          return true;
        case "link":
          if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
            break;
          switch (props.rel) {
            case "stylesheet":
              return type = props.disabled, "string" === typeof props.precedence && null == type;
            default:
              return true;
          }
        case "script":
          if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
            return true;
      }
      return false;
    }
    function preloadResource(resource) {
      return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
    }
    function suspendResource(state, hoistableRoot, resource, props) {
      if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
        if (null === resource.instance) {
          var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
            getStylesheetSelectorFromKey(key)
          );
          if (instance) {
            hoistableRoot = instance._p;
            null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
            resource.state.loading |= 4;
            resource.instance = instance;
            markNodeAsHoistable(instance);
            return;
          }
          instance = hoistableRoot.ownerDocument || hoistableRoot;
          props = stylesheetPropsFromRawProps(props);
          (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
          instance = instance.createElement("link");
          markNodeAsHoistable(instance);
          var linkInstance = instance;
          linkInstance._p = new Promise(function(resolve, reject) {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance, "link", props);
          resource.instance = instance;
        }
        null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
        state.stylesheets.set(resource, hoistableRoot);
        (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
      }
    }
    var estimatedBytesWithinLimit = 0;
    function waitForCommitToBeReady(state, timeoutOffset) {
      state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
      return 0 < state.count || 0 < state.imgCount ? function(commit) {
        var stylesheetTimer = setTimeout(function() {
          state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
          if (state.unsuspend) {
            var unsuspend = state.unsuspend;
            state.unsuspend = null;
            unsuspend();
          }
        }, 6e4 + timeoutOffset);
        0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
        var imgTimer = setTimeout(
          function() {
            state.waitingForImages = false;
            if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
              var unsuspend = state.unsuspend;
              state.unsuspend = null;
              unsuspend();
            }
          },
          (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
        );
        state.unsuspend = commit;
        return function() {
          state.unsuspend = null;
          clearTimeout(stylesheetTimer);
          clearTimeout(imgTimer);
        };
      } : null;
    }
    function onUnsuspend() {
      this.count--;
      if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
        if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
        else if (this.unsuspend) {
          var unsuspend = this.unsuspend;
          this.unsuspend = null;
          unsuspend();
        }
      }
    }
    var precedencesByRoot = null;
    function insertSuspendedStylesheets(state, resources) {
      state.stylesheets = null;
      null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
    }
    function insertStylesheetIntoRoot(root2, resource) {
      if (!(resource.state.loading & 4)) {
        var precedences = precedencesByRoot.get(root2);
        if (precedences) var last = precedences.get(null);
        else {
          precedences = /* @__PURE__ */ new Map();
          precedencesByRoot.set(root2, precedences);
          for (var nodes = root2.querySelectorAll(
            "link[data-precedence],style[data-precedence]"
          ), i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
              precedences.set(node.dataset.precedence, node), last = node;
          }
          last && precedences.set(null, last);
        }
        nodes = resource.instance;
        node = nodes.getAttribute("data-precedence");
        i = precedences.get(node) || last;
        i === last && precedences.set(null, nodes);
        precedences.set(node, nodes);
        this.count++;
        last = onUnsuspend.bind(this);
        nodes.addEventListener("load", last);
        nodes.addEventListener("error", last);
        i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
        resource.state.loading |= 4;
      }
    }
    var HostTransitionContext = {
      $$typeof: REACT_CONTEXT_TYPE,
      Provider: null,
      Consumer: null,
      _currentValue: sharedNotPendingObject,
      _currentValue2: sharedNotPendingObject,
      _threadCount: 0
    };
    function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
      this.tag = 1;
      this.containerInfo = containerInfo;
      this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
      this.callbackPriority = 0;
      this.expirationTimes = createLaneMap(-1);
      this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = createLaneMap(0);
      this.hiddenUpdates = createLaneMap(null);
      this.identifierPrefix = identifierPrefix;
      this.onUncaughtError = onUncaughtError;
      this.onCaughtError = onCaughtError;
      this.onRecoverableError = onRecoverableError;
      this.pooledCache = null;
      this.pooledCacheLanes = 0;
      this.formState = formState;
      this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
      containerInfo = new FiberRootNode(
        containerInfo,
        tag,
        hydrate,
        identifierPrefix,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        onDefaultTransitionIndicator,
        formState
      );
      tag = 1;
      true === isStrictMode && (tag |= 24);
      isStrictMode = createFiberImplClass(3, null, null, tag);
      containerInfo.current = isStrictMode;
      isStrictMode.stateNode = containerInfo;
      tag = createCache();
      tag.refCount++;
      containerInfo.pooledCache = tag;
      tag.refCount++;
      isStrictMode.memoizedState = {
        element: initialChildren,
        isDehydrated: hydrate,
        cache: tag
      };
      initializeUpdateQueue(isStrictMode);
      return containerInfo;
    }
    function getContextForSubtree(parentComponent) {
      if (!parentComponent) return emptyContextObject;
      parentComponent = emptyContextObject;
      return parentComponent;
    }
    function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
      parentComponent = getContextForSubtree(parentComponent);
      null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
      container = createUpdate(lane);
      container.payload = { element };
      callback = void 0 === callback ? null : callback;
      null !== callback && (container.callback = callback);
      element = enqueueUpdate(rootFiber, container, lane);
      null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
    }
    function markRetryLaneImpl(fiber, retryLane) {
      fiber = fiber.memoizedState;
      if (null !== fiber && null !== fiber.dehydrated) {
        var a = fiber.retryLane;
        fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
      }
    }
    function markRetryLaneIfNotHydrated(fiber, retryLane) {
      markRetryLaneImpl(fiber, retryLane);
      (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
    }
    function attemptContinuousHydration(fiber) {
      if (13 === fiber.tag || 31 === fiber.tag) {
        var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
        null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
        markRetryLaneIfNotHydrated(fiber, 67108864);
      }
    }
    function attemptHydrationAtCurrentPriority(fiber) {
      if (13 === fiber.tag || 31 === fiber.tag) {
        var lane = requestUpdateLane();
        lane = getBumpedLaneForHydrationByLane(lane);
        var root2 = enqueueConcurrentRenderForLane(fiber, lane);
        null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
        markRetryLaneIfNotHydrated(fiber, lane);
      }
    }
    var _enabled = true;
    function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
      var prevTransition = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
      }
    }
    function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
      var prevTransition = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
      }
    }
    function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      if (_enabled) {
        var blockedOn = findInstanceBlockingEvent(nativeEvent);
        if (null === blockedOn)
          dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            return_targetInst,
            targetContainer
          ), clearIfContinuousEvent(domEventName, nativeEvent);
        else if (queueIfContinuousEvent(
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ))
          nativeEvent.stopPropagation();
        else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
          for (; null !== blockedOn; ) {
            var fiber = getInstanceFromNode(blockedOn);
            if (null !== fiber)
              switch (fiber.tag) {
                case 3:
                  fiber = fiber.stateNode;
                  if (fiber.current.memoizedState.isDehydrated) {
                    var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                    if (0 !== lanes) {
                      var root2 = fiber;
                      root2.pendingLanes |= 2;
                      for (root2.entangledLanes |= 2; lanes; ) {
                        var lane = 1 << 31 - clz32(lanes);
                        root2.entanglements[1] |= lane;
                        lanes &= ~lane;
                      }
                      ensureRootIsScheduled(fiber);
                      0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0, false));
                    }
                  }
                  break;
                case 31:
                case 13:
                  root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
              }
            fiber = findInstanceBlockingEvent(nativeEvent);
            null === fiber && dispatchEventForPluginEventSystem(
              domEventName,
              eventSystemFlags,
              nativeEvent,
              return_targetInst,
              targetContainer
            );
            if (fiber === blockedOn) break;
            blockedOn = fiber;
          }
          null !== blockedOn && nativeEvent.stopPropagation();
        } else
          dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            null,
            targetContainer
          );
      }
    }
    function findInstanceBlockingEvent(nativeEvent) {
      nativeEvent = getEventTarget(nativeEvent);
      return findInstanceBlockingTarget(nativeEvent);
    }
    var return_targetInst = null;
    function findInstanceBlockingTarget(targetNode) {
      return_targetInst = null;
      targetNode = getClosestInstanceFromNode(targetNode);
      if (null !== targetNode) {
        var nearestMounted = getNearestMountedFiber(targetNode);
        if (null === nearestMounted) targetNode = null;
        else {
          var tag = nearestMounted.tag;
          if (13 === tag) {
            targetNode = getSuspenseInstanceFromFiber(nearestMounted);
            if (null !== targetNode) return targetNode;
            targetNode = null;
          } else if (31 === tag) {
            targetNode = getActivityInstanceFromFiber(nearestMounted);
            if (null !== targetNode) return targetNode;
            targetNode = null;
          } else if (3 === tag) {
            if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
              return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
            targetNode = null;
          } else nearestMounted !== targetNode && (targetNode = null);
        }
      }
      return_targetInst = targetNode;
      return null;
    }
    function getEventPriority(domEventName) {
      switch (domEventName) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (getCurrentPriorityLevel()) {
            case ImmediatePriority:
              return 2;
            case UserBlockingPriority:
              return 8;
            case NormalPriority$1:
            case LowPriority:
              return 32;
            case IdlePriority:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var hasScheduledReplayAttempt = false;
    var queuedFocus = null;
    var queuedDrag = null;
    var queuedMouse = null;
    var queuedPointers = /* @__PURE__ */ new Map();
    var queuedPointerCaptures = /* @__PURE__ */ new Map();
    var queuedExplicitHydrationTargets = [];
    var discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
      " "
    );
    function clearIfContinuousEvent(domEventName, nativeEvent) {
      switch (domEventName) {
        case "focusin":
        case "focusout":
          queuedFocus = null;
          break;
        case "dragenter":
        case "dragleave":
          queuedDrag = null;
          break;
        case "mouseover":
        case "mouseout":
          queuedMouse = null;
          break;
        case "pointerover":
        case "pointerout":
          queuedPointers.delete(nativeEvent.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          queuedPointerCaptures.delete(nativeEvent.pointerId);
      }
    }
    function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
        return existingQueuedEvent = {
          blockedOn,
          domEventName,
          eventSystemFlags,
          nativeEvent,
          targetContainers: [targetContainer]
        }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
      existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
      blockedOn = existingQueuedEvent.targetContainers;
      null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
      return existingQueuedEvent;
    }
    function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      switch (domEventName) {
        case "focusin":
          return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedFocus,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "dragenter":
          return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedDrag,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "mouseover":
          return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedMouse,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "pointerover":
          var pointerId = nativeEvent.pointerId;
          queuedPointers.set(
            pointerId,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointers.get(pointerId) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            )
          );
          return true;
        case "gotpointercapture":
          return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
            pointerId,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointerCaptures.get(pointerId) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            )
          ), true;
      }
      return false;
    }
    function attemptExplicitHydrationTarget(queuedTarget) {
      var targetInst = getClosestInstanceFromNode(queuedTarget.target);
      if (null !== targetInst) {
        var nearestMounted = getNearestMountedFiber(targetInst);
        if (null !== nearestMounted) {
          if (targetInst = nearestMounted.tag, 13 === targetInst) {
            if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
              queuedTarget.blockedOn = targetInst;
              runWithPriority(queuedTarget.priority, function() {
                attemptHydrationAtCurrentPriority(nearestMounted);
              });
              return;
            }
          } else if (31 === targetInst) {
            if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
              queuedTarget.blockedOn = targetInst;
              runWithPriority(queuedTarget.priority, function() {
                attemptHydrationAtCurrentPriority(nearestMounted);
              });
              return;
            }
          } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
            queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
            return;
          }
        }
      }
      queuedTarget.blockedOn = null;
    }
    function attemptReplayContinuousQueuedEvent(queuedEvent) {
      if (null !== queuedEvent.blockedOn) return false;
      for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
        var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
        if (null === nextBlockedOn) {
          nextBlockedOn = queuedEvent.nativeEvent;
          var nativeEventClone = new nextBlockedOn.constructor(
            nextBlockedOn.type,
            nextBlockedOn
          );
          currentReplayingEvent = nativeEventClone;
          nextBlockedOn.target.dispatchEvent(nativeEventClone);
          currentReplayingEvent = null;
        } else
          return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
        targetContainers.shift();
      }
      return true;
    }
    function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
      attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
    }
    function replayUnblockedEvents() {
      hasScheduledReplayAttempt = false;
      null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
      null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
      null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
      queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
      queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
    }
    function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
      queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
        Scheduler.unstable_NormalPriority,
        replayUnblockedEvents
      )));
    }
    var lastScheduledReplayQueue = null;
    function scheduleReplayQueueIfNeeded(formReplayingQueue) {
      lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
        Scheduler.unstable_NormalPriority,
        function() {
          lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
          for (var i = 0; i < formReplayingQueue.length; i += 3) {
            var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
            if ("function" !== typeof submitterOrAction)
              if (null === findInstanceBlockingTarget(submitterOrAction || form))
                continue;
              else break;
            var formInst = getInstanceFromNode(form);
            null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
              formInst,
              {
                pending: true,
                data: formData,
                method: form.method,
                action: submitterOrAction
              },
              submitterOrAction,
              formData
            ));
          }
        }
      ));
    }
    function retryIfBlockedOn(unblocked) {
      function unblock(queuedEvent) {
        return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
      }
      null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
      null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
      null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
      queuedPointers.forEach(unblock);
      queuedPointerCaptures.forEach(unblock);
      for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
        var queuedTarget = queuedExplicitHydrationTargets[i];
        queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
      }
      for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
        attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
      i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
      if (null != i)
        for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
          var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
          if ("function" === typeof submitterOrAction)
            formProps || scheduleReplayQueueIfNeeded(i);
          else if (formProps) {
            var action = null;
            if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
              if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
                action = formProps.formAction;
              else {
                if (null !== findInstanceBlockingTarget(form)) continue;
              }
            else action = formProps.action;
            "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
            scheduleReplayQueueIfNeeded(i);
          }
        }
    }
    function defaultOnDefaultTransitionIndicator() {
      function handleNavigate(event) {
        event.canIntercept && "react-transition" === event.info && event.intercept({
          handler: function() {
            return new Promise(function(resolve) {
              return pendingResolve = resolve;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function handleNavigateComplete() {
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        isCancelled || setTimeout(startFakeNavigation, 20);
      }
      function startFakeNavigation() {
        if (!isCancelled && !navigation.transition) {
          var currentEntry = navigation.currentEntry;
          currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
            state: currentEntry.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if ("object" === typeof navigation) {
        var isCancelled = false, pendingResolve = null;
        navigation.addEventListener("navigate", handleNavigate);
        navigation.addEventListener("navigatesuccess", handleNavigateComplete);
        navigation.addEventListener("navigateerror", handleNavigateComplete);
        setTimeout(startFakeNavigation, 100);
        return function() {
          isCancelled = true;
          navigation.removeEventListener("navigate", handleNavigate);
          navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
          navigation.removeEventListener("navigateerror", handleNavigateComplete);
          null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        };
      }
    }
    function ReactDOMRoot(internalRoot) {
      this._internalRoot = internalRoot;
    }
    ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
      var root2 = this._internalRoot;
      if (null === root2) throw Error(formatProdErrorMessage(409));
      var current = root2.current, lane = requestUpdateLane();
      updateContainerImpl(current, lane, children, root2, null, null);
    };
    ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
      var root2 = this._internalRoot;
      if (null !== root2) {
        this._internalRoot = null;
        var container = root2.containerInfo;
        updateContainerImpl(root2.current, 2, null, root2, null, null);
        flushSyncWork$1();
        container[internalContainerInstanceKey] = null;
      }
    };
    function ReactDOMHydrationRoot(internalRoot) {
      this._internalRoot = internalRoot;
    }
    ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
      if (target) {
        var updatePriority = resolveUpdatePriority();
        target = { blockedOn: null, target, priority: updatePriority };
        for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
        queuedExplicitHydrationTargets.splice(i, 0, target);
        0 === i && attemptExplicitHydrationTarget(target);
      }
    };
    var isomorphicReactPackageVersion$jscomp$inline_1840 = React.version;
    if ("19.2.7" !== isomorphicReactPackageVersion$jscomp$inline_1840)
      throw Error(
        formatProdErrorMessage(
          527,
          isomorphicReactPackageVersion$jscomp$inline_1840,
          "19.2.7"
        )
      );
    ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
      var fiber = componentOrElement._reactInternals;
      if (void 0 === fiber) {
        if ("function" === typeof componentOrElement.render)
          throw Error(formatProdErrorMessage(188));
        componentOrElement = Object.keys(componentOrElement).join(",");
        throw Error(formatProdErrorMessage(268, componentOrElement));
      }
      componentOrElement = findCurrentFiberUsingSlowPath(fiber);
      componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
      componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
      return componentOrElement;
    };
    var internals$jscomp$inline_2347 = {
      bundleType: 0,
      version: "19.2.7",
      rendererPackageName: "react-dom",
      currentDispatcherRef: ReactSharedInternals,
      reconcilerVersion: "19.2.7"
    };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
        try {
          rendererID = hook$jscomp$inline_2348.inject(
            internals$jscomp$inline_2347
          ), injectedHook = hook$jscomp$inline_2348;
        } catch (err) {
        }
    }
    var hook$jscomp$inline_2348;
    exports.createRoot = function(container, options2) {
      if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
      var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
      null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
      options2 = createFiberRoot(
        container,
        1,
        false,
        null,
        null,
        isStrictMode,
        identifierPrefix,
        null,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        defaultOnDefaultTransitionIndicator
      );
      container[internalContainerInstanceKey] = options2.current;
      listenToAllSupportedEvents(container);
      return new ReactDOMRoot(options2);
    };
    exports.hydrateRoot = function(container, initialChildren, options2) {
      if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
      var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
      null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
      initialChildren = createFiberRoot(
        container,
        1,
        true,
        initialChildren,
        null != options2 ? options2 : null,
        isStrictMode,
        identifierPrefix,
        formState,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        defaultOnDefaultTransitionIndicator
      );
      initialChildren.context = getContextForSubtree(null);
      options2 = initialChildren.current;
      isStrictMode = requestUpdateLane();
      isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
      identifierPrefix = createUpdate(isStrictMode);
      identifierPrefix.callback = null;
      enqueueUpdate(options2, identifierPrefix, isStrictMode);
      options2 = isStrictMode;
      initialChildren.current.lanes = options2;
      markRootUpdated$1(initialChildren, options2);
      ensureRootIsScheduled(initialChildren);
      container[internalContainerInstanceKey] = initialChildren.current;
      listenToAllSupportedEvents(container);
      return new ReactDOMHydrationRoot(initialChildren);
    };
    exports.version = "19.2.7";
  }
});

// ../../../ponto_comum/node_modules/react-dom/client.js
var require_client = __commonJS({
  "../../../ponto_comum/node_modules/react-dom/client.js"(exports, module2) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module2.exports = require_react_dom_client_production();
    } else {
      module2.exports = null;
    }
  }
});

// ../../../ponto_comum/node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "../../../ponto_comum/node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsx = jsxProd;
    exports.jsxs = jsxProd;
  }
});

// ../../../ponto_comum/node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "../../../ponto_comum/node_modules/react/jsx-runtime.js"(exports, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_jsx_runtime_production();
    } else {
      module2.exports = null;
    }
  }
});

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/main.tsx
var import_react4 = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/App.tsx
var import_react3 = __toESM(require_react(), 1);

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/catalog.ts
var logoImagePath = "/assets/ponto-comum/logo.png";
function lesson(input) {
  return input;
}
function module(input) {
  return input;
}
function course(input) {
  return {
    ...input,
    courseUrl: `/cursos/${input.id}`
  };
}
var emptyLessonModules = {
  assinaturaAstrologica: [
    module({ id: "sol-lua-ascendente", title: "Sol, Lua, Ascendente", lessons: [] }),
    module({ id: "venus-e-poder-feminino", title: "Venus e o poder feminino", lessons: [] }),
    module({ id: "saturno-nodos-lunares", title: "Saturno e os nodos lunares", lessons: [] })
  ],
  facesDoServir: [
    module({ id: "face-identidade", title: "Face da Identidade", lessons: [] }),
    module({ id: "face-materialidade", title: "Face da Materialidade", lessons: [] }),
    module({ id: "face-conhecimento", title: "Face do Conhecimento", lessons: [] }),
    module({ id: "face-espiritualidade", title: "Face da Espiritualidade", lessons: [] })
  ]
};
var tracks = [
  {
    id: "caminho-do-servir",
    name: "Caminho do Servir",
    description: "Trilha de fundamentos para transformar servico, presenca e execucao em uma pratica sustentada.",
    categoryUrl: "/trilhas/caminho-do-servir",
    banner: {
      eyebrow: "Trilha",
      title: "Caminho do Servir",
      subtitle: "Cursos e praticas para aprofundar servico, presenca e planejamento.",
      accentColor: "#d6a14a",
      imagePath: "/assets/ponto-comum/banners/caminho-do-servir.jpg"
    },
    courses: [
      course({
        id: "comece-aqui-caminho-do-servir",
        title: "Comece aqui - Caminho do Servir",
        description: "Ponto de partida do Caminho do Servir.",
        coverImagePath: "/assets/ponto-comum/courses/comece-aqui-caminho-do-servir.jpg",
        modules: [module({
          id: "comece-aqui-servir",
          title: "Comece aqui",
          lessons: [
            lesson({ id: "servir-autentico", title: "Servir Autentico", kind: "material", summary: "Primeiro mapa de orientacao da jornada." }),
            lesson({ id: "maria-sem-abandonar-intuicao", title: "Como usar a MarIA sem abandonar a intuicao", kind: "material", summary: "Boas praticas para usar assistentes sem terceirizar criterio." })
          ]
        })]
      }),
      course({ id: "assinatura-astrologica", title: "Assinatura Astrologica", description: "Modulos de leitura astrologica pessoal.", coverImagePath: "/assets/ponto-comum/courses/assinatura-astrologica.jpg", modules: emptyLessonModules.assinaturaAstrologica }),
      course({ id: "quatro-faces-do-servir", title: "4 Faces do Servir", description: "Mapa das quatro faces que sustentam o servir autentico.", coverImagePath: "/assets/ponto-comum/courses/quatro-faces-do-servir.jpg", modules: emptyLessonModules.facesDoServir }),
      course({ id: "planejamento-ciclico", title: "Planejamento Ciclico", description: "Fundamentos de planejamento ciclico aplicados ao servir.", coverImagePath: "/assets/ponto-comum/courses/planejamento-ciclico.jpg", modules: [module({ id: "modulo-1-planejamento-ciclico", title: "Modulo 1", lessons: [] })] })
    ]
  },
  {
    id: "comunidade-planejamento-ciclico",
    name: "Comunidade de Planejamento Ciclico",
    description: "Biblioteca viva com rodas, ferramentas e aulas especiais.",
    categoryUrl: "/trilhas/comunidade-planejamento-ciclico",
    banner: {
      eyebrow: "Comunidade",
      title: "Comunidade de Planejamento Ciclico",
      subtitle: "Rodas, ferramentas, workshops e encontros para acompanhar os ciclos.",
      accentColor: "#b98cff",
      imagePath: "/assets/ponto-comum/banners/comunidade-planejamento-ciclico.jpg"
    },
    courses: [
      course({
        id: "comunidade-planejamento-ciclico-entre-aqui",
        title: "Comunidade Planejamento Ciclico - Entre aqui",
        description: "Portal de entrada da comunidade, com links, orientacoes e grupo de visoes.",
        coverImagePath: "/assets/ponto-comum/courses/comunidade-planejamento-ciclico-entre-aqui.jpg",
        modules: [module({ id: "comece-aqui-comunidade", title: "Comece aqui", lessons: [
          lesson({ id: "portal-da-comunidade", title: "Portal da Comunidade", kind: "material" }),
          lesson({ id: "grupo-visoes-astrologicas", title: "Grupo de Visoes Astrologicas", kind: "material" }),
          lesson({ id: "grupo-comunidade-planejamento-ciclico", title: "Grupo Comunidade Planejamento Ciclico", kind: "material" })
        ] })]
      }),
      course({
        id: "ferramentas-de-planejamento-ciclico",
        title: "Ferramentas de Planejamento Ciclico",
        description: "Recursos para apoiar o planejamento ao longo dos ciclos.",
        coverImagePath: "/assets/ponto-comum/courses/ferramentas-de-planejamento-ciclico.jpg",
        modules: [module({ id: "ferramentas-planejamento", title: "Ferramentas de Planejamento Ciclico", lessons: [
          lesson({ id: "maria-inteligencia-astrologica", title: "MarIA - Inteligencia Astrologica", kind: "tool" }),
          lesson({ id: "guia-materiais", title: "Guia de Materiais no Notion", kind: "material" }),
          lesson({ id: "ebook-planner-ciclico", title: "E-book do Planner Ciclico", kind: "material" })
        ] })]
      }),
      course({
        id: "rodas-da-lunacao",
        title: "Rodas da Lunacao",
        description: "Encontros mensais para compreender a energia de cada lunacao.",
        durationLabel: "9h 39m",
        coverImagePath: "/assets/ponto-comum/courses/rodas-da-lunacao.jpg",
        modules: [module({ id: "rodas-da-lunacao-modulo", title: "Rodas da Lunacao", lessons: [
          lesson({ id: "como-funcionam-as-rodas", title: "Como funcionam as Rodas", kind: "material" }),
          lesson({ id: "lunacao-de-peixes", title: "Lunacao de Peixes", kind: "live", durationLabel: "02:18:48" }),
          lesson({ id: "lunacao-de-aries", title: "Lunacao de Aries", kind: "live", durationLabel: "01:55:16" }),
          lesson({ id: "lunacao-de-touro", title: "Lunacao de Touro", kind: "live", durationLabel: "01:19:55" }),
          lesson({ id: "lunacao-de-gemeos", title: "Lunacao de Gemeos", kind: "live", durationLabel: "01:55:46" }),
          lesson({ id: "lunacao-de-cancer-2026-07-15", title: "Lunacao de Cancer - 15/07/2026", kind: "live", durationLabel: "02:10:06" })
        ] })]
      }),
      course({
        id: "workshops-e-aulas-especiais",
        title: "Workshops e Aulas Especiais",
        description: "Conteudos extras, workshops e aulas especiais da comunidade.",
        durationLabel: "18h 28m",
        coverImagePath: "/assets/ponto-comum/courses/workshops-e-aulas-especiais.jpg",
        modules: [
          module({ id: "empreendedorismo-selvagem", title: "Empreendedorismo Selvagem", description: "Workshops e aulas especiais sobre empreendedorismo.", lessons: [
            lesson({ id: "mapa-empreendedora-selvagem", title: "Mapa da Empreendedora Selvagem", kind: "video", durationLabel: "05:39" }),
            lesson({ id: "planetas-mapa-empreendedora", title: "Os planetas do Mapa da Empreendedora Selvagem", kind: "video", durationLabel: "16:02" }),
            lesson({ id: "workshop-empreendedorismo-selvagem", title: "Workshop | Empreendedorismo Selvagem", kind: "video", durationLabel: "02:59:13" }),
            lesson({ id: "mentoria-experimental-2026-04-15", title: "Aula de Mentoria Selvagem experimental - 15/04/2026", kind: "video", durationLabel: "02:25:38" })
          ] }),
          module({ id: "ciclos-de-venus", title: "Ciclos de Venus", description: "Aulas e aprofundamentos para compreender os ciclos de Venus.", lessons: [
            lesson({ id: "workshop-ciclo-de-venus", title: "Workshop Ciclo de Venus", kind: "video", durationLabel: "01:58:21" }),
            lesson({ id: "aprofundamentos-ciclos-de-venus", title: "Aula de aprofundamentos Ciclos de Venus", kind: "video", durationLabel: "01:48:14" }),
            lesson({ id: "portal-estelar-de-venus", title: "Portal Estelar de Venus - Aula 06/01/2026", kind: "video", durationLabel: "01:42:35" })
          ] }),
          module({ id: "aulas-especiais-comunidade", title: "Aulas especiais", description: "Conteudos extras para apoiar a caminhada.", lessons: [
            lesson({ id: "workshop-retorno-puerpera", title: "Workshop Retorno da Puerpera", kind: "video", durationLabel: "02:44:31" }),
            lesson({ id: "eclipse-em-virgem", title: "Eclipse em Virgem - Alinhamento de rotina para o ano astrologico - 03/03/2026", kind: "video", durationLabel: "02:07:38" }),
            lesson({ id: "sonhos-animus-criatividade", title: "Sonhos, Animus e Criatividade", kind: "video", durationLabel: "02:20:24" })
          ] })
        ]
      })
    ]
  },
  {
    id: "mentoria-selvagem",
    name: "Mentoria Selvagem",
    description: "Jornada principal de planejamento ciclico, execucao e empreendedorismo selvagem.",
    categoryUrl: "/trilhas/mentoria-selvagem",
    banner: {
      eyebrow: "Jornada principal",
      title: "Mentoria Selvagem",
      subtitle: "Jornada, metodo, hotseats, agentes especiais, tutorias e aulas convidadas.",
      accentColor: "#58c68f",
      imagePath: "/assets/ponto-comum/banners/mentoria-selvagem.jpg"
    },
    courses: [
      course({
        id: "comece-aqui-mentoria-selvagem",
        title: "Comece aqui - Mentoria Selvagem",
        description: "Como iniciar a sua jornada no Metodo Selvagem.",
        durationLabel: "32m 57s",
        coverImagePath: "/assets/ponto-comum/courses/comece-aqui-mentoria-selvagem.jpg",
        modules: [
          module({ id: "comece-aqui-mentoria", title: "Comece aqui", lessons: [
            lesson({ id: "boas-vindas-proxima-versao", title: "Boas-vindas a tua proxima versao", kind: "material" }),
            lesson({ id: "acordos-da-jornada", title: "Acordos da Jornada", kind: "material" }),
            lesson({ id: "onboarding", title: "Onboarding", kind: "material" }),
            lesson({ id: "atendimento-e-suporte", title: "Atendimento e Suporte", kind: "material" }),
            lesson({ id: "grupo-de-avisos", title: "Entre no grupo de avisos", kind: "material" })
          ] }),
          module({ id: "primeiros-passos-mentoria", title: "Primeiros passos", lessons: [
            lesson({ id: "conheca-jornada-mentoria", title: "Conheca a Jornada da Mentoria", kind: "video", durationLabel: "32:57" }),
            lesson({ id: "calendario-de-encontros", title: "Calendario de Encontros", kind: "material" }),
            lesson({ id: "glossario-mentoria-selvagem", title: "Glossario da Mentoria Selvagem", kind: "material" })
          ] })
        ]
      }),
      course({
        id: "metodo-selvagem",
        title: "Metodo Selvagem",
        description: "Mentoria estrategica para empreendedoras espirituais crescerem com estrutura e proposito.",
        durationLabel: "18h 53m",
        coverImagePath: "/assets/ponto-comum/courses/metodo-selvagem.jpg",
        modules: [
          module({ id: "pilares-metodo-selvagem", title: "Pilares do Metodo Selvagem", description: "Aulas de implementacao do metodo.", lessons: [
            lesson({ id: "posicionamento-unico", title: "Posicionamento Unico", kind: "video", durationLabel: "02:30:10" }),
            lesson({ id: "metodo-autoral", title: "Metodo Autoral", kind: "video", durationLabel: "02:22:57" }),
            lesson({ id: "linha-editorial", title: "Linha Editorial", kind: "video", durationLabel: "02:28:40" }),
            lesson({ id: "promessa-esteira-produtos", title: "Promessa Venusiana e Esteira de Produtos", kind: "video", durationLabel: "01:25:24" }),
            lesson({ id: "rotina-planejamento-estrategico", title: "Rotina da Empreendedora / Planejamento estrategico", kind: "video", durationLabel: "03:09:54" }),
            lesson({ id: "jornada-da-cliente", title: "Jornada da Cliente", kind: "video", durationLabel: "01:49:32" })
          ] }),
          module({ id: "ciclo-de-vendas", title: "Ciclo de Vendas", lessons: [
            lesson({ id: "manual-de-vendas", title: "Manual de Vendas", kind: "video", durationLabel: "50:31" }),
            lesson({ id: "desafio-de-vendas", title: "Desafio de Vendas", kind: "material" }),
            lesson({ id: "conheca-publico-venda-leveza", title: "Conheca seu publico e venda com leveza", kind: "video", durationLabel: "02:03:14" }),
            lesson({ id: "follow-up-fechamento-vendas", title: "Follow UP - Fechamento Desafio de Vendas", kind: "video", durationLabel: "02:12:59" })
          ] })
        ]
      }),
      course({
        id: "hotseat-selvagem",
        title: "Hotseat Selvagem",
        description: "Encontros e hotseats da Mentoria Selvagem.",
        durationLabel: "31h 39m",
        coverImagePath: "/assets/ponto-comum/courses/hotseat-selvagem.jpg",
        modules: [
          module({ id: "orientacoes-hotseat", title: "Orientacoes para participar do Hotseat", lessons: [lesson({ id: "orientacoes-para-participar-hotseat", title: "Orientacoes para participar do hotseat", kind: "material" })] }),
          module({ id: "hotseat-2026", title: "Hotseat Selvagem 2026", lessons: [
            lesson({ id: "hotseat-13-2026-05-14", title: "Hotseat Selvagem 13 - 14/05/2026", kind: "live", durationLabel: "02:44:18" }),
            lesson({ id: "hotseat-12-2026-04-16", title: "Hotseat Selvagem 12 - 16/04/2026", kind: "live", durationLabel: "02:33:06" }),
            lesson({ id: "hotseat-11-2026-04-02", title: "Hotseat Selvagem 11 - 02/04/2026", kind: "live", durationLabel: "01:39:19" }),
            lesson({ id: "hotseat-10-2026-03-19", title: "Hotseat Selvagem 10 - 19/03/2026", kind: "live", durationLabel: "03:33:03" }),
            lesson({ id: "hotseat-09-2026-03-05", title: "Hotseat Selvagem 09 - 05/03/2026", kind: "live", durationLabel: "01:51:43" }),
            lesson({ id: "hotseat-08-2026-02-19", title: "Hotseat Selvagem 08 - 19/02/2026", kind: "live", durationLabel: "03:12:20" }),
            lesson({ id: "hotseat-07-2026-02-05", title: "Hotseat Selvagem 07 - 05/02/2026", kind: "live", durationLabel: "02:57:54" }),
            lesson({ id: "hotseat-06-2026-01-22", title: "Hotseat Selvagem 06 - 22/01/2026", kind: "live", durationLabel: "02:50:36" }),
            lesson({ id: "hotseat-05-2026-01-08", title: "Hotseat Selvagem 05 - 08/01/2026", kind: "live", durationLabel: "02:21:45" })
          ] }),
          module({ id: "hotseat-2025", title: "Hotseat Selvagem 2025", lessons: [
            lesson({ id: "hotseat-04-2025-12-11", title: "Hotseat Selvagem 04 - 11/12/2025", kind: "live", durationLabel: "02:21:27" }),
            lesson({ id: "hotseat-03-2025-11-27", title: "Hotseat Selvagem 03 - 27/11/2025", kind: "live", durationLabel: "50:31" }),
            lesson({ id: "hotseat-02-2025-11-13", title: "Hotseat Selvagem 02 - 13/11/2025", kind: "live", durationLabel: "02:25:44" }),
            lesson({ id: "hotseat-01-2025-10-30", title: "Hotseat Selvagem 01 - 30/10/2025", kind: "live", durationLabel: "02:17:14" })
          ] })
        ]
      }),
      course({
        id: "agentes-especiais",
        title: "Agentes Especiais",
        description: "Ferramentas e agentes de apoio da Mentoria Selvagem.",
        coverImagePath: "/assets/ponto-comum/courses/agentes-especiais.jpg",
        modules: [module({ id: "agentes-especiais-modulo", title: "Agentes Especiais", lessons: [
          lesson({ id: "mentora-selvagem-ia", title: "Mentora Selvagem IA", kind: "tool" }),
          lesson({ id: "maria-inteligencia-servir-autentico", title: "MarIA - inteligencia astrologica do servir autentico", kind: "tool" })
        ] })]
      }),
      course({
        id: "tutoria-de-conteudo",
        title: "Tutoria de Conteudo",
        description: "Espaco para tutorias e orientacoes de conteudo da Mentoria Selvagem.",
        durationLabel: "7h 45m",
        coverImagePath: "/assets/ponto-comum/courses/tutoria-de-conteudo.jpg",
        modules: [module({ id: "aulas-tutoria-conteudo", title: "Aulas - Tutoria de Conteudo", description: "Tutorias gravadas por tema e data.", lessons: [
          lesson({ id: "conteudos-campanhas-vendem-2026-01-15", title: "Como criar Conteudos para Campanhas que Vendem | 15.01.26", kind: "video", durationLabel: "02:26:40" }),
          lesson({ id: "tutoria-quesia-2026-03-12", title: "Tutoria de conteudo com Quesia 12/03/2026", kind: "video", durationLabel: "02:06:29" }),
          lesson({ id: "tutoria-quesia-2026-06-10", title: "Tutoria de Conteudo com Quesia | 10.06.2026", kind: "video", durationLabel: "01:10:48" }),
          lesson({ id: "tutoria-desafio-maio-selvagem", title: "Tutoria de conteudo Quesia | Desafio Maio Selvagem", kind: "video", durationLabel: "01:00:43" }),
          lesson({ id: "tutoria-quesia-2026-07-07", title: "Tutoria de Conteudo com Quesia | 07.07.2026", kind: "video", durationLabel: "01:00:23" })
        ] })]
      }),
      course({
        id: "aulas-com-convidadas",
        title: "Aulas com Convidadas",
        description: "Aulas especiais com convidadas e materiais complementares.",
        coverImagePath: "/assets/ponto-comum/courses/aulas-com-convidadas.jpg",
        modules: [module({ id: "aulas-com-convidadas-modulo", title: "Aulas com Convidadas", lessons: [
          lesson({
            id: "aula-bonus-trafego-aline-2026-06-02",
            title: "Aula Bonus de Trafego com Aline | 02.06.26",
            kind: "video",
            summary: "Material da aula, video complementar e tarefas de casa para preparar anuncios.",
            materials: ["Estrategia de conteudo para anuncios", "Como turbinar pelo Facebook", "Roteiro para validacao conjunta"]
          })
        ] })]
      })
    ]
  }
];
var members = [
  {
    id: "m_001",
    name: "Aluna exemplo",
    email: "aluna@example.com",
    status: "active",
    trackIds: ["mentoria-selvagem"]
  },
  {
    id: "m_002",
    name: "Visitante pendente",
    email: "pendente@example.com",
    status: "pending",
    trackIds: []
  }
];
function getVisibleTracksForMember(member, allTracks = tracks) {
  if (member.status !== "active") {
    return [];
  }
  const allowed = new Set(member.trackIds);
  return allTracks.filter((track) => allowed.has(track.id));
}
function countLessons(track) {
  return track.courses.reduce(
    (courseTotal, course2) => courseTotal + course2.modules.reduce((moduleTotal, moduleItem) => moduleTotal + moduleItem.lessons.length, 0),
    0
  );
}
function countModules(track) {
  return track.courses.reduce((total, courseItem) => total + courseItem.modules.length, 0);
}
function countCourseLessons(courseItem) {
  return courseItem.modules.reduce((total, moduleItem) => total + moduleItem.lessons.length, 0);
}
function findTrackById(trackId, allTracks = tracks) {
  return allTracks.find((track) => track.id === trackId);
}
function findCourseById(courseId, allTracks = tracks) {
  for (const track of allTracks) {
    const foundCourse = track.courses.find((courseItem) => courseItem.id === courseId);
    if (foundCourse) {
      return { track, course: foundCourse };
    }
  }
  return void 0;
}
function findLessonById(lessonId, allTracks = tracks) {
  for (const track of allTracks) {
    for (const courseItem of track.courses) {
      for (const moduleItem of courseItem.modules) {
        const foundLesson = moduleItem.lessons.find((lessonItem) => lessonItem.id === lessonId);
        if (foundLesson) {
          return { track, course: courseItem, module: moduleItem, lesson: foundLesson };
        }
      }
    }
  }
  return void 0;
}
function getFirstLesson(courseItem) {
  return courseItem.modules.flatMap((moduleItem) => moduleItem.lessons)[0];
}
function searchCatalog(query, allTracks = tracks) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }
  const matches = (value) => value?.toLowerCase().includes(normalizedQuery) ?? false;
  const results = [];
  for (const track of allTracks) {
    if (matches(track.name) || matches(track.description)) {
      results.push({ type: "track", id: track.id, title: track.name, subtitle: "Jornada", trackId: track.id });
    }
    for (const courseItem of track.courses) {
      if (matches(courseItem.title) || matches(courseItem.description)) {
        results.push({
          type: "course",
          id: courseItem.id,
          title: courseItem.title,
          subtitle: track.name,
          trackId: track.id,
          courseId: courseItem.id
        });
      }
      for (const moduleItem of courseItem.modules) {
        if (matches(moduleItem.title) || matches(moduleItem.description)) {
          results.push({
            type: "module",
            id: moduleItem.id,
            title: moduleItem.title,
            subtitle: courseItem.title,
            trackId: track.id,
            courseId: courseItem.id,
            moduleId: moduleItem.id
          });
        }
        for (const lessonItem of moduleItem.lessons) {
          if (matches(lessonItem.title) || matches(lessonItem.summary)) {
            results.push({
              type: "lesson",
              id: lessonItem.id,
              title: lessonItem.title,
              subtitle: `${courseItem.title} / ${moduleItem.title}`,
              trackId: track.id,
              courseId: courseItem.id,
              moduleId: moduleItem.id,
              lessonId: lessonItem.id
            });
          }
        }
      }
    }
  }
  return results;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/appearance.ts
var lightPalette = {
  appBg: "#f4f1ea",
  panelBg: "#fffaf1",
  cardBg: "#f7f4ee",
  sidebarBg: "#dceeba",
  topbarBg: "#ffffff",
  textMain: "#171512",
  textMuted: "#504c43",
  accent: "#d6a14a",
  border: "#d9d1c2",
  buttonText: "#171512"
};
var defaultThemeGradients = {
  appBg: { direction: "solid", colorBalance: 50, to: "#ffffff" },
  panelBg: { direction: "solid", colorBalance: 50, to: "#ffffff" },
  cardBg: { direction: "solid", colorBalance: 50, to: "#ffffff" },
  sidebarBg: { direction: "solid", colorBalance: 50, to: "#ffffff" },
  topbarBg: { direction: "solid", colorBalance: 50, to: "#ffffff" }
};
var defaultBackgroundOpacity = {
  appBg: 100,
  panelBg: 100,
  cardBg: 100,
  sidebarBg: 100,
  topbarBg: 100
};
var defaultAppearance = {
  brandName: "C\xEDrculo",
  loginPreposition: "no",
  logoImagePath,
  logoDarkImagePath: logoImagePath,
  faviconImagePath: logoImagePath,
  // A tenant must opt in to a portal banner. The platform keeps its own
  // versioned entry visual so a tenant asset can never become another
  // tenant's fallback.
  bannerImagePath: "",
  openingBackgroundImagePath: "/assets/ponto-comum/opening/circulo-default-login.png",
  openingPanelImagePath: "",
  customFontPath: "",
  portalTitle: "Jornadas",
  cardSize: "large",
  fontHeading: "system",
  fontBody: "system",
  fontHeadingWeight: 700,
  fontBodyWeight: 400,
  fontHeadingStyle: "normal",
  fontBodyStyle: "normal",
  fontHeadingScale: 1,
  fontBodyScale: 1,
  fontHeadingLineHeight: 1.15,
  fontBodyLineHeight: 1.5,
  fontHeadingLetterSpacing: 0,
  fontBodyLetterSpacing: 0,
  sidebarWidth: "regular",
  logoPosition: "left",
  light: lightPalette,
  dark: {
    appBg: "#111111",
    panelBg: "#171717",
    cardBg: "#1d1d1f",
    sidebarBg: "#151515",
    topbarBg: "#121212",
    textMain: "#f8f8f8",
    textMuted: "#b7b7b8",
    accent: lightPalette.accent,
    border: "#303030",
    buttonText: "#111111"
  },
  lightGradients: defaultThemeGradients,
  darkGradients: defaultThemeGradients,
  lightBackgroundOpacity: defaultBackgroundOpacity,
  darkBackgroundOpacity: defaultBackgroundOpacity,
  lightBorderWidth: 1,
  darkBorderWidth: 1,
  lightScrollbar: { track: "#ebe5da", thumb: "#b8ae9d", sidebarTrack: "#dceeba", sidebarThumb: "#9aaa72", width: 10 },
  darkScrollbar: { track: "#171717", thumb: "#555555", sidebarTrack: "#151515", sidebarThumb: "#555555", width: 10 },
  darkMode: "auto",
  defaultColorMode: "dark",
  studentNav: {
    portal: "Portal",
    journey: "Jornada",
    favorites: "Favoritos",
    profile: "Perfil",
    account: "Conta",
    support: "Suporte"
  }
};
var hexColor = /^#[0-9a-f]{6}$/i;
var appearanceFonts = /* @__PURE__ */ new Set(["system", "serif", "sans", "humanist", "mono", "montserrat", "cormorant", "playfair", "lora", "poppins", "dmSans", "custom"]);
var fontWeights = /* @__PURE__ */ new Set([300, 400, 500, 600, 700, 800]);
var fontStyles = /* @__PURE__ */ new Set(["normal", "italic"]);
var cardSizes = /* @__PURE__ */ new Set(["compact", "comfortable", "large"]);
var sidebarWidths = /* @__PURE__ */ new Set(["narrow", "regular", "wide"]);
var logoPositions = /* @__PURE__ */ new Set(["left", "center"]);
var darkModes = /* @__PURE__ */ new Set(["auto", "custom"]);
var colorModes = /* @__PURE__ */ new Set(["light", "dark", "system"]);
var gradientDirections = /* @__PURE__ */ new Set(["solid", "horizontal", "vertical", "diagonal"]);
function validText(value, fallback, maxLength = 160) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength ? value.trim() : fallback;
}
function normalizePalette(input, fallback) {
  if (!input || typeof input !== "object") return fallback;
  const source = input;
  const palette = { ...fallback };
  for (const key of Object.keys(palette)) {
    if (source[key] === void 0) continue;
    if (typeof source[key] !== "string" || !hexColor.test(source[key])) return fallback;
    palette[key] = source[key];
  }
  return palette;
}
function validOptionalAsset(value, fallback) {
  if (value === "") return "";
  return typeof value === "string" && /^(\/assets\/|\/uploads\/)/.test(value) && value.length <= 500 ? value : fallback;
}
function normalizeGradients(input, fallback) {
  if (!input || typeof input !== "object") return fallback;
  const source = input;
  const gradients = { ...fallback };
  for (const key of Object.keys(fallback)) {
    const value = source[key];
    if (!value || typeof value !== "object") continue;
    const item = value;
    const legacyDirection = item.enabled === true ? "diagonal" : "solid";
    const direction = gradientDirections.has(item.direction) ? item.direction : legacyDirection;
    const rawColorBalance = typeof item.colorBalance === "number" && Number.isFinite(item.colorBalance) ? item.colorBalance : 50;
    gradients[key] = {
      direction,
      colorBalance: Math.min(100, Math.max(0, Math.round(rawColorBalance))),
      to: typeof item.to === "string" && hexColor.test(item.to) ? item.to : fallback[key].to
    };
  }
  return gradients;
}
function normalizeBackgroundOpacity(input, fallback) {
  if (!input || typeof input !== "object") return fallback;
  const source = input;
  const opacity = { ...fallback };
  for (const key of Object.keys(fallback)) {
    const value = source[key];
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    opacity[key] = Math.min(100, Math.max(0, Math.round(value)));
  }
  return opacity;
}
function normalizeBorderWidth(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(4, Math.max(0, Math.round(value * 2) / 2)) : fallback;
}
function normalizeScrollbar(input, fallback) {
  if (!input || typeof input !== "object") return fallback;
  const source = input;
  return {
    track: typeof source.track === "string" && hexColor.test(source.track) ? source.track : fallback.track,
    thumb: typeof source.thumb === "string" && hexColor.test(source.thumb) ? source.thumb : fallback.thumb,
    sidebarTrack: typeof source.sidebarTrack === "string" && hexColor.test(source.sidebarTrack) ? source.sidebarTrack : fallback.sidebarTrack,
    sidebarThumb: typeof source.sidebarThumb === "string" && hexColor.test(source.sidebarThumb) ? source.sidebarThumb : fallback.sidebarThumb,
    width: typeof source.width === "number" && Number.isFinite(source.width) ? Math.min(18, Math.max(4, Math.round(source.width))) : fallback.width
  };
}
function normalizeFontNumber(value, fallback, min, max, step) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  const normalized = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, Number(normalized.toFixed(2))));
}
function deriveDarkPalette(light) {
  return { ...defaultAppearance.dark, accent: light.accent };
}
function normalizeAppearance(input) {
  if (!input || typeof input !== "object") return defaultAppearance;
  const source = input;
  const studentNav = source.studentNav && typeof source.studentNav === "object" ? source.studentNav : {};
  const light = normalizePalette(source.light, defaultAppearance.light);
  const customDark = normalizePalette(source.dark, defaultAppearance.dark);
  const lightGradients = normalizeGradients(source.lightGradients, defaultAppearance.lightGradients);
  const darkGradients = normalizeGradients(source.darkGradients, defaultAppearance.darkGradients);
  const lightBackgroundOpacity = normalizeBackgroundOpacity(source.lightBackgroundOpacity, defaultAppearance.lightBackgroundOpacity);
  const darkBackgroundOpacity = normalizeBackgroundOpacity(source.darkBackgroundOpacity, defaultAppearance.darkBackgroundOpacity);
  return {
    ...defaultAppearance,
    brandName: validText(source.brandName, defaultAppearance.brandName),
    loginPreposition: source.loginPreposition === "na" || source.loginPreposition === "no" ? source.loginPreposition : defaultAppearance.loginPreposition,
    logoImagePath: validText(source.logoImagePath, defaultAppearance.logoImagePath, 500),
    logoDarkImagePath: validText(source.logoDarkImagePath, defaultAppearance.logoDarkImagePath, 500),
    faviconImagePath: validText(source.faviconImagePath, defaultAppearance.faviconImagePath, 500),
    bannerImagePath: validOptionalAsset(source.bannerImagePath, defaultAppearance.bannerImagePath),
    openingBackgroundImagePath: validOptionalAsset(source.openingBackgroundImagePath, defaultAppearance.openingBackgroundImagePath),
    openingPanelImagePath: validOptionalAsset(source.openingPanelImagePath, defaultAppearance.openingPanelImagePath),
    customFontPath: validOptionalAsset(source.customFontPath, defaultAppearance.customFontPath),
    portalTitle: validText(source.portalTitle, defaultAppearance.portalTitle),
    cardSize: cardSizes.has(source.cardSize) ? source.cardSize : defaultAppearance.cardSize,
    fontHeading: appearanceFonts.has(source.fontHeading) ? source.fontHeading : defaultAppearance.fontHeading,
    fontBody: appearanceFonts.has(source.fontBody) ? source.fontBody : defaultAppearance.fontBody,
    fontHeadingWeight: fontWeights.has(source.fontHeadingWeight) ? source.fontHeadingWeight : defaultAppearance.fontHeadingWeight,
    fontBodyWeight: fontWeights.has(source.fontBodyWeight) ? source.fontBodyWeight : defaultAppearance.fontBodyWeight,
    fontHeadingStyle: fontStyles.has(source.fontHeadingStyle) ? source.fontHeadingStyle : defaultAppearance.fontHeadingStyle,
    fontBodyStyle: fontStyles.has(source.fontBodyStyle) ? source.fontBodyStyle : defaultAppearance.fontBodyStyle,
    fontHeadingScale: normalizeFontNumber(source.fontHeadingScale, defaultAppearance.fontHeadingScale, 0.85, 1.25, 0.05),
    fontBodyScale: normalizeFontNumber(source.fontBodyScale, defaultAppearance.fontBodyScale, 0.9, 1.2, 0.05),
    fontHeadingLineHeight: normalizeFontNumber(source.fontHeadingLineHeight, defaultAppearance.fontHeadingLineHeight, 1, 2, 0.05),
    fontBodyLineHeight: normalizeFontNumber(source.fontBodyLineHeight, defaultAppearance.fontBodyLineHeight, 1, 2, 0.05),
    fontHeadingLetterSpacing: normalizeFontNumber(source.fontHeadingLetterSpacing, defaultAppearance.fontHeadingLetterSpacing, -0.04, 0.2, 0.01),
    fontBodyLetterSpacing: normalizeFontNumber(source.fontBodyLetterSpacing, defaultAppearance.fontBodyLetterSpacing, -0.02, 0.12, 0.01),
    sidebarWidth: sidebarWidths.has(source.sidebarWidth) ? source.sidebarWidth : defaultAppearance.sidebarWidth,
    logoPosition: logoPositions.has(source.logoPosition) ? source.logoPosition : defaultAppearance.logoPosition,
    light,
    dark: source.darkMode === "auto" ? deriveDarkPalette(light) : customDark,
    lightGradients,
    darkGradients,
    lightBackgroundOpacity,
    darkBackgroundOpacity,
    lightBorderWidth: normalizeBorderWidth(source.lightBorderWidth, defaultAppearance.lightBorderWidth),
    darkBorderWidth: normalizeBorderWidth(source.darkBorderWidth, defaultAppearance.darkBorderWidth),
    lightScrollbar: normalizeScrollbar(source.lightScrollbar, defaultAppearance.lightScrollbar),
    darkScrollbar: normalizeScrollbar(source.darkScrollbar, defaultAppearance.darkScrollbar),
    darkMode: darkModes.has(source.darkMode) ? source.darkMode : defaultAppearance.darkMode,
    defaultColorMode: colorModes.has(source.defaultColorMode) ? source.defaultColorMode : defaultAppearance.defaultColorMode,
    studentNav: {
      portal: validText(studentNav.portal, defaultAppearance.studentNav.portal, 60),
      journey: validText(studentNav.journey, defaultAppearance.studentNav.journey, 60),
      favorites: validText(studentNav.favorites, defaultAppearance.studentNav.favorites, 60),
      profile: validText(studentNav.profile, defaultAppearance.studentNav.profile, 60),
      account: validText(studentNav.account, defaultAppearance.studentNav.account, 60),
      support: validText(studentNav.support, defaultAppearance.studentNav.support, 60)
    }
  };
}
function appearanceCssVariables(appearance, mode) {
  const palette = mode === "dark" && appearance.darkMode === "auto" ? deriveDarkPalette(appearance.light) : mode === "dark" ? appearance.dark : appearance.light;
  const gradients = mode === "dark" && appearance.darkMode === "custom" ? appearance.darkGradients : mode === "light" ? appearance.lightGradients : defaultThemeGradients;
  const opacity = mode === "dark" && appearance.darkMode === "custom" ? appearance.darkBackgroundOpacity : mode === "light" ? appearance.lightBackgroundOpacity : defaultBackgroundOpacity;
  const borderWidth = mode === "dark" ? appearance.darkBorderWidth : appearance.lightBorderWidth;
  const scrollbar = mode === "dark" ? appearance.darkScrollbar : appearance.lightScrollbar;
  const gradientAngles = {
    horizontal: "90deg",
    vertical: "180deg",
    diagonal: "135deg"
  };
  const background = (key) => {
    const gradient = gradients[key];
    const alpha = opacity[key] / 100;
    const color = (hex) => alpha === 1 ? hex : `${hex}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
    return gradient.direction === "solid" ? color(palette[key]) : `linear-gradient(${gradientAngles[gradient.direction]}, ${color(palette[key])} 0%, ${color(palette[key])} ${gradient.colorBalance}%, ${color(gradient.to)} 100%)`;
  };
  const font = (name) => name === "serif" ? "Georgia, Cambria, serif" : name === "sans" ? "Arial, Helvetica, sans-serif" : name === "humanist" ? "Trebuchet MS, Segoe UI, sans-serif" : name === "mono" ? "SFMono-Regular, Consolas, Liberation Mono, monospace" : name === "montserrat" ? "Montserrat, sans-serif" : name === "cormorant" ? "Cormorant Garamond, Georgia, serif" : name === "playfair" ? "Playfair Display, Georgia, serif" : name === "lora" ? "Lora, Georgia, serif" : name === "poppins" ? "Poppins, sans-serif" : name === "dmSans" ? "DM Sans, sans-serif" : name === "custom" && appearance.customFontPath ? "ProjectCustom, system-ui, sans-serif" : "system-ui, sans-serif";
  const sidebarWidth = appearance.sidebarWidth === "narrow" ? "240px" : appearance.sidebarWidth === "wide" ? "300px" : "268px";
  return {
    "--app-bg": background("appBg"),
    "--panel-bg": background("panelBg"),
    "--card-bg": background("cardBg"),
    "--topbar-bg": background("topbarBg"),
    "--input-bg": background("panelBg"),
    "--soft-bg": palette.border,
    "--hover-bg": palette.border,
    "--border-color": palette.border,
    "--border-width": `${borderWidth}px`,
    "--text-main": palette.textMain,
    "--text-muted": palette.textMuted,
    "--text-soft": palette.textMuted,
    "--chip-bg": palette.panelBg,
    "--chip-active-bg": palette.accent,
    "--chip-active-text": palette.buttonText,
    "--student-sidebar": background("sidebarBg"),
    "--student-sidebar-active": palette.accent,
    "--student-sidebar-text": palette.textMain,
    "--student-topbar": palette.topbarBg,
    "--student-topbar-text": palette.textMain,
    "--student-search": palette.panelBg,
    "--accent-color": palette.accent,
    "--sidebar-width": sidebarWidth,
    "--logo-justify": appearance.logoPosition === "center" ? "center" : "flex-start",
    "--auth-visual-image": appearance.openingBackgroundImagePath ? `url("${appearance.openingBackgroundImagePath}")` : "none",
    "--auth-panel-image": appearance.openingPanelImagePath ? `url("${appearance.openingPanelImagePath}")` : "none",
    "--custom-font-src": appearance.customFontPath ? `url("${appearance.customFontPath}")` : "none",
    "--heading-font": font(appearance.fontHeading),
    "--body-font": font(appearance.fontBody),
    "--heading-weight": `${appearance.fontHeadingWeight}`,
    "--body-weight": `${appearance.fontBodyWeight}`,
    "--heading-style": appearance.fontHeadingStyle,
    "--body-style": appearance.fontBodyStyle,
    "--heading-size-scale": `${appearance.fontHeadingScale}`,
    "--body-size-scale": `${appearance.fontBodyScale}`,
    "--heading-line-height": `${appearance.fontHeadingLineHeight}`,
    "--body-line-height": `${appearance.fontBodyLineHeight}`,
    "--heading-letter-spacing": `${appearance.fontHeadingLetterSpacing}em`,
    "--body-letter-spacing": `${appearance.fontBodyLetterSpacing}em`,
    "--scrollbar-track": scrollbar.track,
    "--scrollbar-thumb": scrollbar.thumb,
    "--sidebar-scrollbar-track": scrollbar.sidebarTrack,
    "--sidebar-scrollbar-thumb": scrollbar.sidebarThumb,
    "--scrollbar-width": `${scrollbar.width}px`
  };
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/html-media.ts
var HTML_LESSON_PREFIX = "/html-lessons/";
var MAX_HTML_LESSON_BYTES = 50 * 1024 * 1024;
var htmlFilenamePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.html$/;
function isHtmlLessonReference(reference) {
  return reference.startsWith(HTML_LESSON_PREFIX) && htmlFilenamePattern.test(reference.slice(HTML_LESSON_PREFIX.length));
}
function publicHttpsUrl(value) {
  if (!/^https:\/\//i.test(value) || value.length > 2e3 || /[\s\\\x00-\x1f\x7f]/.test(value)) return null;
  try {
    const url = new URL(value);
    const host = url.hostname;
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.search) return null;
    if (!/^[a-z0-9.-]+$/.test(host) || host.endsWith(".") || !host.includes(".") || /^\d+(\.\d+)*$/.test(host)) return null;
    if (host.split(".").some((label) => !label || label.length > 63 || label.startsWith("-") || label.endsWith("-"))) return null;
    if (/\.(localhost|local|localdomain|internal|lan|home|invalid|test|arpa)$/.test(host)) return null;
    return url;
  } catch {
    return null;
  }
}
function normalizeHtmlEmbedOrigins(value) {
  if (value === void 0 || value === null) return [];
  if (!Array.isArray(value)) throw new Error("Informe ate 20 origens HTTPS para HTML externo.");
  const candidates = value.filter((item) => !(typeof item === "string" && !item.trim()));
  if (candidates.length > 20) throw new Error("Informe ate 20 origens HTTPS para HTML externo.");
  return [...new Set(candidates.map((item) => {
    const url = typeof item === "string" ? publicHttpsUrl(item.trim()) : null;
    if (!url || url.pathname !== "/" || url.hash) throw new Error("Origem HTML deve ser HTTPS publica, sem caminho, query ou credenciais.");
    return url.origin;
  }))];
}
function resolveExternalHtml(reference, allowedOrigins, appHostname) {
  const url = publicHttpsUrl(reference);
  if (!url || appHostname && url.hostname === appHostname.split(":")[0].toLowerCase()) return null;
  try {
    return normalizeHtmlEmbedOrigins(allowedOrigins).includes(url.origin) ? url.href : null;
  } catch {
    return null;
  }
}
function isHtmlMedia(media) {
  return Boolean(media && (media.type === "internal" && isHtmlLessonReference(media.reference) || media.provider === "html"));
}
var HTML_DOCUMENT_CSP = [
  "sandbox allow-scripts",
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src data:",
  "font-src data:",
  "connect-src 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "worker-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'self'"
].join("; ");

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/project-settings.ts
var defaults = {
  timezone: "America/Sao_Paulo",
  locale: "pt-BR",
  projectEmail: null,
  registrationMode: "invite_only",
  requireEmailVerification: true,
  allowSelfEnrollment: false,
  sessionDurationMinutes: 1440,
  notificationEmail: null,
  welcomeMessage: null,
  videoProvider: "bunny",
  customDomain: null,
  defaultTrackSlug: null,
  commentsEnabled: true,
  favoritesEnabled: true,
  rankingEnabled: true,
  privacyUrl: null,
  termsUrl: null,
  dataRetentionDays: null,
  htmlEmbedAllowedOrigins: []
};
function cleanText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength ? value.trim() : null;
}
function email(value, label) {
  const result = cleanText(value, 254)?.toLowerCase() ?? null;
  if (result && !/^\S+@\S+\.\S+$/.test(result)) throw new Error(`Invalid ${label}.`);
  return result;
}
function optionalHttps(value, label) {
  const result = cleanText(value, 500);
  if (!result) return null;
  try {
    const url = new URL(result);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error();
  } catch {
    throw new Error(`${label} must use HTTPS.`);
  }
  return result;
}
function normalizeOperational(input) {
  const source = input && typeof input === "object" ? input : {};
  if (Object.keys(source).some((key) => !Object.prototype.hasOwnProperty.call(defaults, key))) throw new Error("Unknown project operational setting.");
  const registrationMode = source.registrationMode === "open" || source.registrationMode === "approval_required" || source.registrationMode === "invite_only" ? source.registrationMode : defaults.registrationMode;
  const locale = source.locale === "en-US" || source.locale === "es-ES" || source.locale === "pt-BR" ? source.locale : defaults.locale;
  const videoProvider = source.videoProvider === "youtube" || source.videoProvider === "other" || source.videoProvider === "bunny" ? source.videoProvider : defaults.videoProvider;
  const sessionDurationMinutes = typeof source.sessionDurationMinutes === "number" && Number.isInteger(source.sessionDurationMinutes) ? Math.min(43200, Math.max(15, source.sessionDurationMinutes)) : defaults.sessionDurationMinutes;
  const retention = source.dataRetentionDays === null ? null : typeof source.dataRetentionDays === "number" && Number.isInteger(source.dataRetentionDays) ? Math.min(3650, Math.max(30, source.dataRetentionDays)) : defaults.dataRetentionDays;
  return {
    timezone: cleanText(source.timezone, 80) ?? defaults.timezone,
    locale,
    projectEmail: email(source.projectEmail, "project email"),
    registrationMode,
    requireEmailVerification: typeof source.requireEmailVerification === "boolean" ? source.requireEmailVerification : defaults.requireEmailVerification,
    allowSelfEnrollment: typeof source.allowSelfEnrollment === "boolean" ? source.allowSelfEnrollment : defaults.allowSelfEnrollment,
    sessionDurationMinutes,
    notificationEmail: email(source.notificationEmail, "notification email"),
    welcomeMessage: cleanText(source.welcomeMessage, 2e3),
    videoProvider,
    customDomain: cleanText(source.customDomain, 253)?.toLowerCase() ?? null,
    defaultTrackSlug: cleanText(source.defaultTrackSlug, 120),
    commentsEnabled: typeof source.commentsEnabled === "boolean" ? source.commentsEnabled : defaults.commentsEnabled,
    favoritesEnabled: typeof source.favoritesEnabled === "boolean" ? source.favoritesEnabled : defaults.favoritesEnabled,
    rankingEnabled: typeof source.rankingEnabled === "boolean" ? source.rankingEnabled : defaults.rankingEnabled,
    privacyUrl: optionalHttps(source.privacyUrl, "Privacy URL"),
    termsUrl: optionalHttps(source.termsUrl, "Terms URL"),
    dataRetentionDays: retention,
    htmlEmbedAllowedOrigins: normalizeHtmlEmbedOrigins(source.htmlEmbedAllowedOrigins)
  };
}
function defaultProjectSettings() {
  return { supportEmail: null, supportSenderName: null, publicAppOrigin: null, videoEmbedBaseUrl: null, operational: { ...defaults, htmlEmbedAllowedOrigins: [] } };
}
function normalizeProjectSettings(input) {
  const source = input && typeof input === "object" ? input : {};
  const supportEmail = email(source.supportEmail, "support email");
  const publicAppOrigin = cleanText(source.publicAppOrigin, 300);
  const videoEmbedBaseUrl = cleanText(source.videoEmbedBaseUrl, 300);
  if (publicAppOrigin && !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(publicAppOrigin)) throw new Error("Public app origin must use HTTPS.");
  if (videoEmbedBaseUrl) {
    try {
      const url = new URL(videoEmbedBaseUrl);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error();
    } catch {
      throw new Error("Video embed base URL must use HTTPS without credentials, query or fragment.");
    }
  }
  const operational = normalizeOperational(source.operational ?? source.operationalConfig);
  if (publicAppOrigin && operational.htmlEmbedAllowedOrigins?.includes(new URL(publicAppOrigin).origin)) throw new Error("HTML externo precisa usar origem diferente do aplicativo.");
  return { supportEmail, supportSenderName: cleanText(source.supportSenderName, 120), publicAppOrigin, videoEmbedBaseUrl, operational };
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-courses-api.ts
function getFetch(fetcher) {
  return fetcher ?? fetch;
}
async function createAdminCourse(input, fetcher) {
  const response = await getFetch(fetcher)("/admin/courses", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel criar o curso.");
  const payload = await response.json();
  if (!payload.course) throw new Error("Resposta de curso invalida.");
  return payload.course;
}
async function updateAdminCourse(input, fetcher) {
  const { courseSlug, ...body } = input;
  const response = await getFetch(fetcher)(`/admin/courses/${encodeURIComponent(courseSlug)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Nao foi possivel atualizar o curso.");
  const payload = await response.json();
  if (!payload.course) throw new Error("Resposta de curso invalida.");
  return payload.course;
}
async function deleteAdminCourse(input, fetcher) {
  const params = new URLSearchParams({ trackSlug: input.trackSlug });
  const response = await getFetch(fetcher)(`/admin/courses/${encodeURIComponent(input.courseSlug)}?${params.toString()}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel excluir o curso.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-tracks-api.ts
function getFetch2(fetcher) {
  return fetcher ?? fetch;
}
async function createAdminTrack(input, fetcher) {
  const response = await getFetch2(fetcher)("/admin/tracks", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel criar a jornada.");
  const payload = await response.json();
  if (!payload.track) throw new Error("Resposta de jornada invalida.");
  return payload.track;
}
async function updateAdminTrack(input, fetcher) {
  const { trackSlug, ...body } = input;
  const response = await getFetch2(fetcher)(`/admin/tracks/${encodeURIComponent(trackSlug)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Nao foi possivel atualizar a jornada.");
  const payload = await response.json();
  if (!payload.track) throw new Error("Resposta de jornada invalida.");
  return payload.track;
}
async function deleteAdminTrack(input, fetcher) {
  const response = await getFetch2(fetcher)(`/admin/tracks/${encodeURIComponent(input.trackSlug)}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel excluir a jornada.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-lessons-api.ts
function getFetch3(fetcher) {
  return fetcher ?? fetch;
}
async function createAdminLesson(input, fetcher) {
  const response = await getFetch3(fetcher)("/admin/lessons", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel criar a aula.");
  const payload = await response.json();
  if (!payload.lesson) throw new Error("Resposta de aula invalida.");
  return payload.lesson;
}
async function updateAdminLesson(input, fetcher) {
  const { lessonSlug, ...body } = input;
  const response = await getFetch3(fetcher)(`/admin/lessons/${encodeURIComponent(lessonSlug)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Nao foi possivel atualizar a aula.");
  const payload = await response.json();
  if (!payload.lesson) throw new Error("Resposta de aula invalida.");
  return payload.lesson;
}
async function reorderAdminLessons(input, fetcher) {
  const response = await getFetch3(fetcher)("/admin/lessons/order", {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel ordenar as aulas.");
}
async function deleteAdminLesson(input, fetcher) {
  const params = new URLSearchParams({ courseSlug: input.courseSlug, moduleSlug: input.moduleSlug });
  const response = await getFetch3(fetcher)(`/admin/lessons/${encodeURIComponent(input.lessonSlug)}?${params.toString()}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel excluir a aula.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-modules-api.ts
function getFetch4(fetcher) {
  return fetcher ?? fetch;
}
async function createAdminModule(input, fetcher) {
  const response = await getFetch4(fetcher)("/admin/modules", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel criar o modulo.");
  const payload = await response.json();
  if (!payload.module) throw new Error("Resposta de modulo invalida.");
  return payload.module;
}
async function updateAdminModule(input, fetcher) {
  const { moduleSlug, ...body } = input;
  const response = await getFetch4(fetcher)(`/admin/modules/${encodeURIComponent(moduleSlug)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Nao foi possivel atualizar o modulo.");
  const payload = await response.json();
  if (!payload.module) throw new Error("Resposta de modulo invalida.");
  return payload.module;
}
async function deleteAdminModule(input, fetcher) {
  const params = new URLSearchParams({ courseSlug: input.courseSlug });
  const response = await getFetch4(fetcher)(`/admin/modules/${encodeURIComponent(input.moduleSlug)}?${params.toString()}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel excluir o modulo.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-students-api.ts
function getFetch5(fetcher) {
  return fetcher ?? fetch;
}
async function fetchAdminStudents(fetcher) {
  const response = await getFetch5(fetcher)("/admin/students", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as alunas.");
  const payload = await response.json();
  if (!Array.isArray(payload.students)) throw new Error("Resposta de alunas invalida.");
  return payload.students;
}
async function createAdminStudent(input, fetcher) {
  const response = await getFetch5(fetcher)("/admin/students", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel criar a aluna.");
  const payload = await response.json();
  if (!payload.student) throw new Error("Resposta de aluna invalida.");
  return { ...payload.student, invitation: payload.invitation };
}
async function grantAdminStudentAccess(input, fetcher) {
  const response = await getFetch5(fetcher)(`/admin/students/${encodeURIComponent(input.userId)}/access`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ trackSlug: input.trackSlug })
  });
  if (!response.ok) throw new Error("Nao foi possivel conceder acesso.");
}
async function revokeAdminStudentAccess(input, fetcher) {
  const response = await getFetch5(fetcher)(`/admin/students/${encodeURIComponent(input.userId)}/access/${encodeURIComponent(input.trackSlug)}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel remover acesso.");
}
async function resendAdminStudentInvitation(userId, fetcher) {
  const response = await getFetch5(fetcher)(`/admin/students/${encodeURIComponent(userId)}/invitation`, { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel reenviar o convite.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/auth-api.ts
function getFetch6(fetcher) {
  return fetcher ?? fetch;
}
function parseUser(value) {
  if (!value || typeof value !== "object") return null;
  const user = value;
  if (typeof user.id !== "string") return null;
  if (typeof user.email !== "string") return null;
  if (typeof user.name !== "string") return null;
  if (user.role !== "admin" && user.role !== "student") return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role, platformAdmin: user.platformAdmin === true };
}
async function readAuthUser(response) {
  const payload = await response.json();
  const user = parseUser(payload.user);
  if (!user) throw new Error("Resposta de autenticacao invalida.");
  return user;
}
async function fetchCurrentUser(fetcher) {
  const response = await getFetch6(fetcher)("/auth/me", { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Nao foi possivel carregar a sessao.");
  return readAuthUser(response);
}
async function loginWithPassword(credentials, fetcher) {
  const response = await getFetch6(fetcher)("/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) throw new Error("Email ou senha invalidos.");
  return readAuthUser(response);
}
async function requestPasswordReset(input, fetcher) {
  const response = await getFetch6(fetcher)("/auth/password-reset/request", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel solicitar a recuperacao de senha.");
}
async function confirmPasswordReset(input, fetcher) {
  const response = await getFetch6(fetcher)("/auth/password-reset/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Link invalido ou expirado.");
}
async function confirmInvitation(input, fetcher) {
  const response = await getFetch6(fetcher)("/auth/invitation/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Convite invalido ou expirado.");
}
async function changePassword(input, fetcher) {
  const response = await getFetch6(fetcher)("/auth/password", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel alterar a senha.");
}
async function logoutSession(fetcher) {
  const response = await getFetch6(fetcher)("/auth/logout", { method: "POST", credentials: "include" });
  if (!response.ok && response.status !== 401) throw new Error("Nao foi possivel encerrar a sessao.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/circle-signup-api.ts
async function requestCircleSignup(input, fetcher = fetch) {
  const response = await fetcher("/public/circle-signups", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Nao foi possivel enviar a solicitacao.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/catalog-api.ts
function getFetch7(fetcher) {
  return fetcher ?? fetch;
}
function isTrackList(value) {
  if (!Array.isArray(value)) return false;
  return value.every((track) => {
    if (!track || typeof track !== "object") return false;
    const item = track;
    return typeof item.id === "string" && typeof item.name === "string" && Array.isArray(item.courses);
  });
}
async function fetchCatalogTracks(fetcher) {
  const response = await getFetch7(fetcher)("/catalog/tracks", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o catalogo.");
  const payload = await response.json();
  if (!isTrackList(payload.tracks)) throw new Error("Resposta de catalogo invalida.");
  return payload.tracks;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-activity-api.ts
function getFetch8(fetcher) {
  return fetcher ?? fetch;
}
function parseState(value) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  if (!Array.isArray(record.completedLessonIds) || !Array.isArray(record.favoriteLessonIds)) return null;
  return {
    completedLessonIds: record.completedLessonIds.filter((item) => typeof item === "string"),
    favoriteLessonIds: record.favoriteLessonIds.filter((item) => typeof item === "string")
  };
}
async function fetchStudentActivity(fetcher) {
  const response = await getFetch8(fetcher)("/student/activity", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar sua atividade.");
  const state = parseState(await response.json());
  if (!state) throw new Error("Resposta de atividade invalida.");
  return state;
}
async function markLessonComplete(lessonSlug, fetcher) {
  const response = await getFetch8(fetcher)("/student/progress", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lessonSlug })
  });
  if (!response.ok) throw new Error("Nao foi possivel concluir a aula.");
}
async function setLessonFavorite(lessonSlug, favorite, fetcher) {
  const response = await getFetch8(fetcher)(`/student/favorites/${encodeURIComponent(lessonSlug)}`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ favorite })
  });
  if (!response.ok) throw new Error("Nao foi possivel atualizar favorito.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-ranking-api.ts
async function fetchStudentRanking(fetcher = fetch) {
  const response = await fetcher("/student/ranking", { credentials: "include" });
  if (!response.ok) throw new Error("Unable to load ranking.");
  return response.json();
}
async function fetchAdminRanking(limit = 100, fetcher = fetch) {
  const response = await fetcher(`/admin/ranking?limit=${encodeURIComponent(String(limit))}`, { credentials: "include" });
  if (!response.ok) throw new Error("Unable to load admin ranking.");
  return response.json();
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-profile-api.ts
function parseProfile(value) {
  const profile = value;
  return {
    phone: typeof profile?.phone === "string" ? profile.phone : "",
    timezone: typeof profile?.timezone === "string" ? profile.timezone : "",
    bio: typeof profile?.bio === "string" ? profile.bio : ""
  };
}
async function fetchStudentProfile(fetcher = fetch) {
  const response = await fetcher("/student/profile", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o perfil.");
  const payload = await response.json();
  return parseProfile(payload.profile);
}
async function updateStudentProfile(profile, fetcher = fetch) {
  const response = await fetcher("/student/profile", {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(profile)
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar o perfil.");
  const payload = await response.json();
  return parseProfile(payload.profile);
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-support-api.ts
async function createSupportRequest(input, fetcher = fetch) {
  const response = await fetcher("/student/support", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error("Nao foi possivel enviar a solicitacao.");
  return await response.json();
}
async function fetchStudentNotifications(fetcher = fetch) {
  const response = await fetcher("/student/notifications", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as notificacoes.");
  const payload = await response.json();
  return Array.isArray(payload.notifications) ? payload.notifications : [];
}
async function markStudentNotificationsRead(fetcher = fetch) {
  const response = await fetcher("/student/notifications/read", { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel atualizar as notificacoes.");
}
async function fetchStudentUnreadNotificationCount(fetcher = fetch) {
  const response = await fetcher("/student/notifications/unread-count", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o contador de notificacoes.");
  const payload = await response.json();
  return typeof payload.count === "number" ? payload.count : 0;
}
async function fetchAdminSupportRequests(status, fetcher = fetch) {
  const response = await fetcher(`/admin/support${status ? `?status=${encodeURIComponent(status)}` : ""}`, { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as mensagens.");
  const payload = await response.json();
  return Array.isArray(payload.requests) ? payload.requests : [];
}
async function updateSupportRequestStatus(requestId, status, fetcher = fetch) {
  const response = await fetcher(`/admin/support/${encodeURIComponent(requestId)}/status`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
  if (!response.ok) throw new Error("Nao foi possivel atualizar a mensagem.");
  return await response.json();
}
async function fetchAdminUnreadSupportCount(fetcher = fetch) {
  const response = await fetcher("/admin/support/unread-count", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o contador de mensagens.");
  const payload = await response.json();
  return typeof payload.count === "number" ? payload.count : 0;
}
async function markAdminSupportRead(fetcher = fetch) {
  const response = await fetcher("/admin/support/read", { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel marcar as mensagens como lidas.");
}
async function replyToSupportRequest(requestId, responseText, fetcher = fetch) {
  const response = await fetcher(`/admin/support/${encodeURIComponent(requestId)}/reply`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ response: responseText }) });
  if (!response.ok) throw new Error("Nao foi possivel responder a mensagem.");
  return await response.json();
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-feedback-api.ts
function getFetch9(fetcher) {
  return fetcher ?? fetch;
}
function parseFeedback(value) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  if (!Array.isArray(record.comments) || record.rating !== null && typeof record.rating !== "number") return null;
  const comments = record.comments.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const comment = item;
    return typeof comment.id === "string" && typeof comment.body === "string" && typeof comment.authorName === "string" && typeof comment.createdAt === "string" && typeof comment.own === "boolean";
  });
  return { comments, rating: record.rating };
}
async function fetchLessonFeedback(lessonSlug, fetcher) {
  const response = await getFetch9(fetcher)(`/student/lessons/${encodeURIComponent(lessonSlug)}/feedback`, { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o feedback da aula.");
  const feedback = parseFeedback(await response.json());
  if (!feedback) throw new Error("Resposta de feedback invalida.");
  return feedback;
}
async function addLessonComment(lessonSlug, body, fetcher) {
  const response = await getFetch9(fetcher)(`/student/lessons/${encodeURIComponent(lessonSlug)}/comments`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ body }) });
  if (!response.ok) throw new Error("Nao foi possivel publicar o comentario.");
  return await response.json();
}
async function rateLesson(lessonSlug, value, fetcher) {
  const response = await getFetch9(fetcher)(`/student/lessons/${encodeURIComponent(lessonSlug)}/rating`, { method: "PUT", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ value }) });
  if (!response.ok) throw new Error("Nao foi possivel salvar sua avaliacao.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-audit-api.ts
async function fetchAdminAuditLogs(filters = {}, fetcher) {
  const params = new URLSearchParams();
  if (filters.action) params.set("action", filters.action);
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.limit) params.set("limit", String(filters.limit));
  const query = params.toString();
  const response = await (fetcher ?? fetch)("/admin/audit-logs" + (query ? "?" + query : ""), { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar o historico.");
  const payload = await response.json();
  if (!Array.isArray(payload.logs)) throw new Error("Resposta de historico invalida.");
  return payload.logs;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/appearance-api.ts
async function fetchAppearance(fetcher = fetch) {
  const response = await fetcher("/appearance", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar a aparencia.");
  const payload = await response.json();
  if (!payload.appearance || typeof payload.appearance !== "object" || Array.isArray(payload.appearance)) {
    throw new Error("Resposta de aparencia invalida.");
  }
  return normalizeAppearance(payload.appearance);
}
async function saveAppearance(settings, fetcher = fetch) {
  const response = await fetcher("/admin/appearance", {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(settings)
  });
  if (!response.ok) throw new Error("Nao foi possivel salvar a aparencia.");
  const payload = await response.json();
  return normalizeAppearance(payload.appearance);
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/AppearancePending.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function AppearancePending({ failed = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { style: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#111", color: "#eee" }, children: failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { role: "alert", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nao foi possivel carregar a aparencia deste ambiente." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => window.location.reload(), children: "Tentar novamente" })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", "aria-live": "polite", children: "Carregando ambiente..." }) });
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/project-settings-api.ts
var emptySettings = defaultProjectSettings();
async function fetchPublicVideoConfig(fetcher = fetch) {
  const response = await fetcher("/video-config", { credentials: "include" });
  if (!response.ok) return { bunnyEmbedBaseUrl: null };
  const payload = await response.json();
  return { bunnyEmbedBaseUrl: typeof payload.bunnyEmbedBaseUrl === "string" ? payload.bunnyEmbedBaseUrl : null, ...Array.isArray(payload.htmlEmbedAllowedOrigins) ? { htmlEmbedAllowedOrigins: payload.htmlEmbedAllowedOrigins.filter((item) => typeof item === "string") } : {} };
}
async function fetchProjectSettings(fetcher = fetch) {
  const response = await fetcher("/admin/project-settings", { credentials: "include" });
  if (!response.ok) return emptySettings;
  const payload = await response.json();
  return normalizeProjectSettings(payload.settings ?? emptySettings);
}
async function saveProjectSettings(settings, fetcher = fetch) {
  const response = await fetcher("/admin/project-settings", { method: "PUT", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(settings) });
  if (!response.ok) throw new Error("Nao foi possivel salvar as configuracoes do projeto.");
  const payload = await response.json();
  return normalizeProjectSettings(payload.settings ?? emptySettings);
}
async function requestProjectSubdomainChange(requestedSubdomain, fetcher = fetch) {
  const response = await fetcher("/admin/project-settings/subdomain-request", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestedSubdomain }) });
  if (!response.ok) throw new Error("Nao foi possivel solicitar a alteracao do subdominio.");
  return await response.json();
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/project-provisioning-api.ts
async function provisionProject(input, fetcher = fetch) {
  const response = await fetcher("/admin/projects", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel criar o projeto.");
  }
  return response.json();
}
async function fetchManagedProjects(fetcher = fetch) {
  const response = await fetcher("/admin/projects", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar os projetos.");
  const payload = await response.json();
  return payload.projects ?? [];
}
async function updateManagedProjectStatus(slug, status, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/status`, { method: "PATCH", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel alterar o status do projeto.");
  }
  return (await response.json()).project;
}
async function fetchProjectAdmins(slug, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/admins`, { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar os administradores.");
  return (await response.json()).admins;
}
async function addProjectAdmin(slug, email2, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/admins`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email2 }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel adicionar o administrador.");
  }
  return (await response.json()).admins;
}
async function removeProjectAdmin(slug, userId, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/admins/${encodeURIComponent(userId)}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel remover o administrador.");
  }
  return (await response.json()).admins;
}
async function fetchProjectDomains(slug, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/domains`, { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar os dominios.");
  return (await response.json()).domains;
}
async function addProjectDomain(slug, hostname, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/domains`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ hostname }) });
  if (!response.ok) throw new Error("Nao foi possivel adicionar o dominio.");
  return (await response.json()).domain;
}
async function verifyProjectDomain(slug, domainId, token, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/domains/${encodeURIComponent(domainId)}/verify`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
  if (!response.ok) throw new Error("Nao foi possivel verificar o dominio.");
  return (await response.json()).domain;
}
async function verifyProjectDomainDns(slug, domainId, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/domains/${encodeURIComponent(domainId)}/verify-dns`, { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel verificar o dominio via DNS.");
  return (await response.json()).domain;
}
async function removeProjectDomain(slug, domainId, fetcher = fetch) {
  const response = await fetcher(`/admin/projects/${encodeURIComponent(slug)}/domains/${encodeURIComponent(domainId)}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel remover o dominio.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/platform-settings-api.ts
var emptySettings2 = { bunnyAffiliateUrl: null };
async function fetchPlatformSettings(fetcher = fetch) {
  const response = await fetcher("/admin/platform-settings", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as configuracoes da plataforma.");
  const payload = await response.json();
  return { ...emptySettings2, ...payload.settings ?? {} };
}
async function savePlatformSettings(settings, fetcher = fetch) {
  const response = await fetcher("/admin/platform-settings", { method: "PUT", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(settings) });
  if (!response.ok) {
    const payload2 = await response.json().catch(() => null);
    throw new Error(payload2?.error ?? "Nao foi possivel salvar as configuracoes da plataforma.");
  }
  const payload = await response.json();
  return { ...emptySettings2, ...payload.settings ?? {} };
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/bunny-onboarding-api.ts
async function fetchBunnyOnboarding(fetcher = fetch) {
  const response = await fetcher("/admin/bunny-onboarding", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as instrucoes Bunny.");
  return await response.json();
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/circle-signups-api.ts
async function fetchCircleSignupRequests(status, fetcher = fetch) {
  const response = await fetcher(`/admin/circle-signups${status ? `?status=${encodeURIComponent(status)}` : ""}`, { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as solicitacoes.");
  return (await response.json()).requests ?? [];
}
async function decideCircleSignup(id, status, reviewNote, fetcher = fetch) {
  const response = await fetcher(`/admin/circle-signups/${encodeURIComponent(id)}`, { method: "PATCH", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ status, reviewNote, confirm: true }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel atualizar a solicitacao.");
  }
  return (await response.json()).request;
}
async function provisionCircleSignup(id, fetcher = fetch) {
  const response = await fetcher(`/admin/circle-signups/${encodeURIComponent(id)}/provision`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirm: true }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel provisionar o Circulo.");
  }
  return response.json();
}
async function resendCircleSignupInvitation(id, fetcher = fetch) {
  const response = await fetcher(`/admin/circle-signups/${encodeURIComponent(id)}/invitation`, { method: "POST", credentials: "include" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel reenviar o convite.");
  }
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/assets-api.ts
async function uploadPlatformAsset(file, fetcher = fetch) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetcher("/admin/assets", { method: "POST", credentials: "include", body });
  const payload = await response.json();
  if (!response.ok || !payload.asset) throw new Error(payload.error ?? "Nao foi possivel enviar o asset.");
  return payload.asset;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/materials-api.ts
async function uploadLessonMaterial(file, fetcher = fetch) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetcher("/admin/materials", { method: "POST", credentials: "include", body });
  const payload = await response.json();
  if (!response.ok || !payload.material) throw new Error(payload.error ?? "Nao foi possivel enviar o material.");
  return payload.material;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/html-lessons-api.ts
async function uploadHtmlLesson(file, fetcher = fetch) {
  if (file.size > MAX_HTML_LESSON_BYTES) throw new Error("HTML e imagens incorporadas excedem 50 MiB. Otimize ou escolha HTML externo.");
  const body = new FormData();
  body.append("file", file);
  const response = await fetcher("/admin/html-lessons", { method: "POST", credentials: "include", body });
  const payload = await response.json();
  if (!response.ok || !payload.document) throw new Error(payload.error ?? "Nao foi possivel enviar o HTML.");
  return payload.document;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/mcp-credentials-api.ts
async function request(url, init, fetcher) {
  const response = await fetcher(url, { ...init, credentials: "include", headers: { "content-type": "application/json", ...init.headers ?? {} } });
  if (!response.ok) throw new Error("Nao foi possivel concluir a operacao MCP.");
  return await response.json();
}
async function fetchMcpCredentials(fetcher = fetch) {
  const response = await fetcher("/admin/mcp/credentials", { credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel carregar as credenciais MCP.");
  const payload = await response.json();
  return payload.credentials ?? [];
}
function createMcpCredential(input, fetcher = fetch) {
  return request("/admin/mcp/credentials", { method: "POST", body: JSON.stringify(input) }, fetcher);
}
function rotateMcpCredential(credentialId, fetcher = fetch) {
  return request(`/admin/mcp/credentials/${encodeURIComponent(credentialId)}/rotate`, { method: "POST", body: "{}" }, fetcher);
}
async function revokeMcpCredential(credentialId, fetcher = fetch) {
  const response = await fetcher(`/admin/mcp/credentials/${encodeURIComponent(credentialId)}/revoke`, { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Nao foi possivel revogar a credencial MCP.");
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/video-provider.ts
var safeVideoReferencePattern = /^[A-Za-z0-9_-]+$/;
function configuredEmbedBase(baseUrl) {
  const value = baseUrl ?? import.meta.env.VITE_BUNNY_STREAM_EMBED_BASE_URL;
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    return url.toString().endsWith("/") ? url.toString() : `${url.toString()}/`;
  } catch {
    return null;
  }
}
function resolveBunnyVideoEmbed(reference, baseUrl) {
  const base = configuredEmbedBase(baseUrl);
  if (reference !== reference.trim()) return null;
  const normalizedReference = reference.trim();
  if (!base || !safeVideoReferencePattern.test(normalizedReference)) return null;
  return new URL(normalizedReference, base).toString();
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/youtube-provider.ts
var youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;
function resolveYoutubeVideoEmbed(reference) {
  if (reference !== reference.trim() || !youtubeVideoIdPattern.test(reference)) return null;
  return `https://www.youtube-nocookie.com/embed/${reference}`;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/media-resolvers.ts
function resolveLessonMedia(media, bunnyBaseUrl, htmlOrigins = [], appHostname) {
  if (media?.type === "internal" && isHtmlLessonReference(media.reference)) return media.reference;
  if (!media || media.type !== "external") return null;
  if (media.provider === "html") {
    const reference = resolveExternalHtml(media.reference, htmlOrigins, appHostname);
    return reference ? `/html-embeds?url=${encodeURIComponent(reference)}` : null;
  }
  if (media.provider === "youtube") return resolveYoutubeVideoEmbed(media.reference);
  return resolveBunnyVideoEmbed(media.reference, bunnyBaseUrl);
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/LessonPlayer.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var mediaStatusLabels = {
  internal: "Arquivo interno configurado",
  external: "Referencia externa configurada",
  embed: "Embed configurado"
};
function LessonPlayer({ bunnyBaseUrl, htmlAllowedOrigins = [], durationLabel, kindLabel, media, title }) {
  const [expanded, setExpanded] = (0, import_react.useState)(false);
  if (!media) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "player-shell player-shell-empty", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: kindLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: durationLabel ?? "Conteudo sem duracao definida" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: "Midia ainda nao configurada" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "player-placeholder", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "Este conteudo ja pode ser organizado" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "A publicacao fica disponivel para resumo, materiais e progresso enquanto a midia final e preparada." })
      ] })
    ] });
  }
  const htmlDocument = isHtmlMedia(media);
  const embedUrl = resolveLessonMedia(media, bunnyBaseUrl, htmlAllowedOrigins, typeof window === "undefined" ? void 0 : window.location.hostname);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "player-shell player-shell-ready", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: kindLabel }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: durationLabel ?? "Conteudo sem duracao definida" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: mediaStatusLabels[media.type] }),
    embedUrl ? htmlDocument ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `player-document-frame${expanded ? " is-expanded" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "secondary-action", onClick: () => setExpanded(!expanded), type: "button", children: expanded ? "Reduzir documento" : "Ampliar documento" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("iframe", { allow: "camera 'none'; microphone 'none'; geolocation 'none'", loading: "lazy", referrerPolicy: "no-referrer", sandbox: media.provider === "html" ? "allow-scripts allow-same-origin" : "allow-scripts", src: embedUrl, title }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: media.provider === "html" ? "Conteudo externo: disponibilidade e privacidade dependem do host. Se nao abrir, confira a permissao de iframe e a origem autorizada." : "HTML interno isolado. Recursos de rede, cookies e armazenamento do aplicativo nao ficam disponiveis ao documento." })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "player-video-frame", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("iframe", { allow: "autoplay; fullscreen; picture-in-picture", allowFullScreen: true, loading: "lazy", referrerPolicy: "strict-origin-when-cross-origin", src: embedUrl, title }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "player-placeholder player-reference", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: mediaStatusLabels[media.type] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: media.reference }),
      media.provider === "html" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: "URL HTML invalida ou origem nao autorizada neste projeto. Confira as configuracoes de HTML externo." })
    ] })
  ] });
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/auth-state.ts
function canPreviewStudentView(user) {
  return user?.role === "admin";
}
function getPreviewTracks(tracks2, accesses) {
  const activeTrackIds = new Set(accesses.filter((access) => access.status === "ACTIVE").map((access) => access.trackId));
  return tracks2.filter((track) => activeTrackIds.has(track.id));
}
function resolveInitialViewMode(user) {
  if (!user) return "login";
  return user.role === "admin" ? "admin" : "student";
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/checkout-api.ts
async function request2(url, init, fetcher = fetch) {
  const response = await fetcher(url, { ...init, credentials: "include", headers: { "content-type": "application/json", ...init?.headers ?? {} } });
  if (!response.ok) throw new Error("Nao foi possivel carregar a configuracao de checkout.");
  if (response.status === 204) return void 0;
  return await response.json();
}
function fetchCheckoutSettings(fetcher = fetch) {
  return Promise.all([
    request2("/admin/checkout/integrations", void 0, fetcher),
    request2("/admin/checkout/offers", void 0, fetcher),
    request2("/admin/checkout/events", void 0, fetcher),
    request2("/admin/checkout/guides", void 0, fetcher)
  ]).then(([integrations, offers, events, guides]) => ({ integrations: integrations.integrations, offers: offers.offers, events: events.events, providers: guides.providers, webhookUrl: guides.webhookUrl }));
}
function saveCheckoutProvider(provider, checkoutBaseUrl, fetcher = fetch) {
  return request2(`/admin/checkout/integrations/${provider}`, { method: "PUT", body: JSON.stringify({ checkoutBaseUrl }) }, fetcher);
}
function generateCheckoutWebhookSecret(provider, fetcher = fetch) {
  return request2(`/admin/checkout/integrations/${provider}/secret`, { method: "POST", body: "{}" }, fetcher);
}
function saveProviderWebhookSecret(provider, secret, fetcher = fetch) {
  return request2(`/admin/checkout/integrations/${provider}/provider-secret`, { method: "PUT", body: JSON.stringify({ secret }) }, fetcher);
}
function saveCheckoutOffer(input, fetcher = fetch) {
  return request2("/admin/checkout/offers", { method: "POST", body: JSON.stringify(input) }, fetcher);
}
function deleteCheckoutOffer(offerId, fetcher = fetch) {
  return request2(`/admin/checkout/offers/${encodeURIComponent(offerId)}`, { method: "DELETE" }, fetcher);
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/checkout-guides.ts
var checkoutGuides = [
  { provider: "kiwify", label: "Kiwify", officialUrl: "https://ajuda.kiwify.com.br/pt-br/article/como-funciona-a-api-da-kiwify-1iosjhu/", webhookEvents: ["approved", "refunded", "chargedback", "subscription_canceled"], steps: ["Crie o produto e a oferta na Kiwify.", "Cadastre a URL de webhook do tenant e copie o segredo gerado no Circulo.", "Copie o ID do produto/oferta e o link HTTPS de checkout para o mapeamento.", "Envie um evento de teste e confirme o status ativo no Circulo."], credentialNote: "A API Key da Kiwify permanece no ambiente seguro do cliente e nao e solicitada pelo Circulo.", apiAvailable: true },
  { provider: "hotmart", label: "Hotmart", officialUrl: "https://developers.hotmart.com/docs/pt-BR/", webhookEvents: ["PURCHASE_APPROVED", "PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "SUBSCRIPTION_CANCELLATION"], steps: ["Crie o produto e a oferta na Hotmart.", "Configure o webhook de postback para a URL do tenant.", "Copie o ID do produto e o link HTTPS de checkout para o mapeamento.", "Envie um evento de teste e confirme o status ativo no Circulo."], credentialNote: "Credenciais da Hotmart nao sao armazenadas pelo Circulo nesta integracao externa.", apiAvailable: true },
  { provider: "eduzz", label: "Eduzz", officialUrl: "https://developers.eduzz.com/", webhookEvents: ["myeduzz.invoice_paid", "myeduzz.invoice_refunded", "myeduzz.invoice_chargeback"], steps: ["Crie o produto e a oferta no MyEduzz.", "Configure a notificacao/webhook para a URL do tenant.", "Copie o ID do produto/oferta e o link HTTPS de checkout para o mapeamento.", "Envie um evento de teste e confirme o status ativo no Circulo."], credentialNote: "Access Token ou OAuth da Eduzz deve permanecer no ambiente seguro do cliente e nao e exibido no MCP.", apiAvailable: true }
];
function getCheckoutGuide(provider) {
  return checkoutGuides.find((guide) => guide.provider === provider) ?? null;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/CheckoutView.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var statusDescriptions = {
  UNCONFIGURED: "Nenhum provedor foi salvo neste tenant.",
  PENDING_TEST: "O provedor foi salvo, mas ainda nao recebeu um webhook valido.",
  ACTIVE: "O Circulo recebeu um webhook com o segredo correto.",
  ERROR: "O ultimo processamento registrou um erro de integracao."
};
function CheckoutView({ settings, tracks: tracks2, onReload }) {
  const [provider, setProvider] = (0, import_react2.useState)("kiwify");
  const [checkoutBaseUrl, setCheckoutBaseUrl] = (0, import_react2.useState)("");
  const [externalProductId, setExternalProductId] = (0, import_react2.useState)("");
  const [externalOfferId, setExternalOfferId] = (0, import_react2.useState)("");
  const [checkoutUrl, setCheckoutUrl] = (0, import_react2.useState)("");
  const [targetType, setTargetType] = (0, import_react2.useState)("track");
  const [targetSlug, setTargetSlug] = (0, import_react2.useState)(tracks2[0]?.id ?? "");
  const [editingOfferId, setEditingOfferId] = (0, import_react2.useState)("");
  const [secret, setSecret] = (0, import_react2.useState)("");
  const [providerSecret, setProviderSecret] = (0, import_react2.useState)("");
  const [copied, setCopied] = (0, import_react2.useState)("");
  const [status, setStatus] = (0, import_react2.useState)("");
  const [guideProvider, setGuideProvider] = (0, import_react2.useState)("kiwify");
  const current = settings?.integrations.find((item) => item.provider === provider);
  const guide = getCheckoutGuide(guideProvider);
  const courseOptions = tracks2.flatMap((track) => track.courses.map((course2) => ({ id: course2.id, label: `${track.name} / ${course2.title}` })));
  const targetOptions = targetType === "track" ? tracks2.map((track) => ({ id: track.id, label: track.name })) : courseOptions;
  const webhookUrl = settings?.webhookUrl ?? `/webhooks/checkout/${window.location.hostname}`;
  (0, import_react2.useEffect)(() => {
    setCheckoutBaseUrl(current?.checkoutBaseUrl ?? "");
  }, [current?.checkoutBaseUrl]);
  function resetOfferForm() {
    setExternalProductId("");
    setExternalOfferId("");
    setCheckoutUrl("");
    setTargetType("track");
    setTargetSlug(tracks2[0]?.id ?? "");
    setEditingOfferId("");
  }
  async function copyValue(label, value) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }
  async function saveProvider() {
    setStatus("Salvando provedor...");
    try {
      await saveCheckoutProvider(provider, checkoutBaseUrl || null);
      await onReload();
      setStatus("Provedor salvo.");
    } catch {
      setStatus("Nao foi possivel salvar o provedor.");
    }
  }
  async function rotateSecret() {
    if (!window.confirm("Gerar um novo segredo invalida o segredo anterior. Continuar?")) return;
    setStatus("Gerando segredo...");
    try {
      const result = await generateCheckoutWebhookSecret(provider);
      setSecret(result.secret);
      await onReload();
      setStatus("Segredo exibido uma vez.");
    } catch {
      setStatus("Nao foi possivel gerar o segredo.");
    }
  }
  async function saveProviderSecret() {
    if (!providerSecret.trim()) return;
    setStatus("Salvando autenticacao do provedor...");
    try {
      await saveProviderWebhookSecret(provider, providerSecret.trim());
      setProviderSecret("");
      await onReload();
      setStatus("Autenticacao do provedor protegida.");
    } catch {
      setStatus("Nao foi possivel salvar a autenticacao do provedor.");
    }
  }
  async function submitOffer(event) {
    event.preventDefault();
    setStatus("Salvando mapeamento...");
    try {
      await saveCheckoutOffer({ id: editingOfferId || void 0, provider, externalProductId, externalOfferId: externalOfferId || null, checkoutUrl, targetType, targetSlug, active: true });
      resetOfferForm();
      await onReload();
      setStatus("Mapeamento salvo.");
    } catch {
      setStatus("Nao foi possivel salvar o mapeamento.");
    }
  }
  async function removeOffer(offerId) {
    if (!window.confirm("Remover este mapeamento? O produto continua existindo no provedor externo.")) return;
    setStatus("Removendo mapeamento...");
    try {
      await deleteCheckoutOffer(offerId);
      await onReload();
      setStatus("Mapeamento removido.");
    } catch {
      setStatus("Nao foi possivel remover o mapeamento.");
    }
  }
  function editOffer(offer) {
    setEditingOfferId(offer.id);
    setProvider(offer.provider);
    setExternalProductId(offer.externalProductId);
    setExternalOfferId(offer.externalOfferId ?? "");
    setCheckoutUrl(offer.checkoutUrl);
    setTargetType(offer.targetType);
    setTargetSlug(offer.targetSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const providerSecretPanel = provider === "hotmart" || provider === "eduzz" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel checkout-wide-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-panel-heading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Autenticacao externa" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Segredo do provedor" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "security-badge", title: "O Circulo cifra este valor em repouso e nunca o devolve para a interface ou para o MCP.", children: "Cifrado" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { title: "Hotmart usa Hottok; Eduzz usa HMAC-SHA256 sobre o corpo bruto.", children: [
      "Necessario para validar eventos assinados de ",
      provider === "hotmart" ? "Hotmart" : "Eduzz",
      "."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "form-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "wide", title: "Cole o segredo fornecido pelo painel do provedor. Ele nao sera exibido novamente.", children: [
        "Segredo do provedor",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "password", autoComplete: "new-password", value: providerSecret, onChange: (event) => setProviderSecret(event.target.value), placeholder: "Cole o segredo aqui" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", disabled: !providerSecret.trim(), onClick: () => void saveProviderSecret(), title: "Cifra e substitui o segredo somente neste tenant.", type: "button", children: "Salvar segredo cifrado" })
    ] })
  ] }) : null;
  const checkoutOverview = /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel checkout-wide-panel checkout-overview", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-panel-heading", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Visao geral" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Como uma compra libera acesso" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "O pagamento acontece no provedor externo. O C\xEDrculo recebe a confirma\xE7\xE3o e libera o destino configurado somente neste tenant." }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("ol", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "Configure o provedor e o webhook." }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "Mapeie o produto externo para uma Jornada ou Curso." }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "Envie um evento de teste e acompanhe o resultado aqui." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: "Remover um mapeamento n\xE3o apaga o produto no provedor externo." })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "detail-page checkout-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "settings-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "eyebrow", children: "Monetizacao" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { children: "Vendas e acessos" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Configure onde a compra acontece e qual acesso ser\xE1 liberado. O C\xEDrculo n\xE3o processa pagamentos nem compartilha configura\xE7\xF5es entre tenants." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", onClick: () => void onReload(), title: "Atualiza status, mapeamentos e eventos recebidos.", type: "button", children: "Atualizar dados" })
    ] }),
    checkoutOverview,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-steps", "aria-label": "Etapas da configuracao", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: "1" }),
        " Provedor"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: "2" }),
        " Webhook"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: "3" }),
        " Mapeamento"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: "4" }),
        " Eventos"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-panel-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Etapa 1" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Provedor de checkout" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: `checkout-status status-${(current?.status ?? "UNCONFIGURED").toLowerCase()}`, title: statusDescriptions[current?.status ?? "UNCONFIGURED"], children: current?.status ?? "UNCONFIGURED" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Escolha onde o produto e o pagamento sao administrados. Cada tenant possui sua propria configuracao." }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "Plataforma externa que vende o produto e envia os eventos de pagamento.", children: [
            "Plataforma",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { value: provider, onChange: (event) => setProvider(event.target.value), children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "kiwify", children: "Kiwify" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "hotmart", children: "Hotmart" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "eduzz", children: "Eduzz" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "URL de referencia do checkout. O link realmente oferecido a aluna e salvo no mapeamento da oferta.", children: [
            "URL base do checkout",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "url", value: checkoutBaseUrl, onChange: (event) => setCheckoutBaseUrl(event.target.value), placeholder: "https://checkout.exemplo" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "primary-action", onClick: () => void saveProvider(), title: "Salva apenas o provedor selecionado neste tenant.", type: "button", children: "Salvar provedor" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-panel-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Etapa 2" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Webhook seguro" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "security-badge", title: "O segredo e armazenado somente como hash e nunca e recuperado depois da exibicao unica.", children: "Segredo protegido" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Cadastre a URL no painel do provedor. Em producao, use sempre HTTPS." }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "copy-field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { title: "Endpoint que recebe os eventos de pagamento deste tenant.", children: "URL do webhook" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: webhookUrl }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "icon-action", onClick: () => void copyValue("webhook", webhookUrl), title: "Copiar URL do webhook", type: "button", children: "\u29C9" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", onClick: () => void rotateSecret(), title: "Revoga o segredo anterior e gera um novo segredo exibido uma unica vez.", type: "button", children: "Gerar/rotacionar segredo" }),
          secret && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", onClick: () => void copyValue("secret", secret), title: "Copiar o segredo antes de sair desta pagina.", type: "button", children: "Copiar segredo" })
        ] }),
        secret && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("aside", { className: "checkout-secret", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: "Segredo exibido uma vez" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: secret }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
            "URL com token: ",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: `${webhookUrl}?token=${encodeURIComponent(secret)}` })
          ] })
        ] }),
        copied && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { className: "form-status", children: copied === "secret" ? "Segredo copiado." : "URL copiada." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-panel-heading", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Etapa 3" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: editingOfferId ? "Editar mapeamento" : "Mapear oferta" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Associe o produto externo a uma Jornada ou Curso deste tenant. Uma compra aprovada libera o destino escolhido." }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { className: "form-grid", onSubmit: submitOffer, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "Identificador do produto no painel do provedor. E usado para localizar o evento de compra.", children: [
            "ID do produto externo",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, value: externalProductId, onChange: (event) => setExternalProductId(event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "Identificador opcional da oferta, plano ou variacao dentro do produto.", children: [
            "ID da oferta ",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "field-hint", children: "opcional" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { value: externalOfferId, onChange: (event) => setExternalOfferId(event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "Define se a compra concede acesso a uma Jornada inteira ou somente a um Curso.", children: [
            "Tipo de acesso",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { value: targetType, onChange: (event) => {
              const next = event.target.value;
              setTargetType(next);
              setTargetSlug(next === "track" ? tracks2[0]?.id ?? "" : courseOptions[0]?.id ?? "");
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "track", children: "Jornada" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "course", children: "Curso" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { title: "Destino interno que recebera o acesso quando o webhook aprovado for processado.", children: [
            targetType === "track" ? "Jornada liberada" : "Curso liberado",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { required: true, value: targetSlug, onChange: (event) => setTargetSlug(event.target.value), children: targetOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: option.id, children: option.label }, option.id)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "wide", title: "Link HTTPS usado no botao de compra. Este link permanece no provedor externo.", children: [
            "Link HTTPS de checkout",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { required: true, type: "url", value: checkoutUrl, onChange: (event) => setCheckoutUrl(event.target.value), placeholder: "https://checkout.exemplo/oferta" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "inline-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "primary-action", title: "Salva ou atualiza o mapeamento somente neste tenant.", type: "submit", children: editingOfferId ? "Atualizar mapeamento" : "Salvar mapeamento" }),
            editingOfferId && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", onClick: resetOfferForm, type: "button", children: "Cancelar edicao" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-panel-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Etapa 4" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Eventos recebidos" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "field-hint", title: "Eventos sao gravados para idempotencia e diagnostico; o payload bruto nao e exibido nesta tela.", children: [
            settings?.events.length ?? 0,
            " recentes"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Envie um evento de teste no provedor e clique em Atualizar dados. Um segredo valido ativa a conexao." }),
        settings?.events.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-event-list", children: settings.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("article", { className: "checkout-event", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("strong", { children: [
              event.provider,
              " \xB7 ",
              event.state
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: new Date(event.receivedAt).toLocaleString("pt-BR") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: event.externalProductId ?? "Produto nao identificado" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: event.buyerEmail ?? "Comprador nao informado" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: `event-result ${event.processedAt ? "event-applied" : "event-pending"}`, title: event.processedAt ? "O evento alterou o acesso de uma aluna." : "O evento foi recebido, mas nao encontrou um mapeamento ou nao concede acesso.", children: event.processedAt ? "Acesso processado" : "Recebido" })
        ] }, `${event.provider}-${event.externalEventId}`)) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-empty-state", children: "Nenhum evento recebido ainda. Configure o webhook e envie um evento de teste no provedor." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel checkout-wide-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-panel-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Gerenciamento" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Ofertas configuradas" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "field-hint", title: "Mapeamentos sao exclusivos deste tenant e nao liberam acesso em outro projeto.", children: [
          settings?.offers.length ?? 0,
          " mapeadas"
        ] })
      ] }),
      settings?.offers.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-offer-list", children: settings.offers.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("article", { className: "checkout-offer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("strong", { children: [
            offer.provider,
            " \xB7 ",
            offer.externalProductId
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("small", { children: [
            offer.externalOfferId ? `Oferta ${offer.externalOfferId} \xB7 ` : "Produto \xB7 ",
            offer.targetType === "track" ? "Jornada" : "Curso",
            ": ",
            offer.targetSlug
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("a", { href: offer.checkoutUrl, rel: "noreferrer", target: "_blank", children: "Abrir checkout externo" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: `checkout-status ${offer.active ? "status-active" : ""}`, children: offer.active ? "Ativa" : "Inativa" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action", onClick: () => editOffer(offer), title: "Carrega este mapeamento no formulario para edicao.", type: "button", children: "Editar" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "secondary-action danger-action", onClick: () => void removeOffer(offer.id), title: "Remove o mapeamento; nao apaga o produto no provedor externo.", type: "button", children: "Remover" })
        ] })
      ] }, offer.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-empty-state", children: "Nenhuma oferta foi mapeada para este tenant." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "appearance-panel checkout-panel checkout-wide-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-panel-heading", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "section-kicker", children: "Orientacao" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "Guia do provedor" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "checkout-provider-tabs", role: "tablist", "aria-label": "Guias de checkout", children: checkoutGuides.map((item) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: guideProvider === item.provider ? "active" : "", onClick: () => setGuideProvider(item.provider), role: "tab", "aria-selected": guideProvider === item.provider, type: "button", children: item.label }, item.provider)) }),
      guide && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-guide-content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: guide.label }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: guide.credentialNote }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("a", { href: guide.officialUrl, rel: "noreferrer", target: "_blank", children: "Documentacao oficial" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ol", { children: guide.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: step }, step)) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "checkout-event-reference", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: "Eventos tratados" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: guide.webhookEvents.join(" \xB7 ") })
        ] })
      ] })
    ] }),
    providerSecretPanel,
    status && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "form-status checkout-feedback", role: "status", children: status })
  ] });
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/student-ai-api.ts
async function askStudentAi(question, conversationId, fetcher = fetch) {
  const response = await fetcher("/student/ai/chat", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ question, ...conversationId ? { conversationId } : {} }) });
  const payload = await response.json();
  if (!response.ok && !("status" in payload && ["disabled", "rate_limited", "no_context", "unavailable"].includes(payload.status))) throw new Error("reason" in payload ? payload.reason : "Nao foi possivel consultar a assistente.");
  return payload;
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/web/admin-ai-api.ts
async function json(response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Nao foi possivel concluir a operacao de IA.");
  return payload;
}
async function fetchAiPolicy(fetcher = fetch) {
  return json(await fetcher("/admin/ai/policy", { credentials: "include" }));
}
async function saveAiPolicy(policy, fetcher = fetch) {
  return json(await fetcher("/admin/ai/policy", { method: "PUT", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(policy) }));
}
async function fetchAiSources(fetcher = fetch) {
  const payload = await json(await fetcher("/admin/ai/sources", { credentials: "include" }));
  return payload.sources;
}
async function ingestAiSource(input, fetcher = fetch) {
  return json(await fetcher("/admin/ai/sources", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }));
}
async function extractAiPdf(file, fetcher = fetch) {
  const form = new FormData();
  form.append("file", file);
  return json(await fetcher("/admin/ai/sources/pdf", { method: "POST", credentials: "include", body: form }));
}
async function prepareAiLesson(input, fetcher = fetch) {
  return json(await fetcher("/admin/ai/lesson-manifest", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }));
}

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/domain/ai-policy.ts
var defaultAiPolicy = {
  enabled: false,
  allowedSourceTypes: ["LESSON", "MATERIAL", "TRACK", "COURSE"],
  maxQuestionsPerMinute: 5,
  maxQuestionsPerDay: 100,
  maxContextChunks: 6,
  maxExcerptCharacters: 900,
  maxAnswerTokens: 500,
  allowStudyNotes: false,
  historyRetentionDays: 30,
  modelName: null
};

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/App.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var activeMember = members[0];
var paletteLabels = {
  appBg: "Fundo da area",
  panelBg: "Fundo dos controles",
  cardBg: "Fundo dos cards",
  sidebarBg: "Fundo da sidebar",
  topbarBg: "Fundo do topo",
  textMain: "Texto principal",
  textMuted: "Texto secundario",
  accent: "Cor de destaque",
  border: "Bordas",
  buttonText: "Texto dos botoes"
};
var gradientLabels = {
  appBg: "Fundo da area",
  panelBg: "Fundo dos controles",
  cardBg: "Fundo dos cards",
  sidebarBg: "Fundo da sidebar",
  topbarBg: "Fundo do topo"
};
var paletteOrder = [
  "appBg",
  "panelBg",
  "cardBg",
  "sidebarBg",
  "topbarBg",
  "textMain",
  "textMuted",
  "buttonText",
  "accent",
  "border"
];
function logoPath(appearance, colorMode) {
  return colorMode === "dark" ? appearance.logoDarkImagePath || appearance.logoImagePath : appearance.logoImagePath;
}
function BrandLogo({ alt, path }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { className: "login-logo", src: path, alt });
}
function FileUploadControl({ accept, disabled, onSelect }) {
  const inputId = (0, import_react3.useId)();
  const [fileName, setFileName] = (0, import_react3.useState)("");
  async function selectFile(file) {
    if (!file) return;
    setFileName(file.name);
    await onSelect(file);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "file-upload-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { accept, disabled, id: inputId, onChange: (event) => void selectFile(event.target.files?.[0]), type: "file" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "file-upload-button", htmlFor: inputId, children: disabled ? "Enviando..." : "Escolher arquivo" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: fileName || "Nenhum arquivo selecionado" })
  ] });
}
function CatalogAssetInput({ label, value, onChange, onUpload }) {
  const [uploading, setUploading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)("");
  async function selectFile(file) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange((await onUpload(file)).url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Nao foi possivel enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
    label,
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileUploadControl, { accept: "image/png,image/jpeg,image/webp", disabled: uploading, onSelect: selectFile }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `${label} URL`, value, onChange: (event) => onChange(event.target.value), placeholder: "URL interna ou caminho local" }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { className: "login-error", children: error })
  ] });
}
function systemColorMode() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function resolveColorMode(mode) {
  return mode === "system" ? systemColorMode() : mode;
}
var adminPrimaryNav = [
  { icon: "home", label: "Biblioteca", page: { name: "portal" } },
  { icon: "classroom", label: "Jornadas", page: { name: "portal" } },
  { icon: "certificate", label: "Conquistas", page: { name: "ranking" } },
  { icon: "banner", label: "Destaques", page: { name: "portal" } },
  { icon: "community", label: "Mensagens", page: { name: "support" } },
  { icon: "ranking", label: "Evolucao", page: { name: "ranking" } }
];
var adminSecondaryNav = [
  { icon: "offers", label: "Produtos", page: { name: "portal" } },
  { icon: "members", label: "Alunas", page: { name: "students-admin" } },
  { icon: "classroom", label: "Jornadas", page: { name: "tracks-admin" } },
  { icon: "classroom", label: "Cursos", page: { name: "courses-admin" } },
  { icon: "classroom", label: "Modulos", page: { name: "modules-admin" } },
  { icon: "classroom", label: "Aulas", page: { name: "lessons-admin" } },
  { icon: "reports", label: "Indicadores", page: { name: "ranking" } },
  { icon: "settings", label: "Aparencia", page: { name: "appearance" } },
  { icon: "settings", label: "Configuracoes", page: { name: "project-settings" } },
  { icon: "offers", label: "Vendas e acessos", page: { name: "checkout-admin" } },
  { icon: "settings", label: "Agentes", page: { name: "mcp-admin" } },
  { icon: "reports", label: "Assistente de estudos", page: { name: "ai-admin" } },
  { icon: "reports", label: "Documentacao", page: { name: "documentation" } },
  { icon: "reports", label: "Historico", page: { name: "audit-admin" } }
];
var studentPrimaryNav = [
  { icon: "home", label: "Portal", page: { name: "portal" }, key: "portal" },
  { icon: "classroom", label: "Jornada", page: { name: "portal" }, key: "journey" },
  { icon: "certificate", label: "Favoritos", page: { name: "favorites" }, key: "favorites" },
  { icon: "certificate", label: "Conquistas", page: { name: "ranking" } },
  { icon: "members", label: "Perfil", page: { name: "profile" }, key: "profile" },
  { icon: "settings", label: "Conta", page: { name: "account" }, key: "account" },
  { icon: "community", label: "Suporte", page: { name: "support" }, key: "support" }
];
var platformAdminNav = [
  { icon: "home", label: "Projetos", page: { name: "projects-admin" } },
  { icon: "community", label: "Solicitacoes", page: { name: "circle-signups-admin" } },
  { icon: "reports", label: "Documentacao", page: { name: "documentation" } }
];
function isPlatformAdminHost() {
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "admin.circulo.localhost" || hostname === "admin.circulo.soberania.cloud";
}
var iconPaths = {
  home: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z",
  classroom: "M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Zm2 4h6M9 12h6M9 16h4",
  certificate: "M8 4h8l3 3v13H5V7l3-3Zm2 8h4m-4 4h6M15 4v4h4",
  banner: "M4 6h16v12H4V6Zm3 9 3-3 2 2 3-4 3 5",
  members: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 21a8 8 0 0 1 16 0",
  community: "M5 5h14v10H8l-3 3V5Zm4 4h6m-6 3h4",
  ranking: "M5 20V9h4v11H5Zm5 0V4h4v16h-4Zm5 0v-7h4v7h-4Z",
  offers: "M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0",
  reports: "M5 20h14M7 16V9m5 7V5m5 11v-4",
  settings: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0-5v3m0 11v3m8.5-8.5h-3m-11 0h-3m14.5-6.5-2.1 2.1M7.6 16.4l-2.1 2.1m0-13 2.1 2.1m8.8 8.8 2.1 2.1"
};
var lessonKindLabels = {
  video: "Video",
  live: "Encontro",
  material: "Material",
  tool: "Ferramenta"
};
function Icon({ name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { className: "nav-icon", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: iconPaths[name] }) });
}
function imageStyle(url) {
  return { backgroundImage: `url(${url})` };
}
function samePage(a, b) {
  return a.name === b.name && JSON.stringify(a) === JSON.stringify(b);
}
function getCourseProgress(course2, completedLessonIds) {
  const lessonIds = course2.modules.flatMap((moduleItem) => moduleItem.lessons.map((lesson2) => lesson2.id));
  if (lessonIds.length === 0) {
    return 0;
  }
  const completedCount = lessonIds.filter((lessonId) => completedLessonIds.has(lessonId)).length;
  return Math.round(completedCount / lessonIds.length * 100);
}
function getTrackProgress(track, completedLessonIds) {
  const coursesWithLessons = track.courses.filter((course2) => countCourseLessons(course2) > 0);
  if (coursesWithLessons.length === 0) {
    return 0;
  }
  const total = coursesWithLessons.reduce((sum, course2) => sum + getCourseProgress(course2, completedLessonIds), 0);
  return Math.round(total / coursesWithLessons.length);
}
function NavLinks({ currentPage, items, labels, onNavigate, unreadCount = 0 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: samePage(currentPage, item.page) ? "active" : void 0, onClick: () => onNavigate(item.page), type: "button", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: item.icon }),
    item.key && labels ? labels[item.key] : item.label,
    item.page.name === "support" && unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "nav-badge", "aria-label": `${unreadCount} mensagens nao lidas`, children: unreadCount > 99 ? "99+" : unreadCount })
  ] }, item.label)) });
}
function StatPill({ label, value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "stat-pill", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: value }),
    label
  ] });
}
function CourseCard({ course: course2, completedLessonIds, onOpenCourse }) {
  const progress = getCourseProgress(course2, completedLessonIds);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("article", { className: "poster-card", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { "aria-label": course2.title, onClick: () => onOpenCourse(course2.id), type: "button", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "poster-cover", style: imageStyle(course2.coverImagePath), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "progress", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { width: `${progress}%` } }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "poster-title", children: course2.title })
  ] }) });
}
function StudentAiPanel() {
  const [question, setQuestion] = (0, import_react3.useState)("");
  const [answer, setAnswer] = (0, import_react3.useState)("");
  const [citations, setCitations] = (0, import_react3.useState)([]);
  const [conversationId, setConversationId] = (0, import_react3.useState)();
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [notice, setNotice] = (0, import_react3.useState)("");
  async function submit(event) {
    event.preventDefault();
    if (!question.trim()) return;
    setStatus("loading");
    setNotice("");
    try {
      const response = await askStudentAi(question, conversationId);
      if (response.status === "answered") {
        setAnswer(response.answer);
        setCitations(response.citations);
        setConversationId(response.conversationId);
        setQuestion("");
        setStatus("idle");
        return;
      }
      setNotice(response.status === "no_context" ? "Ainda nao encontrei uma fonte publicada que responda a essa pergunta." : response.status === "rate_limited" ? "Seu limite de perguntas foi atingido. Tente novamente mais tarde." : response.status === "disabled" ? "O assistente ainda nao foi ativado neste Circulo." : "A assistente esta indisponivel no momento.");
      setStatus(response.status === "unavailable" ? "error" : "blocked");
    } catch {
      setNotice("Nao foi possivel consultar a assistente agora.");
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "ai-study-panel", "aria-label": "Assistente de estudos", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Apoio ao aprendizado" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Converse com o conte\xFAdo" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Fa\xE7a perguntas sobre as aulas liberadas para voc\xEA. A assistente responde somente com base no conte\xFAdo dispon\xEDvel." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { onSubmit: submit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: "student-ai-question", children: "Sua pergunta" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { id: "student-ai-question", maxLength: 4e3, onChange: (event) => setQuestion(event.target.value), placeholder: "O que quero compreender melhor?", value: question }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "ai-form-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          question.length,
          "/4000"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "loading" || !question.trim(), type: "submit", children: status === "loading" ? "Consultando..." : "Perguntar" })
      ] })
    ] }),
    notice && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: status === "error" ? "login-error" : "form-status", role: "status", children: notice }),
    answer && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "ai-answer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "panel-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Resposta" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "security-badge status-active", children: "Baseada no curso" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: answer }),
      citations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("footer", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Fontes consultadas" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "ai-citations", children: citations.map((citation) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          citation.sourceId,
          " \xB7 trecho ",
          citation.ordinal + 1
        ] }, `${citation.sourceId}-${citation.ordinal}`)) })
      ] })
    ] })
  ] });
}
function PortalView({ appearance, completedLessonIds, onOpenCourse, onOpenTrack, tracks: tracks2, studentView = false }) {
  const hasConfiguredBanner = Boolean(appearance.bannerImagePath);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: `featured-banner${hasConfiguredBanner ? "" : " featured-banner-neutral"}`, "aria-label": "Banner principal do C\xEDrculo", children: [
      hasConfiguredBanner ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => onOpenTrack("mentoria-selvagem"), type: "button", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: appearance.bannerImagePath, alt: "Banner principal do C\xEDrculo" }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "featured-banner-neutral-content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "\xC1rea de aprendizagem" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: appearance.brandName }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: appearance.portalTitle })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "banner-pagination", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("nav", { className: "category-chips", "aria-label": "Categorias", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "active", onClick: () => onOpenTrack("mentoria-selvagem"), type: "button", children: "Inicio" }),
      tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => onOpenTrack(track.id), type: "button", children: track.name }, track.id))
    ] }),
    studentView && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StudentAiPanel, {}),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("section", { className: "rails", id: "trilhas", "aria-label": appearance.portalTitle, children: tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "course-section", id: track.id, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "section-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("h2", { children: [
          track.name,
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => onOpenTrack(track.id), type: "button", children: "Ver tudo ->" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "rail-controls", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", children: "<" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", children: ">" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "poster-row", children: track.courses.map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CourseCard, { completedLessonIds, course: course2, onOpenCourse }, course2.id)) })
    ] }, track.id)) })
  ] });
}
function PreviewEmptyState() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "preview-empty-state", "aria-live": "polite", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Selecione uma aluna" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Escolha uma aluna no seletor acima para visualizar exatamente as jornadas liberadas para ela." })
  ] });
}
function TrackView({ completedLessonIds, onOpenCourse, track }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "detail-hero track-hero", style: imageStyle(track.banner.imagePath), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: track.banner.eyebrow }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: track.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: track.description }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "detail-stats", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "cursos", value: track.courses.length }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "modulos", value: countModules(track) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "aulas", value: countLessons(track) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "concluido", value: `${getTrackProgress(track, completedLessonIds)}%` })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "course-grid", children: track.courses.map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "course-tile", onClick: () => onOpenCourse(course2.id), type: "button", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: course2.coverImagePath, alt: "" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: course2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: course2.description }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          countCourseLessons(course2),
          " conteudos"
        ] })
      ] })
    ] }, course2.id)) })
  ] });
}
function CourseView({
  completedLessonIds,
  course: course2,
  favoriteLessonIds,
  favoritesEnabled,
  onOpenLesson,
  onToggleFavorite,
  readOnly,
  track
}) {
  const firstLesson = getFirstLesson(course2);
  const progress = getCourseProgress(course2, completedLessonIds);
  const lessonCount = countCourseLessons(course2);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page course-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "course-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: course2.coverImagePath, alt: "" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: track.name }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: course2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: course2.description }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "detail-stats", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "conteudos", value: lessonCount }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "duracao", value: course2.durationLabel ?? "sob demanda" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "concluido", value: `${progress}%` })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: !firstLesson, onClick: () => firstLesson && onOpenLesson(firstLesson.id), type: "button", children: progress > 0 ? "continuar agora" : "comecar agora" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "module-list", children: course2.modules.map((moduleItem) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      ModulePanel,
      {
        completedLessonIds,
        favoriteLessonIds,
        favoritesEnabled,
        moduleItem,
        onOpenLesson,
        onToggleFavorite,
        readOnly
      },
      moduleItem.id
    )) })
  ] });
}
function ModulePanel({
  completedLessonIds,
  favoriteLessonIds,
  favoritesEnabled,
  moduleItem,
  onOpenLesson,
  onToggleFavorite,
  readOnly
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "module-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("header", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: moduleItem.title }),
        moduleItem.description && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: moduleItem.description })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        moduleItem.lessons.length,
        " aulas"
      ] })
    ] }),
    moduleItem.lessons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma aula publicada ainda." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "lesson-list", children: moduleItem.lessons.map((lesson2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lesson-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => onOpenLesson(lesson2.id), type: "button", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lesson-kind", children: lessonKindLabels[lesson2.kind] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: lesson2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: lesson2.durationLabel ?? lesson2.summary ?? "Sem duracao definida" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lesson-row-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: completedLessonIds.has(lesson2.id) ? "done" : void 0, children: completedLessonIds.has(lesson2.id) ? "Concluida" : "Pendente" }),
        favoritesEnabled && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-pressed": favoriteLessonIds.has(lesson2.id), disabled: readOnly, onClick: () => onToggleFavorite(lesson2.id), type: "button", children: favoriteLessonIds.has(lesson2.id) ? "Favorita" : "Favoritar" })
      ] })
    ] }, lesson2.id)) })
  ] });
}
function LessonView({
  bunnyBaseUrl,
  htmlAllowedOrigins,
  completedLessonIds,
  favoriteLessonIds,
  favoritesEnabled,
  lessonContext,
  onComplete,
  onOpenCourse,
  onToggleFavorite,
  feedback,
  feedbackEnabled,
  feedbackError,
  feedbackLoading,
  onAddComment,
  onLoadFeedback,
  onRateLesson,
  readOnly
}) {
  const { course: course2, lesson: lesson2, module: module2, track } = lessonContext;
  const completed = completedLessonIds.has(lesson2.id);
  const [comment, setComment] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => {
    if (feedbackEnabled) void onLoadFeedback(lesson2.id);
  }, [feedbackEnabled, lesson2.id]);
  async function submitComment(event) {
    event.preventDefault();
    const nextComment = comment.trim();
    if (!nextComment || !feedbackEnabled) return;
    await onAddComment(lesson2.id, nextComment);
    setComment("");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page lesson-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("nav", { className: "breadcrumbs", "aria-label": "Caminho da aula", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => onOpenCourse(course2.id), type: "button", children: track.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "/" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => onOpenCourse(course2.id), type: "button", children: course2.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "/" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: module2.title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lesson-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "lesson-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LessonPlayer, { bunnyBaseUrl, htmlAllowedOrigins, durationLabel: lesson2.durationLabel, kindLabel: lessonKindLabels[lesson2.kind], media: lesson2.media, title: lesson2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "lesson-body", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Material da aula" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: lesson2.summary ?? "Esta aula esta pronta para receber video, texto, links e materiais complementares no fluxo nativo do C\xEDrculo." }),
          lesson2.materials && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { children: lesson2.materials.map((material) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: material }, material)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "comment-box", onSubmit: submitComment, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: "lesson-comment", children: "Comentarios" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { disabled: readOnly, id: "lesson-comment", onChange: (event) => setComment(event.target.value), placeholder: "Escreva seu comentario...", value: comment }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { disabled: !feedbackEnabled || feedbackLoading, type: "submit", children: "Comentar" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "comments-list", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "comment-tabs", "aria-label": "Filtros de comentarios", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", children: "Mais recentes" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", children: "Mais antigos" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", children: "Meus comentarios" })
          ] }),
          feedbackError && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: feedbackError }),
          !feedbackEnabled && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Comentarios disponiveis na experiencia da aluna." }),
          feedbackEnabled && feedbackLoading && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Carregando comentarios..." }),
          feedbackEnabled && !feedbackLoading && feedback?.comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhum comentario ainda." }),
          feedback?.comments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "comment-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: item.authorName }),
            " ",
            item.body
          ] }, item.id))
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("aside", { className: "lesson-aside", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Como voce avalia este conteudo?" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "rating-grid", children: ["Muito ruim", "Ruim", "Razoavel", "Muito bom", "Excelente"].map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-pressed": feedback?.rating === index + 1, disabled: readOnly || !feedbackEnabled || feedbackLoading, onClick: () => void onRateLesson(lesson2.id, index + 1), type: "button", children: option }, option)) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: readOnly, onClick: () => onComplete(lesson2.id), type: "button", children: completed ? "Aula concluida" : "Marcar como concluido" }),
        favoritesEnabled && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", "aria-pressed": favoriteLessonIds.has(lesson2.id), disabled: readOnly, onClick: () => onToggleFavorite(lesson2.id), type: "button", children: favoriteLessonIds.has(lesson2.id) ? "Remover dos favoritos" : "Adicionar aos favoritos" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mini-progress", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
            getCourseProgress(course2, completedLessonIds),
            "%"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { style: { width: `${getCourseProgress(course2, completedLessonIds)}%` } }) })
        ] })
      ] })
    ] })
  ] });
}
function SearchView({ onOpenResult, query, results }) {
  const counts = {
    all: results.length,
    courses: results.filter((result) => result.type === "course").length,
    modules: results.filter((result) => result.type === "module").length,
    lessons: results.filter((result) => result.type === "lesson").length
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Busca" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "search-tabs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        "Todos ",
        counts.all
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        "Cursos ",
        counts.courses
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        "Modulos ",
        counts.modules
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        "Aulas ",
        counts.lessons
      ] })
    ] }),
    query.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Digite uma palavra-chave para buscar cursos, modulos e aulas." }) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhum conteudo correspondente." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: results.map((result) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => onOpenResult(result), type: "button", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: result.type }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: result.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: result.subtitle })
    ] }, `${result.type}-${result.id}`)) })
  ] });
}
function FavoritesView({ favoriteLessonIds, onOpenLesson, tracks: tracks2 }) {
  const favorites = [...favoriteLessonIds].map((lessonId) => findLessonById(lessonId, tracks2)).filter(Boolean);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Favoritos" }),
    favorites.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhum conteudo favorito ainda." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: favorites.map(({ course: course2, lesson: lesson2, module: module2 }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => onOpenLesson(lesson2.id), type: "button", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: lessonKindLabels[lesson2.kind] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: lesson2.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        course2.title,
        " / ",
        module2.title
      ] })
    ] }, lesson2.id)) })
  ] });
}
function RankingView({ ranking }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Ranking" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Compare seu progresso com outras participantes a partir de conclusoes, comentarios e avaliacoes." }),
    !ranking || ranking.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Ainda nao ha pontuacao registrada." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      ranking.currentUser && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "metric-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "sua posicao", value: `#${ranking.currentUser.rank}` }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "XP", value: ranking.currentUser.score }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "aulas concluidas", value: ranking.currentUser.completedLessons })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list ranking-list", children: ranking.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("strong", { children: [
          "#",
          entry.rank,
          " ",
          entry.name
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          entry.score,
          " XP"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          entry.completedLessons,
          " aulas, ",
          entry.comments,
          " comentarios, ",
          entry.ratings,
          " avaliacoes"
        ] })
      ] }, entry.userId)) })
    ] })
  ] });
}
function AdminIndicatorsView({ ranking }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-testid": "indicators-stable-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { "data-testid": "indicators-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Indicadores" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Acompanhe a participacao das alunas com base nas atividades persistidas." })
      ] }),
      !ranking ? null : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "metric-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "alunas ativas", value: ranking.summary.participants }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "XP distribuido", value: ranking.summary.totalScore }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "media de aulas", value: ranking.summary.averageCompletedLessons })
      ] })
    ] }),
    !ranking ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nao foi possivel carregar os indicadores." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: ranking.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma aluna ativa neste projeto." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list ranking-list", children: ranking.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("strong", { children: [
        "#",
        entry.rank,
        " ",
        entry.name
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        entry.score,
        " XP"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        entry.completedLessons,
        " aulas, ",
        entry.comments,
        " comentarios, ",
        entry.ratings,
        " avaliacoes"
      ] })
    ] }, entry.userId)) }) })
  ] });
}
function ProfileView({ completedLessonIds, tracks: tracks2, user }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: user?.name ?? activeMember.name }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: user?.email ?? activeMember.email }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "metric-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "comentarios", value: "0" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "avaliacoes", value: "0" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatPill, { label: "aulas concluidas", value: completedLessonIds.size })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Acompanhamento" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: track.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        getTrackProgress(track, completedLessonIds),
        "% concluido"
      ] })
    ] }, track.id)) })
  ] });
}
function AccountView({ onChangePassword, onLoadProfile, onSaveProfile, readOnly, user }) {
  const [profile, setProfile] = (0, import_react3.useState)({ phone: "", timezone: "America/Sao_Paulo", bio: "" });
  const [profileStatus, setProfileStatus] = (0, import_react3.useState)("loading");
  const [currentPassword, setCurrentPassword] = (0, import_react3.useState)("");
  const [newPassword, setNewPassword] = (0, import_react3.useState)("");
  const [passwordStatus, setPasswordStatus] = (0, import_react3.useState)("idle");
  (0, import_react3.useEffect)(() => {
    let mounted = true;
    onLoadProfile().then((loaded) => {
      if (!mounted) return;
      setProfile({ ...loaded, timezone: loaded.timezone || "America/Sao_Paulo" });
      setProfileStatus("idle");
    }).catch(() => {
      if (mounted) setProfileStatus("error");
    });
    return () => {
      mounted = false;
    };
  }, [onLoadProfile]);
  async function submitProfile(event) {
    event.preventDefault();
    if (readOnly) return;
    setProfileStatus("saving");
    try {
      setProfile(await onSaveProfile(profile));
      setProfileStatus("saved");
    } catch {
      setProfileStatus("error");
    }
  }
  async function submitPassword(event) {
    event.preventDefault();
    setPasswordStatus("saving");
    try {
      await onChangePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordStatus("saved");
    } catch {
      setPasswordStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Minha Conta" }),
    readOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Visualizacao da aluna selecionada. Alteracoes ficam desativadas no preview." }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submitProfile, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome completo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-readonly": "true", readOnly: true, value: user?.name ?? activeMember.name })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Email",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-readonly": "true", readOnly: true, value: user?.email ?? activeMember.email })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Telefone",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { disabled: readOnly, maxLength: 40, onChange: (event) => setProfile((current) => ({ ...current, phone: event.target.value })), placeholder: "Adicionar telefone", value: profile.phone })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Fuso horario",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { disabled: readOnly, maxLength: 100, onChange: (event) => setProfile((current) => ({ ...current, timezone: event.target.value })), value: profile.timezone })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Sobre voce",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { disabled: readOnly, maxLength: 2e3, onChange: (event) => setProfile((current) => ({ ...current, bio: event.target.value })), placeholder: "Conte um pouco sobre sua jornada", value: profile.bio })
      ] }),
      profileStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Perfil atualizado." }),
      profileStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel carregar ou salvar o perfil." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: readOnly || profileStatus === "loading" || profileStatus === "saving", type: "submit", children: profileStatus === "saving" ? "Salvando..." : "Salvar perfil" })
    ] }),
    !readOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid password-form", onSubmit: submitPassword, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Senha atual",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "current-password", minLength: 8, onChange: (event) => setCurrentPassword(event.target.value), required: true, type: "password", value: currentPassword })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nova senha",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "new-password", minLength: 8, onChange: (event) => setNewPassword(event.target.value), required: true, type: "password", value: newPassword })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: passwordStatus === "saving", type: "submit", children: passwordStatus === "saving" ? "Salvando..." : "Alterar senha" }),
      passwordStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Senha atualizada." }),
      passwordStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel alterar a senha." })
    ] })
  ] });
}
function AdminSupportView({ onLoad, onReply, onStatus, requests }) {
  const [filter, setFilter] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => {
    void onLoad(filter || void 0);
  }, [filter]);
  const [drafts, setDrafts] = (0, import_react3.useState)({});
  const [savingId, setSavingId] = (0, import_react3.useState)("");
  async function reply(requestId) {
    const response = drafts[requestId]?.trim();
    if (!response) return;
    setSavingId(requestId);
    try {
      await onReply(requestId, response);
      setDrafts((current) => ({ ...current, [requestId]: "" }));
    } finally {
      setSavingId("");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "settings-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Administracao" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Mensagens" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Solicitacoes recebidas das alunas." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Status",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: filter, onChange: (event) => setFilter(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Todas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "OPEN", children: "Abertas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "ANSWERED", children: "Respondidas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "RESOLVED", children: "Resolvidas" })
        ] })
      ] })
    ] }),
    requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma solicitacao recebida." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: requests.map((request3) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: request3.subject }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        request3.user.name,
        " - ",
        request3.user.email,
        " - ",
        request3.status
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "message-thread", children: request3.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("strong", { children: [
          message.sender === "ADMIN" ? "Admin" : request3.user.name,
          ":"
        ] }),
        " ",
        message.body
      ] }, message.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { "aria-label": `Resposta para ${request3.user.name}`, maxLength: 4e3, onChange: (event) => setDrafts((current) => ({ ...current, [request3.id]: event.target.value })), placeholder: "Escreva uma resposta", value: drafts[request3.id] ?? "" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: savingId === request3.id, onClick: () => void reply(request3.id), type: "button", children: savingId === request3.id ? "Enviando..." : "Responder" }),
      request3.status === "RESOLVED" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void onStatus(request3.id, "OPEN"), type: "button", children: "Reabrir" }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void onStatus(request3.id, "RESOLVED"), type: "button", children: "Marcar resolvida" })
    ] }, request3.id)) })
  ] });
}
function SupportView({ onSubmit, readOnly, tracks: tracks2 }) {
  const [subject, setSubject] = (0, import_react3.useState)("");
  const [message, setMessage] = (0, import_react3.useState)("");
  const [status, setStatus] = (0, import_react3.useState)("idle");
  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    try {
      await onSubmit({ subject, message });
      setSubject("");
      setMessage("");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Suporte" }),
    readOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Preview da aluna selecionada. O envio de mensagens fica desativado." }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Assunto",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { disabled: readOnly, required: true, value: subject, onChange: (event) => setSubject(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Selecione um assunto" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "Duvida sobre conteudo", children: "Duvida sobre conteudo" }),
          tracks2.flatMap((track) => track.courses).map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: `Duvida sobre ${course2.title}`, children: course2.title }, course2.id)),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "Problema tecnico", children: "Problema tecnico" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "Outro", children: "Outro" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Mensagem",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { disabled: readOnly, maxLength: 4e3, required: true, value: message, onChange: (event) => setMessage(event.target.value), placeholder: "Descreva sua solicitacao" })
      ] }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Solicitacao enviada." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel enviar a solicitacao." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: readOnly || status === "saving", type: "submit", children: status === "saving" ? "Enviando..." : "Enviar solicitacao" })
    ] })
  ] });
}
function NotificationsView({ notifications, onMarkAllRead, onLoad, readOnly }) {
  (0, import_react3.useEffect)(() => {
    void onLoad();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Notificacoes" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: readOnly, onClick: () => void onMarkAllRead(), type: "button", children: "Marcar todas como lidas" }),
    notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma notificacao nova." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: notifications.map((notification) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: `read-only-result${notification.readAt ? "" : " unread"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: notification.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: notification.body }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: new Date(notification.createdAt).toLocaleString("pt-BR") })
    ] }, notification.id)) })
  ] });
}
function AdminAuditView({ logs, onLoad }) {
  const [action, setAction] = (0, import_react3.useState)("");
  const [entityType, setEntityType] = (0, import_react3.useState)("");
  const [status, setStatus] = (0, import_react3.useState)("loading");
  async function load(filters = { action, entityType }) {
    setStatus("loading");
    try {
      await onLoad({ action: filters.action || void 0, entityType: filters.entityType || void 0 });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }
  (0, import_react3.useEffect)(() => {
    void load();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Historico" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Acompanhe alteracoes administrativas recentes no C\xEDrculo." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: (event) => {
      event.preventDefault();
      void load();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Acao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: action, onChange: (event) => setAction(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Todas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "CREATE", children: "Criacao" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "UPDATE", children: "Edicao" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "PUBLISH", children: "Publicacao" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "DELETE", children: "Exclusao" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "GRANT_ACCESS", children: "Acesso concedido" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "REVOKE_ACCESS", children: "Acesso removido" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "BLOCK_ACCESS", children: "Acesso bloqueado" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "UNBLOCK_ACCESS", children: "Acesso desbloqueado" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Entidade",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: entityType, onChange: (event) => setEntityType(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Todas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "STUDENT", children: "Aluna" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "STUDENT_ACCESS", children: "Acesso de aluna" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "LESSON", children: "Aula" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "MODULE", children: "Modulo" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "loading", type: "submit", children: status === "loading" ? "Carregando..." : "Atualizar historico" })
    ] }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel carregar o historico." }),
    status !== "loading" && logs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhum evento encontrado." }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list admin-lesson-list", "aria-live": "polite", children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: log.summary }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          log.entityType,
          " / ",
          log.entityId
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: log.actor ? log.actor.name + " / " + log.actor.email : "Ator indisponivel" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: new Date(log.createdAt).toLocaleString("pt-BR") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("b", { children: log.action })
    ] }, log.id)) })
  ] });
}
function AdminStudentsView({ onCreateStudent, onGrantAccess, onLoadStudents, onResendInvitation, onRevokeAccess, students, tracks: tracks2 }) {
  const firstStudent = students[0];
  const firstTrack = tracks2[0];
  const [studentId, setStudentId] = (0, import_react3.useState)(firstStudent?.id ?? "");
  const [trackSlug, setTrackSlug] = (0, import_react3.useState)(firstTrack?.id ?? "");
  const [status, setStatus] = (0, import_react3.useState)("loading");
  const [newStudentName, setNewStudentName] = (0, import_react3.useState)("");
  const [newStudentEmail, setNewStudentEmail] = (0, import_react3.useState)("");
  const [newStudentPassword, setNewStudentPassword] = (0, import_react3.useState)("");
  const [sendInvitation, setSendInvitation] = (0, import_react3.useState)(true);
  const [invitationWarning, setInvitationWarning] = (0, import_react3.useState)(false);
  const [newStudentStatus, setNewStudentStatus] = (0, import_react3.useState)("ACTIVE");
  const [newStudentTrackSlugs, setNewStudentTrackSlugs] = (0, import_react3.useState)([]);
  const [studentSearch, setStudentSearch] = (0, import_react3.useState)("");
  const [studentStatusFilter, setStudentStatusFilter] = (0, import_react3.useState)("ALL");
  const [studentTrackFilter, setStudentTrackFilter] = (0, import_react3.useState)("ALL");
  const [studentsWithoutAccessOnly, setStudentsWithoutAccessOnly] = (0, import_react3.useState)(false);
  const [studentsLowProgressOnly, setStudentsLowProgressOnly] = (0, import_react3.useState)(false);
  const [studentsInactiveOnly, setStudentsInactiveOnly] = (0, import_react3.useState)(false);
  const selectedStudent = students.find((student) => student.id === studentId) ?? firstStudent;
  const selectedTrack = tracks2.find((track) => track.id === trackSlug) ?? firstTrack;
  const filteredStudents = students.filter((student) => {
    const query = studentSearch.trim().toLowerCase();
    const matchesSearch = !query || student.name.toLowerCase().includes(query) || student.email.toLowerCase().includes(query);
    const matchesStatus = studentStatusFilter === "ALL" || student.status === studentStatusFilter;
    const matchesTrack = studentTrackFilter === "ALL" || student.accesses.some((access) => access.trackId === studentTrackFilter && access.status === "ACTIVE");
    const matchesNoAccess = !studentsWithoutAccessOnly || student.accesses.every((access) => access.status !== "ACTIVE");
    const matchesLowProgress = !studentsLowProgressOnly || student.completedLessons <= 2;
    const matchesInactive = !studentsInactiveOnly || !student.lastActivityAt || Date.now() - new Date(student.lastActivityAt).getTime() > 30 * 24 * 60 * 60 * 1e3;
    return matchesSearch && matchesStatus && matchesTrack && matchesNoAccess && matchesLowProgress && matchesInactive;
  });
  const exportQuery = new URLSearchParams({ search: studentSearch, status: studentStatusFilter, trackSlug: studentTrackFilter, noAccess: String(studentsWithoutAccessOnly), lowProgress: String(studentsLowProgressOnly), inactive: String(studentsInactiveOnly) });
  (0, import_react3.useEffect)(() => {
    let active = true;
    setStatus("loading");
    onLoadStudents().then(() => {
      if (active) setStatus("idle");
    }).catch(() => {
      if (active) setStatus("error");
    });
    return () => {
      active = false;
    };
  }, []);
  (0, import_react3.useEffect)(() => {
    if (!selectedStudent && firstStudent) setStudentId(firstStudent.id);
  }, [firstStudent, selectedStudent]);
  (0, import_react3.useEffect)(() => {
    if (!selectedTrack && firstTrack) setTrackSlug(firstTrack.id);
  }, [firstTrack, selectedTrack]);
  async function createStudent(event) {
    event.preventDefault();
    setStatus("saving");
    try {
      const created = await onCreateStudent({ name: newStudentName, email: newStudentEmail, password: sendInvitation ? void 0 : newStudentPassword, invite: sendInvitation, status: newStudentStatus, trackSlugs: newStudentTrackSlugs });
      setNewStudentName("");
      setNewStudentEmail("");
      setNewStudentPassword("");
      setSendInvitation(true);
      setNewStudentStatus("ACTIVE");
      setNewStudentTrackSlugs([]);
      setInvitationWarning(created.invitation?.sent === false);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  function toggleNewStudentTrack(trackId) {
    setNewStudentTrackSlugs((current) => current.includes(trackId) ? current.filter((item) => item !== trackId) : [...current, trackId]);
  }
  async function grantAccess(event) {
    event.preventDefault();
    if (!selectedStudent || !selectedTrack) return;
    setStatus("saving");
    try {
      await onGrantAccess({ userId: selectedStudent.id, trackSlug: selectedTrack.id });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function revokeAccess(student, trackId) {
    if (!window.confirm(`Remover acesso de ${student.name} a esta jornada?`)) return;
    setStatus("saving");
    try {
      await onRevokeAccess({ userId: student.id, trackSlug: trackId });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function resendInvitation(student) {
    setStatus("saving");
    try {
      await onResendInvitation(student.id);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Alunas" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Consulte alunas e ajuste o acesso de cada uma as jornadas publicadas." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: createStudent, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: newStudentName, onChange: (event) => setNewStudentName(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Email",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "email", value: newStudentEmail, onChange: (event) => setNewStudentEmail(event.target.value), required: true })
      ] }),
      !sendInvitation && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Senha inicial",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "password", minLength: 8, value: newStudentPassword, onChange: (event) => setNewStudentPassword(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: sendInvitation, onChange: (event) => setSendInvitation(event.target.checked), type: "checkbox" }),
        " Enviar convite para definir a senha"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Status",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: newStudentStatus, onChange: (event) => setNewStudentStatus(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "ACTIVE", children: "Ativa" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "PENDING", children: "Pendente" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "BLOCKED", children: "Bloqueada" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "wide checkbox-grid", "aria-label": "Jornadas iniciais", children: tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: newStudentTrackSlugs.includes(track.id), onChange: () => toggleNewStudentTrack(track.id), type: "checkbox" }),
        track.name
      ] }, track.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Salvando..." : "Adicionar aluna" }),
      status === "saved" && invitationWarning && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: 'Aluna criada, mas o convite nao foi enviado. Verifique o mailbox e use "Reenviar convite" quando ele estiver disponivel.' }),
      status === "saved" && !invitationWarning && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Aluna criada e convite enviado." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: grantAccess, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Aluna",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: selectedStudent?.id ?? "", onChange: (event) => setStudentId(event.target.value), children: students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("option", { value: student.id, children: [
          student.name,
          " / ",
          student.email
        ] }, student.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Jornada",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: selectedTrack?.id ?? "", onChange: (event) => setTrackSlug(event.target.value), children: tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: track.id, children: track.name }, track.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving" || !selectedStudent || !selectedTrack, type: "submit", children: status === "saving" ? "Salvando..." : "Conceder acesso" }),
      status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Carregando alunas..." }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Acesso atualizado." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel atualizar o acesso." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid student-filters", "aria-label": "Filtros de alunas", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Buscar aluna",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: studentSearch, onChange: (event) => setStudentSearch(event.target.value), placeholder: "Nome ou email" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Status",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: studentStatusFilter, onChange: (event) => setStudentStatusFilter(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "ALL", children: "Todos os status" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "ACTIVE", children: "Ativas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "PENDING", children: "Pendentes" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "BLOCKED", children: "Bloqueadas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "EXPIRED", children: "Expiradas" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Jornada",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: studentTrackFilter, onChange: (event) => setStudentTrackFilter(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "ALL", children: "Todas as jornadas" }),
          tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: track.id, children: track.name }, track.id))
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: studentsWithoutAccessOnly, onChange: (event) => setStudentsWithoutAccessOnly(event.target.checked), type: "checkbox" }),
        " Sem jornada ativa"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: studentsLowProgressOnly, onChange: (event) => setStudentsLowProgressOnly(event.target.checked), type: "checkbox" }),
        " Baixo progresso (ate 2 aulas)"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: studentsInactiveOnly, onChange: (event) => setStudentsInactiveOnly(event.target.checked), type: "checkbox" }),
        " Sem atividade ha 30 dias"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { className: "primary-action", download: true, href: `/admin/students/export.csv?${exportQuery.toString()}`, children: "Exportar CSV" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list admin-lesson-list", children: [
      filteredStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: student.name }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          student.email,
          " / ",
          student.status,
          " / ",
          student.completedLessons,
          " aulas concluidas / ",
          student.lastActivityAt ? `atividade em ${new Date(student.lastActivityAt).toLocaleDateString("pt-BR")}` : "sem atividade",
          " / ",
          student.accesses.filter((access) => access.status === "ACTIVE").length,
          " acessos ativos"
        ] }),
        student.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void resendInvitation(student), type: "button", children: "Reenviar convite" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "student-access-list", children: [
          student.accesses.map((access) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "access-pill", children: [
            access.trackName,
            " / ",
            access.status,
            access.status === "ACTIVE" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-label": `Remover acesso a ${access.trackName}`, onClick: () => void revokeAccess(student, access.trackId), type: "button", children: "Remover" })
          ] }, `${student.id}-${access.trackId}`)),
          student.accesses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "access-pill", children: "Sem jornadas liberadas" })
        ] })
      ] }, student.id)),
      filteredStudents.length === 0 && status !== "loading" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma aluna encontrada para os filtros atuais." })
    ] })
  ] });
}
function AdminTracksView({ onCreateTrack, onDeleteTrack, onUpdateTrack, onUpload, tracks: tracks2 }) {
  const [editingTrackId, setEditingTrackId] = (0, import_react3.useState)("");
  const editingTrack = tracks2.find((track) => track.id === editingTrackId);
  const [name, setName] = (0, import_react3.useState)("");
  const [description, setDescription] = (0, import_react3.useState)("");
  const [bannerEyebrow, setBannerEyebrow] = (0, import_react3.useState)("Jornada");
  const [bannerTitle, setBannerTitle] = (0, import_react3.useState)("");
  const [bannerSubtitle, setBannerSubtitle] = (0, import_react3.useState)("");
  const [bannerImagePath, setBannerImagePath] = (0, import_react3.useState)("");
  const [accentColor, setAccentColor] = (0, import_react3.useState)("#d6a14a");
  const [visible, setVisible] = (0, import_react3.useState)(true);
  const [status, setStatus] = (0, import_react3.useState)("idle");
  (0, import_react3.useEffect)(() => {
    if (!editingTrack) return;
    setName(editingTrack.name);
    setDescription(editingTrack.description ?? "");
    setBannerEyebrow(editingTrack.banner.eyebrow ?? "Jornada");
    setBannerTitle(editingTrack.banner.title ?? editingTrack.name);
    setBannerSubtitle(editingTrack.banner.subtitle ?? "");
    setBannerImagePath(editingTrack.banner.imagePath ?? "");
    setAccentColor(editingTrack.banner.accentColor ?? "#d6a14a");
    setVisible(editingTrack.visible ?? true);
  }, [editingTrack]);
  function clearForm() {
    setEditingTrackId("");
    setName("");
    setDescription("");
    setBannerEyebrow("Jornada");
    setBannerTitle("");
    setBannerSubtitle("");
    setBannerImagePath("");
    setAccentColor("#d6a14a");
    setVisible(true);
  }
  async function submitTrack(event) {
    event.preventDefault();
    setStatus("saving");
    try {
      const payload = { name, description, bannerEyebrow, bannerTitle, bannerSubtitle, bannerImagePath, accentColor, visible };
      if (editingTrackId) {
        await onUpdateTrack({ ...payload, trackSlug: editingTrackId });
      } else {
        await onCreateTrack(payload);
      }
      clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function removeTrack(track) {
    if (!window.confirm(`Excluir a jornada "${track.name}" e todo o conteudo vinculado?`)) return;
    setStatus("saving");
    try {
      await onDeleteTrack({ trackSlug: track.id });
      if (editingTrackId === track.id) clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Jornadas" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Cadastre as jornadas principais, imagens de banner e status de publicacao." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submitTrack, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: name, onChange: (event) => setName(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Chamada curta",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: bannerEyebrow, onChange: (event) => setBannerEyebrow(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Titulo do banner",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: bannerTitle, onChange: (event) => setBannerTitle(event.target.value), placeholder: "Opcional" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Cor de destaque",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "color", value: accentColor, onChange: (event) => setAccentColor(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Visivel",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: visible ? "yes" : "no", onChange: (event) => setVisible(event.target.value === "yes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "yes", children: "Sim" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "no", children: "Nao" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CatalogAssetInput, { label: "Imagem do banner", onChange: setBannerImagePath, onUpload, value: bannerImagePath }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Subtitulo do banner",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: bannerSubtitle, onChange: (event) => setBannerSubtitle(event.target.value), placeholder: "Texto de apoio no topo da jornada" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Descricao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: description, onChange: (event) => setDescription(event.target.value), placeholder: "Descricao curta da jornada" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Salvando..." : editingTrackId ? "Salvar jornada" : "Adicionar jornada" }),
      editingTrackId && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: clearForm, type: "button", children: "Cancelar edicao" }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Catalogo atualizado." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar a alteracao." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list admin-lesson-list", children: [
      tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: track.name }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          track.visible === false ? "Oculta" : "Visivel",
          " / ",
          track.courses.length,
          " cursos / ",
          countModules(track),
          " modulos / ",
          countLessons(track),
          " aulas"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => setEditingTrackId(track.id), type: "button", children: "Editar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void removeTrack(track), type: "button", children: "Excluir" })
        ] })
      ] }, track.id)),
      tracks2.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Ainda nao existem jornadas cadastradas." })
    ] })
  ] });
}
function AdminCoursesView({ onCreateCourse, onDeleteCourse, onUpdateCourse, onUpload, tracks: tracks2 }) {
  const firstTrack = tracks2[0];
  const [trackSlug, setTrackSlug] = (0, import_react3.useState)(firstTrack?.id ?? "");
  const selectedTrack = tracks2.find((track) => track.id === trackSlug) ?? firstTrack;
  const [editingCourseId, setEditingCourseId] = (0, import_react3.useState)("");
  const editingCourse = selectedTrack?.courses.find((course2) => course2.id === editingCourseId);
  const [title, setTitle] = (0, import_react3.useState)("");
  const [description, setDescription] = (0, import_react3.useState)("");
  const [coverImagePath, setCoverImagePath] = (0, import_react3.useState)("");
  const [durationLabel, setDurationLabel] = (0, import_react3.useState)("");
  const [visible, setVisible] = (0, import_react3.useState)(true);
  const [status, setStatus] = (0, import_react3.useState)("idle");
  (0, import_react3.useEffect)(() => {
    if (!selectedTrack || selectedTrack.courses.some((course2) => course2.id === editingCourseId)) return;
    setEditingCourseId("");
  }, [editingCourseId, selectedTrack]);
  (0, import_react3.useEffect)(() => {
    if (!editingCourse) return;
    setTitle(editingCourse.title);
    setDescription(editingCourse.description ?? "");
    setCoverImagePath(editingCourse.coverImagePath ?? "");
    setDurationLabel(editingCourse.durationLabel ?? "");
    setVisible(editingCourse.visible ?? true);
  }, [editingCourse]);
  function clearForm() {
    setEditingCourseId("");
    setTitle("");
    setDescription("");
    setCoverImagePath("");
    setDurationLabel("");
    setVisible(true);
  }
  async function submitCourse(event) {
    event.preventDefault();
    if (!selectedTrack) return;
    setStatus("saving");
    try {
      const payload = { trackSlug: selectedTrack.id, title, description, coverImagePath, durationLabel, visible };
      if (editingCourseId) {
        await onUpdateCourse({ ...payload, courseSlug: editingCourseId });
      } else {
        await onCreateCourse(payload);
      }
      clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function removeCourse(course2) {
    if (!selectedTrack) return;
    if (!window.confirm(`Excluir o curso "${course2.title}" e seus modulos?`)) return;
    setStatus("saving");
    try {
      await onDeleteCourse({ trackSlug: selectedTrack.id, courseSlug: course2.id });
      if (editingCourseId === course2.id) clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Cursos" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Organize cursos dentro das jornadas antes de montar os modulos e aulas." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submitCourse, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Jornada",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: selectedTrack?.id ?? "", onChange: (event) => {
          setTrackSlug(event.target.value);
          clearForm();
        }, children: tracks2.map((track) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: track.id, children: track.name }, track.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Titulo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: title, onChange: (event) => setTitle(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Duracao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { placeholder: "Ex: 1h 20m", value: durationLabel, onChange: (event) => setDurationLabel(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Visivel",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: visible ? "yes" : "no", onChange: (event) => setVisible(event.target.value === "yes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "yes", children: "Sim" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "no", children: "Nao" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CatalogAssetInput, { label: "Capa do curso", onChange: setCoverImagePath, onUpload, value: coverImagePath }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Descricao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: description, onChange: (event) => setDescription(event.target.value), placeholder: "Descricao curta do curso" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Salvando..." : editingCourseId ? "Salvar curso" : "Adicionar curso" }),
      editingCourseId && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: clearForm, type: "button", children: "Cancelar edicao" }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Catalogo atualizado." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar a alteracao." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list admin-lesson-list", children: [
      (selectedTrack?.courses ?? []).map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: course2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          course2.visible === false ? "Oculto" : "Visivel",
          " / ",
          course2.durationLabel ?? "sem duracao",
          " / ",
          course2.modules.length,
          " modulos"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => setEditingCourseId(course2.id), type: "button", children: "Editar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void removeCourse(course2), type: "button", children: "Excluir" })
        ] })
      ] }, course2.id)),
      selectedTrack?.courses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Esta jornada ainda nao tem cursos." })
    ] })
  ] });
}
function AdminModulesView({ onCreateModule, onDeleteModule, onUpdateModule, tracks: tracks2 }) {
  const courses = tracks2.flatMap((track) => track.courses);
  const firstCourse = courses[0];
  const [courseSlug, setCourseSlug] = (0, import_react3.useState)(firstCourse?.id ?? "");
  const selectedCourse = courses.find((course2) => course2.id === courseSlug) ?? firstCourse;
  const [editingModuleId, setEditingModuleId] = (0, import_react3.useState)("");
  const editingModule = selectedCourse?.modules.find((moduleItem) => moduleItem.id === editingModuleId);
  const [title, setTitle] = (0, import_react3.useState)("");
  const [description, setDescription] = (0, import_react3.useState)("");
  const [visible, setVisible] = (0, import_react3.useState)(true);
  const [status, setStatus] = (0, import_react3.useState)("idle");
  (0, import_react3.useEffect)(() => {
    if (!selectedCourse || selectedCourse.modules.some((moduleItem) => moduleItem.id === editingModuleId)) return;
    setEditingModuleId("");
  }, [editingModuleId, selectedCourse]);
  (0, import_react3.useEffect)(() => {
    if (!editingModule) return;
    setTitle(editingModule.title);
    setDescription(editingModule.description ?? "");
    setVisible(true);
  }, [editingModule]);
  function clearForm() {
    setEditingModuleId("");
    setTitle("");
    setDescription("");
    setVisible(true);
  }
  async function submitModule(event) {
    event.preventDefault();
    if (!selectedCourse) return;
    setStatus("saving");
    try {
      const payload = { courseSlug: selectedCourse.id, title, description, visible };
      if (editingModuleId) {
        await onUpdateModule({ ...payload, moduleSlug: editingModuleId });
      } else {
        await onCreateModule(payload);
      }
      clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function removeModule(moduleItem) {
    if (!selectedCourse) return;
    if (!window.confirm(`Excluir o modulo "${moduleItem.title}" e suas aulas?`)) return;
    setStatus("saving");
    try {
      await onDeleteModule({ courseSlug: selectedCourse.id, moduleSlug: moduleItem.id });
      if (editingModuleId === moduleItem.id) clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Modulos" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Organize os modulos dentro dos cursos existentes antes de adicionar aulas." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submitModule, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Curso",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: selectedCourse?.id ?? "", onChange: (event) => {
          setCourseSlug(event.target.value);
          clearForm();
        }, children: courses.map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: course2.id, children: course2.title }, course2.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Titulo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: title, onChange: (event) => setTitle(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Visivel",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: visible ? "yes" : "no", onChange: (event) => setVisible(event.target.value === "yes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "yes", children: "Sim" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "no", children: "Nao" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Descricao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: description, onChange: (event) => setDescription(event.target.value), placeholder: "Descricao curta do modulo" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Salvando..." : editingModuleId ? "Salvar modulo" : "Adicionar modulo" }),
      editingModuleId && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: clearForm, type: "button", children: "Cancelar edicao" }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Catalogo atualizado." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar a alteracao." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list admin-lesson-list", children: [
      (selectedCourse?.modules ?? []).map((moduleItem) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: moduleItem.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          moduleItem.visible === false ? "Oculto" : "Visivel",
          " / ",
          moduleItem.description ?? "Sem descricao",
          " / ",
          moduleItem.lessons.length,
          " aulas"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => setEditingModuleId(moduleItem.id), type: "button", children: "Editar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void removeModule(moduleItem), type: "button", children: "Excluir" })
        ] })
      ] }, moduleItem.id)),
      selectedCourse?.modules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Este curso ainda nao tem modulos." })
    ] })
  ] });
}
function AdminLessonsView({ onCreateLesson, onDeleteLesson, onReorderLessons, onUpdateLesson, onUploadMaterial, htmlAllowedOrigins, tracks: tracks2 }) {
  const courses = tracks2.flatMap((track) => track.courses);
  const firstCourse = courses[0];
  const [courseSlug, setCourseSlug] = (0, import_react3.useState)(firstCourse?.id ?? "");
  const selectedCourse = courses.find((course2) => course2.id === courseSlug) ?? firstCourse;
  const [moduleSlug, setModuleSlug] = (0, import_react3.useState)(selectedCourse?.modules[0]?.id ?? "");
  const selectedModule = selectedCourse?.modules.find((moduleItem) => moduleItem.id === moduleSlug) ?? selectedCourse?.modules[0];
  const [editingLessonId, setEditingLessonId] = (0, import_react3.useState)("");
  const editingLesson = selectedModule?.lessons.find((lesson2) => lesson2.id === editingLessonId);
  const [title, setTitle] = (0, import_react3.useState)("");
  const [kind, setKind] = (0, import_react3.useState)("video");
  const [summary, setSummary] = (0, import_react3.useState)("");
  const [durationLabel, setDurationLabel] = (0, import_react3.useState)("");
  const [mediaType, setMediaType] = (0, import_react3.useState)("internal");
  const [mediaProvider, setMediaProvider] = (0, import_react3.useState)("bunny");
  const [mediaReference, setMediaReference] = (0, import_react3.useState)("");
  const [materialsText, setMaterialsText] = (0, import_react3.useState)("");
  const [published, setPublished] = (0, import_react3.useState)(false);
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [materialUploadStatus, setMaterialUploadStatus] = (0, import_react3.useState)("");
  const [htmlUploadStatus, setHtmlUploadStatus] = (0, import_react3.useState)("");
  const [htmlUploading, setHtmlUploading] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    if (selectedCourse && !selectedCourse.modules.some((moduleItem) => moduleItem.id === moduleSlug)) {
      setModuleSlug(selectedCourse.modules[0]?.id ?? "");
      setEditingLessonId("");
    }
  }, [moduleSlug, selectedCourse]);
  (0, import_react3.useEffect)(() => {
    if (!editingLesson) return;
    setTitle(editingLesson.title);
    setKind(editingLesson.kind);
    setSummary(editingLesson.summary ?? "");
    setDurationLabel(editingLesson.durationLabel ?? "");
    setMediaType(editingLesson.media?.type ?? "internal");
    setMediaProvider(editingLesson.media?.provider ?? "bunny");
    setMediaReference(editingLesson.media?.reference ?? "");
    setMaterialsText(editingLesson.materials?.join("\n") ?? "");
    setPublished(editingLesson.published ?? false);
  }, [editingLesson]);
  function clearForm() {
    setEditingLessonId("");
    setTitle("");
    setKind("video");
    setSummary("");
    setDurationLabel("");
    setMediaType("internal");
    setMediaProvider("bunny");
    setMediaReference("");
    setMaterialsText("");
    setPublished(false);
    setHtmlUploadStatus("");
  }
  async function submitLesson(event) {
    event.preventDefault();
    if (!selectedCourse || !selectedModule || htmlUploading) return;
    setStatus("saving");
    try {
      const trimmedMediaReference = mediaReference.trim();
      if (mediaType === "external" && mediaProvider === "html" && !resolveExternalHtml(trimmedMediaReference, htmlAllowedOrigins, window.location.hostname)) {
        setHtmlUploadStatus("URL HTML invalida ou origem nao autorizada. Configure as origens HTTPS do projeto antes de salvar.");
        setStatus("error");
        return;
      }
      const materials = materialsText.split("\n").map((item) => item.trim()).filter(Boolean);
      const payload = { courseSlug: selectedCourse.id, moduleSlug: selectedModule.id, title, kind, summary, durationLabel, media: trimmedMediaReference ? { type: mediaType, provider: mediaType === "external" ? mediaProvider : void 0, reference: trimmedMediaReference } : void 0, materials, published };
      if (editingLessonId) {
        await onUpdateLesson({ ...payload, lessonSlug: editingLessonId });
      } else {
        await onCreateLesson(payload);
      }
      clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function uploadMaterial(file) {
    if (!file) return;
    setMaterialUploadStatus("Enviando material...");
    try {
      const material = await onUploadMaterial(file);
      setMaterialsText((current) => current ? `${current}
${material.url}` : material.url);
      setMaterialUploadStatus("Material enviado.");
    } catch (error) {
      setMaterialUploadStatus(error instanceof Error ? error.message : "Nao foi possivel enviar o material.");
    }
  }
  async function uploadHtml(file) {
    if (!file) return;
    setHtmlUploading(true);
    setHtmlUploadStatus("Enviando HTML...");
    try {
      const document2 = await uploadHtmlLesson(file);
      setMediaType("internal");
      setMediaReference(document2.url);
      setKind("tool");
      setHtmlUploadStatus("HTML enviado. Salve a aula para vincular; o envio nao publica automaticamente.");
    } catch (error) {
      setHtmlUploadStatus(error instanceof Error ? error.message : "Nao foi possivel enviar o HTML.");
    } finally {
      setHtmlUploading(false);
    }
  }
  async function moveLesson(lessonId, direction) {
    if (!selectedCourse || !selectedModule) return;
    const currentIndex = selectedModule.lessons.findIndex((lesson2) => lesson2.id === lessonId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= selectedModule.lessons.length) return;
    const lessonSlugs = selectedModule.lessons.map((lesson2) => lesson2.id);
    [lessonSlugs[currentIndex], lessonSlugs[nextIndex]] = [lessonSlugs[nextIndex], lessonSlugs[currentIndex]];
    setStatus("saving");
    try {
      await onReorderLessons({ courseSlug: selectedCourse.id, moduleSlug: selectedModule.id, lessonSlugs });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function removeLesson(lesson2) {
    if (!selectedCourse || !selectedModule) return;
    if (!window.confirm(`Excluir a aula "${lesson2.title}"?`)) return;
    setStatus("saving");
    try {
      await onDeleteLesson({ courseSlug: selectedCourse.id, moduleSlug: selectedModule.id, lessonSlug: lesson2.id });
      if (editingLessonId === lesson2.id) clearForm();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Admin" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Aulas" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Cadastre e gerencie aulas nos modulos existentes da biblioteca." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submitLesson, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Curso",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { disabled: htmlUploading, value: courseSlug, onChange: (event) => {
          setCourseSlug(event.target.value);
          setEditingLessonId("");
        }, children: courses.map((course2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: course2.id, children: course2.title }, course2.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Modulo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { disabled: htmlUploading, value: moduleSlug, onChange: (event) => {
          setModuleSlug(event.target.value);
          setEditingLessonId("");
        }, children: selectedCourse?.modules.map((moduleItem) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: moduleItem.id, children: moduleItem.title }, moduleItem.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Titulo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: title, onChange: (event) => setTitle(event.target.value), required: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Tipo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: kind, onChange: (event) => setKind(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "video", children: "Video" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "live", children: "Encontro" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "material", children: "Material" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "tool", children: "Ferramenta" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Duracao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { placeholder: "Ex: 20m", value: durationLabel, onChange: (event) => setDurationLabel(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Tipo de midia",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { disabled: htmlUploading, value: mediaType, onChange: (event) => setMediaType(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "internal", children: "Arquivo interno / HTML" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "external", children: "Referencia externa" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "embed", children: "Embed legado" })
        ] })
      ] }),
      mediaType === "external" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Provedor",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: mediaProvider, onChange: (event) => setMediaProvider(event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "bunny", children: "Bunny Stream" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "youtube", children: "YouTube" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "html", children: "HTML externo (HTTPS)" })
        ] })
      ] }),
      mediaType === "internal" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "wide", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Enviar aula HTML" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileUploadControl, { accept: ".html,.htm,text/html", disabled: htmlUploading, onSelect: uploadHtml }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: "Maximo 50 MiB no total, incluindo imagens, CSS, scripts e dados incorporados no HTML. Arquivos relativos/CDNs nao sao incluidos. Acima do limite, otimize ou escolha HTML externo." }),
        htmlUploadStatus && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { role: "status", children: htmlUploadStatus })
      ] }),
      mediaType === "external" && mediaProvider === "html" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "wide field-help", children: [
        "Informe uma URL HTTPS de origem autorizada nas Configuracoes do projeto. Uma URL publica permanece publica fora do Circulo; o host precisa permitir iframe. Nao ha envio nem publicacao externa automatica.",
        htmlUploadStatus && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { role: "status", children: htmlUploadStatus })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Referencia da midia",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: mediaReference, onChange: (event) => setMediaReference(event.target.value), placeholder: mediaType === "external" && mediaProvider === "youtube" ? "ID do video YouTube (11 caracteres)" : "ID, caminho interno ou codigo de embed" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Materiais",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileUploadControl, { accept: "application/pdf,.pdf", onSelect: uploadMaterial }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { "aria-label": "Materiais", value: materialsText, onChange: (event) => setMaterialsText(event.target.value), placeholder: "Um material por linha" }),
        materialUploadStatus && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { className: materialUploadStatus.startsWith("Nao") || materialUploadStatus.startsWith("Material is") ? "login-error" : "form-status", children: materialUploadStatus })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Publicado",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: published ? "yes" : "no", onChange: (event) => setPublished(event.target.value === "yes"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "yes", children: "Sim" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "no", children: "Nao" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Resumo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: summary, onChange: (event) => setSummary(event.target.value), placeholder: "Resumo curto da aula" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving" || htmlUploading, type: "submit", children: status === "saving" ? "Salvando..." : editingLessonId ? "Salvar aula" : "Adicionar aula" }),
      editingLessonId && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: htmlUploading, onClick: clearForm, type: "button", children: "Cancelar edicao" }),
      status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Catalogo atualizado." }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar a alteracao." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list admin-lesson-list", children: [
      (selectedModule?.lessons ?? []).map((lesson2) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: lesson2.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
          lessonKindLabels[lesson2.kind],
          lesson2.durationLabel ? ` / ${lesson2.durationLabel}` : ""
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-label": `Mover ${lesson2.title} para cima`, className: "secondary-action", disabled: selectedModule.lessons[0]?.id === lesson2.id || status === "saving", onClick: () => void moveLesson(lesson2.id, -1), type: "button", children: "\u2191" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-label": `Mover ${lesson2.title} para baixo`, className: "secondary-action", disabled: selectedModule.lessons[selectedModule.lessons.length - 1]?.id === lesson2.id || status === "saving", onClick: () => void moveLesson(lesson2.id, 1), type: "button", children: "\u2193" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: htmlUploading, onClick: () => setEditingLessonId(lesson2.id), type: "button", children: "Editar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void removeLesson(lesson2), type: "button", children: "Excluir" })
        ] })
      ] }, lesson2.id)),
      selectedModule?.lessons.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Este modulo ainda nao tem aulas." })
    ] })
  ] });
}
function CircleSignupsView({ onDecide, onProvision, onResendInvitation, requests }) {
  const [notes, setNotes] = (0, import_react3.useState)({});
  const [busyId, setBusyId] = (0, import_react3.useState)("");
  const [error, setError] = (0, import_react3.useState)("");
  async function decide(request3, status) {
    if (!window.confirm(`Confirmar ${status === "APPROVED" ? "aprova\xE7\xE3o" : status === "REJECTED" ? "rejei\xE7\xE3o" : "pedido de ajustes"} de ${request3.circleName}?`)) return;
    setBusyId(request3.id);
    setError("");
    try {
      await onDecide(request3.id, status, notes[request3.id]?.trim() || null);
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : "Nao foi possivel atualizar a solicitacao.");
    } finally {
      setBusyId("");
    }
  }
  async function provision(request3) {
    if (!window.confirm(`Provisionar o tenant ${request3.slug}.circulo.soberania.cloud e enviar o convite?`)) return;
    setBusyId(request3.id);
    setError("");
    try {
      await onProvision(request3.id);
    } catch (provisionError) {
      setError(provisionError instanceof Error ? provisionError.message : "Nao foi possivel provisionar o Circulo.");
    } finally {
      setBusyId("");
    }
  }
  async function resend(request3) {
    if (!window.confirm(`Reenviar o convite para ${request3.email}?`)) return;
    setBusyId(request3.id);
    setError("");
    try {
      await onResendInvitation(request3.id);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Nao foi possivel reenviar o convite.");
    } finally {
      setBusyId("");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Plataforma" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Solicita\xE7\xF5es de C\xEDrculo" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Analise pedidos de cria\xE7\xE3o antes de provisionar um novo tenant." })
    ] }) }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "result-list", children: [
      requests.map((request3) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "read-only-result", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "settings-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: request3.circleName }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
              request3.name,
              " \xB7 ",
              request3.email
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
              "Slug: ",
              request3.slug,
              " \xB7 Status: ",
              request3.status
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: new Date(request3.createdAt).toLocaleString("pt-BR") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
          "Nota interna (opcional)",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { "aria-label": "Nota interna", maxLength: 1e3, value: notes[request3.id] ?? request3.reviewNote ?? "", onChange: (event) => setNotes((current) => ({ ...current, [request3.id]: event.target.value })), placeholder: "Registre aqui o contexto da an\xE1lise" })
        ] }),
        request3.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: busyId === request3.id, onClick: () => void decide(request3, "APPROVED"), type: "button", children: "Aprovar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: busyId === request3.id, onClick: () => void decide(request3, "NEEDS_CHANGES"), type: "button", children: "Solicitar ajustes" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", disabled: busyId === request3.id, onClick: () => void decide(request3, "REJECTED"), type: "button", children: "Rejeitar" })
        ] }),
        request3.status === "APPROVED" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: busyId === request3.id, onClick: () => void provision(request3), type: "button", children: "Provisionar C\xEDrculo" }),
        request3.status === "PROVISIONED" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: busyId === request3.id, onClick: () => void resend(request3), type: "button", children: "Reenviar convite" })
      ] }, request3.id)),
      requests.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma solicita\xE7\xE3o encontrada." })
    ] })
  ] });
}
function ProjectProvisioningView({ admins, domains, onAdminAdd, onAdminRemove, onDomainAdd, onDomainRemove, onDomainVerify, onDomainVerifyDns, onProvision, onStatus, projects, platformSettings, onPlatformSettingsChange, onPlatformSettingsSave }) {
  const [form, setForm] = (0, import_react3.useState)({ slug: "", name: "", hostname: "", adminEmail: "" });
  const [adminEmails, setAdminEmails] = (0, import_react3.useState)({});
  const [domainInputs, setDomainInputs] = (0, import_react3.useState)({});
  const [domainTokens, setDomainTokens] = (0, import_react3.useState)({});
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [error, setError] = (0, import_react3.useState)("");
  const [platformSaveStatus, setPlatformSaveStatus] = (0, import_react3.useState)("idle");
  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await onProvision(form);
      setForm({ slug: "", name: "", hostname: "", adminEmail: "" });
      setStatus("saved");
    } catch (provisionError) {
      setStatus("error");
      setError(provisionError instanceof Error ? provisionError.message : "Nao foi possivel criar o projeto.");
    }
  }
  async function changeStatus(project, nextStatus) {
    if (nextStatus === "ARCHIVED" && !window.confirm(`Arquivar o projeto "${project.name}"?`)) return;
    try {
      await onStatus(project.slug, nextStatus);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Nao foi possivel alterar o status.");
      setStatus("error");
    }
  }
  async function addAdmin(project) {
    const email2 = adminEmails[project.slug]?.trim();
    if (!email2) return;
    try {
      await onAdminAdd(project.slug, email2);
      setAdminEmails((current) => ({ ...current, [project.slug]: "" }));
    } catch (adminError) {
      setError(adminError instanceof Error ? adminError.message : "Nao foi possivel adicionar o administrador.");
      setStatus("error");
    }
  }
  async function addDomain(project) {
    const hostname = domainInputs[project.slug]?.trim();
    if (!hostname) return;
    const domain = await onDomainAdd(project.slug, hostname);
    setDomainInputs((current) => ({ ...current, [project.slug]: "" }));
    if (domain) setDomainTokens((current) => ({ ...current, [domain.id]: domain.verificationToken ?? "" }));
  }
  async function savePlatform() {
    setPlatformSaveStatus("saving");
    try {
      await onPlatformSettingsSave();
      setPlatformSaveStatus("saved");
    } catch {
      setPlatformSaveStatus("error");
    }
  }
  async function verifyDns(project, domain) {
    try {
      await onDomainVerifyDns(project.slug, domain.id);
    } catch (dnsError) {
      setError(dnsError instanceof Error ? dnsError.message : "Nao foi possivel verificar o dominio via DNS.");
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Plataforma" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Projetos" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Crie e gerencie tenants sem compartilhar catalogo ou configuracoes." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Afiliado Bunny" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Este link aparece no onboarding dos projetos e nao concede acesso a nenhuma conta." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "form-grid", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
        "Link de afiliado",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", value: platformSettings.bunnyAffiliateUrl ?? "", onChange: (event) => onPlatformSettingsChange({ bunnyAffiliateUrl: event.target.value || null }), placeholder: "https://bunny.net/?ref=..." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: platformSaveStatus === "saving", onClick: () => void savePlatform(), type: "button", children: platformSaveStatus === "saving" ? "Salvando..." : "Salvar link de afiliado" }),
      platformSaveStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Link global atualizado." }),
      platformSaveStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", children: "Nao foi possivel salvar o link." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: submit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome do projeto",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, value: form.name, onChange: (event) => setForm({ ...form, name: event.target.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Slug",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, pattern: "[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Hostname",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, placeholder: "projeto.localhost", value: form.hostname, onChange: (event) => setForm({ ...form, hostname: event.target.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "E-mail do administrador",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, type: "email", value: form.adminEmail, onChange: (event) => setForm({ ...form, adminEmail: event.target.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Criando..." : "Criar projeto" })
    ] }),
    status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Projeto criado e isolado." }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: project.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        project.slug,
        " / ",
        project.hostname ?? "sem dominio ativo",
        " / ",
        project.status
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "message-thread", children: (admins[project.slug] ?? []).map((admin) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: admin.name }),
        " - ",
        admin.email,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: (admins[project.slug] ?? []).length <= 1, onClick: () => void onAdminRemove(project.slug, admin.userId), type: "button", children: "Remover admin" })
      ] }, admin.userId)) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "message-thread", children: (domains[project.slug] ?? []).map((domain) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: domain.hostname }),
        " - ",
        domain.active ? "ativo" : "aguardando verificacao",
        " ",
        domain.active ? null : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Token de verificacao ${domain.hostname}`, value: domainTokens[domain.id] ?? "", onChange: (event) => setDomainTokens((current) => ({ ...current, [domain.id]: event.target.value })), placeholder: "token" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void onDomainVerify(project.slug, domain.id, domainTokens[domain.id] ?? ""), type: "button", children: "Token" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void verifyDns(project, domain), type: "button", children: "Verificar DNS" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void onDomainRemove(project.slug, domain.id), type: "button", children: "Remover dominio" })
      ] }, domain.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Novo administrador para ${project.name}`, type: "email", value: adminEmails[project.slug] ?? "", onChange: (event) => setAdminEmails((current) => ({ ...current, [project.slug]: event.target.value })), placeholder: "email de usuario existente" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void addAdmin(project), type: "button", children: "Adicionar admin" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Novo dominio para ${project.name}`, value: domainInputs[project.slug] ?? "", onChange: (event) => setDomainInputs((current) => ({ ...current, [project.slug]: event.target.value })), placeholder: "portal.exemplo.com" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void addDomain(project), type: "button", children: "Adicionar dominio" }),
        project.status === "ACTIVE" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void changeStatus(project, "SUSPENDED"), type: "button", children: "Suspender" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void changeStatus(project, "ARCHIVED"), type: "button", children: "Arquivar" })
        ] }),
        project.status === "SUSPENDED" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void changeStatus(project, "ACTIVE"), type: "button", children: "Reativar" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void changeStatus(project, "ARCHIVED"), type: "button", children: "Arquivar" })
        ] }),
        project.status === "ARCHIVED" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Arquivado" })
      ] })
    ] }, project.projectId)) })
  ] });
}
function McpAgentsView({ credentials, onCreate, onRotate, onRevoke, oneTimeSecret, onDismissSecret }) {
  const [agentId, setAgentId] = (0, import_react3.useState)("");
  const [name, setName] = (0, import_react3.useState)("");
  const [expiresAt, setExpiresAt] = (0, import_react3.useState)("");
  const [scopes, setScopes] = (0, import_react3.useState)(["project:read"]);
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [error, setError] = (0, import_react3.useState)("");
  const availableScopes = ["project:read", "members:read", "members:write", "catalog:read", "catalog:write", "catalog:publish", "assets:read", "assets:write", "materials:read", "materials:write", "appearance:read", "appearance:write", "settings:read", "settings:write"];
  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await onCreate({ agentId: agentId.trim(), name: name.trim(), scopes, expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null });
      setAgentId("");
      setName("");
      setExpiresAt("");
      setScopes(["project:read"]);
      setStatus("idle");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Nao foi possivel criar a credencial.");
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page account-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Integracoes" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Agentes autorizados" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Credenciais isoladas deste projeto. O agente so pode executar as capacidades autorizadas pelo admin." })
    ] }) }),
    oneTimeSecret && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("aside", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Segredo exibido uma vez" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Guarde este valor no ambiente seguro do agente. Ele nao podera ser recuperado depois." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: oneTimeSecret }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: onDismissSecret, type: "button", children: "Ocultar segredo" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "form-grid", onSubmit: (event) => void submit(event), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Identificador do agente",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, maxLength: 120, value: agentId, onChange: (event) => setAgentId(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome da integracao",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { required: true, maxLength: 120, value: name, onChange: (event) => setName(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Expira em ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "field-hint", children: "opcional" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Expiracao da credencial", type: "datetime-local", value: expiresAt, onChange: (event) => setExpiresAt(event.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("fieldset", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("legend", { children: "Permissoes" }),
        availableScopes.map((scope) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: scopes.includes(scope), onChange: (event) => setScopes((current) => event.target.checked ? [...current, scope] : current.filter((item) => item !== scope)), type: "checkbox" }),
          " ",
          scope
        ] }, scope))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving" || scopes.length === 0, type: "submit", children: status === "saving" ? "Criando..." : "Criar credencial" })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "result-list", children: credentials.map((credential) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "read-only-result", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: credential.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        credential.agentId,
        " / client id: ",
        credential.clientId,
        " / escopos: ",
        credential.scopes.join(", ")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
        credential.revokedAt ? "Revogada" : "Ativa",
        " / ",
        credential.expiresAt ? `expira em ${new Date(credential.expiresAt).toLocaleString("pt-BR")}` : "sem expiracao",
        " / segredo: ",
        credential.secretPrefix,
        "..."
      ] }),
      !credential.revokedAt && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "inline-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void onRotate(credential.id), type: "button", children: "Rotacionar segredo" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action danger-action", onClick: () => void onRevoke(credential.id), type: "button", children: "Revogar acesso" })
      ] })
    ] }, credential.id)) })
  ] });
}
function ProjectSettingsView({ appearance, bunnyOnboarding, onAppearanceChange, onRequestSubdomainChange, projectSettings, onProjectSettingsChange, onProjectSettingsSave }) {
  const [subdomain, setSubdomain] = (0, import_react3.useState)("");
  const [subdomainStatus, setSubdomainStatus] = (0, import_react3.useState)("idle");
  const [settingsStatus, setSettingsStatus] = (0, import_react3.useState)("idle");
  function updateNav(key, value) {
    onAppearanceChange({ ...appearance, studentNav: { ...appearance.studentNav, [key]: value } });
  }
  async function saveProjectSettingsForm() {
    setSettingsStatus("saving");
    try {
      await onProjectSettingsSave();
      setSettingsStatus("saved");
    } catch {
      setSettingsStatus("error");
    }
  }
  async function requestSubdomain() {
    if (!subdomain.trim()) return;
    setSubdomainStatus("saving");
    try {
      await onRequestSubdomainChange(subdomain.trim());
      setSubdomain("");
      setSubdomainStatus("saved");
    } catch {
      setSubdomainStatus("error");
    }
  }
  function updateOperational(key, value) {
    onProjectSettingsChange({ ...projectSettings, operational: { ...projectSettings.operational, [key]: value } });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page project-settings-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "settings-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Administracao" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Configuracoes do projeto" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Gerencie comunicacao, acesso, videos e a navegacao da aluna." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Geral do projeto" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Idioma usado nas mensagens e formatos exibidos para as alunas.", children: [
            "Idioma padrao",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: projectSettings.operational.locale, onChange: (event) => updateOperational("locale", event.target.value), children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "pt-BR", children: "Portugues (Brasil)" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "en-US", children: "English (US)" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "es-ES", children: "Espanol" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Fuso usado para datas, horarios e notificacoes do tenant.", children: [
            "Fuso horario",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: projectSettings.operational.timezone, onChange: (event) => updateOperational("timezone", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "E-mail principal de contato administrativo do projeto.", children: [
            "E-mail principal",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "email", value: projectSettings.operational.projectEmail ?? "", onChange: (event) => updateOperational("projectEmail", event.target.value || null) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Acesso e cadastro" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define se novas alunas entram por convite, aguardam aprovacao ou podem se cadastrar livremente.", children: [
            "Modo de cadastro",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: projectSettings.operational.registrationMode, onChange: (event) => updateOperational("registrationMode", event.target.value), children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "invite_only", children: "Somente convite" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "approval_required", children: "Cadastro com aprovacao" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "open", children: "Cadastro aberto" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Tempo pelo qual uma sessao autenticada permanece valida.", children: [
            "Duracao da sessao (minutos)",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "number", min: "15", max: "43200", value: projectSettings.operational.sessionDurationMinutes, onChange: (event) => updateOperational("sessionDurationMinutes", Number(event.target.value)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "checkbox-setting", title: "Exige que a aluna confirme o e-mail antes de acessar a conta.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: projectSettings.operational.requireEmailVerification, onChange: (event) => updateOperational("requireEmailVerification", event.target.checked) }),
            " Exigir confirmacao de e-mail"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "checkbox-setting", title: "Permite que uma aluna entre sem convite quando o modo de cadastro permitir.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: projectSettings.operational.allowSelfEnrollment, onChange: (event) => updateOperational("allowSelfEnrollment", event.target.checked) }),
            " Permitir autoinscricao"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Comunicacao" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Endereco que recebe pedidos e mensagens de suporte.", children: [
            "E-mail de suporte",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "email", value: projectSettings.supportEmail ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, supportEmail: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Nome exibido como remetente nas mensagens do projeto.", children: [
            "Nome do remetente",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: projectSettings.supportSenderName ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, supportSenderName: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Endereco usado para avisos operacionais e notificacoes.", children: [
            "E-mail de notificacoes",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "email", value: projectSettings.operational.notificationEmail ?? "", onChange: (event) => updateOperational("notificationEmail", event.target.value || null) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", title: "Texto opcional enviado na apresentacao inicial da aluna.", children: [
            "Mensagem de boas-vindas",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { value: projectSettings.operational.welcomeMessage ?? "", onChange: (event) => updateOperational("welcomeMessage", event.target.value || null) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Videos e integracoes" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "As credenciais do provedor permanecem no ambiente do cliente. O Ponto Comum armazena apenas referencias publicas e instrucoes." }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Provedor que hospeda e entrega os videos do projeto.", children: [
            "Provedor de video",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: projectSettings.operational.videoProvider, onChange: (event) => updateOperational("videoProvider", event.target.value), children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "bunny", children: "Bunny Stream" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "youtube", children: "YouTube" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "other", children: "Outro provedor" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Base HTTPS usada para montar os embeds de video.", children: [
            "Base de embed",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", placeholder: "https://videos.exemplo/embed", value: projectSettings.videoEmbedBaseUrl ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, videoEmbedBaseUrl: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Origem publica oficial do projeto, usada em links e comunicacao.", children: [
            "Origem publica HTTPS",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", placeholder: "https://exemplo.com", value: projectSettings.publicAppOrigin ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, publicAppOrigin: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
            "Origens permitidas para HTML externo",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { placeholder: "https://guias.exemplo.com", value: (projectSettings.operational.htmlEmbedAllowedOrigins ?? []).join("\n"), onChange: (event) => updateOperational("htmlEmbedAllowedOrigins", event.target.value.split("\n")) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: "Uma origem HTTPS publica por linha (maximo 20). Sem caminhos, curingas, portas, query ou credenciais. Vazio bloqueia HTML externo. O host precisa permitir iframe; conte\xFAdo p\xFAblico externo n\xE3o se torna privado." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Membros e experiencia" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Jornada concedida como padrao quando o fluxo de cadastro usar uma jornada inicial.", children: [
            "Jornada padrao",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: projectSettings.operational.defaultTrackSlug ?? "", onChange: (event) => updateOperational("defaultTrackSlug", event.target.value || null), placeholder: "slug da jornada" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "checkbox-setting", title: "Permite que alunas publiquem comentarios nas aulas.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: projectSettings.operational.commentsEnabled, onChange: (event) => updateOperational("commentsEnabled", event.target.checked) }),
            " Permitir comentarios"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "checkbox-setting", title: "Permite que alunas salvem aulas como favoritas.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: projectSettings.operational.favoritesEnabled, onChange: (event) => updateOperational("favoritesEnabled", event.target.checked) }),
            " Permitir favoritos"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "checkbox-setting", title: "Exibe a classificacao ou ranking para as alunas.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: projectSettings.operational.rankingEnabled, onChange: (event) => updateOperational("rankingEnabled", event.target.checked) }),
            " Exibir ranking"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Privacidade e seguranca" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Link publico para a politica de privacidade do projeto.", children: [
            "URL da politica de privacidade",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", value: projectSettings.operational.privacyUrl ?? "", onChange: (event) => updateOperational("privacyUrl", event.target.value || null), placeholder: "https://exemplo.com/privacidade" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Link publico para os termos de uso do projeto.", children: [
            "URL dos termos de uso",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", value: projectSettings.operational.termsUrl ?? "", onChange: (event) => updateOperational("termsUrl", event.target.value || null), placeholder: "https://exemplo.com/termos" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Prazo planejado para reten\xE7\xE3o de dados, entre 30 e 3650 dias.", children: [
            "Retencao de dados (dias)",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "number", min: "30", max: "3650", value: projectSettings.operational.dataRetentionDays ?? "", onChange: (event) => updateOperational("dataRetentionDays", event.target.value ? Number(event.target.value) : null), placeholder: "Sem prazo definido" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Credenciais MCP e historico de auditoria sao administrados em suas secoes proprias." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "project-settings-save-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: settingsStatus === "saving", onClick: () => void saveProjectSettingsForm(), type: "button", children: settingsStatus === "saving" ? "Salvando..." : "Salvar configuracoes do projeto" }),
        settingsStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Configuracoes salvas." }),
        settingsStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar as configuracoes." })
      ] }),
      bunnyOnboarding && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Configurar videos" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "O Bunny e uma conta externa deste projeto. O cliente cria a conta e configura o agente diretamente no Bunny; o Ponto Comum nao recebe a API key." }),
        bunnyOnboarding.affiliateUrl ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: bunnyOnboarding.affiliateUrl, rel: "noreferrer", target: "_blank", children: "Abrir Bunny pelo link de afiliado do C\xEDrculo" }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "O link de afiliado ainda nao foi configurado pelo admin geral." }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ol", { children: bunnyOnboarding.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: step }, step)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Subdominio do projeto" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Solicite um novo subdominio. A alteracao depende da equipe da plataforma e pode levar ate 24 horas." }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "form-grid", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
          "Novo subdominio",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { pattern: "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?", placeholder: "meu-projeto", value: subdomain, onChange: (event) => setSubdomain(event.target.value) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: subdomainStatus === "saving" || !subdomain.trim(), onClick: () => void requestSubdomain(), type: "button", children: subdomainStatus === "saving" ? "Enviando..." : "Solicitar alteracao" }),
        subdomainStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Solicitacao enviada. A equipe respondera em ate 24 horas." }),
        subdomainStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel enviar a solicitacao." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Navegacao da aluna" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid nav-label-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Portal",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.portal, onChange: (event) => updateNav("portal", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Jornada",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.journey, onChange: (event) => updateNav("journey", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Favoritos",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.favorites, onChange: (event) => updateNav("favorites", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Perfil",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.profile, onChange: (event) => updateNav("profile", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Conta",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.account, onChange: (event) => updateNav("account", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Suporte",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.support, onChange: (event) => updateNav("support", event.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "As alteracoes da navegacao sao aplicadas ao preview e salvas junto da personalizacao." })
      ] })
    ] })
  ] });
}
function AppearanceView({ appearance, bunnyOnboarding, colorMode, onChange, onRequestSubdomainChange, onSave, onSetColorMode, onUpload, projectSettings, onProjectSettingsChange, onProjectSettingsSave }) {
  const [saveStatus, setSaveStatus] = (0, import_react3.useState)("idle");
  const [appearanceHistory, setAppearanceHistory] = (0, import_react3.useState)([]);
  const [appearanceFuture, setAppearanceFuture] = (0, import_react3.useState)([]);
  const [uploadingField, setUploadingField] = (0, import_react3.useState)(null);
  const [uploadError, setUploadError] = (0, import_react3.useState)("");
  const [settingsStatus, setSettingsStatus] = (0, import_react3.useState)("idle");
  const [subdomain, setSubdomain] = (0, import_react3.useState)("");
  const [subdomainStatus, setSubdomainStatus] = (0, import_react3.useState)("idle");
  function applyAppearanceChange(next) {
    setAppearanceHistory((current) => [...current, appearance].slice(-30));
    setAppearanceFuture([]);
    onChange(next);
  }
  function undoAppearanceChange() {
    const previous = appearanceHistory.at(-1);
    if (!previous) return;
    setAppearanceHistory((current) => current.slice(0, -1));
    setAppearanceFuture((current) => [appearance, ...current].slice(0, 30));
    onChange(previous);
  }
  function redoAppearanceChange() {
    const next = appearanceFuture[0];
    if (!next) return;
    setAppearanceFuture((current) => current.slice(1));
    setAppearanceHistory((current) => [...current, appearance].slice(-30));
    onChange(next);
  }
  function update(key, value) {
    applyAppearanceChange({ ...appearance, [key]: value });
  }
  function updateNav(key, value) {
    applyAppearanceChange({ ...appearance, studentNav: { ...appearance.studentNav, [key]: value } });
  }
  function updatePalette(mode, key, value) {
    applyAppearanceChange({
      ...appearance,
      [mode]: { ...appearance[mode], [key]: value },
      ...mode === "dark" && appearance.darkMode === "auto" ? { darkMode: "custom" } : {}
    });
  }
  function updateBackgroundOpacity(mode, key, value) {
    const opacityKey = mode === "light" ? "lightBackgroundOpacity" : "darkBackgroundOpacity";
    applyAppearanceChange({ ...appearance, [opacityKey]: { ...appearance[opacityKey], [key]: value } });
  }
  function updateBorderWidth(mode, value) {
    applyAppearanceChange({ ...appearance, [mode === "light" ? "lightBorderWidth" : "darkBorderWidth"]: value });
  }
  function updateScrollbar(mode, key, value) {
    const scrollbarKey = mode === "light" ? "lightScrollbar" : "darkScrollbar";
    applyAppearanceChange({ ...appearance, [scrollbarKey]: { ...appearance[scrollbarKey], [key]: value } });
  }
  function updateGradient(mode, key, value) {
    const gradientsKey = mode === "light" ? "lightGradients" : "darkGradients";
    applyAppearanceChange({
      ...appearance,
      [gradientsKey]: { ...appearance[gradientsKey], [key]: { ...appearance[gradientsKey][key], ...value } },
      ...mode === "dark" && appearance.darkMode === "auto" ? { darkMode: "custom" } : {}
    });
  }
  async function save() {
    setSaveStatus("saving");
    try {
      await onSave();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }
  async function upload(field, file) {
    if (!file) return;
    setUploadingField(field);
    setUploadError("");
    try {
      const asset = await onUpload(file);
      update(field, asset.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.");
    } finally {
      setUploadingField(null);
    }
  }
  async function saveProjectSettingsForm() {
    setSettingsStatus("saving");
    try {
      await onProjectSettingsSave();
      setSettingsStatus("saved");
    } catch {
      setSettingsStatus("error");
    }
  }
  async function requestSubdomain() {
    if (!subdomain.trim()) return;
    setSubdomainStatus("saving");
    try {
      await onRequestSubdomainChange(subdomain.trim());
      setSubdomain("");
      setSubdomainStatus("saved");
    } catch {
      setSubdomainStatus("error");
    }
  }
  function assetInput(label, field) {
    const explanations = { logoImagePath: "Logo usado no tema claro e na identidade principal.", logoDarkImagePath: "Logo usado quando o tema escuro estiver ativo.", faviconImagePath: "Icone exibido na aba do navegador.", bannerImagePath: "Imagem principal exibida no topo da area da aluna.", openingBackgroundImagePath: "Imagem de fundo da tela de entrada.", openingPanelImagePath: "Imagem usada no card de entrada." };
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", title: explanations[field], children: [
      label,
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileUploadControl, { accept: "image/png,image/jpeg,image/webp", disabled: uploadingField === field, onSelect: (file) => upload(field, file) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `${label} URL`, value: appearance[field], onChange: (event) => update(field, event.target.value) })
    ] });
  }
  function fontInput() {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "custom-font-input", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Arquivo de fonte local usado quando Personalizada for escolhida.", children: [
        "Arquivo da fonte",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileUploadControl, { accept: ".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf,application/font-sfnt,application/vnd.ms-opentype", disabled: uploadingField === "customFontPath", onSelect: (file) => upload("customFontPath", file) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { title: "Caminho interno permitido para a fonte enviada.", "aria-label": "Fonte personalizada URL", value: appearance.customFontPath, onChange: (event) => update("customFontPath", event.target.value), placeholder: "Caminho interno da fonte" })
    ] });
  }
  function fontOptions() {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "system", children: "Sistema" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "montserrat", children: "Montserrat" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "poppins", children: "Poppins" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "dmSans", children: "DM Sans" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "sans", children: "Sans moderna" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "humanist", children: "Sans humanista" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "cormorant", children: "Cormorant Garamond" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "playfair", children: "Playfair Display" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "lora", children: "Lora" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "serif", children: "Serif editorial" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "mono", children: "Monoespacada" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { disabled: !appearance.customFontPath, value: "custom", children: "Personalizada" })
    ] });
  }
  function fontWeightOptions() {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "300", children: "Leve" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "400", children: "Regular" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "500", children: "Medio" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "600", children: "Semibold" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "700", children: "Negrito" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "800", children: "Extra negrito" })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page appearance-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "settings-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Aparencia" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Controle a experiencia visual da aluna sem depender de URLs, endpoints ou assets externos." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-header-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-history-actions", "aria-label": "Historico da personalizacao", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "icon-action", disabled: appearanceHistory.length === 0, onClick: undoAppearanceChange, title: "Desfazer", type: "button", children: "\u21B6" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "icon-action", disabled: appearanceFuture.length === 0, onClick: redoAppearanceChange, title: "Refazer", type: "button", children: "\u21B7" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => applyAppearanceChange(defaultAppearance), type: "button", children: "Restaurar template" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel appearance-identity-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Identidade" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "identity-group identity-brand-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Marca e entrada" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Nome exibido na marca, no login e na area da aluna.", children: [
              "Nome da plataforma",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.brandName, onChange: (event) => update("brandName", event.target.value) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define se o login sera apresentado como Entrar na ou Entrar no plataforma.", children: [
              "Preposi\xE7\xE3o do login",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.loginPreposition, onChange: (event) => update("loginPreposition", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "na", children: "Entrar na" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "no", children: "Entrar no" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "identity-group identity-assets-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Arquivos da marca" }),
            assetInput("Logo claro", "logoImagePath"),
            assetInput("Logo escuro", "logoDarkImagePath"),
            assetInput("Favicon", "faviconImagePath"),
            assetInput("Banner principal", "bannerImagePath")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "identity-group identity-opening-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Abertura" }),
            assetInput("Imagem de fundo da entrada", "openingBackgroundImagePath"),
            assetInput("Imagem do card de entrada", "openingPanelImagePath")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "identity-group identity-layout-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Layout da experiencia" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Texto que identifica a secao de trilhas na area da aluna.", children: [
              "Rotulo da area de jornadas",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.portalTitle, onChange: (event) => update("portalTitle", event.target.value) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Controla quantos cards aparecem na mesma faixa da area da aluna.", children: [
              "Tamanho dos cards",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.cardSize, onChange: (event) => update("cardSize", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "compact", children: "Compacto" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "comfortable", children: "Confortavel" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "large", children: "Maior" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define a largura da navegacao lateral.", children: [
              "Largura da sidebar",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.sidebarWidth, onChange: (event) => update("sidebarWidth", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "narrow", children: "Estreita" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "regular", children: "Regular" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "wide", children: "Larga" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Escolhe o alinhamento do logo dentro da barra lateral.", children: [
              "Posicao do logo",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.logoPosition, onChange: (event) => update("logoPosition", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "left", children: "Esquerda" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "center", children: "Centro" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "identity-group identity-preferences-group", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Preferencias de exibicao" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define o tema usado por padrao quando a pessoa entra na plataforma.", children: [
              "Tema inicial",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.defaultColorMode, onChange: (event) => update("defaultColorMode", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "light", children: "Claro" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "dark", children: "Escuro" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "system", children: "Sistema" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel appearance-typography-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Tipografia" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-typography-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "field-hint", children: "Defina a personalidade visual dos titulos e textos da plataforma." }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "typography-column", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h4", { children: "Titulos" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Escolhe a familia tipografica usada nos titulos.", children: [
              "Familia",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: appearance.fontHeading, onChange: (event) => update("fontHeading", event.target.value), children: fontOptions() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Controla o grau de leveza ou negrito dos titulos.", children: [
              "Peso",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: appearance.fontHeadingWeight, onChange: (event) => update("fontHeadingWeight", Number(event.target.value)), children: fontWeightOptions() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Aplica estilo normal ou italico aos titulos.", children: [
              "Estilo",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.fontHeadingStyle, onChange: (event) => update("fontHeadingStyle", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "normal", children: "Normal" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "italic", children: "Italico" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Aumenta ou reduz o tamanho relativo dos titulos.", children: [
              "Tamanho ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                Math.round(appearance.fontHeadingScale * 100),
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "0.85", max: "1.25", step: "0.05", value: appearance.fontHeadingScale, onChange: (event) => update("fontHeadingScale", Number(event.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define o espaco vertical entre linhas de titulo.", children: [
              "Altura de linha ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("output", { children: appearance.fontHeadingLineHeight.toFixed(2) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "1", max: "2", step: "0.05", value: appearance.fontHeadingLineHeight, onChange: (event) => update("fontHeadingLineHeight", Number(event.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Ajusta o espaco horizontal entre letras dos titulos.", children: [
              "Espacamento ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                appearance.fontHeadingLetterSpacing.toFixed(2),
                "em"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "-0.04", max: "0.2", step: "0.01", value: appearance.fontHeadingLetterSpacing, onChange: (event) => update("fontHeadingLetterSpacing", Number(event.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "typography-column", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h4", { children: "Textos" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Escolhe a familia tipografica usada nos textos corridos.", children: [
              "Familia",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: appearance.fontBody, onChange: (event) => update("fontBody", event.target.value), children: fontOptions() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Controla o grau de leveza ou negrito dos textos.", children: [
              "Peso",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: appearance.fontBodyWeight, onChange: (event) => update("fontBodyWeight", Number(event.target.value)), children: fontWeightOptions() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Aplica estilo normal ou italico aos textos.", children: [
              "Estilo",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.fontBodyStyle, onChange: (event) => update("fontBodyStyle", event.target.value), children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "normal", children: "Normal" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "italic", children: "Italico" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Aumenta ou reduz o tamanho relativo dos textos.", children: [
              "Tamanho ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                Math.round(appearance.fontBodyScale * 100),
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "0.9", max: "1.2", step: "0.05", value: appearance.fontBodyScale, onChange: (event) => update("fontBodyScale", Number(event.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Define o espaco vertical entre linhas de texto.", children: [
              "Altura de linha ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("output", { children: appearance.fontBodyLineHeight.toFixed(2) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "1", max: "2", step: "0.05", value: appearance.fontBodyLineHeight, onChange: (event) => update("fontBodyLineHeight", Number(event.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Ajusta o espaco horizontal entre letras dos textos.", children: [
              "Espacamento ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                appearance.fontBodyLetterSpacing.toFixed(2),
                "em"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "range", min: "-0.02", max: "0.12", step: "0.01", value: appearance.fontBodyLetterSpacing, onChange: (event) => update("fontBodyLetterSpacing", Number(event.target.value)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "custom-font-area", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h4", { children: "Fonte personalizada" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Envie uma fonte do projeto para habilitar a opcao Personalizada." })
            ] }),
            fontInput()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Comunicacao do projeto" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "E-mail de suporte",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "email", value: projectSettings.supportEmail ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, supportEmail: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Nome do remetente",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: projectSettings.supportSenderName ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, supportSenderName: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Origem publica HTTPS",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", placeholder: "https://exemplo.com", value: projectSettings.publicAppOrigin ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, publicAppOrigin: event.target.value || null }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Base de embed Bunny",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "url", placeholder: "https://videos.exemplo/embed", value: projectSettings.videoEmbedBaseUrl ?? "", onChange: (event) => onProjectSettingsChange({ ...projectSettings, videoEmbedBaseUrl: event.target.value || null }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: settingsStatus === "saving", onClick: () => void saveProjectSettingsForm(), type: "button", children: settingsStatus === "saving" ? "Salvando..." : "Salvar comunicacao" }),
        settingsStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Configuracoes salvas." }),
        settingsStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar as configuracoes." })
      ] }),
      bunnyOnboarding && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Configurar videos" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "O Bunny e uma conta externa do projeto. O agente do cliente se conecta diretamente ao Bunny." }),
        bunnyOnboarding.affiliateUrl && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: bunnyOnboarding.affiliateUrl, rel: "noreferrer", target: "_blank", children: "Abrir Bunny pelo nosso link de afiliado" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ol", { children: bunnyOnboarding.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: step }, step)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Subdominio do projeto" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Solicite um novo subdominio. A alteracao depende da equipe da plataforma e pode levar ate 24 horas." }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "form-grid", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
          "Novo subdominio",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { pattern: "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?", placeholder: "meu-projeto", value: subdomain, onChange: (event) => setSubdomain(event.target.value) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", disabled: subdomainStatus === "saving" || !subdomain.trim(), onClick: () => void requestSubdomain(), type: "button", children: subdomainStatus === "saving" ? "Enviando..." : "Solicitar alteracao" }),
        subdomainStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Solicitacao enviada. A equipe respondera em ate 24 horas." }),
        subdomainStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel enviar a solicitacao." })
      ] }),
      ["light", "dark"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel appearance-theme-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("h2", { children: [
          "Tema ",
          mode === "light" ? "claro" : "escuro"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "form-grid", children: paletteOrder.map((key) => {
          const gradientKey = key;
          const gradients = appearance[mode === "light" ? "lightGradients" : "darkGradients"];
          const gradient = gradientKey in gradients ? gradients[gradientKey] : null;
          if (Boolean(gradient)) return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "palette-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
              paletteLabels[key],
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": paletteLabels[key], type: "color", value: appearance[mode][key], onChange: (event) => updatePalette(mode, key, event.target.value) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gradient-controls", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
                "Preenchimento",
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { "aria-label": `Preenchimento de ${gradientLabels[gradientKey]}`, value: gradient?.direction, onChange: (event) => {
                  const direction = event.target.value;
                  updateGradient(mode, gradientKey, { direction, colorBalance: 50 });
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "solid", children: "Cor solida" }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "horizontal", children: "Degrade horizontal" }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "vertical", children: "Degrade vertical" }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "diagonal", children: "Degrade diagonal" })
                ] })
              ] }),
              gradient?.direction !== "solid" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "gradient-balance-label", children: [
                  "Predominancia da primeira cor ",
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                    gradient?.colorBalance ?? 50,
                    "%"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Predominancia da primeira cor", type: "range", min: "0", max: "100", step: "1", value: gradient?.colorBalance ?? 50, onChange: (event) => updateGradient(mode, gradientKey, { colorBalance: Number(event.target.value) }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
                  "Segunda cor",
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Segunda cor de ${gradientLabels[gradientKey]}`, type: "color", value: gradient?.to, onChange: (event) => updateGradient(mode, gradientKey, { to: event.target.value }) })
                ] })
              ] })
            ] })
          ] }, key);
          return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "palette-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
              paletteLabels[key],
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": paletteLabels[key], type: "color", value: appearance[mode][key], onChange: (event) => updatePalette(mode, key, event.target.value) })
            ] }),
            gradient && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "gradient-controls", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: gradient.enabled, onChange: (event) => updateGradient(mode, gradientKey, { enabled: event.target.checked }), type: "checkbox" }),
                " Usar degrad\xEA"
              ] }),
              gradient.enabled && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
                "Segunda cor",
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Segunda cor de ${gradientLabels[gradientKey]}`, type: "color", value: gradient.to, onChange: (event) => updateGradient(mode, gradientKey, { to: event.target.value }) })
              ] })
            ] })
          ] }, key);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-tuning-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Transparencia dos fundos" }),
          Object.keys(appearance[mode === "light" ? "lightBackgroundOpacity" : "darkBackgroundOpacity"]).map((key) => {
            const opacity = appearance[mode === "light" ? "lightBackgroundOpacity" : "darkBackgroundOpacity"][key];
            return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
              gradientLabels[key],
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
                "Transparencia ",
                opacity,
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": `Transparencia de ${gradientLabels[key]}`, type: "range", min: "0", max: "100", step: "1", value: opacity, onChange: (event) => updateBackgroundOpacity(mode, key, Number(event.target.value)) })
            ] }, key);
          }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "border-width-control", children: [
            "Espessura das bordas ",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
              appearance[mode === "light" ? "lightBorderWidth" : "darkBorderWidth"],
              " px"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Espessura das bordas", type: "range", min: "0", max: "4", step: "0.5", value: appearance[mode === "light" ? "lightBorderWidth" : "darkBorderWidth"], onChange: (event) => updateBorderWidth(mode, Number(event.target.value)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "Barras de rolagem" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Cor do trilho da barra de rolagem da pagina.", children: [
            "Trilho geral",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Trilho geral da barra de rolagem", type: "color", value: appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].track, onChange: (event) => updateScrollbar(mode, "track", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Cor do indicador que se move na barra de rolagem da pagina.", children: [
            "Indicador geral",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Indicador geral da barra de rolagem", type: "color", value: appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].thumb, onChange: (event) => updateScrollbar(mode, "thumb", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Cor do trilho da barra de rolagem da sidebar.", children: [
            "Trilho da sidebar",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Trilho da sidebar", type: "color", value: appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].sidebarTrack, onChange: (event) => updateScrollbar(mode, "sidebarTrack", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { title: "Cor do indicador que se move na barra de rolagem da sidebar.", children: [
            "Indicador da sidebar",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Indicador da sidebar", type: "color", value: appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].sidebarThumb, onChange: (event) => updateScrollbar(mode, "sidebarThumb", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "border-width-control", title: "Define a espessura das barras de rolagem.", children: [
            "Espessura ",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("output", { children: [
              appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].width,
              " px"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Espessura da barra de rolagem", type: "range", min: "4", max: "18", step: "1", value: appearance[mode === "light" ? "lightScrollbar" : "darkScrollbar"].width, onChange: (event) => updateScrollbar(mode, "width", Number(event.target.value)) })
          ] })
        ] }),
        mode === "dark" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "appearance-derivation", children: [
          "Derivacao do tema escuro",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: appearance.darkMode, onChange: (event) => update("darkMode", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "auto", children: "Automatica pela paleta clara" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "custom", children: "Personalizada" })
          ] })
        ] })
      ] }, mode)),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel project-settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Navegacao da aluna" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid nav-label-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Portal",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.portal, onChange: (event) => updateNav("portal", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Jornada",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.journey, onChange: (event) => updateNav("journey", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Favoritos",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.favorites, onChange: (event) => updateNav("favorites", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Perfil",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.profile, onChange: (event) => updateNav("profile", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Conta",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.account, onChange: (event) => updateNav("account", event.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Suporte",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: appearance.studentNav.support, onChange: (event) => updateNav("support", event.target.value) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("aside", { className: "appearance-preview", "aria-label": "Previa da area da aluna", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "preview-shell", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "preview-sidebar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: colorMode === "dark" ? appearance.logoDarkImagePath : appearance.logoImagePath, alt: "" }),
            Object.values(appearance.studentNav).slice(0, 4).map((label) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: label }, label))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "preview-content", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: appearance.bannerImagePath, alt: "" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: appearance.portalTitle }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `preview-cards preview-cards-${appearance.cardSize}`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", {}),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", {}),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", {})
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "theme-row", "aria-label": "Tema padrao", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-pressed": colorMode === "light", onClick: () => onSetColorMode("light"), type: "button", children: "Claro" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { "aria-pressed": colorMode === "dark", onClick: () => onSetColorMode("dark"), type: "button", children: "Escuro" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: saveStatus === "saving", onClick: () => void save(), type: "button", children: saveStatus === "saving" ? "Salvando..." : "Salvar personalizacao" }),
        saveStatus === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Personalizacao publicada." }),
        saveStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel salvar a personalizacao." }),
        uploadError && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: uploadError })
      ] })
    ] })
  ] });
}
var documentationTopics = [
  {
    id: "overview",
    label: "Visao geral",
    eyebrow: "Produto",
    title: "Como o Circulo funciona",
    summary: "O Circulo e uma area de membros multi-tenant. Cada projeto possui catalogo, membros, acessos, marca, integracoes e auditoria independentes.",
    tooltip: "Entenda o produto, os papeis e os termos usados no Circulo.",
    bullets: [
      "Jornada contem cursos; curso contem modulos; modulo contem aulas.",
      "Entitlement e a permissao efetiva que libera uma Jornada para uma aluna.",
      "Admin do tenant gerencia somente o proprio projeto.",
      "Admin da plataforma provisiona projetos e trata operacoes globais.",
      "A view da aluna e uma experiencia de consumo e permanece somente leitura no preview administrativo."
    ]
  },
  {
    id: "operations",
    label: "Operacao",
    eyebrow: "Rotinas",
    title: "Fluxos que o admin deve conhecer",
    summary: "Use estas sequencias para reduzir erros durante a operacao diaria do projeto.",
    tooltip: "Consulte as sequencias recomendadas para operar o tenant.",
    bullets: [
      "Cadastro: crie ou convide a aluna e conceda somente os acessos necessarios.",
      "Conteudo: crie Jornada, Curso, Modulo e Aula nessa ordem; publique apenas depois da revisao.",
      "Arquivos: envie imagens e PDFs pelo fluxo de upload e use somente a referencia retornada.",
      "Video: mantenha conta e credenciais Bunny ou YouTube no ambiente do cliente; salve apenas a referencia externa.",
      "Suporte: responda dentro do tenant e use o historico para rastrear alteracoes relevantes."
    ]
  },
  {
    id: "security",
    label: "Seguranca",
    eyebrow: "Invariantes",
    title: "Regras que nao podem ser quebradas",
    summary: "Estas regras valem para a interface, API, banco de dados e agentes.",
    tooltip: "Revise as invariantes de seguranca e isolamento multitenant.",
    bullets: [
      "O tenant web e resolvido pelo Host canonico; o tenant MCP e resolvido pelo token.",
      "Nunca aceite projectId vindo de query, body, cookie, header encaminhado ou argumento do agente.",
      "Toda escrita MCP exige escopo de escrita e confirmacao explicita.",
      "Senhas, tokens, hashes, URLs assinadas, chaves externas e payload bruto nao aparecem em respostas.",
      "Projetos suspensos ou arquivados nao podem executar operacoes administrativas."
    ]
  },
  {
    id: "mcp",
    label: "Agentes MCP",
    eyebrow: "Automacao autorizada",
    title: "Como orientar um agente",
    summary: "O agente pertence ao cliente e usa o MCP somente para o tenant autorizado.",
    tooltip: "Veja como autorizar, confirmar e acompanhar operacoes MCP.",
    bullets: [
      "Comece por get_project_context e list_mcp_capabilities.",
      "Leia o estado atual antes de alterar qualquer recurso.",
      "Confirme com a pessoa o alvo, o efeito e qualquer acao destrutiva.",
      "Use confirm: true somente depois da autorizacao expressa.",
      "Separe sempre no resultado o que foi executado, o que esta pendente e o que continua manual."
    ]
  },
  {
    id: "integrations",
    label: "Integracoes",
    eyebrow: "Servicos externos",
    title: "Checkout e video",
    summary: "O Circulo coordena o tenant sem assumir a conta externa do cliente.",
    tooltip: "Entenda o que fica no Circulo e o que permanece no provedor externo.",
    bullets: [
      "Kiwify, Hotmart e Eduzz criam produto, oferta e webhook fora do Circulo.",
      "O Circulo recebe webhook, normaliza eventos e libera ou revoga entitlements de forma idempotente.",
      "Hotmart e Eduzz estao preparadas para adapters futuros; ainda nao existe conexao automatica externa.",
      "O MCP deve marcar tarefas externas como manual quando nao houver adapter conectado.",
      "O link de afiliado Bunny e uma configuracao global exibida no onboarding; nao concede acesso a contas Bunny."
    ]
  }
];
function AdminAiLessonView({ policy, sources, tracks: tracks2, onPolicySave, onPrepareLesson, onReload }) {
  const [draft, setDraft] = (0, import_react3.useState)(policy);
  const [selectedKey, setSelectedKey] = (0, import_react3.useState)("");
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [jobStatus, setJobStatus] = (0, import_react3.useState)("idle");
  const [jobKey, setJobKey] = (0, import_react3.useState)("");
  const [error, setError] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => setDraft(policy), [policy]);
  const lessonOptions = tracks2.flatMap((track) => track.courses.flatMap((course2) => course2.modules.flatMap((moduleItem) => moduleItem.lessons.map((lesson2) => ({
    key: `${course2.id}|${moduleItem.id}|${lesson2.id}`,
    label: `${course2.title} / ${moduleItem.title} / ${lesson2.title}`,
    reference: { courseSlug: course2.id, moduleSlug: moduleItem.id, lessonSlug: lesson2.id }
  })))));
  async function savePolicy(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await onPolicySave(draft);
      setStatus("saved");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar a politica.");
      setStatus("error");
    }
  }
  async function prepareLesson() {
    const option = lessonOptions.find((item) => item.key === selectedKey);
    if (!option) return;
    setJobStatus("preparing");
    setError("");
    try {
      const result = await onPrepareLesson(option.reference);
      setJobKey(result.jobKey);
      setJobStatus("prepared");
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : "Nao foi possivel preparar a aula.");
      setJobStatus("error");
    }
  }
  function toggleSourceType(type) {
    const allowed = draft.allowedSourceTypes.includes(type) ? draft.allowedSourceTypes.filter((item) => item !== type) : [...draft.allowedSourceTypes, type];
    setDraft({ ...draft, allowedSourceTypes: allowed.length ? allowed : draft.allowedSourceTypes });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page ai-admin-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "settings-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Conhecimento do projeto" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Assistente de estudos" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Selecione uma aula. O Hermes reunira o resumo, os materiais e a referencia do video para processar o RAG." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: () => void onReload(), type: "button", children: "Atualizar fontes" })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-layout ai-admin-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "appearance-panel", onSubmit: (event) => void savePolicy(event), children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "panel-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-kicker", children: "Controle de acesso" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Politica do assistente" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `security-badge ${draft.enabled ? "status-active" : ""}`, children: draft.enabled ? "Ativo" : "Desativado" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "toggle-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: draft.enabled, onChange: (event) => setDraft({ ...draft, enabled: event.target.checked }), type: "checkbox" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Permitir perguntas das alunas" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: "O chat usa somente fontes publicadas e autorizadas." })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "form-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Perguntas por minuto",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { max: 60, min: 1, onChange: (event) => setDraft({ ...draft, maxQuestionsPerMinute: Number(event.target.value) }), type: "number", value: draft.maxQuestionsPerMinute })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Perguntas por dia",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { max: 1e4, min: 1, onChange: (event) => setDraft({ ...draft, maxQuestionsPerDay: Number(event.target.value) }), type: "number", value: draft.maxQuestionsPerDay })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Trechos por resposta",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { max: 20, min: 1, onChange: (event) => setDraft({ ...draft, maxContextChunks: Number(event.target.value) }), type: "number", value: draft.maxContextChunks })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            "Caracteres por trecho",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { max: 2e3, min: 200, onChange: (event) => setDraft({ ...draft, maxExcerptCharacters: Number(event.target.value) }), type: "number", value: draft.maxExcerptCharacters })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("fieldset", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("legend", { children: "Fontes permitidas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "ai-source-types", children: ["LESSON", "MATERIAL", "TRACK", "COURSE"].map((type) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { checked: draft.allowedSourceTypes.includes(type), onChange: () => toggleSourceType(type), type: "checkbox" }),
            " ",
            type === "LESSON" ? "Aulas" : type === "MATERIAL" ? "Materiais" : type === "TRACK" ? "Jornadas" : "Cursos"
          ] }, type)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving", type: "submit", children: status === "saving" ? "Salvando..." : "Salvar politica" }),
        status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Politica atualizada." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "panel-heading", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-kicker", children: "Ingestao por aula" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Preparar fonte para Hermes" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "field-help", children: "O admin escolhe a aula; o worker tera acesso apenas ao manifesto deste tenant. O processamento e a publicacao acontecem depois, com idempotencia e auditoria." }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "wide", children: [
          "Aula",
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: selectedKey, onChange: (event) => setSelectedKey(event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Selecione uma aula" }),
            lessonOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: item.key, children: item.label }, item.key))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: !selectedKey || jobStatus === "preparing", onClick: () => void prepareLesson(), type: "button", children: jobStatus === "preparing" ? "Preparando..." : "Enviar para processamento" }),
        jobStatus === "prepared" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "form-status", children: [
          "Manifesto preparado para Hermes: ",
          jobKey
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "appearance-panel ai-sources-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "panel-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "section-kicker", children: "Fontes publicadas" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Conteudo disponivel para o chat" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "field-hint", children: [
          sources.length,
          " fonte(s)"
        ] })
      ] }),
      sources.length ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "ai-source-list", children: sources.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "ai-source-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("strong", { children: [
            item.sourceType,
            " \xB7 ",
            item.sourceId
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
            "Versao ",
            item.contentVersion,
            " \xB7 atualizado em ",
            new Date(item.updatedAt).toLocaleString("pt-BR")
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `security-badge ${item.enabledForStudents ? "status-active" : ""}`, children: item.enabledForStudents ? "Disponivel para alunas" : "Somente admin" })
      ] }, item.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhuma fonte cadastrada neste tenant." })
    ] })
  ] });
}
function DocumentationView() {
  const [topic, setTopic] = (0, import_react3.useState)("overview");
  const [query, setQuery] = (0, import_react3.useState)("");
  const selected = documentationTopics.find((item) => item.id === topic) ?? documentationTopics[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTopics = normalizedQuery ? documentationTopics.filter((item) => `${item.label} ${item.title} ${item.summary} ${item.bullets.join(" ")}`.toLowerCase().includes(normalizedQuery)) : documentationTopics;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "detail-page utility-page documentation-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "settings-header documentation-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: "Central administrativa" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Documentacao" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Consulte os fluxos do Circulo, as regras de seguranca e o contrato para agentes autorizados." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { "aria-label": "Abrir documentacao completa no GitHub", className: "secondary-action documentation-repository-link", href: "https://github.com/selvalabs/ponto_comum/tree/main/docs", rel: "noreferrer", target: "_blank", title: "Abre a documenta\xE7\xE3o completa versionada no GitHub", children: "Abrir documentacao completa" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "documentation-search", title: "Filtra os topicos pelo titulo, resumo e regras descritas.", children: [
      "Pesquisar na documentacao",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": "Pesquisar na documentacao", onChange: (event) => setQuery(event.target.value), placeholder: "Ex.: tenant, webhook, upload, MCP", type: "search", value: query })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "documentation-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("nav", { "aria-label": "Topicos da documentacao", className: "documentation-nav", children: [
        filteredTopics.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { "aria-label": `${item.label}: ${item.tooltip}`, className: item.id === topic ? "active" : "", "data-tooltip": item.tooltip, onClick: () => setTopic(item.id), title: item.tooltip, type: "button", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: item.eyebrow }),
          item.label
        ] }, item.id)),
        filteredTopics.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "empty-state", children: "Nenhum topico encontrado." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("article", { className: "documentation-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "eyebrow", children: selected.eyebrow }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: selected.title }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "documentation-summary", children: selected.summary }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { children: selected.bullets.map((bullet) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: bullet }, bullet)) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "documentation-next-step", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Referencia normativa" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Para procedimentos completos, consulte o indice no repositorio. Alteracoes de codigo devem atualizar a documentacao correspondente e os testes do contrato." })
        ] })
      ] })
    ] })
  ] });
}
function AuthLoadingView({ appearance, colorMode }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("main", { className: `ponto-comum-app auth-only theme-mode-${colorMode} view-mode-student card-size-${appearance.cardSize}`, style: appearanceCssVariables(appearance, colorMode), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "auth-screen", "aria-live": "polite", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Carregando sessao..." })
  ] }) });
}
function AuthShell({ appearance, children, colorMode }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("main", { className: `ponto-comum-app auth-only theme-mode-${colorMode} view-mode-student card-size-${appearance.cardSize}`, style: appearanceCssVariables(appearance, colorMode), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "auth-screen", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "auth-visual" }),
    children
  ] }) });
}
function CircleLandingView({ appearance, colorMode, onCreateCircle }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthShell, { appearance, colorMode, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "login-panel circle-landing-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", onClick: onCreateCircle, type: "button", children: "Quero criar meu C\xEDrculo" })
  ] }) });
}
function LoginView({ appearance, colorMode, error, isSubmitting, loginTitle, onCreateCircle, onForgotPassword, onLogin }) {
  const [email2, setEmail] = (0, import_react3.useState)("");
  const [password, setPassword] = (0, import_react3.useState)("");
  async function submitLogin(event) {
    event.preventDefault();
    await onLogin({ email: email2, password });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthShell, { appearance, colorMode, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "login-panel", onSubmit: submitLogin, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: loginTitle }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Acesse sua area com o email e senha cadastrados." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
      "Email",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "email", onChange: (event) => setEmail(event.target.value), required: true, type: "email", value: email2 })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
      "Senha",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "current-password", minLength: 8, onChange: (event) => setPassword(event.target.value), required: true, type: "password", value: password })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: isSubmitting, type: "submit", children: isSubmitting ? "Entrando..." : "Entrar" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "auth-link-button", onClick: onForgotPassword, type: "button", children: "Esqueci minha senha" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "secondary-action", onClick: onCreateCircle, type: "button", children: "Quero criar meu C\xEDrculo" })
  ] }) });
}
function CircleSignupView({ appearance, colorMode, onBack, onSubmit }) {
  const [form, setForm] = (0, import_react3.useState)({ email: "", name: "", circleName: "", slug: "" });
  const [status, setStatus] = (0, import_react3.useState)("idle");
  async function submit(event) {
    event.preventDefault();
    setStatus("sending");
    try {
      await onSubmit(form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthShell, { appearance, colorMode, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "login-panel", onSubmit: submit, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Crie seu C\xEDrculo" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Envie seus dados para nossa an\xE1lise. A ativa\xE7\xE3o depende de aprova\xE7\xE3o." })
    ] }),
    status === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Solicita\xE7\xE3o recebida. Voc\xEA receber\xE1 uma resposta ap\xF3s a an\xE1lise." }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Seu nome",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "name", maxLength: 120, onChange: (event) => setForm({ ...form, name: event.target.value }), required: true, value: form.name })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Email",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "email", onChange: (event) => setForm({ ...form, email: event.target.value }), required: true, type: "email", value: form.email })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Nome do C\xEDrculo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { maxLength: 120, onChange: (event) => setForm({ ...form, circleName: event.target.value }), required: true, value: form.circleName })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
        "Endere\xE7o do C\xEDrculo",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { pattern: "[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?", placeholder: "exemplo", onChange: (event) => setForm({ ...form, slug: event.target.value.toLowerCase() }), required: true, value: form.slug }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: "Ser\xE1 usado no endere\xE7o do seu C\xEDrculo." })
      ] }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "N\xE3o foi poss\xEDvel enviar a solicita\xE7\xE3o." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "sending", type: "submit", children: status === "sending" ? "Enviando..." : "Solicitar cria\xE7\xE3o" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "auth-link-button", onClick: onBack, type: "button", children: "Voltar para login" })
  ] }) });
}
function ForgotPasswordView({ appearance, colorMode, onBack, onRequest }) {
  const [email2, setEmail] = (0, import_react3.useState)("");
  const [status, setStatus] = (0, import_react3.useState)("idle");
  async function submitRequest(event) {
    event.preventDefault();
    setStatus("sending");
    try {
      await onRequest(email2);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthShell, { appearance, colorMode, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "login-panel", onSubmit: submitRequest, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "Recuperar senha" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "Informe seu email para receber um link de redefinicao." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
      "Email",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "email", onChange: (event) => setEmail(event.target.value), required: true, type: "email", value: email2 })
    ] }),
    status === "sent" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: "Se o email estiver cadastrado, o link sera enviado." }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Nao foi possivel solicitar a recuperacao." }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "sending", type: "submit", children: status === "sending" ? "Enviando..." : "Enviar link" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "auth-link-button", onClick: onBack, type: "button", children: "Voltar para login" })
  ] }) });
}
function ResetPasswordView({ appearance, colorMode, description = "Defina uma senha nova para acessar sua area.", onBack, onConfirm, savedMessage = "Senha redefinida. Volte para entrar.", title = "Nova senha", token }) {
  const [newPassword, setNewPassword] = (0, import_react3.useState)("");
  const [confirmPassword, setConfirmPassword] = (0, import_react3.useState)("");
  const [status, setStatus] = (0, import_react3.useState)("idle");
  async function submitReset(event) {
    event.preventDefault();
    if (!token || newPassword !== confirmPassword) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    try {
      await onConfirm({ token, newPassword });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthShell, { appearance, colorMode, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "login-panel", onSubmit: submitReset, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: appearance.brandName, path: logoPath(appearance, colorMode) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: description })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
      "Nova senha",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "new-password", minLength: 8, onChange: (event) => setNewPassword(event.target.value), required: true, type: "password", value: newPassword })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { children: [
      "Confirmar senha",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { autoComplete: "new-password", minLength: 8, onChange: (event) => setConfirmPassword(event.target.value), required: true, type: "password", value: confirmPassword })
    ] }),
    status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "form-status", children: savedMessage }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "login-error", role: "alert", children: "Link invalido ou senhas diferentes." }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "primary-action", disabled: status === "saving" || status === "saved", type: "submit", children: status === "saving" ? "Salvando..." : "Salvar senha" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "auth-link-button", onClick: onBack, type: "button", children: "Voltar para login" })
  ] }) });
}
function App() {
  const [colorMode, setColorMode] = (0, import_react3.useState)(() => resolveColorMode(defaultAppearance.defaultColorMode));
  const [appearance, setAppearance] = (0, import_react3.useState)(defaultAppearance);
  const [appearanceStatus, setAppearanceStatus] = (0, import_react3.useState)("loading");
  const [authScreen, setAuthScreen] = (0, import_react3.useState)(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has("invite") ? "invite" : params.has("token") ? "reset" : params.has("criar-circulo") ? "circle-signup" : "login";
  });
  const [authStatus, setAuthStatus] = (0, import_react3.useState)("checking");
  const [authUser, setAuthUser] = (0, import_react3.useState)(null);
  const [loginError, setLoginError] = (0, import_react3.useState)("");
  const [isLoggingIn, setIsLoggingIn] = (0, import_react3.useState)(false);
  const [viewMode, setViewMode] = (0, import_react3.useState)("admin");
  const [page, setPage] = (0, import_react3.useState)({ name: "portal" });
  const [searchQuery, setSearchQuery] = (0, import_react3.useState)("");
  const [favoriteLessonIds, setFavoriteLessonIds] = (0, import_react3.useState)(/* @__PURE__ */ new Set());
  const [adminStudents, setAdminStudents] = (0, import_react3.useState)([]);
  const [previewStudentId, setPreviewStudentId] = (0, import_react3.useState)("");
  const [adminAuditLogs, setAdminAuditLogs] = (0, import_react3.useState)([]);
  const [completedLessonIds, setCompletedLessonIds] = (0, import_react3.useState)(/* @__PURE__ */ new Set());
  const [studentRanking, setStudentRanking] = (0, import_react3.useState)(null);
  const [lessonFeedback, setLessonFeedback] = (0, import_react3.useState)({});
  const [feedbackLoadingLessonId, setFeedbackLoadingLessonId] = (0, import_react3.useState)(null);
  const [feedbackError, setFeedbackError] = (0, import_react3.useState)("");
  const [studentNotifications, setStudentNotifications] = (0, import_react3.useState)([]);
  const [studentUnreadNotificationCount, setStudentUnreadNotificationCount] = (0, import_react3.useState)(0);
  const [adminSupportRequests, setAdminSupportRequests] = (0, import_react3.useState)([]);
  const [adminUnreadSupportCount, setAdminUnreadSupportCount] = (0, import_react3.useState)(0);
  const [catalogTracks, setCatalogTracks] = (0, import_react3.useState)([]);
  const [projectSettings, setProjectSettings] = (0, import_react3.useState)(defaultProjectSettings());
  const [checkoutSettings, setCheckoutSettings] = (0, import_react3.useState)(null);
  const [bunnyEmbedBaseUrl, setBunnyEmbedBaseUrl] = (0, import_react3.useState)(void 0);
  const [htmlEmbedAllowedOrigins, setHtmlEmbedAllowedOrigins] = (0, import_react3.useState)([]);
  const [managedProjects, setManagedProjects] = (0, import_react3.useState)([]);
  const [circleSignupRequests, setCircleSignupRequests] = (0, import_react3.useState)([]);
  const [managedAdmins, setManagedAdmins] = (0, import_react3.useState)({});
  const [managedDomains, setManagedDomains] = (0, import_react3.useState)({});
  const [platformSettings, setPlatformSettings] = (0, import_react3.useState)({ bunnyAffiliateUrl: null });
  const [bunnyOnboarding, setBunnyOnboarding] = (0, import_react3.useState)(null);
  const [mcpCredentials, setMcpCredentials] = (0, import_react3.useState)([]);
  const [mcpOneTimeSecret, setMcpOneTimeSecret] = (0, import_react3.useState)("");
  const [aiPolicy, setAiPolicy] = (0, import_react3.useState)(defaultAiPolicy);
  const [aiSources, setAiSources] = (0, import_react3.useState)([]);
  const visibleTracks = (0, import_react3.useMemo)(() => getVisibleTracksForMember(activeMember, catalogTracks), [catalogTracks]);
  const previewStudent = adminStudents.find((student) => student.id === previewStudentId);
  const canPreviewAsAdmin = canPreviewStudentView(authUser);
  const effectiveViewMode = canPreviewAsAdmin ? viewMode : "student";
  const isStudentView = effectiveViewMode === "student";
  const studentTracks = canPreviewAsAdmin ? previewStudent ? getPreviewTracks(catalogTracks, previewStudent.accesses) : [] : catalogTracks;
  const portalTracks = isStudentView ? studentTracks : catalogTracks;
  const primaryNav = isStudentView ? studentPrimaryNav : adminPrimaryNav;
  const isPlatformAdminView = Boolean(authUser?.platformAdmin && isPlatformAdminHost());
  const visiblePrimaryNav = isPlatformAdminView ? platformAdminNav : primaryNav.filter((item) => {
    if (!isStudentView) return true;
    if (item.page.name === "favorites") return projectSettings.operational.favoritesEnabled;
    if (item.page.name === "ranking") return projectSettings.operational.rankingEnabled;
    return true;
  });
  (0, import_react3.useEffect)(() => {
    if (authUser?.role !== "admin") {
      setMcpCredentials([]);
      return;
    }
    fetchMcpCredentials().then(setMcpCredentials).catch(() => setMcpCredentials([]));
  }, [authUser?.role]);
  (0, import_react3.useEffect)(() => {
    if (authUser?.role !== "admin") {
      setCheckoutSettings(null);
      return;
    }
    fetchCheckoutSettings().then(setCheckoutSettings).catch(() => setCheckoutSettings(null));
  }, [authUser?.role]);
  (0, import_react3.useEffect)(() => {
    let isMounted = true;
    fetchAppearance().then((nextAppearance) => {
      if (!isMounted) return;
      setAppearance(nextAppearance);
      setColorMode(resolveColorMode(nextAppearance.defaultColorMode));
      setAppearanceStatus("ready");
    }).catch(() => {
      if (isMounted) setAppearanceStatus("error");
    });
    fetchPublicVideoConfig().then((config) => {
      setBunnyEmbedBaseUrl(config.bunnyEmbedBaseUrl ?? void 0);
      setHtmlEmbedAllowedOrigins(config.htmlEmbedAllowedOrigins ?? []);
    }).catch(() => {
      setBunnyEmbedBaseUrl(void 0);
      setHtmlEmbedAllowedOrigins([]);
    });
    fetchCurrentUser().then((user) => {
      if (!isMounted) return;
      if (!user) {
        setAuthStatus("anonymous");
        return;
      }
      setAuthUser(user);
      if (user.platformAdmin && isPlatformAdminHost()) setPage({ name: "projects-admin" });
      setViewMode(resolveInitialViewMode(user) === "admin" ? "admin" : "student");
      const adminStudentsRequest = user.role === "admin" ? fetchAdminStudents() : Promise.resolve([]);
      const projectSettingsRequest = user.role === "admin" ? fetchProjectSettings().catch(() => defaultProjectSettings()) : Promise.resolve(defaultProjectSettings());
      const unreadCountRequest = user.role === "admin" ? fetchAdminUnreadSupportCount().catch(() => 0) : fetchStudentUnreadNotificationCount().catch(() => 0);
      Promise.all([fetchCatalogTracks(), fetchStudentActivity(), (user.role === "admin" ? fetchAdminRanking() : fetchStudentRanking()).catch(() => null), adminStudentsRequest, unreadCountRequest, projectSettingsRequest]).then(([nextTracks, activity, ranking, students, unreadCount, nextProjectSettings]) => {
        if (!isMounted) return;
        setCatalogTracks(nextTracks);
        setStudentRanking(ranking);
        setProjectSettings(nextProjectSettings);
        setCompletedLessonIds(new Set(activity.completedLessonIds));
        setFavoriteLessonIds(new Set(activity.favoriteLessonIds));
        setAdminStudents(students);
        if (user.role === "admin") setAdminUnreadSupportCount(unreadCount);
        else setStudentUnreadNotificationCount(unreadCount);
        if (students[0]) setPreviewStudentId(students[0].id);
      }).catch(() => {
        if (isMounted) setCatalogTracks([]);
      });
      setAuthScreen("login");
      setAuthStatus("authenticated");
    }).catch(() => {
      if (isMounted) setAuthStatus("anonymous");
    });
    return () => {
      isMounted = false;
    };
  }, []);
  (0, import_react3.useEffect)(() => {
    const root = document.documentElement;
    const variables = appearanceCssVariables(appearance, colorMode);
    for (const key of ["--scrollbar-track", "--scrollbar-thumb", "--sidebar-scrollbar-track", "--sidebar-scrollbar-thumb", "--scrollbar-width"]) {
      root.style.setProperty(key, variables[key]);
    }
  }, [appearance, colorMode]);
  (0, import_react3.useEffect)(() => {
    if (appearance.defaultColorMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const applySystemMode = () => setColorMode(media.matches ? "light" : "dark");
    applySystemMode();
    media.addEventListener?.("change", applySystemMode);
    return () => media.removeEventListener?.("change", applySystemMode);
  }, [appearance.defaultColorMode]);
  (0, import_react3.useEffect)(() => {
    if (!authUser?.platformAdmin) {
      setManagedProjects([]);
      setCircleSignupRequests([]);
      return;
    }
    fetchManagedProjects().then(setManagedProjects).catch(() => setManagedProjects([]));
    fetchCircleSignupRequests().then(setCircleSignupRequests).catch(() => setCircleSignupRequests([]));
    fetchPlatformSettings().then(setPlatformSettings).catch(() => setPlatformSettings({ bunnyAffiliateUrl: null }));
  }, [authUser?.platformAdmin]);
  (0, import_react3.useEffect)(() => {
    if (authUser?.role !== "admin") {
      setBunnyOnboarding(null);
      return;
    }
    fetchBunnyOnboarding().then(setBunnyOnboarding).catch(() => setBunnyOnboarding(null));
  }, [authUser?.role]);
  (0, import_react3.useEffect)(() => {
    if (authUser?.role !== "admin" || isPlatformAdminView) {
      setAiPolicy(defaultAiPolicy);
      setAiSources([]);
      return;
    }
    Promise.all([fetchAiPolicy(), fetchAiSources()]).then(([policy, sources]) => {
      setAiPolicy(policy);
      setAiSources(sources);
    }).catch(() => {
      setAiPolicy(defaultAiPolicy);
      setAiSources([]);
    });
  }, [authUser?.role, isPlatformAdminView]);
  (0, import_react3.useEffect)(() => {
    if (!authUser?.platformAdmin || managedProjects.length === 0) {
      setManagedAdmins({});
      return;
    }
    Promise.all(managedProjects.map(async (project) => [project.slug, await fetchProjectAdmins(project.slug)])).then((entries) => setManagedAdmins(Object.fromEntries(entries))).catch(() => setManagedAdmins({}));
  }, [authUser?.platformAdmin, managedProjects]);
  (0, import_react3.useEffect)(() => {
    if (!authUser?.platformAdmin || managedProjects.length === 0) {
      setManagedDomains({});
      return;
    }
    Promise.all(managedProjects.map(async (project) => [project.slug, await fetchProjectDomains(project.slug)])).then((entries) => setManagedDomains(Object.fromEntries(entries))).catch(() => setManagedDomains({}));
  }, [authUser?.platformAdmin, managedProjects]);
  async function handleSaveAppearance() {
    setAppearance(await saveAppearance(appearance));
  }
  async function handleSaveProjectSettings() {
    const savedSettings = await saveProjectSettings(projectSettings);
    setProjectSettings(savedSettings);
    setBunnyEmbedBaseUrl(savedSettings.videoEmbedBaseUrl ?? void 0);
    setHtmlEmbedAllowedOrigins(savedSettings.operational.htmlEmbedAllowedOrigins ?? []);
  }
  async function handleSavePlatformSettings() {
    setPlatformSettings(await savePlatformSettings(platformSettings));
  }
  async function refreshMcpCredentials() {
    setMcpCredentials(await fetchMcpCredentials());
  }
  async function handleCreateMcpCredential(input) {
    const created = await createMcpCredential(input);
    setMcpOneTimeSecret(created.clientSecret);
    await refreshMcpCredentials();
  }
  async function handleRotateMcpCredential(id) {
    if (!window.confirm("Rotacionar revoga os tokens atuais deste agente. Continuar?")) return;
    const rotated = await rotateMcpCredential(id);
    setMcpOneTimeSecret(rotated.clientSecret);
    await refreshMcpCredentials();
  }
  async function handleRevokeMcpCredential(id) {
    if (!window.confirm("Revogar impede novos tokens e invalida os tokens atuais. Continuar?")) return;
    await revokeMcpCredential(id);
    await refreshMcpCredentials();
  }
  async function handleRequestSubdomainChange(requestedSubdomain) {
    await requestProjectSubdomainChange(requestedSubdomain);
  }
  async function handleSupportRequest(input) {
    await createSupportRequest(input);
    const notifications = await fetchStudentNotifications();
    setStudentNotifications(notifications);
    setStudentUnreadNotificationCount(notifications.filter((notification) => !notification.readAt).length);
  }
  async function loadStudentNotifications() {
    const notifications = await fetchStudentNotifications();
    setStudentNotifications(notifications);
    setStudentUnreadNotificationCount(notifications.filter((notification) => !notification.readAt).length);
    await markStudentNotificationsRead();
    setStudentNotifications((current) => current.map((notification) => ({ ...notification, readAt: notification.readAt ?? (/* @__PURE__ */ new Date()).toISOString() })));
    setStudentUnreadNotificationCount(0);
  }
  async function markAllStudentNotificationsRead() {
    await markStudentNotificationsRead();
    setStudentNotifications((current) => current.map((notification) => ({ ...notification, readAt: notification.readAt ?? (/* @__PURE__ */ new Date()).toISOString() })));
    setStudentUnreadNotificationCount(0);
  }
  async function loadAdminSupportRequests(status) {
    const requests = await fetchAdminSupportRequests(status);
    setAdminSupportRequests(requests);
    await markAdminSupportRead();
    setAdminUnreadSupportCount(0);
  }
  async function handleAdminSupportReply(requestId, response) {
    const previous = adminSupportRequests.find((request3) => request3.id === requestId);
    const updated = await replyToSupportRequest(requestId, response);
    setAdminSupportRequests((current) => current.map((request3) => request3.id === updated.id ? updated : request3));
    if (previous?.status === "OPEN") setAdminUnreadSupportCount((count) => Math.max(0, count - 1));
  }
  async function handleAdminSupportStatus(requestId, status) {
    const previous = adminSupportRequests.find((request3) => request3.id === requestId);
    const updated = await updateSupportRequestStatus(requestId, status);
    setAdminSupportRequests((current) => current.map((request3) => request3.id === updated.id ? updated : request3));
    if (previous?.status === "OPEN" && status !== "OPEN") setAdminUnreadSupportCount((count) => Math.max(0, count - 1));
    if (previous?.status !== "OPEN" && status === "OPEN") setAdminUnreadSupportCount((count) => count + 1);
  }
  function handleSetColorMode(mode) {
    setColorMode(mode);
    setAppearance((current) => ({ ...current, defaultColorMode: mode }));
  }
  (0, import_react3.useEffect)(() => {
    const existingFavicon = document.querySelector('link[rel="icon"]');
    const favicon = existingFavicon ?? document.head.appendChild(document.createElement("link"));
    favicon.rel = "icon";
    favicon.href = appearance.faviconImagePath;
  }, [appearance.faviconImagePath]);
  const searchResults = (0, import_react3.useMemo)(() => searchCatalog(searchQuery, catalogTracks), [catalogTracks, searchQuery]);
  function navigate(nextPage) {
    setPage(nextPage);
  }
  function openCourse(courseId) {
    setPage({ name: "course", courseId });
  }
  function openTrack(trackId) {
    setPage({ name: "track", trackId });
  }
  function openLesson(lessonId) {
    setPage({ name: "lesson", lessonId });
  }
  function toggleFavorite(lessonId) {
    const shouldFavorite = !favoriteLessonIds.has(lessonId);
    setFavoriteLessonIds((current) => {
      const next = new Set(current);
      if (shouldFavorite) {
        next.add(lessonId);
      } else {
        next.delete(lessonId);
      }
      return next;
    });
    void setLessonFavorite(lessonId, shouldFavorite).catch(() => {
      setFavoriteLessonIds((current) => {
        const next = new Set(current);
        if (shouldFavorite) next.delete(lessonId);
        else next.add(lessonId);
        return next;
      });
    });
  }
  function completeLesson(lessonId) {
    setCompletedLessonIds((current) => new Set(current).add(lessonId));
    void markLessonComplete(lessonId).catch(() => {
      setCompletedLessonIds((current) => {
        const next = new Set(current);
        next.delete(lessonId);
        return next;
      });
    });
  }
  async function loadLessonFeedback(lessonSlug) {
    setFeedbackLoadingLessonId(lessonSlug);
    setFeedbackError("");
    try {
      const nextFeedback = await fetchLessonFeedback(lessonSlug);
      setLessonFeedback((current) => ({ ...current, [lessonSlug]: nextFeedback }));
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Nao foi possivel carregar o feedback da aula.");
    } finally {
      setFeedbackLoadingLessonId((current) => current === lessonSlug ? null : current);
    }
  }
  async function handleAddLessonComment(lessonSlug, body) {
    setFeedbackError("");
    try {
      const comment = await addLessonComment(lessonSlug, body);
      setLessonFeedback((current) => {
        const feedback = current[lessonSlug] ?? { comments: [], rating: null };
        return { ...current, [lessonSlug]: { ...feedback, comments: [comment, ...feedback.comments] } };
      });
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Nao foi possivel publicar o comentario.");
    }
  }
  async function handleRateLesson(lessonSlug, value) {
    setFeedbackError("");
    try {
      await rateLesson(lessonSlug, value);
      setLessonFeedback((current) => {
        const feedback = current[lessonSlug] ?? { comments: [], rating: null };
        return { ...current, [lessonSlug]: { ...feedback, rating: value } };
      });
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Nao foi possivel salvar sua avaliacao.");
    }
  }
  function submitSearch(event) {
    event.preventDefault();
    setPage({ name: "search" });
  }
  function showLogin() {
    setLoginError("");
    setAuthScreen("login");
    const params = new URLSearchParams(window.location.search);
    if (params.has("token") || params.has("invite")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }
  async function handleRequestPasswordReset(email2) {
    await requestPasswordReset({ email: email2 });
  }
  async function handleConfirmPasswordReset(input) {
    await confirmPasswordReset(input);
    window.history.replaceState(null, "", window.location.pathname);
  }
  async function handleConfirmInvitation(input) {
    await confirmInvitation(input);
    window.history.replaceState(null, "", window.location.pathname);
  }
  async function handleLogin(credentials) {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const user = await loginWithPassword(credentials);
      const [nextTracks, activity, ranking, unreadCount] = await Promise.all([fetchCatalogTracks().catch(() => []), fetchStudentActivity().catch(() => ({ completedLessonIds: [], favoriteLessonIds: [] })), (user.role === "admin" ? fetchAdminRanking() : fetchStudentRanking()).catch(() => null), user.role === "admin" ? fetchAdminUnreadSupportCount().catch(() => 0) : fetchStudentUnreadNotificationCount().catch(() => 0)]);
      setCatalogTracks(nextTracks);
      setStudentRanking(ranking);
      setCompletedLessonIds(new Set(activity.completedLessonIds));
      setFavoriteLessonIds(new Set(activity.favoriteLessonIds));
      if (user.role === "admin") setAdminUnreadSupportCount(unreadCount);
      else setStudentUnreadNotificationCount(unreadCount);
      setAuthUser(user);
      setViewMode(resolveInitialViewMode(user) === "admin" ? "admin" : "student");
      setPage(user.platformAdmin && isPlatformAdminHost() ? { name: "projects-admin" } : { name: "portal" });
      setAuthScreen("login");
      setAuthStatus("authenticated");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Nao foi possivel entrar.");
    } finally {
      setIsLoggingIn(false);
    }
  }
  async function handleCircleSignup(input) {
    await requestCircleSignup(input);
  }
  async function refreshCatalog() {
    const nextTracks = await fetchCatalogTracks();
    setCatalogTracks(nextTracks);
  }
  async function refreshAdminAuditLogs(filters = {}) {
    const nextLogs = await fetchAdminAuditLogs({ ...filters, limit: 50 });
    setAdminAuditLogs(nextLogs);
  }
  async function refreshAdminStudents() {
    const nextStudents = await fetchAdminStudents();
    setAdminStudents(nextStudents);
    setPreviewStudentId((current) => nextStudents.some((student) => student.id === current) ? current : nextStudents[0]?.id ?? "");
  }
  async function handleCreateStudent(input) {
    const created = await createAdminStudent(input);
    await Promise.all([refreshAdminStudents(), refreshCatalog()]);
    return created;
  }
  async function handleGrantStudentAccess(input) {
    await grantAdminStudentAccess(input);
    await Promise.all([refreshAdminStudents(), refreshCatalog()]);
  }
  async function handleRevokeStudentAccess(input) {
    await revokeAdminStudentAccess(input);
    await Promise.all([refreshAdminStudents(), refreshCatalog()]);
  }
  async function handleResendInvitation(userId) {
    await resendAdminStudentInvitation(userId);
    await refreshAdminStudents();
  }
  async function handleCreateTrack(input) {
    await createAdminTrack(input);
    await refreshCatalog();
  }
  async function handleUpdateTrack(input) {
    await updateAdminTrack(input);
    await refreshCatalog();
  }
  async function handleDeleteTrack(input) {
    await deleteAdminTrack(input);
    await refreshCatalog();
  }
  async function handleCreateCourse(input) {
    await createAdminCourse(input);
    await refreshCatalog();
  }
  async function handleUpdateCourse(input) {
    await updateAdminCourse(input);
    await refreshCatalog();
  }
  async function handleDeleteCourse(input) {
    await deleteAdminCourse(input);
    await refreshCatalog();
  }
  async function handleCreateModule(input) {
    await createAdminModule(input);
    await refreshCatalog();
  }
  async function handleUpdateModule(input) {
    await updateAdminModule(input);
    await refreshCatalog();
  }
  async function handleDeleteModule(input) {
    await deleteAdminModule(input);
    await refreshCatalog();
  }
  async function handleCreateLesson(input) {
    await createAdminLesson(input);
    await refreshCatalog();
  }
  async function handleReorderLessons(input) {
    await reorderAdminLessons(input);
    await refreshCatalog();
  }
  async function handleUpdateLesson(input) {
    await updateAdminLesson(input);
    await refreshCatalog();
  }
  async function handleDeleteLesson(input) {
    await deleteAdminLesson(input);
    await refreshCatalog();
  }
  async function handleChangePassword(input) {
    await changePassword(input);
  }
  async function handleProvisionProject(input) {
    await provisionProject(input);
    setManagedProjects(await fetchManagedProjects());
  }
  async function handleProjectStatus(slug, status) {
    const updated = await updateManagedProjectStatus(slug, status);
    setManagedProjects((current) => current.map((project) => project.slug === slug ? updated : project));
  }
  async function handleCircleSignupDecision(id, status, reviewNote) {
    const updated = await decideCircleSignup(id, status, reviewNote);
    setCircleSignupRequests((current) => current.map((request3) => request3.id === id ? updated : request3));
  }
  async function handleCircleSignupProvision(id) {
    await provisionCircleSignup(id);
    setCircleSignupRequests((current) => current.map((request3) => request3.id === id ? { ...request3, status: "PROVISIONED" } : request3));
  }
  async function handleCircleSignupResendInvitation(id) {
    await resendCircleSignupInvitation(id);
  }
  async function handleAddProjectAdmin(slug, email2) {
    const admins = await addProjectAdmin(slug, email2);
    setManagedAdmins((current) => ({ ...current, [slug]: admins }));
  }
  async function handleRemoveProjectAdmin(slug, userId) {
    const admins = await removeProjectAdmin(slug, userId);
    setManagedAdmins((current) => ({ ...current, [slug]: admins }));
  }
  async function handleAddProjectDomain(slug, hostname) {
    const domain = await addProjectDomain(slug, hostname);
    setManagedDomains((current) => ({ ...current, [slug]: [...current[slug] ?? [], domain] }));
    return domain;
  }
  async function handleVerifyProjectDomain(slug, domainId, token) {
    const domain = await verifyProjectDomain(slug, domainId, token);
    setManagedDomains((current) => ({ ...current, [slug]: (current[slug] ?? []).map((item) => item.id === domainId ? domain : item) }));
  }
  async function handleVerifyProjectDomainDns(slug, domainId) {
    const domain = await verifyProjectDomainDns(slug, domainId);
    setManagedDomains((current) => ({ ...current, [slug]: (current[slug] ?? []).map((item) => item.id === domainId ? domain : item) }));
  }
  async function handleRemoveProjectDomain(slug, domainId) {
    await removeProjectDomain(slug, domainId);
    setManagedDomains((current) => ({ ...current, [slug]: (current[slug] ?? []).filter((item) => item.id !== domainId) }));
  }
  async function handleLogout() {
    await logoutSession();
    setAuthUser(null);
    setCatalogTracks([]);
    setCompletedLessonIds(/* @__PURE__ */ new Set());
    setFavoriteLessonIds(/* @__PURE__ */ new Set());
    setLessonFeedback({});
    setAuthStatus("anonymous");
    setPage({ name: "portal" });
    setViewMode("student");
  }
  async function handleSaveAiPolicy(next) {
    setAiPolicy(await saveAiPolicy(next));
  }
  async function handleIngestAiSource(input) {
    await ingestAiSource(input);
  }
  async function handleExtractAiPdf(file) {
    const result = await extractAiPdf(file);
    return { text: result.text, filename: file.name };
  }
  async function handlePrepareAiLesson(input) {
    const result = await prepareAiLesson(input);
    return { jobKey: result.manifest.jobKey };
  }
  async function refreshAiSources() {
    setAiSources(await fetchAiSources());
  }
  function openSearchResult(result) {
    if (result.lessonId) {
      openLesson(result.lessonId);
    } else if (result.courseId) {
      openCourse(result.courseId);
    } else if (result.trackId) {
      openTrack(result.trackId);
    }
  }
  function renderPage() {
    const previewReadOnly = isStudentView && canPreviewAsAdmin;
    const displayedUser = previewReadOnly && previewStudent ? { id: previewStudent.id, name: previewStudent.name, email: previewStudent.email, role: "student", platformAdmin: false } : authUser;
    if (page.name === "track") {
      const track = findTrackById(page.trackId, catalogTracks);
      return track ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TrackView, { completedLessonIds, onOpenCourse: openCourse, track }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks });
    }
    if (page.name === "course") {
      const courseContext = findCourseById(page.courseId, catalogTracks);
      return courseContext ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        CourseView,
        {
          completedLessonIds,
          course: courseContext.course,
          favoriteLessonIds,
          favoritesEnabled: projectSettings.operational.favoritesEnabled,
          onOpenLesson: openLesson,
          onToggleFavorite: toggleFavorite,
          readOnly: previewReadOnly,
          track: courseContext.track
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks });
    }
    if (page.name === "lesson") {
      const lessonContext = findLessonById(page.lessonId, catalogTracks);
      return lessonContext ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        LessonView,
        {
          bunnyBaseUrl: bunnyEmbedBaseUrl,
          htmlAllowedOrigins: htmlEmbedAllowedOrigins,
          completedLessonIds,
          favoriteLessonIds,
          favoritesEnabled: projectSettings.operational.favoritesEnabled,
          lessonContext,
          onComplete: completeLesson,
          onOpenCourse: openCourse,
          onToggleFavorite: toggleFavorite,
          feedback: lessonFeedback[lessonContext.lesson.id],
          feedbackEnabled: isStudentView && projectSettings.operational.commentsEnabled,
          feedbackError,
          feedbackLoading: feedbackLoadingLessonId === lessonContext.lesson.id,
          onAddComment: handleAddLessonComment,
          onLoadFeedback: loadLessonFeedback,
          onRateLesson: handleRateLesson,
          readOnly: previewReadOnly
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks });
    }
    if (page.name === "search") {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SearchView, { onOpenResult: openSearchResult, query: searchQuery, results: searchResults });
    }
    if (page.name === "favorites") {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FavoritesView, { favoriteLessonIds, onOpenLesson: openLesson, tracks: catalogTracks });
    }
    if (page.name === "profile") {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ProfileView, { completedLessonIds, tracks: studentTracks, user: displayedUser });
    }
    if (page.name === "students-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ProfileView, { completedLessonIds, tracks: studentTracks, user: displayedUser }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminStudentsView, { onCreateStudent: handleCreateStudent, onGrantAccess: handleGrantStudentAccess, onLoadStudents: refreshAdminStudents, onResendInvitation: handleResendInvitation, onRevokeAccess: handleRevokeStudentAccess, students: adminStudents, tracks: catalogTracks });
    }
    if (page.name === "audit-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminAuditView, { logs: adminAuditLogs, onLoad: refreshAdminAuditLogs });
    }
    if (page.name === "account") {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AccountView, { onChangePassword: handleChangePassword, onLoadProfile: fetchStudentProfile, onSaveProfile: updateStudentProfile, readOnly: previewReadOnly, user: displayedUser });
    }
    if (page.name === "support") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SupportView, { onSubmit: handleSupportRequest, readOnly: previewReadOnly, tracks: catalogTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminSupportView, { onLoad: loadAdminSupportRequests, onReply: handleAdminSupportReply, onStatus: handleAdminSupportStatus, requests: adminSupportRequests });
    }
    if (page.name === "notifications") {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NotificationsView, { notifications: studentNotifications, onLoad: loadStudentNotifications, onMarkAllRead: markAllStudentNotificationsRead, readOnly: previewReadOnly });
    }
    if (page.name === "ranking") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(RankingView, { ranking: studentRanking }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminIndicatorsView, { ranking: studentRanking });
    }
    if (page.name === "tracks-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminTracksView, { onCreateTrack: handleCreateTrack, onDeleteTrack: handleDeleteTrack, onUpdateTrack: handleUpdateTrack, onUpload: uploadPlatformAsset, tracks: catalogTracks });
    }
    if (page.name === "courses-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminCoursesView, { onCreateCourse: handleCreateCourse, onDeleteCourse: handleDeleteCourse, onUpdateCourse: handleUpdateCourse, onUpload: uploadPlatformAsset, tracks: catalogTracks });
    }
    if (page.name === "modules-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminModulesView, { onCreateModule: handleCreateModule, onDeleteModule: handleDeleteModule, onUpdateModule: handleUpdateModule, tracks: catalogTracks });
    }
    if (page.name === "lessons-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminLessonsView, { htmlAllowedOrigins: htmlEmbedAllowedOrigins, onCreateLesson: handleCreateLesson, onDeleteLesson: handleDeleteLesson, onReorderLessons: handleReorderLessons, onUpdateLesson: handleUpdateLesson, onUploadMaterial: uploadLessonMaterial, tracks: catalogTracks });
    }
    if (page.name === "projects-admin") {
      return isStudentView || !isPlatformAdminView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ProjectProvisioningView, { admins: managedAdmins, domains: managedDomains, onAdminAdd: handleAddProjectAdmin, onAdminRemove: handleRemoveProjectAdmin, onDomainAdd: handleAddProjectDomain, onDomainRemove: handleRemoveProjectDomain, onDomainVerify: handleVerifyProjectDomain, onDomainVerifyDns: handleVerifyProjectDomainDns, onProvision: handleProvisionProject, onStatus: handleProjectStatus, platformSettings, onPlatformSettingsChange: setPlatformSettings, onPlatformSettingsSave: handleSavePlatformSettings, projects: managedProjects });
    }
    if (page.name === "circle-signups-admin") {
      return isStudentView || !isPlatformAdminView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CircleSignupsView, { onDecide: handleCircleSignupDecision, onProvision: handleCircleSignupProvision, onResendInvitation: handleCircleSignupResendInvitation, requests: circleSignupRequests });
    }
    if (page.name === "appearance") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AppearanceView, { appearance, bunnyOnboarding, colorMode, onChange: setAppearance, onRequestSubdomainChange: handleRequestSubdomainChange, onSave: handleSaveAppearance, onSetColorMode: handleSetColorMode, onUpload: uploadPlatformAsset, projectSettings, onProjectSettingsChange: setProjectSettings, onProjectSettingsSave: handleSaveProjectSettings });
    }
    if (page.name === "project-settings") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ProjectSettingsView, { appearance, bunnyOnboarding, onAppearanceChange: setAppearance, onRequestSubdomainChange: handleRequestSubdomainChange, projectSettings, onProjectSettingsChange: setProjectSettings, onProjectSettingsSave: handleSaveProjectSettings });
    }
    if (page.name === "checkout-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CheckoutView, { settings: checkoutSettings, tracks: catalogTracks, onReload: async () => {
        setCheckoutSettings(await fetchCheckoutSettings());
      } });
    }
    if (page.name === "mcp-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(McpAgentsView, { credentials: mcpCredentials, onCreate: handleCreateMcpCredential, onRotate: handleRotateMcpCredential, onRevoke: handleRevokeMcpCredential, oneTimeSecret: mcpOneTimeSecret, onDismissSecret: () => setMcpOneTimeSecret("") });
    }
    if (page.name === "ai-admin") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AdminAiLessonView, { onPolicySave: handleSaveAiPolicy, onPrepareLesson: handlePrepareAiLesson, onReload: refreshAiSources, policy: aiPolicy, sources: aiSources, tracks: catalogTracks });
    }
    if (page.name === "documentation") {
      return isStudentView ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, tracks: studentTracks }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(DocumentationView, {});
    }
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortalView, { appearance, completedLessonIds, onOpenCourse: openCourse, onOpenTrack: openTrack, studentView: isStudentView, tracks: portalTracks });
  }
  if (appearanceStatus !== "ready") return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AppearancePending, { failed: appearanceStatus === "error" });
  if (authStatus === "checking") {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AuthLoadingView, { appearance, colorMode });
  }
  if (authStatus === "anonymous") {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token") ?? "";
    const invitationToken = params.get("invite") ?? "";
    if (authScreen === "forgot") return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ForgotPasswordView, { appearance, colorMode, onBack: showLogin, onRequest: handleRequestPasswordReset });
    if (authScreen === "reset") return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ResetPasswordView, { appearance, colorMode, onBack: showLogin, onConfirm: handleConfirmPasswordReset, token: resetToken });
    if (authScreen === "invite") return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ResetPasswordView, { appearance, colorMode, onBack: showLogin, onConfirm: handleConfirmInvitation, token: invitationToken, title: "Ativar sua conta", description: "Defina sua senha para acessar o C\xEDrculo.", savedMessage: "Conta ativada. Volte para o login para entrar." });
    if (authScreen === "circle-signup") return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CircleSignupView, { appearance, colorMode, onBack: showLogin, onSubmit: handleCircleSignup });
    const hostname = window.location.hostname.toLowerCase();
    const isCircleLanding = hostname === "circulo.localhost" || hostname === "circulo.soberania.cloud";
    if (isCircleLanding) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CircleLandingView, { appearance, colorMode, onCreateCircle: () => setAuthScreen("circle-signup") });
    const loginTitle = `${appearance.loginPreposition === "na" ? "Entrar na" : "Entrar no"} ${appearance.brandName}`;
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LoginView, { appearance, colorMode, error: loginError, isSubmitting: isLoggingIn, loginTitle, onCreateCircle: () => setAuthScreen("circle-signup"), onForgotPassword: () => setAuthScreen("forgot"), onLogin: handleLogin });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `ponto-comum-app theme-mode-${colorMode} view-mode-${effectiveViewMode}${isPlatformAdminView ? " platform-admin-app" : ""} card-size-${appearance.cardSize}`, style: appearanceCssVariables(appearance, colorMode), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("aside", { className: "sidebar", "aria-label": isStudentView ? "Menu da aluna" : "Menu administrativo", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "brand", type: "button", onClick: () => navigate({ name: "portal" }), "aria-label": "C\xEDrculo", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BrandLogo, { alt: "C\xEDrculo", path: logoPath(appearance, colorMode) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", { className: "side-nav", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NavLinks, { currentPage: page, items: visiblePrimaryNav, labels: isStudentView ? appearance.studentNav : void 0, onNavigate: navigate, unreadCount: isStudentView || isPlatformAdminView ? 0 : adminUnreadSupportCount }) }),
      !isStudentView && !isPlatformAdminView && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "side-divider" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", { className: "side-nav side-nav-secondary", "aria-label": "Administracao", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NavLinks, { currentPage: page, items: adminSecondaryNav, onNavigate: navigate }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "profile-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "avatar", children: "A" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: isStudentView && canPreviewAsAdmin ? previewStudent?.name ?? "Selecione uma aluna" : authUser?.name ?? (isStudentView ? activeMember.name : "Admin C\xEDrculo") }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("small", { children: isStudentView ? `${studentTracks.length} jornadas visiveis` : `${visibleTracks.length} acesso em preview` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("main", { className: "content", id: "inicio", children: [
      isPlatformAdminView && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "platform-admin-banner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: "Administracao do Circulo" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Gestao da plataforma e dos tenants" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("header", { className: "topbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "search", onSubmit: submitSearch, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { "aria-hidden": "true", children: "/" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { onChange: (event) => setSearchQuery(event.target.value), placeholder: isStudentView ? "Buscar nas minhas aulas" : "Buscar", value: searchQuery })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "topbar-actions", children: [
          canPreviewAsAdmin && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `view-switch segmented-control${effectiveViewMode === "student" ? " preview-switch" : ""}`, "aria-label": "Visualizacao", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", "aria-pressed": effectiveViewMode === "admin", onClick: () => setViewMode("admin"), children: "Admin" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", "aria-pressed": effectiveViewMode === "student", onClick: () => setViewMode("student"), children: "Ver como aluna" }),
            effectiveViewMode === "student" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { "aria-label": "Aluna em preview", value: previewStudentId, onChange: (event) => setPreviewStudentId(event.target.value), children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Selecionar aluna" }),
              adminStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: student.id, children: student.name }, student.id))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "theme-switch segmented-control", "aria-label": "Tema da interface", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", "aria-pressed": colorMode === "light", onClick: () => setColorMode("light"), children: "Claro" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", "aria-pressed": colorMode === "dark", onClick: () => setColorMode("dark"), children: "Escuro" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { "aria-label": "Notificacoes", className: "notification-button", onClick: () => navigate({ name: "notifications" }), type: "button", children: [
            "o",
            studentUnreadNotificationCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "nav-badge", "aria-label": `${studentUnreadNotificationCount} notificacoes nao lidas`, children: studentUnreadNotificationCount > 99 ? "99+" : studentUnreadNotificationCount })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => navigate({ name: "account" }), type: "button", children: isStudentView ? "Meu perfil" : "Minha conta" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "logout-button", onClick: handleLogout, type: "button", children: "Sair" })
        ] })
      ] }),
      isStudentView && canPreviewAsAdmin && !previewStudent ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PreviewEmptyState, {}) : renderPage()
    ] })
  ] });
}
var App_default = App;

// ../../../../.codex/worktrees/circulo-release-main/ponto_comum/src/main.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
(0, import_client.createRoot)(document.getElementById("root")).render(
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react4.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(App_default, {}) })
);
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
