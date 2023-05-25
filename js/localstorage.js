/**
 * 
 * @param {String} key
 * @param {any} data 
 */

export function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/**
 * 
 * @param {String} key 
 * @returns {any | null} 
 */
export function get(key) {
    return JSON.parse(localStorage.getItem(key)) || null
}

/**
 * 
 * @param {string} key 
 */
export function remove(key) {
    localStorage.removeItem(key)
}