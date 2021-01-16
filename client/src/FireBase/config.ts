import firebase from 'firebase'
import config from './config.json'

const firebaseConfig = {
    apiKey: config.api_key,
    authDomain: config.auth_domain,
    databaseURL: config.database_url,
    projectId: config.project_id,
    storageBucket: config.storage_bucket,
    messagingSenderId: config.messaging_sender_id,
    appId: config.app_id
};

const client = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log('connect');

export { client, db }