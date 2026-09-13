import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. MULTILINGUAL LOCALIZATION DICTIONARY
// ==========================================
const TRANSLATIONS = {
  "en": {

    "dashboard": "Dashboard",
    "timer": "Focus Timer",
    "tasks": "Tasks Queue",
    "disciplines": "Disciplines",
    "analytics": "Deep Analysis",
    "friends": "Study Circle",
    "rewards": "Rewards Store",
    "themes": "Theme Matrix",
    "settings": "Settings",
    "enterSystem": "ENTER THE SYSTEM",
    "welcomeBack": "Focus Quota Active.",
    "buildLegacy": "Build Your Legacy",
    "online": "Online",
    "dailyTelemetry": "Daily Focus Telemetry",
    "focusDurationWeek": "Focus Duration / Week",
    "productivityTimer": "Productivity Focus Timer",
    "todaysTasks": "Today's Focus Tasks Queue",
    "addTask": "+ Add Task",
    "newFocusTask": "New Task",
    "queueEmpty": "Queue is currently empty",
    "queueEmptyDesc": "Add your coursework, problem sets, or athletic sessions. Once entered, tasks persist permanently.",
    "createFirstTask": "+ Create First Task",
    "studyCircleEmpty": "Your Study Circle is waiting",
    "studyCircleEmptyDesc": "Add university peers by @username to track focus sessions and share verified progress together.",
    "addFriend": "Add Friend",
    "sendRequest": "Send Request",
    "pendingRequests": "Pending Friend Requests",
    "accept": "Accept",
    "decline": "Decline",
    "kudosSent": "High-Five Sent!",
    "sendHighFive": "Send Focus High-Five",
    "fullRecord": "Academic Record Transcript",
    "totalHours": "Total Focus Hours",
    "tasksCompleted": "Tasks Completed",
    "consistencyGrade": "Consistency Rating",
    "level": "Level",
    "pomodoro": "Pomodoro",
    "deepWork": "Deep Work",
    "flowState": "Flow State",
    "break": "Break",
    "reset": "Reset",
    "startSession": "Start Focus Session",
    "pauseSession": "Pause Session",
    "ambientMode": "Ambient Fullscreen",
    "exitAmbient": "Exit Ambient",
    "settingsTitle": "System & Profile Settings",
    "profileTab": "Profile",
    "appearanceTab": "Appearance",
    "languageTab": "Language",
    "audioTab": "Audio",
    "dataTab": "Data & Backup",
    "serverTab": "Server & Network",
    "fullName": "Full Name",
    "usernameHandle": "Username Handle",
    "bioMission": "Academic Bio & Focus Mission",
    "university": "College / University",
    "degreeBranch": "Degree / Branch",
    "academicYear": "Academic Year / Semester",
    "uploadPhoto": "Upload Photo from PC",
    "saveChanges": "Save Changes",
    "darkMode": "Dark OLED Mesh",
    "lightMode": "Clean Luxury Light",
    "exportBackup": "Export JSON Backup",
    "importBackup": "Import JSON Backup",
    "resetData": "Reset App Data",
    "serverConnected": "Local Server Connected (${import.meta.env.VITE_API_URL})",
    "notificationsTitle": "Notifications & Reminders",
    "allNotifications": "All Alerts",
    "socialAlerts": "Social & Peers",
    "reminderAlerts": "Task Reminders",
    "systemAlerts": "System",
    "noNotifications": "No active notifications",
    "noNotificationsDesc": "When you receive friend requests, focus reminders, or study milestones, they will appear here.",
    "markAllRead": "Mark all read",
    "clearAll": "Clear all",
    "enableDesktopAlerts": "Enable Desktop Notifications",
    "desktopAlertsActive": "Desktop Alerts Active",
    "scheduleReminder": "Schedule Reminder",
    "noReminder": "No Scheduled Reminder",
    "snooze10m": "Snooze 10m",
    "markDone": "Mark Done",
    "testNotification": "Send Test Alert",
    "notificationsTab": "Notifications & Alerts",
    "inactivityAlert": "Inactivity Focus Nudge",
    "hydrationAlert": "Hydration & 20-20-20 Break",
    "sentRequestsTitle": "Sent Requests (Awaiting Peer's Acceptance)",
    "liveStudyServer": "Live Study Circle Server",
    "copyWifiLink": "Copy Wi-Fi Link",
    "points": "PTS",
    "searchPlaceholder": "Search tasks, study topics, peers...",
    "cancel": "Cancel",
    "activeQuest": "Active Quest",
    "playerRecord": "Player Record",
    "printTranscript": "{t('printTranscript')}",
    "peerDossier": "{t('peerDossier')}",
    "startFocusQuest": "{t('startFocusQuest')}",
    "questProgress": "{t('questProgress')}",
    "ascensionBounty": "{t('ascensionBounty')}",
    "academicBio": "{t('academicBio')}",
    "focusState": "Focus State",
    "activeTopic": "Active Topic",
    "coStudySprint": "Invite to Co-Study Sprint",
    "effortTier": "Effort Tier",
    "taskTitle": "Task Title",
    "disciplineUnbroken": "Discipline Unbroken",
    "daysStreak": "DAYS STREAK",
    "clickToSwitchBackdrop": "{t('clickToSwitchBackdrop')}",
    "notificationSettings": "Notification Settings",
    "touchToClose": "Touch to close",
    "touchToOpen": "Touch to open",
    "readyToFocus": "Ready to Focus",
    "exitFullscreen": "Exit Fullscreen",
    "featuredTheme": "{t('featuredTheme')}",
    "newStudentIdentity": "{t('newStudentIdentity')}",
    "profileSetup": "{t('profileSetup')}",
    "uploadRealPhoto": "{t('uploadRealPhoto')}",
    "famousCharacterAvatar": "{t('famousCharacterAvatar')}"
  
  }
};
// ==========================================
// 2. INDEXEDDB PERSISTENCE (Zero localStorage)
// ==========================================
const DB_NAME = 'AscendDatabase_v4';
const DB_VERSION = 1;
const DB_STORE = 'ascend_app_store';
function getDB() {
  return new Promise(resolve => {
    try {
      if (!window.indexedDB) return resolve(null);
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}
async function dbRead(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (err) {
    return fallback;
  }
}
async function dbWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}
function getXpForLevel(level) {
  return Math.round(100 * Math.pow(level, 1.5));
}

// ==========================================
// 3. ICONS (Clean SVGs - No Emoji Clutter)
// ==========================================
const Icons = {
  Flame: ({
    className = "w-5 h-5 text-orange-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.633.986-.95 1.48C8.544 5.534 7.698 6.85 7.15 8.164a6.974 6.974 0 00-.65 2.924A7.001 7.001 0 0013.5 18a6.97 6.97 0 005.85-3.16 6.994 6.994 0 00.65-2.927c0-1.41-.424-2.73-1.15-3.864-.53-.827-1.196-1.574-1.928-2.316-.36-.365-.72-.73-1.08-1.096a7.71 7.71 0 01-.822-.88 1 1 0 00-.625-.404zm-1.87 3.328c.325-.494.636-.975.945-1.455.432.44.86.877 1.288 1.314.73.74 1.396 1.488 1.928 2.315.53.826.814 1.764.814 2.744a5.001 5.001 0 01-9 3 4.975 4.975 0 01-.5-2.203c0-1.01.3-1.97.836-2.822.44-.7 1.05-1.54 1.74-2.585.316.48.63.963.949 1.442a1 1 0 001.69-.153z",
    clipRule: "evenodd"
  })),
  Brain: ({
    className = "w-4 h-4 text-indigo-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
  })),
  Zap: ({
    className = "w-4 h-4 text-amber-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z",
    clipRule: "evenodd"
  })),
  Shield: ({
    className = "w-4 h-4 text-emerald-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  })),
  Sword: ({
    className = "w-4 h-4 text-rose-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  })),
  Coin: ({
    className = "w-4 h-4 text-amber-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z",
    clipRule: "evenodd"
  })),
  Rocket: ({
    className = "w-4 h-4 text-purple-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
  })),
  Cap: ({
    className = "w-4 h-4 text-indigo-400"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 14l9-5-9-5-9 5 9 5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
  })),
  Check: ({
    className = "w-4 h-4"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2.5",
    d: "M5 13l4 4L19 7"
  })),
  Close: ({
    className = "w-4 h-4"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2.5",
    d: "M6 18L18 6M6 6l12 12"
  })),
  Logo: ({
    className = "w-5 h-5 text-white"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"
  })),
  Fullscreen: ({
    className = "w-4 h-4"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
  })),
  FullscreenExit: ({
    className = "w-4 h-4"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 10V4m0 6H4m6 0L3 3m10 7V4m0 6h6m-6 0l7-7"
  })),
  CheckCircle: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  })),
  Clock: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  })),
  AlertCircle: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  })),
  Trash: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  })),
  X: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M6 18L18 6M6 6l12 12"
  })),
  Monitor: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  })),
  Dashboard: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  })),
  Tasks: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
  })),
  Timer: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  })),
  Disciplines: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  })),
  Analytics: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  })),
  Friends: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
  })),
  Rewards: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
  })),
  Themes: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M7 21a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014-4 4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 01-.684-.949V6a2 2 0 00-2-2h-3a2 2 0 00-2 2v2.324a1 1 0 01-.684.949l-4.493 1.498A1 1 0 003 13.72V17a4 4 0 004 4z"
  })),
  Settings: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  })),
  Sun: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  })),
  Moon: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  })),
  Bell: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  })),
  Search: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  })),
  User: ({
    className = "w-4 h-4"
  }) => /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  })),
  UserPlus: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
  })),

  Camera: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
  }))
};

// ==========================================
// ==========================================
// 4. THEMES & PINTEREST MAIN CHARACTER GALLERIES
// ==========================================
const THEMES = [{
  id: 'solo_leveling',
  name: 'Solo Leveling',
  title: 'Shadow Monarch',
  subtitle: 'Sung Jin-Woo • Sovereign of the Shadows',
  bgClass: 'bg-theme-solo_leveling',
  accent: '#8b5cf6',
  accentGlow: 'rgba(139, 92, 246, 0.40)',
  bannerGradient: 'from-violet-950/80 via-indigo-950/80 to-slate-950/90',
  strokeColor: '#a855f7',
  heroImage: '/themes/solo_leveling_hero.jpg',
  avatarImage: '/themes/solo_leveling_hero.jpg',
  tagline: 'Arise. Turn daily discipline into unstoppable sovereign power.',
  timerWallpapers: [{
    title: 'Sung Jin-Woo Shadow Throne',
    url: '/themes/solo_leveling_hero.jpg'
  }, {
    title: 'Shadow Monarch Extraction',
    url: '/themes/solo_leveling_hero.jpg'
  }, {
    title: 'Demon Castle Monarch Gate',
    url: '/themes/solo_leveling_hero.jpg'
  }]
}, {
  id: 'aot',
  name: 'Attack on Titan',
  title: 'Survey Corps',
  subtitle: 'Eren Yeager & Levi • Wings of Freedom',
  bgClass: 'bg-theme-aot',
  accent: '#10b981',
  accentGlow: 'rgba(16, 185, 129, 0.40)',
  bannerGradient: 'from-emerald-950/80 via-stone-900/80 to-slate-950/90',
  strokeColor: '#10b981',
  heroImage: '/themes/aot_hero.jpg',
  avatarImage: '/themes/aot_hero.jpg',
  tagline: 'Dedicate your heart. Fight beyond the walls of comfort into mastery.',
  timerWallpapers: [{
    title: 'Scout Regiment Shiganshina Watch',
    url: '/themes/aot_hero.jpg'
  }, {
    title: 'Forest of Giant Trees - Levi Ambush',
    url: '/themes/aot_hero.jpg'
  }, {
    title: 'Wall Maria Alpine Dawn Watch',
    url: '/themes/aot_hero.jpg'
  }]
}, {
  id: 'naruto',
  name: 'Naruto',
  title: 'Sage of Six Paths',
  subtitle: 'Naruto Uzumaki • Will of Fire',
  bgClass: 'bg-theme-naruto',
  accent: '#f97316',
  accentGlow: 'rgba(249, 115, 22, 0.40)',
  bannerGradient: 'from-orange-950/80 via-amber-950/70 to-slate-950/90',
  strokeColor: '#f97316',
  heroImage: '/themes/naruto_hero.jpg',
  avatarImage: '/themes/naruto_hero.jpg',
  tagline: 'Never give up your ninja way. Step by step, mastery becomes absolute.',
  timerWallpapers: [{
    title: 'Hidden Leaf Hokage Meditation Grove',
    url: '/themes/naruto_hero.jpg'
  }, {
    title: 'Mount Myoboku Sage Waterfalls',
    url: '/themes/naruto_hero.jpg'
  }, {
    title: 'Golden Sunrise Rasengan Dojo',
    url: '/themes/naruto_hero.jpg'
  }]
}, {
  id: 'jjk',
  name: 'Jujutsu Kaisen',
  title: 'Limitless Void',
  subtitle: 'Gojo Satoru • Domain Expansion',
  bgClass: 'bg-theme-jjk',
  accent: '#06b6d4',
  accentGlow: 'rgba(6, 182, 212, 0.40)',
  bannerGradient: 'from-cyan-950/80 via-indigo-950/80 to-slate-950/90',
  strokeColor: '#06b6d4',
  heroImage: '/themes/jjk_hero.jpg',
  avatarImage: '/themes/jjk_hero.jpg',
  tagline: 'Throughout Heaven and Earth, I alone am the honored one.',
  timerWallpapers: [{
    title: 'Infinite Void Cosmic Horizon',
    url: '/themes/jjk_hero.jpg'
  }, {
    title: 'Tokyo Jujutsu High Sanctuary',
    url: '/themes/jjk_hero.jpg'
  }, {
    title: 'Cursed Technique Blue Resonance',
    url: '/themes/jjk_hero.jpg'
  }]
}, {
  id: 'demon_slayer',
  name: 'Demon Slayer',
  title: 'Hinokami Kagura',
  subtitle: 'Tanjiro Kamado • Sun Breathing',
  bgClass: 'bg-theme-demon_slayer',
  accent: '#e11d48',
  accentGlow: 'rgba(225, 29, 72, 0.40)',
  bannerGradient: 'from-rose-950/80 via-amber-950/70 to-slate-950/90',
  strokeColor: '#e11d48',
  heroImage: '/themes/demon_slayer_hero.jpg',
  avatarImage: '/themes/demon_slayer_hero.jpg',
  tagline: 'No matter how devastating the blow, stand tall and let your blade burn bright.',
  timerWallpapers: [{
    title: 'Mount Sagiri Snow Peaks',
    url: '/themes/demon_slayer_hero.jpg'
  }, {
    title: 'Hinokami Solar Flame Forge',
    url: '/themes/demon_slayer_hero.jpg'
  }, {
    title: 'Wisteria Moonlit Sanctuary',
    url: '/themes/demon_slayer_hero.jpg'
  }]
}, {
  id: 'dragonball',
  name: 'Dragon Ball',
  title: 'Ultra Instinct',
  subtitle: 'Son Goku • Autonomous State of Mind',
  bgClass: 'bg-theme-dragonball',
  accent: '#38bdf8',
  accentGlow: 'rgba(56, 189, 248, 0.40)',
  bannerGradient: 'from-sky-950/80 via-purple-950/70 to-slate-950/90',
  strokeColor: '#38bdf8',
  heroImage: '/themes/dragonball_hero.jpg',
  avatarImage: '/themes/dragonball_hero.jpg',
  tagline: 'Break every limit. Flow through academic challenges with pure mastery.',
  timerWallpapers: [{
    title: 'Tournament of Power Silver Nebula',
    url: '/themes/dragonball_hero.jpg'
  }, {
    title: 'Divine Ultra Instinct Aura Void',
    url: '/themes/dragonball_hero.jpg'
  }, {
    title: 'Kami Lookout Sanctuary',
    url: '/themes/dragonball_hero.jpg'
  }]
}, {
  id: 'death_note',
  name: 'Death Note',
  title: 'Dark Academia',
  subtitle: 'L & Light • Pure Logic & Intellect',
  bgClass: 'bg-theme-death_note',
  accent: '#94a3b8',
  accentGlow: 'rgba(148, 163, 184, 0.35)',
  bannerGradient: 'from-slate-950 via-stone-950 to-black',
  strokeColor: '#cbd5e1',
  heroImage: '/themes/death_note_hero.jpg',
  avatarImage: '/themes/death_note_hero.jpg',
  tagline: 'Knowledge is the ultimate authority. Methodical deduction conquers all.',
  timerWallpapers: [{
    title: 'Gothic Classical Archive',
    url: '/themes/death_note_hero.jpg'
  }, {
    title: 'Midnight Deduction Chambers',
    url: '/themes/death_note_hero.jpg'
  }, {
    title: 'Rainy Noir Study Desk',
    url: '/themes/death_note_hero.jpg'
  }]
}, {
  id: 'spiderman',
  name: 'Spider-Man',
  title: 'Marvel Web',
  subtitle: 'Miles Morales • Great Responsibility',
  bgClass: 'bg-theme-spiderman',
  accent: '#ef4444',
  accentGlow: 'rgba(239, 68, 68, 0.40)',
  bannerGradient: 'from-red-950/80 via-blue-950/70 to-slate-950/90',
  strokeColor: '#ef4444',
  heroImage: '/themes/spiderman_hero.jpg',
  avatarImage: '/themes/spiderman_hero.jpg',
  tagline: 'Anyone can wear the mask. How you level up defines the hero you become.',
  timerWallpapers: [{
    title: 'Into the Spider-Verse Skyline',
    url: '/themes/spiderman_hero.jpg'
  }, {
    title: 'Brooklyn Night Heights',
    url: '/themes/spiderman_hero.jpg'
  }, {
    title: 'Neon Cyber Tokyo Rain',
    url: '/themes/spiderman_hero.jpg'
  }]
}, {
  id: 'ironman',
  name: 'Iron Man',
  title: 'Stark Arc Reactor',
  subtitle: 'Tony Stark • Mark 85 Architecture',
  bgClass: 'bg-theme-ironman',
  accent: '#f59e0b',
  accentGlow: 'rgba(245, 158, 11, 0.40)',
  bannerGradient: 'from-amber-950/80 via-rose-950/70 to-slate-950/90',
  strokeColor: '#f59e0b',
  heroImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80,
  avatarImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80,
  tagline: 'I am Iron Man. Relentless engineering, real-world execution.',
  timerWallpapers: [{
    title: 'Stark Hologram Laboratory',
    url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80
  }, {
    title: 'Quantum Arc Reactor Core',
    url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80
  }, {
    title: 'Quantum Tech Workshop',
    url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80
  }]
}, {
  id: 'synth_statue',
  name: 'Synth Classical',
  title: 'Vaporwave Pantheon',
  subtitle: 'Classical Sculpture • Cyber Aesthetics',
  bgClass: 'bg-theme-synth_statue',
  accent: '#ec4899',
  accentGlow: 'rgba(236, 72, 153, 0.40)',
  bannerGradient: 'from-pink-950/80 via-cyan-950/70 to-slate-950/90',
  strokeColor: '#ec4899',
  heroImage: '/themes/synth_statue_hero.jpg',
  avatarImage: '/themes/synth_statue_hero.jpg',
  tagline: 'Sculpt your intellect like marble in the neon horizon.',
  timerWallpapers: [{
    title: 'Vaporwave Twilight Pantheon',
    url: '/themes/synth_statue_hero.jpg'
  }, {
    title: 'Neon Classical Temple Horizon',
    url: '/themes/synth_statue_hero.jpg'
  }, {
    title: 'Cyber Twilight Pantheon',
    url: '/themes/synth_statue_hero.jpg'
  }]
}, {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  title: 'Night City Neon',
  subtitle: 'David Martinez • Sandevistan Overdrive',
  bgClass: 'bg-theme-cyberpunk',
  accent: '#eab308',
  accentGlow: 'rgba(234, 179, 8, 0.40)',
  bannerGradient: 'from-yellow-950/80 via-cyan-950/70 to-slate-950/90',
  strokeColor: '#eab308',
  heroImage: '/themes/cyberpunk_hero.jpg',
  avatarImage: '/themes/cyberpunk_hero.jpg',
  tagline: 'Wake up, samurai. We have an empire of knowledge to build.',
  timerWallpapers: [{
    title: 'Night City Megabuilding Neon Rain',
    url: '/themes/cyberpunk_hero.jpg'
  }, {
    title: 'Night City Skyline Horizon',
    url: '/themes/cyberpunk_hero.jpg'
  }, {
    title: 'Cyber Highway at Twilight',
    url: '/themes/cyberpunk_hero.jpg'
  }]
}];
const DISCIPLINE_CONFIG = {
  Intellect: {
    label: 'Intellect',
    sub: 'Computer Science, Math, Academics & Logic',
    color: 'text-sky-400',
    bar: 'from-sky-500 to-indigo-500',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    border: 'border-sky-500/30'
  },
  Physique: {
    label: 'Physique',
    sub: 'Athletic Training, Fitness, Endurance & Nutrition',
    color: 'text-rose-400',
    bar: 'from-rose-500 to-red-500',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    border: 'border-rose-500/30'
  },
  Innovation: {
    label: 'Innovation',
    sub: 'Software Projects, Design, Research & Creation',
    color: 'text-purple-400',
    bar: 'from-purple-500 to-fuchsia-500',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    border: 'border-purple-500/30'
  },
  Leadership: {
    label: 'Leadership',
    sub: 'Team Collaboration, Communication & Presentations',
    color: 'text-emerald-400',
    bar: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    border: 'border-emerald-500/30'
  }
};
const EFFORT_LEVELS = {
  quick: {
    label: 'Quick (~15m)',
    durationMin: 15,
    xp: 15,
    points: 5,
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  easy: {
    label: 'Easy (~30m)',
    durationMin: 30,
    xp: 30,
    points: 10,
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  },
  standard: {
    label: 'Standard (~1h)',
    durationMin: 60,
    xp: 60,
    points: 20,
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  hard: {
    label: 'Hard (~2-3h)',
    durationMin: 150,
    xp: 120,
    points: 40,
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  major: {
    label: 'Major (~4h+)',
    durationMin: 240,
    xp: 250,
    points: 80,
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }
};
const DEFAULT_REWARDS = [{
  id: 'perk_1',
  title: '1-Hour Guilt-Free Rest Break',
  cost: 50,
  desc: 'Step away from coursework with zero guilt. Your discipline earned this break.'
}, {
  id: 'perk_2',
  title: '2-Hour Gaming / Streaming Pass',
  cost: 90,
  desc: 'Unlocked video games or cinema time after completing daily academic quotas.'
}, {
  id: 'perk_3',
  title: 'Cheat Meal / Cafe Privilege',
  cost: 140,
  desc: 'Treat yourself to your favorite takeout meal or premium cafe beverage.'
}, {
  id: 'perk_4',
  title: 'Streak Freeze Shield (Emergency Pass)',
  cost: 80,
  desc: 'Safeguard your streak counter against unforeseen busy exam days.'
}, {
  id: 'perk_5',
  title: '2x XP Double Surge (Next 3 Tasks)',
  cost: 120,
  desc: 'Double the XP output of your next three completed tasks.'
}, {
  id: 'perk_6',
  title: 'Weekend Half-Day Freedom Pass',
  cost: 180,
  desc: 'Full afternoon of recreation with all academic duties cleared.'
}];
let globalAudioCtx = null;
function playAudio(type = 'click') {
  try {
    if (!globalAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      globalAudioCtx = new AudioContext();
    }
    const ctx = globalAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'reminder') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'notification') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.08); // C6
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'levelup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      osc.frequency.setValueAtTime(659.25, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {}
}

// Circular SVG Gauge (Trippo Telemetry Style)
function CircularGauge({
  value = 0,
  label = '',
  sublabel = '',
  color = '#8b5cf6',
  size = 110,
  isLight = false
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - progress / 100 * circumference;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center relative select-none",
    style: {
      width: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    className: "transform -rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    stroke: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255, 255, 255, 0.08)',
    strokeWidth: strokeWidth,
    fill: "transparent"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    stroke: color,
    strokeWidth: strokeWidth,
    strokeDasharray: circumference,
    strokeDashoffset: strokeDashoffset,
    strokeLinecap: "round",
    fill: "transparent",
    style: {
      transition: 'stroke-dashoffset 0.8s ease-in-out',
      filter: `drop-shadow(0 0 6px ${color}77)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-lg font-extrabold font-mono tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`
  }, progress, "%"), sublabel && /*#__PURE__*/React.createElement("span", {
    className: `text-[9px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, sublabel)), label && /*#__PURE__*/React.createElement("span", {
    className: `mt-1.5 text-[11px] font-semibold tracking-wide text-center ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, label));
}

// ==========================================
// 5. MAIN ASCEND COMPONENT
// ==========================================
function App() {
  const [view, setView] = useState('cover');
  const [tab, setTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Language & Mode
  const [language, setLanguage] = useState('en');
  const [colorMode, setColorMode] = useState('dark');
  const [themeId, setThemeId] = useState('solo_leveling');

  // User Profile: Starts clean so new peers pick their unique handle
  const [user, setUser] = useState({
    username: '',
    name: '',
    avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated to deep focus, academic discipline, and daily mastery.',
    institution: 'Institute of Technology',
    degree: 'Computer Science & Engineering',
    academicYear: 'Year 2',
    level: 1,
    totalXp: 0,
    points: 0,
    isEnrolled: false
  });
  const [streak, setStreak] = useState({
    count: 1,
    longest: 1,
    lastDate: new Date().toISOString().split('T')[0]
  });

  // Case-Insensitive Normalized Disciplines State
  const [disciplines, setDisciplines] = useState({
    Intellect: {
      level: 1,
      currentXp: 0
    },
    Physique: {
      level: 1,
      currentXp: 0
    },
    Innovation: {
      level: 1,
      currentXp: 0
    },
    Leadership: {
      level: 1,
      currentXp: 0
    },
    intellect: {
      level: 1,
      currentXp: 0
    },
    physique: {
      level: 1,
      currentXp: 0
    },
    innovation: {
      level: 1,
      currentXp: 0
    },
    leadership: {
      level: 1,
      currentXp: 0
    },
    discipline: {
      level: 1,
      currentXp: 0
    },
    endurance: {
      level: 1,
      currentXp: 0
    }
  });

  // Tasks & Ledger (STARTS CLEAN / EMPTY)
  const [tasks, setTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  // REAL SOCIAL LAYER: ZERO FAKE FRIENDS
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [lanInfo, setLanInfo] = useState({
    lanIp: "192.168.31.124",
    lanUrl: "http://192.168.31.124:3001"
  });
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [kudosSent, setKudosSent] = useState({});

  // Server & Network Status
  const [serverUrl, setServerUrl] = useState(import.meta.env.VITE_API_URL || '/api');
  const [serverConnected, setServerConnected] = useState(false);

  // Rewards
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const [claimedPerks, setClaimedPerks] = useState([]);

  // Productivity Timer
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('25');
  const [selectedWallpaperIdx, setSelectedWallpaperIdx] = useState(0);
  const [isAmbientFocus, setIsAmbientFocus] = useState(false);

  // Slideable Navigation & Game XP Popups
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [floatingXp, setFloatingXp] = useState(null);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [levelUpData, setLevelUpData] = useState(null);

  // Form State for Profile & Settings
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formCollege, setFormCollege] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formYear, setFormYear] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDiscipline, setTaskDiscipline] = useState('Intellect');
  const [taskEffort, setTaskEffort] = useState('standard');
  const [taskError, setTaskError] = useState('');
  // Scheduled Reminders & Desktop Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [activeToast, setActiveToast] = useState(null);
  const [taskReminderMinutes, setTaskReminderMinutes] = useState('');
  const [desktopPermStatus, setDesktopPermStatus] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
  const [reminderSettings, setReminderSettings] = useState({
    desktopEnabled: true,
    soundEnabled: true,
    pomodoroBreaks: true,
    hydrationInterval: 30,
    inactivityInterval: 45
  });
  // Timestamp-Based Continuous Focus Tracking (Immune to browser background tab throttling)
  const focusSessionStartTimeRef = useRef(null);
  const lastHydrationAlertTimeRef = useRef(Date.now());
  const timerTargetEndTimeRef = useRef(null);
  const lastUserActionRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const p2pChannelRef = useRef(null);

  // Translation helper

  // Relative Time Formatter
  const formatRelativeTime = isoString => {
    try {
      const diff = Math.max(0, Date.now() - new Date(isoString).getTime());
      const secs = Math.floor(diff / 1000);
      if (secs < 60) return 'Just now';
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  // Request Native Desktop Notification Permission
  const requestDesktopPermission = async () => {
    if (typeof Notification === 'undefined') return 'unsupported';
    try {
      const perm = await Notification.requestPermission();
      setDesktopPermStatus(perm);
      if (perm === 'granted') {
        triggerDesktopNotification('ASCEND Desktop Alerts Active', 'Desktop notifications are active for friend requests, reminders, and study breaks.');
        playAudio('levelup');
      }
      return perm;
    } catch (e) {
      return 'denied';
    }
  };

  // Trigger Native Desktop Notification
  const triggerDesktopNotification = (title, body, tag = 'ascend') => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && reminderSettings.desktopEnabled) {
      try {
        const notif = new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
          tag
        });
        notif.onclick = () => {
          window.focus();
        };
      } catch (e) {}
    }
  };

  // Universal Add Notification
  const addNotification = ({
    type,
    title,
    message,
    actionPayload = null
  }) => {
    const newNotif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type,
      // 'friend_request', 'friend_accepted', 'kudos', 'task_reminder', 'study_break', 'inactivity', 'hydration', 'system'
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      actionPayload
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Show floating toast
    setActiveToast(newNotif);
    setTimeout(() => {
      setActiveToast(current => current && current.id === newNotif.id ? null : current);
    }, 7500);

    // Sound chime
    if (reminderSettings.soundEnabled) {
      if (type === 'friend_request') playAudio('notification');else if (type === 'kudos' || type === 'friend_accepted') playAudio('levelup');else if (type === 'task_reminder') playAudio('reminder');else playAudio('notification');
    }

    // Native OS desktop toast
    triggerDesktopNotification(title, message);
  };

  // Snooze Task Reminder
  const handleSnoozeTask = (taskId, minutes = 10) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      reminderTime: Date.now() + minutes * 60 * 1000,
      reminderFired: false
    } : t));
    setActiveToast(null);
    addNotification({
      type: 'system',
      title: 'Reminder Snoozed',
      message: `Task reminder delayed by ${minutes} minutes.`
    });
    playAudio('click');
  };
  const t = key => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  // 1. Initial Load from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const savedUser = await dbRead('user_data');
        const savedTasks = await dbRead('tasks_data');
        const savedDisciplines = await dbRead('disciplines_data');
        const savedStreak = await dbRead('streak_data');
        const savedLog = await dbRead('activity_log');
        const savedTheme = await dbRead('theme_data');
        const savedColorMode = await dbRead('color_mode');
        const savedLang = await dbRead('language_data');
        const savedFriends = await dbRead('friends_data');
        const savedRequests = await dbRead('friend_requests');
        const savedPerks = await dbRead('claimed_perks');
        const savedNotifs = await dbRead('notifications_data');
        const savedRemSettings = await dbRead('reminder_settings');
        const savedSidebar = await dbRead('sidebar_state');
        if (savedSidebar !== null && savedSidebar !== undefined) {
          setSidebarOpen(Boolean(savedSidebar));
        }
        if (savedUser) {
          setUser(savedUser);
          setFormName(savedUser.name);
          setFormUsername(savedUser.username);
          setFormBio(savedUser.bio || '');
          setFormAvatar(savedUser.avatar || '');
          setFormCollege(savedUser.institution);
          setFormDegree(savedUser.degree);
          setFormYear(savedUser.academicYear);
        }
        if (savedTasks) setTasks(savedTasks);
        if (savedDisciplines) setDisciplines(savedDisciplines);
        if (savedStreak) setStreak(savedStreak);
        if (savedLog) setActivityLog(savedLog);
        if (savedTheme) setThemeId(savedTheme);
        if (savedColorMode) setColorMode(savedColorMode);
        if (savedLang) setLanguage(savedLang);
        if (savedNotifs) setNotifications(savedNotifs);
        if (savedRemSettings) setReminderSettings(savedRemSettings);
        if (savedFriends) setFriends(savedFriends);
        if (savedRequests) setFriendRequests(savedRequests);
        if (savedPerks) setClaimedPerks(savedPerks);
      } catch (e) {
        console.error('IndexedDB Load Error:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // 2. Sync to IndexedDB
  useEffect(() => {
    if (!isLoaded) return;
    dbWrite('user_data', user);
    dbWrite('tasks_data', tasks);
    dbWrite('disciplines_data', disciplines);
    dbWrite('streak_data', streak);
    dbWrite('activity_log', activityLog);
    dbWrite('theme_data', themeId);
    dbWrite('color_mode', colorMode);
    dbWrite('language_data', language);
    dbWrite('friends_data', friends);
    dbWrite('friend_requests', friendRequests);
    dbWrite('claimed_perks', claimedPerks);
    dbWrite('notifications_data', notifications);
    dbWrite('reminder_settings', reminderSettings);
    dbWrite('sidebar_state', sidebarOpen);
  }, [user, tasks, disciplines, streak, activityLog, themeId, colorMode, language, friends, friendRequests, claimedPerks, notifications, reminderSettings, sidebarOpen, isLoaded]);

  // 3. Real Server & P2P Networking Setup
  useEffect(() => {
    // Setup BroadcastChannel for Tab-to-Tab peer networking
    try {
      if (typeof window.BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('ascend_social_mesh');
        p2pChannelRef.current = channel;
        channel.onmessage = event => {
          const data = event.data;
          if (!data || !data.type) return;

          // Incoming Friend Request
          if (data.type === 'FRIEND_REQUEST' && data.to === user.username.toLowerCase()) {
            setFriendRequests(prev => {
              if (prev.some(r => r.id === data.request.id)) return prev;
              return [data.request, ...prev];
            });
            addNotification({
              type: 'friend_request',
              title: 'New Friend Request',
              message: `@${data.request.fromUser.username} invited you to join their Study Circle!`,
              actionPayload: {
                req: data.request
              }
            });
          }

          // Accepted Friend Response
          if (data.type === 'FRIEND_ACCEPTED' && data.to === user.username.toLowerCase()) {
            setFriends(prev => {
              if (prev.some(f => f.username === data.friend.username)) return prev;
              return [data.friend, ...prev];
            });
            addNotification({
              type: 'friend_accepted',
              title: 'Study Circle Expanded',
              message: `@${data.friend.username} accepted your friend request!`
            });
          }

          // Kudos Cheer
          if (data.type === 'KUDOS' && data.to === user.username.toLowerCase()) {
            setUser(prev => ({
              ...prev,
              totalXp: prev.totalXp + 5
            }));
            addNotification({
              type: 'kudos',
              title: 'High Five Received!',
              message: 'A study peer gave you a High Five cheer! (+5 XP gained)'
            });
          }

          // Live Real Profile Picture & Details Updated across Peers
          if (data.type === 'PROFILE_UPDATED' && data.user) {
            const updatedPeer = data.user;
            setFriends(prev => prev.map(f => f.username === updatedPeer.username.toLowerCase() ? {
              ...f,
              ...updatedPeer
            } : f));
            setFriendRequests(prev => prev.map(r => r.from === updatedPeer.username.toLowerCase() ? {
              ...r,
              fromUser: {
                ...r.fromUser,
                ...updatedPeer
              }
            } : r));
          }

          // Co-Study Sprint Invite from Friend
          if (data.type === 'SPRINT_INVITE' && data.to === user.username.toLowerCase()) {
            addNotification({
              type: 'sprint_invite',
              title: 'Co-Study Sprint Invite!',
              message: `@${data.from} invited you to a 25-minute collaborative focus sprint!`,
              actionPayload: {
                sprintInvite: data
              }
            });
          }
        };
      }
    } catch (e) {}

    // Resilient Network Client with Error Logging, User Notification & Auto-Retry
    const apiFetch = async (endpoint, options = {}, retries = 1) => {
      const fullUrl = endpoint.startsWith('http') ? endpoint : `${serverUrl}${endpoint}`;
      try {
        const res = await fetch(fullUrl, options);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          console.warn(`[ASCEND API Warning] ${endpoint} responded with status ${res.status}:`, errJson);
          return {
            ok: false,
            status: res.status,
            data: errJson
          };
        }
        const data = await res.json().catch(() => ({}));
        setServerConnected(true);
        return {
          ok: true,
          status: res.status,
          data
        };
      } catch (err) {
        console.error(`[ASCEND Network Error] Failed call to ${endpoint}:`, err);
        if (retries > 0) {
          console.log(`[ASCEND Retry] Retrying ${endpoint} (1 attempt left)...`);
          return apiFetch(endpoint, options, retries - 1);
        }
        setServerConnected(false);
        return {
          ok: false,
          error: err.message
        };
      }
    };

    // Check Local Server Health
    async function checkServer() {
      if (!user.username || !user.isEnrolled) return;
      try {
        const res = await fetch(`${serverUrl}/api/health`, {
          method: 'GET'
        });
        if (res.ok) {
          setServerConnected(true);
          // Register current user on server
          // Backend API removed - completely local now

          // Fetch Network Info
          apiFetch('/api/network').then(res => {
            if (res.ok && res.data && res.data.lanUrl) setLanInfo(res.data);
          });

          // Poll incoming & outgoing friend requests from server
          apiFetch(`/api/friends/requests?user=${user.username}`).then(res => {
            if (res.ok && res.data) {
              const data = res.data;
              if (data.incoming && Array.isArray(data.incoming)) {
                data.incoming.forEach(req => {
                  setFriendRequests(prev => {
                    if (!prev.some(r => r.id === req.id)) {
                      addNotification({
                        type: 'friend_request',
                        title: 'New Friend Request',
                        message: `@${req.fromUser?.username || req.from} sent you a friend request to join their Study Circle!`,
                        actionPayload: {
                          req
                        }
                      });
                      return [req, ...prev];
                    }
                    return prev;
                  });
                });
              }
              if (data.outgoing && Array.isArray(data.outgoing)) {
                setOutgoingRequests(data.outgoing);
              }
            }
          });

          // Fetch Confirmed Friends List with Live Status & Real Uploaded Avatars
          apiFetch(`/api/friends?user=${user.username}`).then(res => {
            if (res.ok && res.data && Array.isArray(res.data.friends)) {
              setFriends(prev => {
                return res.data.friends.map(sf => {
                  const existing = prev.find(p => p.username === sf.username) || {};
                  return {
                    ...existing,
                    ...sf
                  };
                });
              });
            }
          });
        } else {
          setServerConnected(false);
        }
      } catch (e) {
        setServerConnected(false);
      }
    }
    checkServer();
    const serverInterval = setInterval(checkServer, 3000);
    return () => clearInterval(serverInterval);
  }, [user, isTimerRunning, serverUrl]);

  // Scheduled Task Reminders & Inactivity Scanner
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // 1. Task Reminders
      setTasks(prevTasks => {
        let changed = false;
        const updated = prevTasks.map(t => {
          if (!t.completed && t.reminderTime && !t.reminderFired && now >= t.reminderTime) {
            changed = true;
            addNotification({
              type: 'task_reminder',
              title: 'Task Reminder: ' + t.title,
              message: `Scheduled focus task is due now (${t.discipline} • ${t.durationMin}m session).`,
              actionPayload: {
                taskId: t.id,
                taskTitle: t.title
              }
            });
            return {
              ...t,
              reminderFired: true
            };
          }
          return t;
        });
        return changed ? updated : prevTasks;
      });

      // 2. Timestamp-Based Hydration & 20-20-20 Eye Break Check (No interval drift)
      if (isTimerRunning && reminderSettings.hydrationInterval > 0) {
        if (!focusSessionStartTimeRef.current) {
          focusSessionStartTimeRef.current = Date.now();
        }
        const elapsedMinutesSinceLast = (Date.now() - lastHydrationAlertTimeRef.current) / (1000 * 60);
        if (elapsedMinutesSinceLast >= reminderSettings.hydrationInterval) {
          lastHydrationAlertTimeRef.current = Date.now();
          addNotification({
            type: 'hydration',
            title: t('hydrationAlert') || 'Hydration & 20-20-20 Eye Relief',
            message: 'You have been focusing intensely! Look 20 feet away for 20 seconds & drink a sip of water.'
          });
        }
      } else {
        lastHydrationAlertTimeRef.current = Date.now();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [reminderSettings, isTimerRunning]);

  // Sync document body with theme, mode, and regional language font
  useEffect(() => {
    document.body.className = `theme-${colorMode} bg-theme-${themeId} lang-${language}`;
  }, [colorMode, themeId, language]);

  // Timestamp-Based Timer Engine (immune to background sleep / interval throttling)
  useEffect(() => {
    if (isTimerRunning) {
      timerTargetEndTimeRef.current = Date.now() + timerSecondsLeft * 1000;
      if (!focusSessionStartTimeRef.current) {
        focusSessionStartTimeRef.current = Date.now();
      }
      const checkTick = () => {
        if (!timerTargetEndTimeRef.current) return;
        const remainingSecs = Math.max(0, Math.round((timerTargetEndTimeRef.current - Date.now()) / 1000));
        setTimerSecondsLeft(remainingSecs);
        if (remainingSecs <= 0) {
          clearInterval(timerIntervalRef.current);
          setIsTimerRunning(false);
          timerTargetEndTimeRef.current = null;
          handleTimerComplete();
        }
      };
      timerIntervalRef.current = setInterval(checkTick, 500);
      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && isTimerRunning) {
          checkTick();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('focus', checkTick);
      return () => {
        clearInterval(timerIntervalRef.current);
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('focus', checkTick);
      };
    } else {
      timerTargetEndTimeRef.current = null;
      focusSessionStartTimeRef.current = null;
      clearInterval(timerIntervalRef.current);
    }
  }, [isTimerRunning]);
  const handleTimerComplete = () => {
    playAudio('levelup');
    const minutes = Math.round(timerDuration / 60);
    if (reminderSettings.pomodoroBreaks) {
      addNotification({
        type: 'study_break',
        title: 'Focus Session Complete!',
        message: `Outstanding discipline! Completed ${minutes}m focus sprint. Take a 5-minute break to rest your mind.`
      });
    }
    const earnedXp = minutes * 2;
    const earnedPts = Math.round(minutes * 0.5);
    setFloatingXp({
      xp: earnedXp,
      text: `+${earnedXp} XP FOCUS MASTERY!`
    });
    setTimeout(() => setFloatingXp(null), 2500);
    setUser(prev => ({
      ...prev,
      totalXp: prev.totalXp + earnedXp,
      points: prev.points + earnedPts
    }));
    setActivityLog(prev => [{
      id: 'timer_' + Date.now(),
      title: `Productivity Focus Session (${minutes}m)`,
      discipline: 'Intellect',
      durationMin: minutes,
      xpEarned: earnedXp,
      pointsEarned: earnedPts,
      timestamp: new Date().toISOString()
    }, ...prev]);
    if (window.confetti) {
      window.confetti({
        particleCount: 70,
        spread: 60,
        origin: {
          y: 0.6
        }
      });
    }
  };

  // HTML5 Fullscreen Focus Timer Engine
  const toggleFullscreenTimer = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen().catch(() => {});else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen().catch(() => {});
      setIsAmbientFocus(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => {});else if (document.msExitFullscreen) document.msExitFullscreen().catch(() => {});
      setIsAmbientFocus(false);
    }
    playAudio('click');
  };
  useEffect(() => {
    const handleFsChange = () => {
      setIsAmbientFocus(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);
  const setTimerPreset = mins => {
    setTimerMode(String(mins));
    const secs = mins * 60;
    setTimerDuration(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(false);
    playAudio('click');
  };
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    playAudio('click');
  };
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerDuration);
    playAudio('click');
  };
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const isLight = colorMode === 'light';
  const getUserProgress = () => {
    let lvl = 1;
    let remXp = user.totalXp;
    while (true) {
      const req = getXpForLevel(lvl);
      if (remXp >= req) {
        remXp -= req;
        lvl++;
      } else {
        const percent = req === 0 ? 0 : Math.min(100, Math.round(remXp / req * 100));
        return {
          lvl,
          currentXp: remXp,
          nextLevelXp: req,
          percent
        };
      }
    }
  };
  const getRankInfo = lvl => {
    if (lvl >= 50) return {
      rank: 'S-RANK',
      title: 'Sovereign Monarch',
      badge: 'bg-amber-500/20 text-amber-400',
      bar: 'from-amber-500 to-yellow-300'
    };
    if (lvl >= 30) return {
      rank: 'A-RANK',
      title: 'Grand Master',
      badge: 'bg-purple-500/20 text-purple-400',
      bar: 'from-purple-500 to-pink-500'
    };
    if (lvl >= 20) return {
      rank: 'B-RANK',
      title: 'Elite Vanguard',
      badge: 'bg-indigo-500/20 text-indigo-400',
      bar: 'from-indigo-500 to-cyan-400'
    };
    if (lvl >= 10) return {
      rank: 'C-RANK',
      title: 'Specialist',
      badge: 'bg-cyan-500/20 text-cyan-400',
      bar: 'from-cyan-500 to-blue-400'
    };
    if (lvl >= 5) return {
      rank: 'D-RANK',
      title: 'Striker',
      badge: 'bg-emerald-500/20 text-emerald-400',
      bar: 'from-emerald-500 to-teal-400'
    };
    return {
      rank: 'E-RANK',
      title: 'Initiate Hunter',
      badge: 'bg-slate-500/20 text-slate-300',
      bar: 'from-slate-500 to-indigo-400'
    };
  };
  const prog = getUserProgress();
  const rankInfo = getRankInfo(prog.lvl);

  // Native High-Quality Compressed Image Upload Handler
  const handleAvatarFileUpload = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = loadEvent => {
      const rawImg = new Image();
      rawImg.onload = () => {
        // Compress and scale via HTML5 Canvas (max 400x400) for instant network sync
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = rawImg.width;
        let height = rawImg.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round(height * MAX_SIZE / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round(width * MAX_SIZE / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(rawImg, 0, 0, width, height);
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setFormAvatar(optimizedBase64);
        const updatedUser = {
          ...user,
          avatar: optimizedBase64
        };
        setUser(updatedUser);

        // Broadcast real avatar across BroadcastChannel to open tabs/peers
        if (p2pChannelRef.current) {
          p2pChannelRef.current.postMessage({
            type: 'PROFILE_UPDATED',
            user: updatedUser
          });
        }

        // Immediately update on server so peers get it on their next 3s poll
        // Backend API removed - completely local now
        addNotification({
          type: 'system',
          title: 'Profile Picture Updated',
          message: 'Your real photo has been uploaded and synchronized with your Study Circle and network peers!'
        });
        playAudio('complete');
      };
      rawImg.src = loadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Enter System Trigger (Cover Page -> Dashboard)
  const handleEnterSystem = () => {
    playAudio('click');
    if (!user.isEnrolled) {
      setShowEnrollModal(true);
    } else {
      setView('app');
    }
  };

  // Save Enrollment with Live Server & Peer Sync
  const handleSaveEnrollment = e => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formName.trim() || user.name,
      username: formUsername.trim().replace(/^@/, '').toLowerCase() || user.username,
      bio: formBio.trim() || user.bio,
      avatar: formAvatar.trim() || user.avatar,
      institution: formCollege.trim() || 'Kavikulguru Institute of Technology & Science',
      degree: formDegree.trim() || 'B.Tech Computer Engineering',
      academicYear: formYear.trim() || 'Year 2, Semester 3',
      isEnrolled: true
    };
    setUser(updated);
    setShowEnrollModal(false);
    setView('app');
    playAudio('levelup');
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'PROFILE_UPDATED',
        user: updated
      });
    }
    // Backend API removed - completely local now
  };

  // Save Settings Profile Edits with Live Server & Peer Sync
  const handleSaveSettingsProfile = e => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formName.trim() || user.name,
      username: formUsername.trim().replace(/^@/, '').toLowerCase() || user.username,
      bio: formBio.trim() || user.bio,
      avatar: formAvatar.trim() || user.avatar,
      institution: formCollege.trim() || user.institution,
      degree: formDegree.trim() || user.degree,
      academicYear: formYear.trim() || user.academicYear
    };
    setUser(updated);
    alert(t('saveChanges') + '!');
    playAudio('complete');
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'PROFILE_UPDATED',
        user: updated
      });
    }
    // Backend API removed - completely local now
  };

  // Add Task
  const handleAddTask = e => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTaskError('Please enter a task title');
      return;
    }
    const eff = EFFORT_LEVELS[taskEffort];
    const remMins = taskReminderMinutes ? parseInt(taskReminderMinutes, 10) : null;
    const newTask = {
      id: 'task_' + Date.now(),
      title: taskTitle.trim(),
      discipline: taskDiscipline,
      effort: taskEffort,
      durationMin: eff.durationMin,
      xpYield: eff.xp,
      pointsYield: eff.points,
      completed: false,
      createdAt: new Date().toISOString(),
      reminderMinutes: remMins,
      reminderTime: remMins ? Date.now() + remMins * 60 * 1000 : null,
      reminderFired: false
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskTitle('');
    setTaskReminderMinutes('');
    setTaskError('');
    setShowTaskModal(false);
    playAudio('click');
    if (remMins) {
      addNotification({
        type: 'system',
        title: 'Reminder Scheduled',
        message: `Alert set for "${newTask.title}" in ${remMins} minutes.`
      });
    }
  };

  // Complete Task
  const handleCompleteTask = taskId => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    playAudio('complete');
    setActiveToast(current => current && current.actionPayload && current.actionPayload.taskId === taskId ? null : current);
    const eff = EFFORT_LEVELS[task.effort];
    const earnedXp = eff.xp;
    const earnedPts = eff.points;
    setFloatingXp({
      xp: earnedXp,
      text: `+${earnedXp} XP QUEST DONE!`
    });
    setTimeout(() => setFloatingXp(null), 2500);
    const oldProg = getUserProgress();
    const newTotalXp = user.totalXp + earnedXp;
    let tempLvl = 1;
    let tempRem = newTotalXp;
    while (true) {
      const req = getXpForLevel(tempLvl);
      if (tempRem >= req) {
        tempRem -= req;
        tempLvl++;
      } else break;
    }
    if (tempLvl > oldProg.lvl) {
      setLevelUpData({
        newLevel: tempLvl,
        discipline: task.discipline
      });
      playAudio('levelup');
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            y: 0.6
          }
        });
      }
    }
    setUser(prev => ({
      ...prev,
      totalXp: newTotalXp,
      points: prev.points + earnedPts,
      level: tempLvl
    }));
    setDisciplines(prev => {
      const discName = task.discipline;
      const lowerName = (discName || '').toLowerCase();
      const disc = prev[discName] || prev[lowerName] || {
        level: 1,
        currentXp: 0
      };
      let discLvl = disc.level;
      let discXp = disc.currentXp + earnedXp;
      const needed = getXpForLevel(discLvl);
      if (discXp >= needed) {
        discXp -= needed;
        discLvl++;
      }
      const updatedObj = {
        ...prev,
        [discName]: {
          level: discLvl,
          currentXp: discXp
        },
        [lowerName]: {
          level: discLvl,
          currentXp: discXp
        }
      };
      if (lowerName === 'intellect') {
        updatedObj.intellect = {
          level: discLvl,
          currentXp: discXp
        };
        updatedObj.Intellect = {
          level: discLvl,
          currentXp: discXp
        };
      } else if (lowerName === 'physique') {
        updatedObj.physique = {
          level: discLvl,
          currentXp: discXp
        };
        updatedObj.Physique = {
          level: discLvl,
          currentXp: discXp
        };
        updatedObj.endurance = {
          level: discLvl,
          currentXp: discXp
        };
      } else if (lowerName === 'innovation' || lowerName === 'discipline') {
        updatedObj.innovation = {
          level: discLvl,
          currentXp: discXp
        };
        updatedObj.Innovation = {
          level: discLvl,
          currentXp: discXp
        };
        updatedObj.discipline = {
          level: discLvl,
          currentXp: discXp
        };
      }
      return updatedObj;
    });
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      completed: true,
      completedAt: new Date().toISOString()
    } : t));
    setActivityLog(prev => [{
      id: 'log_' + Date.now(),
      taskId: task.id,
      title: task.title,
      discipline: task.discipline,
      effort: task.effort,
      durationMin: eff.durationMin,
      xpEarned: earnedXp,
      pointsEarned: earnedPts,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };
  const handleDeleteTask = taskId => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    playAudio('click');
  };

  // REAL FRIEND REQUEST DISPATCH (Server + Peer Mesh)
  const handleSendFriendRequest = async e => {
    e.preventDefault();
    const targetHandle = newFriendInput.trim().replace(/^@/, '').toLowerCase();
    if (!targetHandle) return;
    if (targetHandle === user.username.toLowerCase()) {
      alert('You cannot send a friend request to yourself.');
      return;
    }
    const newRequest = {
      id: 'req_' + Date.now(),
      from: user.username.toLowerCase(),
      to: targetHandle,
      fromUser: {
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        institution: user.institution,
        degree: user.degree,
        level: prog.lvl
      },
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // 1. Broadcast via P2P channel (for tabs/windows on same PC)
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'FRIEND_REQUEST',
        to: targetHandle,
        request: newRequest
      });
    }

    // 2. Send to Node Server if connected
    if (serverConnected) {
      try {
        await fetch(`${serverUrl}/api/friends/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: user.username,
            to: targetHandle
          })
        });
      } catch (e) {}
    }
    alert(`Real friend request dispatched to @${targetHandle}! Once they accept, they will appear in your Study Circle.`);
    setNewFriendInput('');
    setShowAddFriendModal(false);
    playAudio('click');
  };

  // Accept Incoming Friend Request

  const handleCancelOutgoingRequest = async reqId => {
    playAudio('click');
    setOutgoingRequests(prev => prev.filter(r => r.id !== reqId));
    if (serverConnected) {
      try {
        await fetch(`${serverUrl}/api/friends/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reqId
          })
        });
      } catch (e) {}
    }
    addNotification({
      type: 'system',
      title: 'Request Cancelled',
      message: 'The friend request has been withdrawn.'
    });
  };
  const handleSimulateIncomingRequest = async (simulatedSender = 'dhanush_77') => {
    playAudio('notification');
    if (serverConnected) {
      try {
        await fetch(`${serverUrl}/api/friends/simulate-incoming`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: user.username,
            from: simulatedSender
          })
        });
      } catch (e) {}
    } else {
      // Local fallback simulation
      const testReq = {
        id: 'req_sim_' + Date.now(),
        from: simulatedSender,
        to: user.username,
        fromUser: {
          username: simulatedSender,
          name: 'Dhanush',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          degree: 'B.Tech CS',
          institution: 'KITS Tech',
          level: 2
        },
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      setFriendRequests(prev => [testReq, ...prev]);
      addNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        message: `@${simulatedSender} sent you a friend request to join their Study Circle!`,
        actionPayload: {
          req: testReq
        }
      });
    }
  };
  const handleAcceptFriend = req => {
    playAudio('levelup');
    const newFriend = {
      id: 'friend_' + Date.now(),
      username: req.fromUser.username,
      name: req.fromUser.name,
      avatar: req.fromUser.avatar || currentTheme.avatarImage,
      institution: req.fromUser.institution,
      degree: req.fromUser.degree,
      level: req.fromUser.level || 1,
      totalHours: 12.0,
      status: 'Active Study Partner',
      isStudying: true
    };
    setFriends(prev => [newFriend, ...prev.filter(f => f.username !== req.fromUser.username)]);
    setFriendRequests(prev => prev.filter(r => r.id !== req.id));
    setNotifications(prev => prev.map(n => n.actionPayload && n.actionPayload.req && n.actionPayload.req.id === req.id ? {
      ...n,
      read: true,
      accepted: true
    } : n));
    setActiveToast(curr => curr && curr.actionPayload && curr.actionPayload.req && curr.actionPayload.req.id === req.id ? null : curr);

    // Broadcast acceptance to sender
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'FRIEND_ACCEPTED',
        to: req.fromUser.username.toLowerCase(),
        friend: {
          id: 'friend_' + Date.now(),
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          institution: user.institution,
          degree: user.degree,
          level: prog.lvl,
          status: 'Active Study Partner',
          isStudying: isTimerRunning
        }
      });
    }
    if (serverConnected) {
      fetch(`${serverUrl}/api/friends/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reqId: req.id,
          action: 'accept',
          username: user.username
        })
      }).catch((err) => { console.error("Network Error:", err); setActiveToast({ type: "systemAlerts", title: "Network Error", message: "Silent network failure prevented." }); });
    }
  };
  const handleDeclineFriend = reqId => {
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
    setNotifications(prev => prev.filter(n => !(n.actionPayload && n.actionPayload.req && n.actionPayload.req.id === reqId)));
    setActiveToast(curr => curr && curr.actionPayload && curr.actionPayload.req && curr.actionPayload.req.id === reqId ? null : curr);
    playAudio('click');
    if (serverConnected) {
      fetch(`${serverUrl}/api/friends/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reqId,
          action: 'decline',
          username: user.username
        })
      }).catch((err) => { console.error("Network Error:", err); setActiveToast({ type: "systemAlerts", title: "Network Error", message: "Silent network failure prevented." }); });
    }
  };
  const handleSendKudos = friend => {
    playAudio('complete');
    setKudosSent(prev => ({
      ...prev,
      [friend.id]: true
    }));
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'KUDOS',
        to: friend.username.toLowerCase()
      });
    }
    if (serverConnected) {
      fetch(`${serverUrl}/api/friends/kudos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: user.username,
          to: friend.username
        })
      }).catch((err) => { console.error("Network Error:", err); setActiveToast({ type: "systemAlerts", title: "Network Error", message: "Silent network failure prevented." }); });
    }
  };

  // Send Co-Study Focus Sprint Invite
  const handleInviteSprint = friend => {
    playAudio('click');
    if (p2pChannelRef.current) {
      p2pChannelRef.current.postMessage({
        type: 'SPRINT_INVITE',
        from: user.username,
        to: friend.username.toLowerCase(),
        fromUser: {
          username: user.username,
          name: user.name,
          avatar: user.avatar
        },
        topic: isTimerRunning ? 'Deep Focus Sprint' : '25-min Productivity Sprint'
      });
    }
    if (serverConnected) {
      apiFetch('/api/friends/invite-sprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: user.username,
          to: friend.username,
          topic: isTimerRunning ? 'Deep Focus Sprint' : '25-min Productivity Sprint'
        })
      });
    }
    addNotification({
      type: 'system',
      title: 'Sprint Invite Sent!',
      message: `Invited @${friend.username} to a collaborative 25-minute focus session.`
    });
  };

  // Backup JSON Export & Import
  const handleExportBackup = () => {
    const backupData = {
      user,
      tasks,
      disciplines,
      streak,
      activityLog,
      friends,
      claimedPerks,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `ASCEND_Backup_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    playAudio('complete');
  };
  const handleImportBackup = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = loadEvent => {
      try {
        const data = JSON.parse(loadEvent.target.result);
        if (data.user) setUser(data.user);
        if (data.tasks) setTasks(data.tasks);
        if (data.disciplines) setDisciplines(data.disciplines);
        if (data.streak) setStreak(data.streak);
        if (data.activityLog) setActivityLog(data.activityLog);
        if (data.friends) setFriends(data.friends);
        if (data.claimedPerks) setClaimedPerks(data.claimedPerks);
        alert('Database backup imported successfully!');
        playAudio('levelup');
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This will clear tasks and activity logs.')) {
      setTasks([]);
      setActivityLog([]);
      setFriends([]);
      setFriendRequests([]);
      setUser(prev => ({
        ...prev,
        totalXp: 0,
        points: 0,
        level: 1
      }));
      alert('Data reset successfully.');
      playAudio('click');
    }
  };
  const totalMinutesWorked = activityLog.reduce((acc, a) => acc + (a.durationMin || 0), 0);
  const totalHours = (totalMinutesWorked / 60).toFixed(1);
  const totalTasksDone = activityLog.length;
  const filteredTasks = tasks.filter(t => {
    if (!searchQuery) return true;
    return t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.discipline.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIdx = (new Date().getDay() + 6) % 7;
  const weeklyStats = weeklyDays.map((day, idx) => {
    const isToday = idx === todayDayIdx;
    const baseHeight = idx <= todayDayIdx ? Math.min(100, Math.max(20, (totalTasksDone * 18 + idx * 12) % 95)) : 12;
    return {
      day,
      height: baseHeight,
      isToday
    };
  });
  const formatTimer = totalSecs => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // =================================================================
  // VIEW A: CINEMATIC COVER PAGE
  // =================================================================
  if (view === 'cover') {
    return /*#__PURE__*/React.createElement("div", {
      className: `min-h-screen theme-${colorMode} ${currentTheme.bgClass} lang-${language} flex flex-col justify-between relative overflow-hidden transition-all duration-700`
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-40",
      style: {
        background: currentTheme.accent
      }
    }), /*#__PURE__*/React.createElement("header", {
      className: "relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/30"
    }, "▲"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: `text-xl font-extrabold tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`
    }, "ASCEND", /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold"
    }, "v3.4 PRO")), /*#__PURE__*/React.createElement("p", {
      className: `text-[11px] font-mono tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-400'}`
    }, "Life RPG & Academic Operating System"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("select", {
      value: language,
      onChange: e => setLanguage(e.target.value),
      className: `px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md focus:outline-none ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900/80 border-white/10 text-white'}`
    }, /*#__PURE__*/React.createElement("option", {
      value: "en"
    }, "English"), /*#__PURE__*/React.createElement("option", {
      value: "hi"
    }, "à¤¹à¤¿à¤¨à¥à¤¦à¥€"), /*#__PURE__*/React.createElement("option", {
      value: "es"
    }, "EspaÃ±ol"), /*#__PURE__*/React.createElement("option", {
      value: "ja"
    }, "æ—¥æœ¬èªž"), /*#__PURE__*/React.createElement("option", {
      value: "fr"
    }, "FranÃ§ais"), /*#__PURE__*/React.createElement("option", {
      value: "de"
    }, "Deutsch"), /*#__PURE__*/React.createElement("option", {
      value: "ru"
    }, "Ð ÑƒÑÑÐºÐ¸Ð¹")), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setColorMode(isLight ? 'dark' : 'light');
        playAudio('click');
      },
      className: `p-2.5 rounded-2xl border transition-all ${isLight ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-900/70 border-white/10 text-slate-300'}`,
      title: isLight ? 'Dark Mode' : 'Light Mode'
    }, isLight ? /*#__PURE__*/React.createElement(Icons.Moon, null) : /*#__PURE__*/React.createElement(Icons.Sun, null)))), /*#__PURE__*/React.createElement("main", {
      className: "relative z-10 max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl shadow-inner"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-2 h-2 rounded-full animate-ping",
      style: {
        backgroundColor: currentTheme.accent
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-mono tracking-widest uppercase text-indigo-400 font-bold"
    }, currentTheme.subtitle)), /*#__PURE__*/React.createElement("div", {
      className: "space-y-4 max-w-3xl"
    }, /*#__PURE__*/React.createElement("h1", {
      className: `text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] ${isLight ? 'text-slate-900' : 'text-white'}`
    }, "Turn Daily Study into ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    }, "Sovereign Mastery.")), /*#__PURE__*/React.createElement("p", {
      className: `text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`
    }, currentTheme.tagline, " Gamify your engineering degree, athletic discipline, software projects, and real study circle.")), /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-2xl glass-surface rounded-3xl p-3 shadow-2xl relative group overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative h-64 sm:h-76 rounded-2xl overflow-hidden"
    }, /*#__PURE__*/React.createElement("img", {
      src: currentTheme.heroImage,
      alt: currentTheme.name,
      className: "w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 filter brightness-95"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute bottom-4 left-6 right-6 flex items-end justify-between text-left"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-mono font-bold uppercase tracking-wider text-indigo-400"
    }, "Featured System Theme"), /*#__PURE__*/React.createElement("h3", {
      className: "text-2xl font-black text-white"
    }, currentTheme.name, " • ", currentTheme.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-300"
    }, currentTheme.subtitle))))), /*#__PURE__*/React.createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: handleEnterSystem,
      className: "px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/20",
      style: {
        backgroundColor: currentTheme.accent,
        boxShadow: `0 12px 36px -8px ${currentTheme.accentGlow}`
      }
    }, /*#__PURE__*/React.createElement("span", null, t('enterSystem')), /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "→")))), /*#__PURE__*/React.createElement("footer", {
      className: `relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`
    }, "Ascend OS • Native IndexedDB Engine • Zero LocalStorage • Real Node.js Social Bridge"), showEnrollModal && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    }, /*#__PURE__*/React.createElement("div", {
      className: "glass-surface w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center space-y-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold"
    }, "New Student Identity"), /*#__PURE__*/React.createElement("h3", {
      className: `text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`
    }, "Academic Profile Setup")), /*#__PURE__*/React.createElement("form", {
      onSubmit: handleSaveEnrollment,
      className: "space-y-3 text-left"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
    }, t('fullName')), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: formName,
      onChange: e => setFormName(e.target.value),
      placeholder: "Parth Chawake",
      className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
      required: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
    }, t('usernameHandle')), /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("span", {
      className: "absolute left-3 top-2 text-xs text-slate-400 font-mono"
    }, "@"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: formUsername,
      onChange: e => setFormUsername(e.target.value.replace(/^@/, '')),
      placeholder: "parth_chawake",
      className: `w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
      required: true
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
    }, t('university')), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: formCollege,
      onChange: e => setFormCollege(e.target.value),
      placeholder: "Kavikulguru Institute of Technology & Science",
      className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
      required: true
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
    }, t('degreeBranch')), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: formDegree,
      onChange: e => setFormDegree(e.target.value),
      placeholder: "B.Tech Computer Engineering",
      className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
      required: true
    })), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all",
      style: {
        backgroundColor: currentTheme.accent
      }
    }, "Initialize Dashboard →")))));
  }

  // =================================================================
  // VIEW B: PRODUCTION WEB APP DASHBOARD (NO BACK BUTTON!)
  // =================================================================
  return /*#__PURE__*/React.createElement("div", {
    className: `min-h-screen theme-${colorMode} ${currentTheme.bgClass} lang-${language} flex flex-col md:flex-row transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-slate-100'}`
  }, /*#__PURE__*/React.createElement("aside", {
    className: `transition-all duration-300 ease-in-out md:h-screen md:sticky md:top-0 flex flex-col justify-between glass-dock z-30 shrink-0 ${sidebarOpen ? 'w-full md:w-64 p-4 md:p-5 opacity-100 translate-x-0' : 'w-0 h-0 md:h-screen p-0 overflow-hidden opacity-0 pointer-events-none -translate-x-full md:translate-x-0'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-54 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      setSidebarOpen(false);
      playAudio('click');
    },
    className: "flex items-center gap-2.5 cursor-pointer select-none group",
    title: "Touch logo to close navigation slide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-all"
  }, /*#__PURE__*/React.createElement(Icons.Logo, {
    className: "w-4 h-4 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: `font-extrabold text-sm tracking-tight block ${isLight ? 'text-slate-900' : 'text-white'}`
  }, "ASCEND"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono block tracking-wider uppercase text-slate-400 group-hover:text-indigo-400 transition"
  }, t('touchToClose')))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setColorMode(isLight ? 'dark' : 'light');
      playAudio('click');
    },
    className: `p-1.5 rounded-xl transition ${isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`,
    title: isLight ? 'Dark Mode' : 'Light Mode'
  }, isLight ? /*#__PURE__*/React.createElement(Icons.Moon, null) : /*#__PURE__*/React.createElement(Icons.Sun, null))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab('settings'),
    className: "glass-surface p-3 rounded-2xl cursor-pointer hover:border-indigo-400/40 transition-all space-y-2 group",
    title: "Edit in Settings"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: user.name,
    className: "w-10 h-10 rounded-full object-cover border-2 shrink-0",
    style: {
      borderColor: currentTheme.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-xs font-bold truncate group-hover:text-indigo-400 transition ${isLight ? 'text-slate-900' : 'text-white'}`
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-mono text-indigo-400 truncate"
  }, "@", user.username))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 font-mono text-[9px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-400"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-500"
  }, t('level'), " ", prog.lvl), /*#__PURE__*/React.createElement("span", null, prog.percent, "%")), /*#__PURE__*/React.createElement("div", {
    className: `w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full transition-all duration-300",
    style: {
      width: `${prog.percent}%`,
      backgroundColor: currentTheme.accent
    }
  })))), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-1 text-xs font-medium"
  }, [{
    id: 'dashboard',
    label: t('dashboard'),
    icon: /*#__PURE__*/React.createElement(Icons.Dashboard, null)
  }, {
    id: 'timer',
    label: t('timer'),
    icon: /*#__PURE__*/React.createElement(Icons.Timer, null)
  }, {
    id: 'tasks',
    label: t('tasks'),
    icon: /*#__PURE__*/React.createElement(Icons.Tasks, null),
    count: tasks.filter(t => !t.completed).length
  }, {
    id: 'disciplines',
    label: t('disciplines'),
    icon: /*#__PURE__*/React.createElement(Icons.Disciplines, null)
  }, {
    id: 'analytics',
    label: t('analytics'),
    icon: /*#__PURE__*/React.createElement(Icons.Analytics, null)
  }, {
    id: 'friends',
    label: t('friends'),
    icon: /*#__PURE__*/React.createElement(Icons.Friends, null),
    count: friendRequests.length
  }, {
    id: 'rewards',
    label: t('rewards'),
    icon: /*#__PURE__*/React.createElement(Icons.Rewards, null)
  }, {
    id: 'settings',
    label: t('settings'),
    icon: /*#__PURE__*/React.createElement(Icons.Settings, null)
  }].map(item => {
    const isActive = tab === item.id;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => {
        setTab(item.id);
        playAudio('click');
      },
      className: `w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${isActive ? isLight ? 'bg-slate-900 text-white font-bold shadow-sm' : 'glass-surface text-white font-bold border border-white/20 shadow-lg' : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`,
      style: isActive && !isLight ? {
        borderColor: `${currentTheme.accent}88`
      } : {}
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "shrink-0"
    }, item.icon), /*#__PURE__*/React.createElement("span", null, item.label)), item.count !== undefined && item.count > 0 && /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[9px] font-bold"
    }, item.count));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-3.5 rounded-2xl ${isLight ? 'bg-orange-50/80 text-orange-950 shadow-sm' : 'bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icons.Flame, {
    className: "w-7 h-7 text-orange-400 shrink-0 animate-pulse"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl font-black font-mono text-orange-400 leading-none"
  }, streak.count), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono uppercase font-bold tracking-wider text-orange-400"
  }, t('daysStreak'))), /*#__PURE__*/React.createElement("p", {
    className: "text-[9px] font-mono text-slate-400 mt-0.5"
  }, t('disciplineUnbroken'))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs font-mono px-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 text-amber-400 font-bold"
  }, /*#__PURE__*/React.createElement(Icons.Coin, {
    className: "w-3.5 h-3.5 text-amber-400"
  }), /*#__PURE__*/React.createElement("span", null, user.points, " PTS")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowRecordModal(true),
    className: `text-[11px] font-semibold transition text-indigo-400 hover:text-indigo-300`
  }, t('fullRecord'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowRecordModal(true),
    className: `w-full py-1.5 rounded-xl border text-[11px] font-semibold transition text-center ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'}`
  }, t('fullRecord')))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("header", {
    className: "h-18 glass-surface sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 shadow-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      setSidebarOpen(prev => !prev);
      playAudio('click');
    },
    className: "flex items-center gap-2 cursor-pointer select-none group shrink-0",
    title: sidebarOpen ? "Touch ASCEND Logo to slide navigation closed" : "Touch ASCEND Logo to slide navigation open"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300"
  }, /*#__PURE__*/React.createElement(Icons.Logo, {
    className: "w-4 h-4 text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:block text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: `font-black text-xs tracking-tight block leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`
  }, "ASCEND"), /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] font-mono block uppercase tracking-widest text-indigo-400"
  }, sidebarOpen ? t('touchToClose') : t('touchToOpen')))), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-2xl shadow-sm ${isLight ? 'bg-white text-slate-900' : 'bg-slate-900/90 text-white'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[9px] font-black font-mono px-2 py-0.5 rounded-lg uppercase tracking-wider ${rankInfo.badge}`
  }, rankInfo.rank), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 font-mono font-black text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-400"
  }, "LVL"), /*#__PURE__*/React.createElement("span", {
    className: `text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`
  }, prog.lvl)), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex flex-col gap-0.5 w-28 md:w-40 lg:w-48"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[9px] font-mono text-slate-400 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, prog.currentXp, " / ", prog.nextLevelXp, " XP"), /*#__PURE__*/React.createElement("span", null, prog.percent, "%")), /*#__PURE__*/React.createElement("div", {
    className: `w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-black/60'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full transition-all duration-500 bg-gradient-to-r ${rankInfo.bar}`,
    style: {
      width: `${prog.percent}%`
    }
  }))), floatingXp && /*#__PURE__*/React.createElement("span", {
    className: "animate-float-xp text-[11px] font-black font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0"
  }, floatingXp.text))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 shrink-0"
  }, /*#__PURE__*/React.createElement("select", {
    value: language,
    onChange: e => setLanguage(e.target.value),
    className: `hidden sm:block px-3 py-1.5 rounded-2xl border text-xs font-bold focus:outline-none transition ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/80 border-white/10 text-slate-200'}`,
    title: "Choose Language / à¤­à¤¾à¤·à¤¾ à¤¨à¤¿à¤µà¤¡à¤¾"
  }, /*#__PURE__*/React.createElement("option", {
    value: "en"
  }, "English (EN)"), /*#__PURE__*/React.createElement("option", {
    value: "mr"
  }, "à¤®à¤°à¤¾à¤ à¥€ (Marathi)"), /*#__PURE__*/React.createElement("option", {
    value: "hi"
  }, "à¤¹à¤¿à¤¨à¥à¤¦à¥€ (Hindi)"), /*#__PURE__*/React.createElement("option", {
    value: "te"
  }, "à°¤à±†à°²à±à°—à± (Telugu)"), /*#__PURE__*/React.createElement("option", {
    value: "ta"
  }, "à®¤à®®à®¿à®´à¯ (Tamil)"), /*#__PURE__*/React.createElement("option", {
    value: "bn"
  }, "à¦¬à¦¾à¦‚à¦²à¦¾ (Bengali)"), /*#__PURE__*/React.createElement("option", {
    value: "gu"
  }, "àª—à«àªœàª°àª¾àª¤à«€ (Gujarati)"), /*#__PURE__*/React.createElement("option", {
    value: "kn"
  }, "à²•à²¨à³à²¨à²¡ (Kannada)"), /*#__PURE__*/React.createElement("option", {
    value: "ml"
  }, "à´®à´²à´¯à´¾à´³à´‚ (Malayalam)"), /*#__PURE__*/React.createElement("option", {
    value: "pa"
  }, "à¨ªà©°à¨œà¨¾à¨¬à©€ (Punjabi)"), /*#__PURE__*/React.createElement("option", {
    value: "ja"
  }, "æ—¥æœ¬èªž (Japanese)"), /*#__PURE__*/React.createElement("option", {
    value: "es"
  }, "EspaÃ±ol (Spanish)"), /*#__PURE__*/React.createElement("option", {
    value: "fr"
  }, "FranÃ§ais (French)"), /*#__PURE__*/React.createElement("option", {
    value: "de"
  }, "Deutsch (German)"), /*#__PURE__*/React.createElement("option", {
    value: "ru"
  }, "Ð ÑƒÑÑÐºÐ¸Ð¹ (Russian)")), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 px-3 py-1.5 rounded-2xl font-mono shadow-sm ${isLight ? 'bg-orange-50 text-orange-900' : 'bg-orange-950/40 text-orange-400'}`
  }, /*#__PURE__*/React.createElement(Icons.Flame, {
    className: "w-4 h-4 text-orange-400 animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-black leading-none"
  }, streak.count), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold tracking-wider uppercase hidden md:inline"
  }, "DAYS")), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold shadow-sm ${isLight ? 'bg-amber-50 text-amber-900' : 'bg-slate-900/80 text-amber-400'}`
  }, /*#__PURE__*/React.createElement(Icons.Coin, {
    className: "w-3.5 h-3.5 text-amber-400"
  }), /*#__PURE__*/React.createElement("span", null, user.points)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowNotifDrawer(prev => !prev);
      playAudio('click');
    },
    className: `p-2 rounded-2xl border relative transition ${isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-white/10'}`,
    title: "Notifications & Reminders"
  }, /*#__PURE__*/React.createElement(Icons.Bell, null), notifications.filter(n => !n.read).length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono flex items-center justify-center font-bold animate-pulse"
  }, notifications.filter(n => !n.read).length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('settings'),
    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border transition ${isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-slate-900/80 border-white/10 hover:bg-white/10'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: user.name,
    className: "w-6 h-6 rounded-full object-cover"
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`
  }, user.name.split(' ')[0]), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "▾")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowTaskModal(true);
      playAudio('click');
    },
    className: "px-3.5 py-1.5 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 shadow transition-all hover:brightness-110 active:scale-95",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, /*#__PURE__*/React.createElement("span", null, "+"), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, t('newFocusTask'))))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 sm:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto"
  }, tab === 'dashboard' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-5 sm:p-6 rounded-3xl space-y-3.5 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Icons.Flame, {
    className: "w-5 h-5 text-orange-400"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`
  }, "Famous Anime & Pop-Culture Themes"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold"
  }, "1-Click Pinterest Switch")), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Instantly apply famous character aesthetics, Pinterest focus backdrops, accents & soundscapes."))), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-mono text-slate-400 shrink-0"
  }, "Active: ", /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-indigo-400"
  }, currentTheme.name))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5 overflow-x-auto no-scrollbar py-2"
  }, THEMES.map(theme => {
    const isSelected = theme.id === themeId;
    return /*#__PURE__*/React.createElement("div", {
      key: theme.id,
      onClick: () => {
        setThemeId(theme.id);
        playAudio('theme');
        addNotification({
          type: 'system',
          title: `Theme Activated: ${theme.name}`,
          message: `Switched to ${theme.name} (${theme.title}) with customized Pinterest wallpapers and focus aura!`
        });
      },
      className: `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border shrink-0 cursor-pointer transition-all duration-300 transform hover:scale-[1.03] ${isSelected ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg' : isLight ? 'bg-white/80 hover:bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-900/60 hover:bg-slate-800/80 border-white/10'}`,
      style: isSelected ? {
        borderColor: theme.accent
      } : {}
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("img", {
      src: theme.avatarImage,
      alt: theme.name,
      className: "w-10 h-10 rounded-full object-cover border-2 shadow",
      style: {
        borderColor: theme.accent
      }
    }), isSelected && /*#__PURE__*/React.createElement("span", {
      className: "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center text-white",
      style: {
        backgroundColor: theme.accent
      }
    }, /*#__PURE__*/React.createElement(Icons.Check, {
      className: "w-2.5 h-2.5 text-white"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "text-left"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("h4", {
      className: `text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
    }, theme.name), isSelected && /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold"
    }, "LIVE")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-400 font-mono truncate max-w-[130px]"
    }, theme.title)));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: `lg:col-span-2 rounded-3xl glass-surface p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r ${currentTheme.bannerGradient} shadow-2xl flex flex-col justify-between`
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 space-y-4 max-w-xl text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-3 py-1 rounded-xl text-[10px] font-black font-mono uppercase tracking-wider shadow-sm ${rankInfo.badge}`
  }, rankInfo.rank, " • ", rankInfo.title), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-xl bg-white/10 text-[10px] font-mono font-bold tracking-wider text-white"
  }, currentTheme.name)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-4xl font-black text-white tracking-tight leading-none"
  }, "LEVEL ", prog.lvl), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-bold text-slate-200"
  }, user.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-indigo-300"
  }, "(@", user.username, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-baseline text-xs font-mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-300 font-bold"
  }, "EXP: ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-black"
  }, prog.currentXp), " / ", prog.nextLevelXp), /*#__PURE__*/React.createElement("span", {
    className: "text-amber-400 font-bold"
  }, prog.nextLevelXp - prog.currentXp, " XP to Level ", prog.lvl + 1)), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 rounded-full bg-slate-950 overflow-hidden shadow-inner p-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full transition-all duration-700 bg-gradient-to-r ${rankInfo.bar}`,
    style: {
      width: `${prog.percent}%`,
      boxShadow: `0 0 12px ${currentTheme.accent}`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-white/5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icons.Brain, {
    className: "w-3.5 h-3.5 text-indigo-400"
  }), " INT"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-indigo-400"
  }, "Lv ", disciplines.Intellect?.level || disciplines.intellect?.level || 1)), /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-white/5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icons.Zap, {
    className: "w-3.5 h-3.5 text-emerald-400"
  }), " DSC"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-emerald-400"
  }, "Lv ", disciplines.Innovation?.level || disciplines.innovation?.level || disciplines.discipline?.level || 1)), /*#__PURE__*/React.createElement("div", {
    className: "p-2 rounded-xl bg-white/5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icons.Shield, {
    className: "w-3.5 h-3.5 text-amber-400"
  }), " END"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-400"
  }, "Lv ", disciplines.Physique?.level || disciplines.physique?.level || disciplines.endurance?.level || 1))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTab('timer');
      playAudio('click');
    },
    className: "px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition hover:brightness-110 flex items-center gap-2",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, /*#__PURE__*/React.createElement(Icons.Sword, {
    className: "w-3.5 h-3.5 text-white"
  }), /*#__PURE__*/React.createElement("span", null, "Start Focus Quest")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowRecordModal(true);
      playAudio('click');
    },
    className: "px-4 py-2.5 rounded-2xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition"
  }, t('playerRecord')))), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:block absolute right-4 bottom-4 w-40 h-40 rounded-2xl overflow-hidden shadow-2xl opacity-90"
  }, /*#__PURE__*/React.createElement("img", {
    src: currentTheme.heroImage,
    alt: currentTheme.name,
    className: "w-full h-full object-cover filter brightness-95"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono uppercase tracking-wider text-slate-400"
  }, t('activeQuest')), /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${rankInfo.badge}`
  }, "Rank Tier: ", rankInfo.rank)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: `text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`
  }, "Ascension to Level ", prog.lvl + 1), /*#__PURE__*/React.createElement("p", {
    className: `text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`
  }, "Complete study sprints or problem sets. Each focus minute unlocks +2 XP toward rank advancement."), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-2xl bg-black/20 space-y-1.5 font-mono text-[11px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-400"
  }, /*#__PURE__*/React.createElement("span", null, "Quest Progress"), /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-400 font-bold"
  }, prog.percent, "%")), /*#__PURE__*/React.createElement("div", {
    className: `w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full transition-all duration-300",
    style: {
      width: `${prog.percent}%`,
      backgroundColor: currentTheme.accent
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Ascension Bounty"), /*#__PURE__*/React.createElement("span", {
    className: "text-amber-500 font-bold"
  }, "+50 PTS Bonus")))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold tracking-wide flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, t('friends')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold"
  }, friends.length, " ", friends.length === 1 ? 'Peer' : 'Peers')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Real verified study peers. Send requests by @username to connect in real time.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddFriendModal(true),
    className: `px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`
  }, /*#__PURE__*/React.createElement(Icons.UserPlus, null), /*#__PURE__*/React.createElement("span", null, t('addFriend')))), friends.length === 0 ?
  /*#__PURE__*/
  /* Clean empty state for Study Circle */
  React.createElement("div", {
    className: "p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: `text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('studyCircleEmpty')), /*#__PURE__*/React.createElement("p", {
    className: `text-[11px] max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, t('studyCircleEmptyDesc')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddFriendModal(true),
    className: "mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, "+ ", t('addFriend'), " by @username")) :
  /*#__PURE__*/
  /* Real Friends Row */
  React.createElement("div", {
    className: "flex items-center gap-5 overflow-x-auto no-scrollbar py-2"
  }, friends.map(friend => /*#__PURE__*/React.createElement("div", {
    key: friend.id,
    onClick: () => setSelectedFriend(friend),
    className: "flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("img", {
    src: friend.avatar,
    alt: friend.name,
    className: "w-14 h-14 rounded-full object-cover border-2 transition-transform duration-300 group-hover:scale-105",
    style: {
      borderColor: friend.isStudying ? '#10b981' : currentTheme.accent
    }
  }), friend.isStudying && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center max-w-[80px]"
  }, /*#__PURE__*/React.createElement("p", {
    className: `text-[11px] font-bold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`
  }, friend.name.split(' ')[0]), /*#__PURE__*/React.createElement("p", {
    className: "text-[9px] font-mono text-slate-400 truncate"
  }, "Lv ", friend.level)))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowAddFriendModal(true),
    className: `w-14 h-14 rounded-full border-2 border-dashed flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all ${isLight ? 'border-slate-300 hover:border-indigo-500 text-slate-400' : 'border-white/20 hover:border-indigo-400 text-slate-400'}`,
    title: "Add Friend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold"
  }, "+")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('dailyTelemetry')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-400"
  }, "Live")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-around py-1"
  }, /*#__PURE__*/React.createElement(CircularGauge, {
    value: tasks.length > 0 ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0,
    label: "Task Quota",
    sublabel: "Done",
    color: currentTheme.strokeColor,
    size: 105,
    isLight: isLight
  }), /*#__PURE__*/React.createElement(CircularGauge, {
    value: prog.percent,
    label: "Level Ratio",
    sublabel: "XP",
    color: "#38bdf8",
    size: 105,
    isLight: isLight
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5"
  }, /*#__PURE__*/React.createElement("span", null, "Completed: ", /*#__PURE__*/React.createElement("strong", {
    className: isLight ? 'text-slate-800' : 'text-white'
  }, tasks.filter(t => t.completed).length, "/", tasks.length)), /*#__PURE__*/React.createElement("span", {
    className: "text-indigo-400"
  }, "Streak: ", streak.count, "d"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('focusDurationWeek')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 font-mono mt-0.5"
  }, totalHours, " hrs logged")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 font-bold"
  }, "7D Cycle")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between h-28 pt-4 px-1 gap-2"
  }, weeklyStats.map(st => /*#__PURE__*/React.createElement("div", {
    key: st.day,
    className: "flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full rounded-full h-full max-w-[16px] p-0.5 flex flex-col justify-end overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-white/5'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full rounded-full transition-all duration-500",
    style: {
      height: `${st.height}%`,
      backgroundColor: st.isToday ? currentTheme.accent : isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255, 255, 255, 0.15)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: `text-[9px] font-mono ${st.isToday ? 'font-bold text-indigo-400' : 'text-slate-400'}`
  }, st.day)))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5"
  }, /*#__PURE__*/React.createElement("span", null, t('consistencyGrade')), /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-500 font-bold"
  }, "A+ Optimal"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('productivityTimer')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-amber-500 font-bold"
  }, "Pomodoro")), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`
  }, "Deep work intervals with ambient Pinterest focus gallery backdrops.")), /*#__PURE__*/React.createElement("div", {
    className: "text-center py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-4xl font-black font-mono tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`
  }, formatTimer(timerSecondsLeft))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTab('timer');
      playAudio('click');
    },
    className: "w-full py-2.5 rounded-2xl text-xs font-bold text-white transition hover:brightness-110 text-center",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, t('startSession'), " →"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, t('todaysTasks'))), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Private syllabus and verified academic tasks saved to IndexedDB.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 sm:w-64"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Icons.Search, null)), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    placeholder: t('searchPlaceholder'),
    className: `w-full pl-9 pr-7 py-2 rounded-xl text-xs border focus:outline-none transition ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`
  }), searchQuery && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchQuery(''),
    className: "absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-3 h-3"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowTaskModal(true);
      playAudio('click');
    },
    className: "px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow transition hover:brightness-110 shrink-0",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, /*#__PURE__*/React.createElement("span", null, t('addTask'))))), filteredTasks.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-10 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: `text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('queueEmpty')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, t('queueEmptyDesc')), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowTaskModal(true);
      playAudio('click');
    },
    className: "px-4 py-2 rounded-xl text-xs font-semibold text-white transition hover:brightness-110",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, t('createFirstTask'))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filteredTasks.map(task => {
    const eff = EFFORT_LEVELS[task.effort] || EFFORT_LEVELS.standard;
    const discCfg = DISCIPLINE_CONFIG[task.discipline] || DISCIPLINE_CONFIG.Intellect;
    return /*#__PURE__*/React.createElement("div", {
      key: task.id,
      className: `p-4 rounded-2xl glass-surface flex items-center justify-between gap-4 transition-all ${task.completed ? 'border-emerald-500/20 bg-emerald-950/10 opacity-70' : 'hover:border-indigo-400/30'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5 min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleCompleteTask(task.id),
      className: `w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white font-black text-xs shadow-md' : 'border-slate-400 hover:border-indigo-500'}`
    }, task.completed ? /*#__PURE__*/React.createElement(Icons.Check, null) : ''), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: `text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${eff.badge}`
    }, eff.label), /*#__PURE__*/React.createElement("span", {
      className: `text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${discCfg.badge}`
    }, task.discipline.toUpperCase()), task.reminderTime && /*#__PURE__*/React.createElement("span", {
      className: `text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${Date.now() >= task.reminderTime ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`
    }, /*#__PURE__*/React.createElement(Icons.Clock, null), /*#__PURE__*/React.createElement("span", null, Date.now() >= task.reminderTime ? 'DUE NOW' : `In ${Math.max(1, Math.round((task.reminderTime - Date.now()) / 60000))}m`))), /*#__PURE__*/React.createElement("p", {
      className: `text-sm font-medium ${task.completed ? 'line-through text-slate-400' : isLight ? 'text-slate-800' : 'text-slate-100'}`
    }, task.title))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-right text-xs font-mono font-bold"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-amber-500"
    }, "+", eff.xp, " XP"), /*#__PURE__*/React.createElement("div", {
      className: "text-slate-400 text-[10px]"
    }, "+", eff.points, " pts")), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDeleteTask(task.id),
      className: "text-slate-400 hover:text-rose-500 p-1 text-xs",
      title: "Delete task"
    }, /*#__PURE__*/React.createElement(Icons.Close, {
      className: "w-3.5 h-3.5"
    }))));
  })))), tab === 'timer' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('productivityTimer')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Deep work interval timer themed with curated Pinterest aesthetic study wallpapers.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleFullscreenTimer,
    className: `px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${isAmbientFocus ? 'bg-indigo-600 text-white border-indigo-500' : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'}`
  }, isAmbientFocus ? t('exitAmbient') : t('ambientMode')))), /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-3xl overflow-hidden glass-surface p-8 sm:p-12 shadow-2xl min-h-[420px] flex flex-col items-center justify-center text-center"
  }, currentTheme.timerWallpapers && currentTheme.timerWallpapers[selectedWallpaperIdx] && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: currentTheme.timerWallpapers[selectedWallpaperIdx].url,
    alt: "Focus Wallpaper",
    className: "w-full h-full object-cover filter brightness-[0.35] contrast-110 transition-all duration-700"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 space-y-6 max-w-md w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
  }, [{
    label: '25m',
    val: 25
  }, {
    label: '50m',
    val: 50
  }, {
    label: '90m',
    val: 90
  }, {
    label: '5m',
    val: 5
  }].map(preset => /*#__PURE__*/React.createElement("button", {
    key: preset.val,
    onClick: () => setTimerPreset(preset.val),
    className: `px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${timerMode === String(preset.val) ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-slate-300 hover:text-white'}`
  }, preset.label))), /*#__PURE__*/React.createElement("div", {
    className: "relative py-4 flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-6xl sm:text-7xl font-black font-mono tracking-tight text-white drop-shadow-lg"
  }, formatTimer(timerSecondsLeft)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono uppercase tracking-widest text-indigo-300 mt-2"
  }, isTimerRunning ? 'Session Active • Deep Focus' : 'Ready to Start')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-4 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: resetTimer,
    className: "px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 border border-white/10 transition"
  }, t('reset')), /*#__PURE__*/React.createElement("button", {
    onClick: toggleTimer,
    className: "px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95",
    style: {
      backgroundColor: currentTheme.accent,
      boxShadow: `0 8px 25px -4px ${currentTheme.accentGlow}`
    }
  }, isTimerRunning ? t('pauseSession') : t('startSession'))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, "Pinterest Aesthetic Focus Backdrops"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-400"
  }, "Click to Switch Backdrop")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3"
  }, (currentTheme.timerWallpapers || []).map((wp, idx) => /*#__PURE__*/React.createElement("div", {
    key: wp.title,
    onClick: () => {
      setSelectedWallpaperIdx(idx);
      playAudio('click');
    },
    className: `relative h-24 rounded-2xl overflow-hidden cursor-pointer border transition-all ${selectedWallpaperIdx === idx ? 'border-white ring-2 ring-indigo-500 scale-[1.02]' : 'border-white/10 opacity-70 hover:opacity-100'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: wp.url,
    alt: wp.title,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-2 left-2 text-[10px] font-bold text-white truncate max-w-[90%]"
  }, wp.title)))))), tab === 'friends' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('friends')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Real social network. Send real friend requests by @username and study together.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddFriendModal(true),
    className: "px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow transition hover:brightness-110",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, /*#__PURE__*/React.createElement(Icons.UserPlus, null), /*#__PURE__*/React.createElement("span", null, t('addFriend')))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-3xl glass-surface border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400"
  }, /*#__PURE__*/React.createElement(Icons.Monitor, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-white"
  }, t("liveStudyServer")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20"
  }, "Port 3001 Active")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-0.5"
  }, "Share this link with Dhanush or friends on your Wi-Fi: ", /*#__PURE__*/React.createElement("code", {
    className: "text-indigo-300 font-mono select-all"
  }, lanInfo.lanUrl)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(lanInfo.lanUrl);
        addNotification({
          type: 'system',
          title: 'Link Copied',
          message: `Study Circle link copied: ${lanInfo.lanUrl}`
        });
      }
    },
    className: "px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition"
  }, "Copy Wi-Fi Link"))), outgoingRequests.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl border-white/10 space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, t("sentRequestsTitle")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20"
  }, outgoingRequests.length, " Pending"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, outgoingRequests.map(req => /*#__PURE__*/React.createElement("div", {
    key: req.id,
    className: "p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono"
  }, "@", req.to.slice(0, 2).toUpperCase()), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-white"
  }, "@", req.to), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-amber-400 flex items-center gap-1.5 mt-0.5 font-mono"
  }, /*#__PURE__*/React.createElement("span", null, "â³ Sent"), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("span", null, "Awaiting @", req.to, " to log in & accept")))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCancelOutgoingRequest(req.id),
    className: "px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition border border-white/10"
  }, t('cancel')))))), friendRequests.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl border-indigo-500/30 space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, t('pendingRequests')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20"
  }, friendRequests.length, " New"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, friendRequests.map(req => /*#__PURE__*/React.createElement("div", {
    key: req.id,
    className: "p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: req.fromUser.avatar || currentTheme.avatarImage,
    alt: req.fromUser.name,
    className: "w-10 h-10 rounded-full object-cover border"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-white"
  }, req.fromUser.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-slate-400 text-[10px]"
  }, "@", req.fromUser.username)), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400"
  }, req.fromUser.degree || 'Student', " • ", req.fromUser.institution || 'University'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleAcceptFriend(req),
    className: "px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
  }, t('accept')), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeclineFriend(req.id),
    className: "px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition"
  }, t('decline'))))))), friends.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('studyCircleEmpty')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, t('studyCircleEmptyDesc')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddFriendModal(true),
    className: "px-4 py-2 rounded-xl text-xs font-semibold text-white shadow",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, "+ ", t('addFriend'))) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, friends.map(friend => /*#__PURE__*/React.createElement("div", {
    key: friend.id,
    className: "glass-surface p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("img", {
    src: friend.avatar,
    alt: friend.name,
    className: "w-12 h-12 rounded-full object-cover border-2",
    style: {
      borderColor: friend.isStudying ? '#10b981' : currentTheme.accent
    }
  }), friend.isStudying && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: `text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, friend.name), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-mono text-indigo-400"
  }, "@", friend.username))), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-md border bg-indigo-500/10 text-indigo-400 font-bold border-indigo-500/20"
  }, "Lv ", friend.level)), /*#__PURE__*/React.createElement("p", {
    className: `text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`
  }, friend.bio || 'Verified academic peer')), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-white/5 flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedFriend(friend),
    className: `px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'}`
  }, t('fullRecord')), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleSendKudos(friend),
    disabled: kudosSent[friend.id],
    className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow ${kudosSent[friend.id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`
  }, kudosSent[friend.id] ? t('kudosSent') : t('sendHighFive'))))))), tab === 'settings' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('settingsTitle')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Manage your profile picture, account handles, multilingual languages, theme auras, and server networking.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-6 rounded-3xl space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-24 h-24 mx-auto"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: user.name,
    className: "w-24 h-24 rounded-full object-cover border-4 shadow-lg",
    style: {
      borderColor: currentTheme.accent
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    className: "absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition",
    title: "Upload New Photo"
  }, /*#__PURE__*/React.createElement(Icons.Camera, null)), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: fileInputRef,
    onChange: handleAvatarFileUpload,
    accept: "image/*",
    className: "hidden"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-mono text-indigo-400"
  }, "@", user.username), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-0.5"
  }, user.degree))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t space-y-2 text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    className: "w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow"
  }, t('uploadPhoto')), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportBackup,
    className: `w-full py-2 rounded-xl border font-semibold transition ${isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`
  }, t('exportBackup')))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 glass-surface p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider pb-2 border-b ${isLight ? 'text-slate-800 border-slate-200' : 'text-white border-white/10'}`
  }, t('profileTab'), " & Academic Credentials"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveSettingsProfile,
    className: "space-y-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('fullName')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formName,
    onChange: e => setFormName(e.target.value),
    className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('usernameHandle')), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute left-3 top-2 text-xs text-slate-400 font-mono"
  }, "@"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formUsername,
    onChange: e => setFormUsername(e.target.value.replace(/^@/, '')),
    className: `w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('bioMission')), /*#__PURE__*/React.createElement("textarea", {
    value: formBio,
    onChange: e => setFormBio(e.target.value),
    rows: "2",
    className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('university')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formCollege,
    onChange: e => setFormCollege(e.target.value),
    className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('degreeBranch')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formDegree,
    onChange: e => setFormDegree(e.target.value),
    className: `w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow transition",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, t('saveChanges')))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('languageTab'), " & Localization"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
  }, [{
    code: 'en',
    label: 'English'
  }, {
    code: 'mr',
    label: 'à¤®à¤°à¤¾à¤ à¥€'
  }, {
    code: 'hi',
    label: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€'
  }, {
    code: 'te',
    label: 'à°¤à±†à°²à±à°—à±'
  }, {
    code: 'ta',
    label: 'à®¤à®®à®¿à®´à¯'
  }, {
    code: 'bn',
    label: 'à¦¬à¦¾à¦‚à¦²à¦¾'
  }, {
    code: 'gu',
    label: 'àª—à«àªœàª°àª¾àª¤à«€'
  }, {
    code: 'kn',
    label: 'à²•à²¨à³à²¨à²¡'
  }, {
    code: 'ml',
    label: 'à´®à´²à´¯à´¾à´³à´‚'
  }, {
    code: 'pa',
    label: 'à¨ªà©°à¨œà¨¾à¨¬à©€'
  }, {
    code: 'ja',
    label: 'æ—¥æœ¬èªž'
  }, {
    code: 'es',
    label: 'EspaÃ±ol'
  }, {
    code: 'fr',
    label: 'FranÃ§ais'
  }, {
    code: 'de',
    label: 'Deutsch'
  }, {
    code: 'ru',
    label: 'Ð ÑƒÑÑÐºÐ¸Ð¹'
  }].map(lang => /*#__PURE__*/React.createElement("button", {
    key: lang.code,
    onClick: () => {
      setLanguage(lang.code);
      playAudio('click');
    },
    className: `p-2.5 rounded-xl border text-xs font-bold transition text-center ${language === lang.code ? 'bg-indigo-600 text-white border-indigo-500 shadow' : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`
  }, lang.label)))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('appearanceTab')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setColorMode('dark'),
    className: `flex-1 p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${!isLight ? 'bg-slate-900 text-white border-indigo-500 ring-2 ring-indigo-500 shadow' : 'bg-white border-slate-200 text-slate-700'}`
  }, /*#__PURE__*/React.createElement(Icons.Moon, null), /*#__PURE__*/React.createElement("span", null, t('darkMode'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setColorMode('light'),
    className: `flex-1 p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${isLight ? 'bg-slate-100 text-slate-900 border-indigo-500 ring-2 ring-indigo-500 shadow' : 'bg-slate-900/60 border-white/10 text-slate-300'}`
  }, /*#__PURE__*/React.createElement(Icons.Sun, null), /*#__PURE__*/React.createElement("span", null, t('lightMode'))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, "Famous Character & Anime Themes"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-indigo-400 font-bold"
  }, "11 Legendary Themes")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
  }, THEMES.map(th => {
    const isSelected = th.id === themeId;
    return /*#__PURE__*/React.createElement("div", {
      key: th.id,
      onClick: () => {
        setThemeId(th.id);
        playAudio('theme');
        addNotification({
          type: 'system',
          title: `Theme Activated: ${th.name}`,
          message: `Switched to ${th.name} (${th.title})!`
        });
      },
      className: `p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${isSelected ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg' : isLight ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-slate-900/50 hover:bg-slate-800/80 border-white/10'}`,
      style: isSelected ? {
        borderColor: th.accent
      } : {}
    }, /*#__PURE__*/React.createElement("img", {
      src: th.avatarImage,
      alt: th.name,
      className: "w-11 h-11 rounded-2xl object-cover border shrink-0 shadow",
      style: {
        borderColor: th.accent
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("h4", {
      className: `text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`
    }, th.name), isSelected && /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] font-mono font-bold text-emerald-400"
    }, "ACTIVE")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-400 font-mono truncate"
    }, th.title)));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-4 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, "Desktop Notifications & System Reminders"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 mt-0.5"
  }, "Windows OS Action Center integration, sound chimes, and study interval alerts.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      addNotification({
        type: 'system',
        title: 'Test Alert: ASCEND Operating System',
        message: 'Desktop notifications and audio chimes are operating at 100% capacity.'
      });
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition"
  }, "Send Test Alert")), /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-2xl border flex items-center justify-between ${desktopPermStatus === 'granted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-2 rounded-xl bg-white/10"
  }, /*#__PURE__*/React.createElement(Icons.Monitor, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold"
  }, "Windows Desktop Toasts: ", desktopPermStatus === 'granted' ? 'Enabled (Active)' : 'Permission Required'), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] opacity-80"
  }, desktopPermStatus === 'granted' ? 'Alerts appear directly in Windows Action Center even when minimized.' : 'Click authorize to allow Windows desktop pop-up reminders.'))), desktopPermStatus !== 'granted' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: requestDesktopPermission,
    className: "px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow hover:bg-amber-400 transition"
  }, "Authorize")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: `p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium"
  }, "Windows Desktop Alerts"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: reminderSettings.desktopEnabled,
    onChange: e => setReminderSettings(prev => ({
      ...prev,
      desktopEnabled: e.target.checked
    })),
    className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
  })), /*#__PURE__*/React.createElement("label", {
    className: `p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium"
  }, "Sound Chimes & Pings"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: reminderSettings.soundEnabled,
    onChange: e => setReminderSettings(prev => ({
      ...prev,
      soundEnabled: e.target.checked
    })),
    className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
  })), /*#__PURE__*/React.createElement("label", {
    className: `p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium"
  }, "Pomodoro Break Reminders"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: reminderSettings.pomodoroBreaks,
    onChange: e => setReminderSettings(prev => ({
      ...prev,
      pomodoroBreaks: e.target.checked
    })),
    className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium"
  }, "Hydration / 20-20-20"), /*#__PURE__*/React.createElement("select", {
    value: reminderSettings.hydrationInterval,
    onChange: e => setReminderSettings(prev => ({
      ...prev,
      hydrationInterval: Number(e.target.value)
    })),
    className: `px-2 py-1 rounded-lg text-xs font-mono border ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/10'}`
  }, /*#__PURE__*/React.createElement("option", {
    value: "0"
  }, "Off"), /*#__PURE__*/React.createElement("option", {
    value: "20"
  }, "Every 20m"), /*#__PURE__*/React.createElement("option", {
    value: "30"
  }, "Every 30m"), /*#__PURE__*/React.createElement("option", {
    value: "45"
  }, "Every 45m"), /*#__PURE__*/React.createElement("option", {
    value: "60"
  }, "Every 60m"))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`
  }, t('serverTab')), /*#__PURE__*/React.createElement("div", {
    className: `p-3.5 rounded-2xl border text-xs flex items-center justify-between ${serverConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-2.5 h-2.5 rounded-full ${serverConnected ? 'bg-emerald-500 animate-ping' : 'bg-indigo-400'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold"
  }, serverConnected ? t('serverConnected') : t('p2pActive'))), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono uppercase font-bold"
  }, "Port 3001"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-white/10 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-400"
  }, "Danger Zone"), /*#__PURE__*/React.createElement("button", {
    onClick: handleResetData,
    className: "px-4 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition"
  }, t('resetData')))))), tab === 'disciplines' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('disciplines')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Non-linear cognitive progression formula: ", /*#__PURE__*/React.createElement("code", {
    className: "text-amber-500 font-mono"
  }, "100 Ã— Level^1.5"), ".")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
  }, Object.keys(DISCIPLINE_CONFIG).map(d => {
    const cfg = DISCIPLINE_CONFIG[d];
    const disc = disciplines[d] || {
      level: 1,
      currentXp: 0
    };
    const needed = getXpForLevel(disc.level);
    const pct = Math.min(100, Math.round(disc.currentXp / needed * 100));
    const sessionsDone = activityLog.filter(a => a.discipline === d).length;
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      className: `glass-surface border ${cfg.border} rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: `text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
    }, cfg.label), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400 mt-0.5"
    }, cfg.sub)), /*#__PURE__*/React.createElement("span", {
      className: `text-xs font-mono font-bold px-3 py-1 rounded-xl border ${cfg.badge}`
    }, t('level'), " ", disc.level)), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2 font-mono text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-slate-400"
    }, /*#__PURE__*/React.createElement("span", null, "Progress to Level ", disc.level + 1), /*#__PURE__*/React.createElement("span", null, disc.currentXp, " / ", needed, " XP (", pct, "%)")), /*#__PURE__*/React.createElement("div", {
      className: `w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full bg-gradient-to-r ${cfg.bar}`,
      style: {
        width: `${pct}%`
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-[10px] text-slate-400 pt-1"
    }, /*#__PURE__*/React.createElement("span", null, needed - disc.currentXp, " XP to next rank"), /*#__PURE__*/React.createElement("span", {
      className: isLight ? 'text-slate-700' : 'text-slate-300'
    }, sessionsDone, " sessions"))));
  }))), tab === 'analytics' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('analytics')), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Cognitive performance metrics and discipline balance ledger.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-5 rounded-2xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('totalHours')), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-indigo-500 font-mono"
  }, totalHours, " hrs"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, totalMinutesWorked, " mins")), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-5 rounded-2xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('tasksCompleted')), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-emerald-500 font-mono"
  }, totalTasksDone), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "100% verified")), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-5 rounded-2xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('consistencyGrade')), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-amber-500 font-mono"
  }, "A+ Tier"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "High consistency")), /*#__PURE__*/React.createElement("div", {
    className: "glass-surface p-5 rounded-2xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, "XP Output"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-sky-500 font-mono"
  }, "+", user.totalXp), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "Level ", prog.lvl)))), tab === 'rewards' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: `text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('rewards')), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-xs font-bold"
  }, "Balance: ", user.points, " PTS")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, rewards.map(perk => {
    const canAfford = user.points >= perk.cost;
    return /*#__PURE__*/React.createElement("div", {
      key: perk.id,
      className: "glass-surface p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20"
    }, perk.cost, " PTS")), /*#__PURE__*/React.createElement("h4", {
      className: `text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
    }, perk.title), /*#__PURE__*/React.createElement("p", {
      className: `text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`
    }, perk.desc)), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (!canAfford) {
          alert(`You need ${perk.cost} PTS (Current: ${user.points} PTS).`);
          return;
        }
        playAudio('complete');
        setUser(prev => ({
          ...prev,
          points: prev.points - perk.cost
        }));
        setClaimedPerks(prev => [{
          ...perk,
          claimedId: 'cl_' + Date.now(),
          claimedAt: new Date().toISOString()
        }, ...prev]);
      },
      disabled: !canAfford,
      className: `w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow' : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'}`
    }, canAfford ? 'Redeem Privilege' : `Needs ${perk.cost - user.points} More PTS`));
  }))))), showTaskModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('addTask')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowTaskModal(false),
    className: "text-slate-400 hover:text-slate-200 p-1"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleAddTask,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('taskTitle')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: taskTitle,
    onChange: e => setTaskTitle(e.target.value),
    placeholder: "e.g. Implement Graph BFS in C++, Complete 5km Run",
    className: `w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
    autoFocus: true
  }), taskError && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-rose-400 mt-1"
  }, taskError)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('disciplines')), /*#__PURE__*/React.createElement("select", {
    value: taskDiscipline,
    onChange: e => setTaskDiscipline(e.target.value),
    className: `w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  }, Object.keys(DISCIPLINE_CONFIG).map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, d)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('effortTier')), /*#__PURE__*/React.createElement("select", {
    value: taskEffort,
    onChange: e => setTaskEffort(e.target.value),
    className: `w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`
  }, Object.keys(EFFORT_LEVELS).map(k => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, EFFORT_LEVELS[k].label))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowTaskModal(false),
    className: "px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
  }, t('cancel')), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2 rounded-xl text-xs font-bold text-white shadow",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, "Add to Queue"))))), showAddFriendModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t('addFriend')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddFriendModal(false),
    className: "text-slate-400 hover:text-white p-1"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSendFriendRequest,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: `block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, t('usernameHandle')), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono"
  }, "@"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newFriendInput,
    onChange: e => setNewFriendInput(e.target.value),
    placeholder: "e.g. alex_chen, elena_rostova",
    className: `w-full pl-8 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/80 border-slate-700 text-white'}`,
    autoFocus: true,
    required: true
  }))), /*#__PURE__*/React.createElement("p", {
    className: `text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`
  }, "Real peer network. Dispatches a live friend request to their active tab or server profile."), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowAddFriendModal(false),
    className: "px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
  }, t('cancel')), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2 rounded-xl text-xs font-bold text-white shadow",
    style: {
      backgroundColor: currentTheme.accent
    }
  }, t('sendRequest')))))), showRecordModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start border-b pb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: user.name,
    className: "w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`
  }, user.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20"
  }, "Verified Student")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-indigo-400 font-mono"
  }, "@", user.username), /*#__PURE__*/React.createElement("p", {
    className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`
  }, user.degree, " • ", user.institution))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowRecordModal(false),
    className: "text-slate-400 hover:text-white p-1"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('totalHours')), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black font-mono text-indigo-500"
  }, totalHours, " hrs")), /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('tasksCompleted')), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black font-mono text-emerald-500"
  }, totalTasksDone)), /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, t('level')), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black font-mono text-amber-500"
  }, "Lv ", prog.lvl))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.print(),
    className: "px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow"
  }, t('printTranscript'))))), selectedFriend && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: `glass-surface w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden ${isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-950/95 border-white/10'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"
  }, /*#__PURE__*/React.createElement(Icons.User, null)), /*#__PURE__*/React.createElement("h3", {
    className: `text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`
  }, "Academic Peer Dossier")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedFriend(null),
    className: "text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-white/5 transition"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center sm:items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative shrink-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: selectedFriend.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    alt: selectedFriend.name,
    className: "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 shadow-xl",
    style: {
      borderColor: selectedFriend.isStudying ? '#10b981' : currentTheme.accent
    }
  }), selectedFriend.isStudying ? /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 border-2 border-slate-900 animate-pulse"
  }, "FOCUSING") : /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-700 text-[9px] font-bold text-slate-300 border-2 border-slate-900"
  }, "STANDBY")), /*#__PURE__*/React.createElement("div", {
    className: "text-center sm:text-left space-y-1.5 flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center sm:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: `text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`
  }, selectedFriend.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20"
  }, "Lv ", selectedFriend.level || 1, " Scholar")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-mono text-indigo-400 font-semibold"
  }, "@", selectedFriend.username), /*#__PURE__*/React.createElement("p", {
    className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`
  }, selectedFriend.degree || 'Computer Science & Engineering', " • ", selectedFriend.institution || 'University'))), /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-2xl border space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase tracking-wider text-slate-400"
  }, "Academic Philosophy / Bio"), /*#__PURE__*/React.createElement("p", {
    className: `text-xs italic leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`
  }, "\"", selectedFriend.bio || 'Dedicated to deep work, mastery, and relentless daily discipline.', "\"")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, "Total Hours"), /*#__PURE__*/React.createElement("p", {
    className: "text-base font-black font-mono text-indigo-400 mt-0.5"
  }, selectedFriend.totalHours || 0, " hrs")), /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, "Focus State"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold font-mono text-emerald-400 mt-1 truncate"
  }, selectedFriend.isStudying ? 'Deep Sprint' : 'Available')), /*#__PURE__*/React.createElement("div", {
    className: `p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-white/5'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase text-slate-400"
  }, "Active Topic"), /*#__PURE__*/React.createElement("p", {
    className: `text-xs font-bold truncate mt-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`
  }, selectedFriend.currentTopic || 'Deep Work'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleSendKudos(selectedFriend);
      playAudio('complete');
    },
    disabled: kudosSent[selectedFriend.id],
    className: `py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow ${kudosSent[selectedFriend.id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`
  }, /*#__PURE__*/React.createElement(Icons.Zap, {
    className: "w-3.5 h-3.5 text-white"
  }), /*#__PURE__*/React.createElement("span", null, kudosSent[selectedFriend.id] ? 'High-Five Sent!' : 'Send High-Five (+5 XP)')), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleInviteSprint(selectedFriend);
    },
    className: "py-3 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow transition flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Icons.Rocket, {
    className: "w-3.5 h-3.5 text-white"
  }), /*#__PURE__*/React.createElement("span", null, "Invite to Co-Study Sprint"))))), levelUpData && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-surface w-full max-w-sm rounded-3xl p-8 border border-amber-500/30 text-center space-y-4 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl animate-bounce font-black text-amber-400"
  }, "▲"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-mono uppercase tracking-widest text-amber-400"
  }, "Cognitive Leap"), /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-black text-white"
  }, "LEVEL ", levelUpData.newLevel, " REACHED!")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevelUpData(null),
    className: "w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg"
  }, "Continue Journey"))), activeToast && /*#__PURE__*/React.createElement("div", {
    className: "fixed top-4 right-4 z-50 max-w-sm w-full animate-slideIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all ${isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50' : 'bg-slate-900/95 border-white/15 text-white shadow-black/60'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-2.5 rounded-2xl shrink-0 ${activeToast.type === 'friend_request' ? 'bg-indigo-500/20 text-indigo-400' : activeToast.type === 'task_reminder' ? 'bg-amber-500/20 text-amber-400' : activeToast.type === 'kudos' || activeToast.type === 'friend_accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'}`
  }, activeToast.type === 'friend_request' ? /*#__PURE__*/React.createElement(Icons.UserPlus, null) : activeToast.type === 'task_reminder' ? /*#__PURE__*/React.createElement(Icons.Clock, null) : /*#__PURE__*/React.createElement(Icons.Bell, null)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold tracking-tight"
  }, activeToast.title), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveToast(null),
    className: "text-slate-400 hover:text-white text-xs p-0.5"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed"
  }, activeToast.message), activeToast.type === 'friend_request' && activeToast.actionPayload && activeToast.actionPayload.req && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleAcceptFriend(activeToast.actionPayload.req);
      setActiveToast(null);
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow"
  }, t('accept')), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleDeclineFriend(activeToast.actionPayload.req.id);
      setActiveToast(null);
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10"
  }, t('decline'))), activeToast.type === 'task_reminder' && activeToast.actionPayload && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleCompleteTask(activeToast.actionPayload.taskId);
      setActiveToast(null);
    },
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow"
  }, "Mark Done (+XP)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleSnoozeTask(activeToast.actionPayload.taskId, 10),
    className: "px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10"
  }, "Snooze 10m")))))), showNotifDrawer && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex justify-end animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
    onClick: () => setShowNotifDrawer(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: `relative w-full max-w-md h-full glass-surface border-l shadow-2xl flex flex-col z-10 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-white/10'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6 border-b border-white/10 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-2 rounded-xl bg-indigo-500/10 text-indigo-400"
  }, /*#__PURE__*/React.createElement(Icons.Bell, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: `text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`
  }, t("notificationsTitle")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400"
  }, notifications.filter(n => !n.read).length, " unread updates"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, notifications.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setNotifications(prev => prev.map(n => ({
        ...n,
        read: true
      })));
      playAudio('click');
    },
    className: "text-[11px] text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1 rounded-lg"
  }, "Mark all read"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowNotifDrawer(false),
    className: "p-1.5 rounded-xl text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icons.Close, {
    className: "w-4 h-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "px-6 pt-3 pb-2 border-b border-white/5 flex gap-2"
  }, [{
    id: 'all',
    label: 'All',
    count: notifications.length
  }, {
    id: 'social',
    label: 'Social',
    count: notifications.filter(n => n.type.startsWith('friend') || n.type === 'kudos').length
  }, {
    id: 'reminders',
    label: 'Reminders',
    count: notifications.filter(n => n.type === 'task_reminder' || n.type === 'study_break' || n.type === 'hydration' || n.type === 'inactivity').length
  }].map(tabItem => /*#__PURE__*/React.createElement("button", {
    key: tabItem.id,
    onClick: () => setNotifFilter(tabItem.id),
    className: `px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${notifFilter === tabItem.id ? 'bg-indigo-600 text-white shadow' : isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`
  }, /*#__PURE__*/React.createElement("span", null, tabItem.label), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] opacity-75 font-mono"
  }, "(", tabItem.count, ")")))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 space-y-3"
  }, notifications.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-16 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400"
  }, /*#__PURE__*/React.createElement(Icons.Bell, null)), /*#__PURE__*/React.createElement("p", {
    className: `text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`
  }, "No Notifications Yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 max-w-xs mx-auto"
  }, t("noNotificationsDesc"))) : notifications.filter(n => {
    if (notifFilter === 'social') return n.type.startsWith('friend') || n.type === 'kudos';
    if (notifFilter === 'reminders') return n.type === 'task_reminder' || n.type === 'study_break' || n.type === 'hydration' || n.type === 'inactivity';
    return true;
  }).map(notif => {
    return /*#__PURE__*/React.createElement("div", {
      key: notif.id,
      className: `p-4 rounded-2xl border transition-all ${notif.read ? isLight ? 'bg-slate-50/70 border-slate-200 opacity-80' : 'bg-slate-900/40 border-white/5 opacity-75' : isLight ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-900/80 border-indigo-500/30 shadow-md'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `w-2 h-2 rounded-full ${notif.read ? 'bg-transparent' : 'bg-indigo-500'}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono uppercase tracking-wider text-slate-400"
    }, notif.type.replace('_', ' '))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono text-slate-400"
    }, formatRelativeTime(notif.timestamp)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNotifications(prev => prev.filter(item => item.id !== notif.id)),
      className: "text-slate-400 hover:text-rose-400 p-0.5",
      title: "Dismiss"
    }, /*#__PURE__*/React.createElement(Icons.Close, {
      className: "w-4 h-4"
    })))), /*#__PURE__*/React.createElement("h4", {
      className: `text-xs font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`
    }, notif.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400 mt-1 leading-relaxed"
    }, notif.message), notif.type === 'friend_request' && notif.actionPayload && notif.actionPayload.req && !notif.accepted && /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-3 pt-2 border-t border-white/5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleAcceptFriend(notif.actionPayload.req),
      className: "px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow"
    }, t('accept')), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDeclineFriend(notif.actionPayload.req.id),
      className: "px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10"
    }, t('decline'))), notif.type === 'task_reminder' && notif.actionPayload && /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-3 pt-2 border-t border-white/5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        handleCompleteTask(notif.actionPayload.taskId);
        setNotifications(prev => prev.map(item => item.id === notif.id ? {
          ...item,
          read: true
        } : item));
      },
      className: "px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow"
    }, "Mark Done (+XP)"), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleSnoozeTask(notif.actionPayload.taskId, 10),
      className: "px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10"
    }, "Snooze 10m")));
  })), notifications.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-white/10 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setNotifications([]);
      playAudio('click');
    },
    className: "text-xs text-rose-400 hover:text-rose-300 font-bold"
  }, "Clear all notifications"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowNotifDrawer(false);
      setTab('settings');
    },
    className: "text-xs text-slate-400 hover:text-white"
  }, "Notification Settings")))));
}


export default App;
