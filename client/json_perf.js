const obj = {};
let link = obj;
for (let i = 0; i < 5; ++i) {
    link[i] = {};
    link[i + 1] = i + 1;
    link[i + 2] = i + 2;
    link = link[i];
}

const str = JSON.stringify(obj);
console.log(str);

console.time('parse');
const n = JSON.parse(str);
console.timeEnd('parse');

console.log(Object.keys(n).length);
