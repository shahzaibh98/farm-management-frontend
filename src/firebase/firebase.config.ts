// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCeOVKoyHjpoHYJHtpv8KGKCzaMNI6bCOk',
  authDomain: 'farm-management-1d50a.firebaseapp.com',
  projectId: 'farm-management-1d50a',
  storageBucket: 'farm-management-1d50a.appspot.com',
  messagingSenderId: '983954423336',
  appId: '1:983954423336:web:027ec0a5277440efaa3f1d',
  measurementId: 'G-6C7Y0YDEWV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

/**
 * Request Token
 */
export const requestForToken = () => {
  return getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_KEY })
    .then((currentToken: string | PromiseLike<string | null> | null) => {
      if (currentToken) {
        return currentToken;
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.'
        );
        return null;
      }
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

/**
 * Message listener
 * @returns Message promise
 */
export const onMessageListener = () =>
  new Promise(resolve => {
    setTimeout(() => {
      onMessage(messaging, payload => {
        resolve(payload);
      });
    }, 500);
  });
