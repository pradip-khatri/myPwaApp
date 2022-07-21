import MusicDB from './js/music-db.js';
const musicdb = new MusicDB();
const cacheName = 'cache-v1';
//code to install the app
//cache strategy: Network with Cache Fallback

self.addEventListener('install', (event) => {
    console.log('sw installed ');


});
//code to activate the app
self.addEventListener('activate', function(event) {
    console.log('sw activated.');
    event.waitUntil(clients.claim());
    clients.matchAll()
        .then((matchedClients) => {
            console.log('matchedClients: ', matchedClients);
            matchedClients.forEach((client) => {
                console.log('client: ', client);
                client.postMessage('My client');
            })

        });
});
//code with the call back function to fetch the data and respond the request by returning the object which matches the request

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .then(function(response) {
            return response

        })
    );
});

self.addEventListener('message', (message) => {
    console.log('SW received message: ', message);
});

self.addEventListener('sync', (event) => {
    console.log('synchronization with tag: ', event);
    musicdb.getAll()
        .then((games) => {
            console.log('musics: ', games);


        });
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                msg: 'msg from service worker'
            });
        });
    });
    if (event.tag === 'myTag') {
        console.log("tag received from add page");
    }
});