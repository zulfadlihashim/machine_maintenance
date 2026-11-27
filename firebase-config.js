const firebaseConfig = {
    apiKey: "AIzaSyDYCmOLG7mPb8H9bIA9zHO76q3SaGFM-m4",
    authDomain: "dma2252-kvkerian-v2.firebaseapp.com",
    databaseURL: "https://dma2252-kvkerian-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dma2252-kvkerian-v2",
    storageBucket: "dma2252-kvkerian-v2.firebasestorage.app",
    messagingSenderId: "1079077182723",
    appId: "1:1079077182723:web:0f1863f741b6262ef86d36",
    measurementId: "G-5DG667B25X"
};

// Enjin Sambungan Firebase Realtime Database
try {
    firebase.initializeApp(firebaseConfig);
    window.dbFirebase = firebase.database();
    window.statusSambunganFirebase = true;
} catch (err) {
    console.error("Ralat sambungan Firebase:", err);
    window.statusSambunganFirebase = false;
}