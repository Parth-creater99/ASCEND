const fs = require('fs');
let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

// The previous script replaced 'â€"' or whatever with '—'.
// But in some places the em dash was converted directly to `" ` because of quote characters getting mixed.
// "Ascend OS " Native
appSrc = appSrc.replace(/"Ascend OS " Native IndexedDB Engine " Zero LocalStorage " Real Node.js Social Bridge"/g, '"Ascend OS — Native IndexedDB Engine — Zero LocalStorage — Real Node.js Social Bridge"');

// 2609|      }, "â†’")))),
appSrc = appSrc.replace(/"â†’"/g, '"→"');

fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('Fixed syntax error 2');
