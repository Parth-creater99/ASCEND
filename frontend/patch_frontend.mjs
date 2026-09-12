import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf-8');

const targetRead = `async function dbRead(key, fallback = null) {
  try {
    const db = await getDB();
    if (!db) return fallback;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : fallback);
        req.onerror = () => resolve(fallback);
      } catch (e) {
        resolve(fallback);
      }
    });
  } catch (err) {
    return fallback;
  }
}`;

const replaceRead = `async function dbRead(key, fallback = null) {
  try {
    const res = await fetch(\`/api/store/\${key}\`);
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
    const db = await getDB();
    if (!db) return false;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  } catch (err) {
    return false;
  }
}`;

const replaceWrite = `async function dbWrite(key, value) {
  try {
    const res = await fetch(\`/api/store/\${key}\`, {
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

content = content.replace(targetRead, replaceRead);
content = content.replace(targetWrite, replaceWrite);

fs.writeFileSync('src/App.jsx', content, 'utf-8');
console.log('App.jsx db functions patched successfully');
