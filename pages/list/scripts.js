import MusicDB from '../../js/music-db.js';
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
        .then((registration) => {
            console.log('Ready', registration.active);
            const controller = registration.active
            controller.postMessage("hello list page");

        });
}

const musicDB = new MusicDB();
const output = document.getElementById('output');


document.getElementById('list-music').addEventListener('click', listMusic);


function listMusic() {
    const genre = document.getElementById('music-genre').value;
    output.innerText = '';

    if (genre === '') {
        musicDB.getAll()
            .then((results) => {
                console.log('lists: ', results);
                results.forEach((result) => {
                    appendMusic(result);

                });
            })
            .catch((errorMessage) => {
                console.log('catch: ', errorMessage);
            });

    } else {
        musicDB.get(genre)
            .then((results) => {
                console.log('lists: ', results);
                results.forEach((result) => {
                    appendMusic(result);

                });
            })
            .catch((errorMessage) => {
                console.log('catch: ', errorMessage);
            });
    }

}

function appendMusic(music) {
    console.log(music);
    const status = music.hasFinished ? 'Completed!' : 'Still Playing';
    const eleMusic = document.createElement('div');
    eleMusic.className = "music-item";
    output.append(eleMusic);
    eleMusic.innerHTML = `
        <span>${music.genre}</span>
        <h3>${music.title}</h3>
        <div>
            <b>Status:</b> 
            ${status} 
        </div>
    
    `;
    const eleStatus = document.createElement('button');
    eleMusic.append(eleStatus);
    eleStatus.innerText = 'Change Status';
    eleStatus.addEventListener('click', () => {
        musicDB.update(music, !music.hasFinished)
            .then((music) => {
                console.log("update success", music);
                const status = music.hasFinished ? 'Completed!' : 'Still Playing';
                eleMusic.innerHTML = `
                <span>${music.genre}</span>
                <h3>${music.title}</h3>
                <div>
                    <b>Status:</b> 
                    ${status} 
                </div>
            
            `;

            })
            .catch((errorMessage) => {
                console.log('Update error', errorMessage);
            });

    });

    const eleRemove = document.createElement('button');
    eleMusic.append(eleRemove);
    eleRemove.innerText = 'Remove Music';
    eleRemove.addEventListener('click', () => {
        musicDB.delete(music)
            .then(() => {
                eleMusic.remove(eleMusic);
            })
            .catch((errorMessage) => {
                console.log('Delete error', errorMessage);
            });

    });



}