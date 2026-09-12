const fs = require('fs');

let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

const targetRead = `async function dbRead(key, fallback = null) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(\`\${apiUrl}/api/store/\${key}\`);
    if (!res.ok) return fallback;
    const json = await res.json();
    return json.value !== null ? json.value : fallback;
  } catch (err) {
    console.error(err);
    return fallback;
  }
}`;

const replaceRead = `async function dbRead(key, fallback = null) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('ascend_token');
    const res = await fetch(\`\${apiUrl}/api/store/\${key}\`, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    return json.value !== null ? json.value : fallback;
  } catch (err) {
    console.error(err);
    return fallback;
  }
}`;

const targetWrite = `async function dbWrite(key, value) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(\`\${apiUrl}/api/store/\${key}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}`;

const replaceWrite = `async function dbWrite(key, value) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('ascend_token');
    const res = await fetch(\`\${apiUrl}/api/store/\${key}\`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify({ value })
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}`;

appSrc = appSrc.split(targetRead).join(replaceRead);
appSrc = appSrc.split(targetWrite).join(replaceWrite);

fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('App.jsx dbRead/dbWrite patched');
