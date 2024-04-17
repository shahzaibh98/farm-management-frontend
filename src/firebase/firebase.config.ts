// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAUEyv61olP5jiwflEi74LvmTKRsz5d6SQ',
  authDomain: 'concave-agri.firebaseapp.com',
  projectId: 'concave-agri',
  storageBucket: 'concave-agri.appspot.com',
  messagingSenderId: '69749560271',
  appId: '1:69749560271:web:977dd82560e4d08af0b8ba',
  measurementId: 'G-D395MPY777',
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
