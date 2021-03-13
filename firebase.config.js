import firebase from '@firebase/app'
import '@firebase/firestore'

try {
	const config = {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.FIREBASE_DATABASE,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderID: process.env.FIREBASE_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID
	}
	firebase.initializeApp(config)
} catch (error) {
	if ('/already exist/' !== error.message) {
		console.error('Firebase init error')
	}
}

const db=firebase.firestore();

export default db;
