import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyCqoj9Mnyq-WRpj3EYGtF4Zm-elz9E5ozw",
    authDomain: "maps-48061.firebaseapp.com",
    databaseURL: "https://maps-48061-default-rtdb.firebaseio.com",
    projectId: "maps-48061",
    storageBucket: "maps-48061.appspot.com",
    messagingSenderId: "521854255853",
    appId: "1:521854255853:web:719cc8e6568439a58842e4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
