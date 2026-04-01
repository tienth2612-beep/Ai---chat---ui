// Import and configure the Firebase SDK
// These imports are for the Firebase JS SDK v9+
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA9TZvsYBydsPQrXTrhHEAJAkAqSTUDxv4",
  authDomain: "hitradies-e7b9a.firebaseapp.com",
  projectId: "hitradies-e7b9a",
  storageBucket: "hitradies-e7b9a.firebasestorage.app",
  messagingSenderId: "360958030086",
  appId: "1:360958030086:web:6fde50030390453ef42e87",
  measurementId: "G-PQBCTHB317"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Job Management Dashboard';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  // console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'view') {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if no existing window found
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/';
          return clients.openWindow(self.location.origin + urlToOpen);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    // console.log('Notification dismissed');
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/';
          return clients.openWindow(self.location.origin + urlToOpen);
        }
      })
    );
  }
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
  // console.log('[firebase-messaging-sw.js] Notification closed.');
});
