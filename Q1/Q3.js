const src = {
  prop11: {
    prop21: 21,
    prop22: {
      prop31: 31,
      prop32: 32,
    },
  },
  prop12: 12,
};

const proto = {
  prop11: {
    prop22: null,
  },
};

/**
 * This function will push values from source props to prototype props where value is null
 * @param {Object} source - source Object
 * @param {Object} prototype - prototype Object
 * @param {Object} response - response Object
 */
const projection = (source, prototype, response) => {
  for (let key in prototype) {
    if (prototype.hasOwnProperty(key) && prototype[key] === null) {
      response[key] = source[key];
    } else if (typeof prototype[key] === "object") {
      projection(source[key], prototype[key], response[key]);
    }
  }
};

/**
 * This function will push values from source props to prototype props where value is null
 * @param {Object} source - source Object
 * @param {Object} prototype - prototype Object
 * @returns {Object} - projected Object
 */
const objectProjection = (source, prototype) => {
  const res = structuredClone(prototype);
  projection(source, prototype, res);
  return res;
};

const main = () => {
  const projectedObj = objectProjection(src, proto);
  console.log(projectedObj);
};

main();
