console.log('hello')
if ('serviceWorker' in navigator) { //checking if service worker is available and registering sw
    navigator.serviceWorker.register('/myPwaApp/service-worker.js', { scope: '/myPwaApp/', type: 'module' })
        .then(function(registration) {
            console.log('serviceworker registration success ');
        })
        .catch(function(error) {
            console.log("service worker register fail ", error)

        })

    ;
} else {
    console.log('serviceworker is not supported');
}

const notificationButton = document.getElementById('notification');
if ('Notification' in window && 'serviceWorker' in navigator) {
    notificationButton.addEventListener('click', () => {
        const permission = Notification.permission;
        console.log('Permission: ', permission);
        switch (permission) {
            case 'granted':
                showMyNotification();
                break;
            case 'denied':
                notificationButton.disabled = true;
                break;
            case 'default':
                requestUserPermission();
                showMyNotification();
                break;

        }


    });


} else {
    notificationButton.disabled = true;
}

function showMyNotification() {
    console.log("Showing Notification...");
    const notification = new Notification("successcfully subscribed", {
        body: "you're the member now"
    });

}

function requestUserPermission() {
    console.log("Requesting Permission");
    Notification.requestPermission()
        .then((permission) => {
            console.log('User chcoice: ', permission);
            if (permission == 'granted') {

                showMyNotification();
            }
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}