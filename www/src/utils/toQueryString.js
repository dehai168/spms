export default (url,query = {}) => {
    const s = new URLSearchParams()
    for(let key in query) {
        s.append(key,query[key])
    }
    const q = s.toString()
    return q ? (url + '?' + q) : url
}