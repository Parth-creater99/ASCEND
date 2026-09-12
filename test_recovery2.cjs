const fs = require('fs');
let str = fs.readFileSync('src/App.jsx', 'utf8');
let buf = Buffer.from(str, 'latin1');
let fixed = buf.toString('utf8');
const idx = fixed.indexOf('"mr": {');
console.log(fixed.slice(idx, idx+250));
