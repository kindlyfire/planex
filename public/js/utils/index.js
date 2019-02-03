export function sortAlpha(arr, key = null) {
    if (key) {
        return arr.sort((a, b) => {
            return a[key].localeCompare(b[key])
        })
    } else {
        return arr.sort((a, b) => {
            return a.localeCompare(b)
        })
    }
}
