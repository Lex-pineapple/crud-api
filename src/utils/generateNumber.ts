function generateNumber(maxNumOfDigits: number) {
  const digits = maxNumOfDigits < 1 ? 1 : maxNumOfDigits - 1;
  return Math.floor(Math.random() * Math.pow(10, digits));
}

export { generateNumber };
