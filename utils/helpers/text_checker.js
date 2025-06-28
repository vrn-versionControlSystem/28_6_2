
const capitalize = (value) => {
    if (value === null || value === undefined || value === '')
        return null
    else
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

const isNumeric = (value) => {
    return /^\d+$/.test(value);
}

const toLowerCase = (value) => {
    return String(value).replace(/\s+/g, ' ').toLowerCase()
}

const toLowerCaseOrNull = (value) => {
    if (!value)
        return null
    else
        return String(value).toLowerCase()
}

const toUpperCase = (value) => {
    return String(value).replace(/\s+/g, ' ').toUpperCase()
}

const toUpperCaseOrNull = (value) => {
    if (!value)
        return null
    else
        return String(value).toUpperCase()
}

const trimSpace = (value) => {
    if (!value)
        return null
    else
        return String(value).replace(/\s+/g, ' ').trim()
}

module.exports = { capitalize, isNumeric, toLowerCase, toLowerCaseOrNull, toUpperCase, toUpperCaseOrNull, trimSpace }