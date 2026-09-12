export const users = {}; // key: username, value: user profile object
export const tasks = {}; // key: taskId, value: task object
export const friends = {}; // key: username, value: array of usernames
export const friendRequests = []; // array of { id, from, to, status, timestamp }
export const activityLogs = []; // array of { id, username, type, text, xp, timestamp }
export const sessions = {}; // key: token, value: username

export function initializeMockUser(username) {
  if (!users[username]) {
    users[username] = {
      username,
      name: username,
      avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
      bio: 'Dedicated to deep focus, academic discipline, and daily mastery.',
      institution: 'Institute of Technology',
      degree: 'Computer Science & Engineering',
      academicYear: 'Year 2',
      level: 1,
      totalXp: 0,
      points: 0,
      isEnrolled: true,
      streak: {
        count: 1,
        longest: 1,
        lastDate: new Date().toISOString().split('T')[0]
      },
      disciplines: {
        Intellect: { level: 1, currentXp: 0 },
        Physique: { level: 1, currentXp: 0 },
        Innovation: { level: 1, currentXp: 0 },
        Leadership: { level: 1, currentXp: 0 }
      }
    };
    friends[username] = [];
    
    // Add a default task
    const tId = 'task_' + Date.now();
    tasks[tId] = {
      id: tId,
      user_id: username,
      title: 'Complete System Integration',
      discipline: 'Intellect',
      effort: 'Hard',
      durationMin: 120,
      xpYield: 250,
      pointsYield: 25,
      completed: false,
      createdAt: new Date().toISOString(),
      reminderMinutes: null,
      reminderTime: null,
      reminderFired: false
    };
  }
}
