
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Default credentials, or provide a service account JSON
  databaseURL: 'https://<your-project-id>.firebaseio.com',
});

const db = admin.firestore();
module.exports = db;
