const inputArray = [
  { amount: 10000, quantity: 10 },
  { amount: 20, quantity: 5 },
  { amount: 4000, quantity: 200 },
];

/**
 * This function returns an new sorted array with totals.
 *
 * @param { Object[] } inArray
 * @param { number } inArray[].amount
 * @param { number } inArray[].quantity
 * @returns { {amount:number, quantity:number, Total:number}[] }
 *
 */
const orderArray = (inArray) => {
  const srcArrayStr = JSON.stringify(inArray);
  const srcArrayCpy = JSON.parse(srcArrayStr);

  const ArrayWthTotal = srcArrayCpy.map((a) => {
    return {
      amount: a.amount,
      quantity: a.quantity,
      Total: a.amount * a.quantity,
    };
  });

  const sortedArray = ArrayWthTotal.sort((a, b) => a.Total - b.Total);
  return { input: inArray, out: sortedArray };
};

const res = orderArray(inputArray);

console.log("input Array:", res.input);
console.log("output Array:", res.out);
