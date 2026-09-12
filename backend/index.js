import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { 
  users, tasks, friends, friendRequests, activityLogs, sessions, initializeMockUser 
} from './store.js';

const app = express();
app.use(cors());
app.use(express.json());

// Fake Auth Middleware
function getAuthUser(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && sessions[token]) {
    return sessions[token];
  }
  return req.query.user; // Fallback for some routes that use ?user=
}

// ---------------------------------------------------------
// AUTH / PROFILES
// ---------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  
  initializeMockUser(username);
  
  const token = uuidv4();
  sessions[token] = username;
  
  res.json({ token, user: users[username] });
});

app.get('/api/users/:username/data', (req, res) => {
  const { username } = req.params;
  
  if (!users[username]) {
    initializeMockUser(username);
  }
  
  const userTasks = Object.values(tasks).filter(t => t.user_id === username);
  const userLogs = activityLogs.filter(l => l.username === username);
  
  res.json({
    user: users[username],
    tasks: userTasks,
    activityLog: userLogs,
    streak: users[username]?.streak,
    disciplines: users[username]?.disciplines
  });
});

app.post('/api/users/:username/update', (req, res) => {
  const { username } = req.params;
  if (!users[username]) return res.status(404).json({ error: 'Not found' });
  
  // Merge incoming user data (e.g. totalXp, points, level, streak, disciplines)
  const { user: newUserData, streak, disciplines } = req.body;
  
  if (newUserData) users[username] = { ...users[username], ...newUserData };
  if (streak) users[username].streak = streak;
  if (disciplines) users[username].disciplines = disciplines;
  
  res.json({ success: true, user: users[username] });
});

// ---------------------------------------------------------
// TASKS
// ---------------------------------------------------------
app.post('/api/tasks', (req, res) => {
  const { task } = req.body;
  tasks[task.id] = task;
  res.json({ success: true, task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  delete tasks[id];
  res.json({ success: true });
});

app.put('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const { completedAt } = req.body;
  if (tasks[id]) {
    tasks[id].completed = true;
    tasks[id].completedAt = completedAt;
  }
  res.json({ success: true, task: tasks[id] });
});

// ---------------------------------------------------------
// ACTIVITY LOG
// ---------------------------------------------------------
app.post('/api/activity', (req, res) => {
  const { log } = req.body;
  activityLogs.unshift(log);
  if (activityLogs.length > 50) activityLogs.pop();
  res.json({ success: true });
});

// ---------------------------------------------------------
// FRIENDS / SOCIAL
// ---------------------------------------------------------
app.get('/api/friends/requests', (req, res) => {
  const username = getAuthUser(req);
  const incoming = friendRequests.filter(r => r.to === username && r.status === 'pending');
  const outgoing = friendRequests.filter(r => r.from === username && r.status === 'pending');
  res.json({ incoming, outgoing });
});

app.get('/api/friends', (req, res) => {
  const username = getAuthUser(req);
  const myFriends = friends[username] || [];
  
  // Map to detailed friend objects
  const friendsList = myFriends.map(f => {
    const friendData = users[f] || {};
    return {
      username: f,
      name: friendData.name || f,
      avatar: friendData.avatar || '',
      level: friendData.level || 1,
      isOnline: true,
      currentAction: 'In the system'
    };
  });
  
  res.json({ friends: friendsList });
});

app.post('/api/friends/request', (req, res) => {
  const username = getAuthUser(req);
  const { targetUser } = req.body;
  
  initializeMockUser(targetUser); // auto create target for testing
  
  const reqId = 'req_' + Date.now();
  friendRequests.push({
    id: reqId,
    from: username,
    to: targetUser,
    status: 'pending',
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true, reqId });
});

app.post('/api/friends/cancel', (req, res) => {
  const { reqId } = req.body;
  const idx = friendRequests.findIndex(r => r.id === reqId);
  if (idx !== -1) friendRequests.splice(idx, 1);
  res.json({ success: true });
});

app.post('/api/friends/respond', (req, res) => {
  const username = getAuthUser(req);
  const { reqId, accept } = req.body;
  
  const request = friendRequests.find(r => r.id === reqId);
  if (!request) return res.status(404).json({ error: 'Not found' });
  
  request.status = accept ? 'accepted' : 'declined';
  
  if (accept) {
    if (!friends[request.from]) friends[request.from] = [];
    if (!friends[request.to]) friends[request.to] = [];
    
    if (!friends[request.from].includes(request.to)) friends[request.from].push(request.to);
    if (!friends[request.to].includes(request.from)) friends[request.to].push(request.from);
  }
  
  res.json({ success: true });
});

app.post('/api/friends/kudos', (req, res) => {
  // Silent success
  res.json({ success: true });
});

app.post('/api/friends/simulate-incoming', (req, res) => {
  const username = getAuthUser(req);
  const fakeUser = 'Student_' + Math.floor(Math.random() * 1000);
  initializeMockUser(fakeUser);
  
  friendRequests.push({
    id: 'req_' + Date.now(),
    from: fakeUser,
    to: username,
    status: 'pending',
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true });
});

app.post('/api/friends/invite-sprint', (req, res) => {
  res.json({ success: true });
});

const storeDb = {};

app.get('/api/store/:key', (req, res) => {
  const { key } = req.params;
  // Send back the stored value or null
  res.json({ value: storeDb[key] !== undefined ? storeDb[key] : null });
});

app.post('/api/store/:key', (req, res) => {
  const { key } = req.params;
  storeDb[key] = req.body.value;
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mock Backend running on http://localhost:${PORT}`);
});
