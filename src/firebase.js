// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey = process.env.REACT_APP_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: 'noname-digital-test-be91a.firebaseapp.com',
  projectId: 'noname-digital-test-be91a',
  storageBucket: 'noname-digital-test-be91a.appspot.com',
  messagingSenderId: '113589988461',
  appId: '1:113589988461:web:364f6ef1418a576e8ba364',
  measurementId: 'G-WRK4S4XC3T',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();

// console.log();
// getDocs(collection(firestore, 'users'))
//   .then(r => console.log(r))
//   .catch(err => console.log(123, err));

// addDoc(collection(firestore, 'users'), {
//   first: 'Alan',
//   middle: 'Mathison',
//   last: 'Turing',
//   born: 1912,
// });
