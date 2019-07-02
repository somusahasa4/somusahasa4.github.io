// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  event.waitUntil(
   caches.open(CACHE_NAME).then(function(cache) {
     return cache.addAll(urlsToCache);
     console.log('cache install');
   })
 );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
  event.waitUntil(
  	// Open our apps cache and delete any old cache items
  	caches.open(CACHE_NAME).then(function(cacheNames){
  		cacheNames.keys().then(function(cache){
  			cache.forEach(function(element, index, array) {
  				if (urlsToCache.indexOf(element) === -1){
  					caches.delete(element);
            console.log('cache activate');
  				}
  	    });
  		});
  	})
  );
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});






importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '313445919700'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]



// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
 console.log('[firebase-messaging-sw.js] Received background message', payload);
 // Customize notification here
 var notificationTitle = 'Background Message Title';
 var notificationOptions = {
   body: 'Background Message body.',
   icon: '/firebase-logo.png'
 };

 return self.registration.showNotification(notificationTitle,
   notificationOptions);
});
// [END background_handler]



var urlsToCache = [
    '/',
    'https://verticurl-sandbox.neolane.net/res/verticurl/firebase-messaging-sw.js'
];
