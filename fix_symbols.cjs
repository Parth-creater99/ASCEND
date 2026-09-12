const fs = require('fs');

let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

const replacements = {
  'â€¢': '•',
  'â†’': '→',
  'â–²': '▲',
  'â–¾': '▾',
  'â ³': '⏳',
  'dâ€™Ã‰tude': 'd’Étude',
  'â€”': '—',
  "import.meta.env.VITE_API_URL || 'http://localhost:5000'": "import.meta.env.VITE_API_URL || '/api'",
  "import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000')": "import.meta.env.VITE_API_URL || '/api'"
};

for (const [key, val] of Object.entries(replacements)) {
  appSrc = appSrc.split(key).join(val);
}

// Add the logo image into the UI at the top
// Look for `<h1 className="text-xl font-bold tracking-widest text-slate-200">ASCEND</h1>`
// and insert an img tag next to it.
const logoTarget = '<h1 className="text-xl font-bold tracking-widest text-slate-200">ASCEND</h1>';
if (appSrc.includes(logoTarget)) {
  appSrc = appSrc.replace(logoTarget, '<div className="flex items-center gap-3"><img src="/logo.jpg" alt="Ascend Logo" className="w-8 h-8 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" /><h1 className="text-xl font-bold tracking-widest text-slate-200">ASCEND</h1></div>');
}

fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('App.jsx artifacts and localhost fixed');

let indexSrc = fs.readFileSync('index.html', 'utf8');
indexSrc = indexSrc.split('â€”').join('—');
indexSrc = indexSrc.replace('</title>', '</title>\n    <link rel="icon" href="/logo.jpg" />');
fs.writeFileSync('index.html', indexSrc, 'utf8');
console.log('index.html artifacts and favicon fixed');
