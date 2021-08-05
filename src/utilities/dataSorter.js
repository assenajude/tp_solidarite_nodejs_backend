const dataSorter = (list) => {
    const sortedList = list.sort((a, b) => {
        if(a.createdAt>b.createdAt) return -1;
        if(a.createdAt<b.createdAt) return 1
        return 0
    })
    return sortedList
}

module.exports = dataSorter
