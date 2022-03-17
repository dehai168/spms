export default (map) => {
    const list = []
    for(let key in map) {
        list.push({
            label: map[key],
            value: key
        })
    }
    return list
}