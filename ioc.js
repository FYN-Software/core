const services = new Map();

export default new Proxy({}, {
    get: (_, key) => services.get(key),
    set: (_, key, value) => services.set(key, value),
});