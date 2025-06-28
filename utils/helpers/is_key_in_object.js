const isKeyInObject = (obj, keysToCheck) => {
    if (obj.hasOwnProperty(keysToCheck)) {
        return true
    } else {
        return false
    }
}


module.exports = isKeyInObject