import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyARpTujzKScSh1uWFU3mZ2psx_oJNlQsZc",
    authDomain: "oi-tickets.firebaseapp.com",
    databaseURL: "https://oi-tickets-default-rtdb.firebaseio.com",
    storageBucket: "oi-tickets.appspot.com",
    // authDomain: "http://127.0.0.1",
    // databaseURL: "http://127.0.0.1:9000?ns=oi-tickets",
    // storageBucket: "http://127.0.0.1:9199",
    projectId: "oi-tickets",
    messagingSenderId: "19311167801",
    appId: "1:19311167801:web:29d5246376348e9d1780e8",
    measurementId: "G-6LL4L6L35Y"
};

firebase.initializeApp(firebaseConfig);

export default firebase;