const { decode } = require('../src/msgpack/decode');

const obj = {};
let link = obj;
for (let i = 0; i < 5; ++i) {
    link[i] = {};
    link[i + 1] = i + 1;
    link[i + 2] = i + 2;
    link = link[i];
}