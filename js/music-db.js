import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
export default class MusicDB {
    constructor() {
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyApm-ZTxnKbrwxGm5brcCKmA3f4_0-0sAU",
            authDomain: "mypwaapp-7ba40.firebaseapp.com",
            projectId: "mypwaapp-7ba40",
            storageBucket: "mypwaapp-7ba40.appspot.com",
            messagingSenderId: "753969617778",
            appId: "1:753969617778:web:25e7c3b7ded136ccb95beb"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);

        this.hasSync = false;
        this.swController = null;
        this.swRegistration = null;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
                .then((registration) => {
                    if (registration.active && registration.sync) {
                        this.hasSync = true;
                        this.swController = registration.active;
                        this.swRegistration = registration;
                        console.log(this.hasSync + "\n" + this.swController + ServiceWorker);
                    }
                });
        }

    }
    add(title, genre, hasFinished) {
        const dbCollection = collection(this.db, "music");
        console.log("collection", dbCollection)

        return addDoc(dbCollection, {
            title: title,
            genre: genre,
            hasFinished: hasFinished
        })

        ;
    }
    get(genre) {
        return new Promise((resolve, reject) => {
            const dbCollection = collection(this.db, "music");
            const dbQuery = query(dbCollection, where("genre", "==", genre));
            getDocs(dbQuery)
                .then((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        results.push({
                            id: doc.id,
                            title: data.title,
                            genre: data.genre,
                            hasFinished: data.hasFinished
                        });
                    });
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            getDocs(collection(this.db, "music"))
                .then((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log(doc.id, data);
                        results.push({
                            id: doc.id,
                            title: data.title,
                            genre: data.genre,
                            hasFinished: data.hasFinished
                        });

                    });
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    }
    update(music, updateHasFinished) {
        console.log('update: ', music);
        return new Promise((resolve, reject) => {
            const dbDoc = doc(this.db, "music", music.id);
            updateDoc(dbDoc, {
                    hasFinished: updateHasFinished
                })
                .then(() => {
                    music.hasFinished = updateHasFinished;
                    resolve(music);
                })
                .catch((error) => {
                    reject(error);

                });
        });
    }
    delete(music) {
        const dbDoc = doc(this.db, "music", music.id);
        return deleteDoc(dbDoc);
    }

}