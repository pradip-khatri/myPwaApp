import MusicDB from '../../js/music-db.js';


const musicDB = new MusicDB();

document.getElementById('add-music-button').addEventListener('click', addMusic);

function addMusic() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                console.log('Ready', registration.active);
                const controller = registration.active
                controller.postMessage("hello add page");

                if (registration.sync) {
                    console.log("sync is available");

                    registration.sync.register('myTag')
                        .then(() => {
                            console.log("tag registered");
                        });
                    registration.sync.getTags()
                        .then((tags) => {
                            if (tags.includes('myTag')) {
                                console.log("message sync already requested");
                            } else {
                                console.log('not requested yet');
                            }
                            console.log("my tags: ", tags);

                        });
                }


            });
    }
    const title = document.getElementById('music-title').value;
    const genre = document.getElementById('music-genre').value;
    const hasFinished = document.getElementById('has-finished-music').checked;

    musicDB.add(title, genre, hasFinished)
        .then((event) => {
            console.log('Add success!!', event);
            document.getElementById('music-add-success').style.display = 'block';

        })
        .catch((errorMessage) => {
            console.log('failed to add:', errorMessage);
            document.getElementById('music-add-failed').style.display = 'block';

        });


}

navigator.serviceWorker.addEventListener('message', (message) => {
    console.log('in add page listening to service worker message: ', message.data);
    alert('just synched ' + message.data.msg + ' music');


});