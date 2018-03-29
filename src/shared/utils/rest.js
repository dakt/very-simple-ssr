const BASE_URL = 'http://localhost:3000/api';


function doApiCall(url, method = 'GET') {
    let structuredResponse = null;
    const header = {
        method,
    };

    return fetch(url, header)
        .then((response) => {
            structuredResponse = {
                count: response.headers.get('x-total-count'),
                page: response.headers.get('x-page'),
                limit: response.headers.get('x-limit'),
            };

            return response.json();
        })
        .then(json => ({
            ...structuredResponse,
            ...json,
        }));
}

function get(resource) {
    const url = BASE_URL + resource;
    return doApiCall(url);
}

function post(resource, data) {
    const url = BASE_URL + resource;
    return doApiCall(url, 'POST');
}

function update(resource, data) {
    const url = BASE_URL + resource;
    return doApiCall(url, 'PATCH');
}

function remove(resource) {
    const url = BASE_URL + resource;
    return doApiCall(url, 'DELETE');
}

export default resource => ({
    get: () => get(resource),
    post: data => post(resource, data),
    update: data => update(resource, data),
    remove: () => remove(resource),
});
