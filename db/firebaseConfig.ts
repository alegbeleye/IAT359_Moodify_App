import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyMQL4jjnX9CEjkxNp6_Z_Zthu9HeDjbo",
    authDomain: "moodify-7fc4c.firebaseapp.com",
    projectId: "moodify-7fc4c",
    storageBucket: "moodify-7fc4c.firebasestorage.app",
    messagingSenderId: "1019468333568",
    appId: "1:1019468333568:web:f7b7fbe387aefbe4fc4ee5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };