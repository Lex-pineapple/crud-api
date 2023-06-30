const randArr = [
  {
    hello: 'hello',
  },
  [],
  ';',
  'df',
  [324],
  'dsfg',
  [],
  'dsfg',
  'dsfg',
  'dsfg',
  22,
  [34],
  458431684,
  'username',
  'password',
  ['ddd', 'ddd'],
  ['ddd', 'ddd'],
  ['ddd', 'ddd'],
  ['ddd', 'ddd'],
  ['ddd', 'ddd'],
  448486,
  [34],
  [234],
  'dscf',
  'sadvf',
  [],
  'asdfg',
  465,
  65,
  {
    username: 'sdfg',
    age: 'asdfg',
    hobbies: ['asdfg', 'sdfg'],
  },
  true,
  false,
  null,
  undefined,
];

function generateRandomType() {
  const randNum = generateRandomNumberInRange(0, randArr.length);
  return randArr[randNum];
}

function generateRandomNumberInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export { generateRandomType };
