
export function register(url) {
    navigator.serviceWorker.register(url)
        .then(registration => {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(error => {
            console.log(error);
        });
}
