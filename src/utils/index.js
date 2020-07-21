export const isObject = (obj) => {
  return obj === Object(obj);
};

export const isSet = (data) => (data instanceof Set);
