export const isHTMLElement = function (el) {
  if ("HTMLElement" in window) {
    return el instanceof HTMLElement;
  } else {
    return (
      typeof el === "object" &&
      el.nodeType === 1 &&
      typeof el.nodeName === "string"
    );
  }
};

// Find some better way to detect react fiber node object
export const isReactNode = (k, v) => {
  return k.startsWith("__reactFiber") && v.stateNode;
};

export const parseData = (data) => {
  // For Detecting Circular Structures
  const seen = new WeakMap();

  const stringifyResolver = function (k, v) {
    if (typeof v === "function") {
      return "function () {}";
    }
    if (isHTMLElement(v)) {
      return `<${v.tagName}> HTMLElemet`;
    }
    if (v instanceof Set) {
      return Array.from(v);
    }
    if (v instanceof Map) {
      return Object.fromEntries(v);
    }
    if (v instanceof WeakSet) {
      return `WeekSet []`;
    }
    if (v instanceof WeakMap) {
      return `WeakMap {}`;
    }
    if (isReactNode(k, v)) {
      return "<REACT NODE>";
    }
    // Detect Circular Structure
    if (typeof v === "object" && v !== null) {
      if (seen.has(v)) {
        return `<CIRCULAR OBJECT> ${seen.get(v)}`;
      }
      seen.set(v, k);
    }
    return v;
  };

  if (typeof data !== "object") {
    return data;
  }

  return JSON.parse(JSON.stringify(data, stringifyResolver));
};
