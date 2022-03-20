const strKeys = ['district','legal_nationality','nationality','nation','police_unit']
export default (map,keyType = 'number') => {
    const list = []
    for(let key in map) {
        list.push({
            label: map[key],
            value: keyType === 'string' ? key : +key
        })
    }

    return list
}