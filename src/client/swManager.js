function register(url) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(url)
            .then((registration) => {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

export { register };
