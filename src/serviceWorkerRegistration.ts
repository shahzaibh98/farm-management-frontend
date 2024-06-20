export const register = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log(
            'Service Worker registration successful with scope: ',
            registration.scope
          );
        })
        .catch(err => {
          console.error('Service Worker registration failed: ', err);
        });
    });
  }
};
