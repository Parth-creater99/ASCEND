const fs = require('fs');
let b = fs.readFileSync('src/App.jsx', 'utf8');
let fixed = Buffer.from(b, 'binary').toString('utf8');
const idx = fixed.indexOf('"mr": {');
console.log(fixed.slice(idx, idx+250));
