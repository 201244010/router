const STOK = '__stok';

const init = (stok) => {
    try {
        window.sessionStorage.setItem(STOK, stok);
    } catch(e) {
        window[STOK] = stok;
    }
}

const get = () => {
    let stok;
    try {
        stok = window.sessionStorage.getItem(STOK);
    } catch (e) {
        stok = window[STOK];
    }

    return stok;
}
const clear = () => {
    try {
        window.sessionStorage.removeItem(STOK);
    } catch (e) {
        window[STOK] = null;
    }
}

export { init, get, clear };