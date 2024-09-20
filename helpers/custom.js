const moment = require('moment');

const isValidDate = (dateString, format = 'YYYY-MM-DD') => {
    let formattedDate = null;
    const formats = [
        'DD-MM-YYYY',
        'D-M-YYYY',
        'DD/MM/YYYY',
        'D/M/YYYY',
        'MM-DD-YYYY',
        'M-D-YYYY',
        'MM/DD/YYYY',
        'M/D/YYYY',
        'YYYY-MM-DD',
        'YYYY-M-D',
        'YYYY/MM/DD',
        'YYYY/M/D',
    ];
    for (const formatString of formats) {
        const parsedDate = moment(dateString, formatString, true);
        if (parsedDate.isValid()) {
            formattedDate = parsedDate.format(format);
            break;
        }
    }

    return formattedDate;
};

const formatedDateTime = (dateString, format = 'YYYY-MM-DD HH:mm:ss') => {
    const date = isValidDate(dateString, format);
    if (!date) return null;
    return moment(date).format(format);
};

const formatedDate = (dateString, format = 'YYYY-MM-DD') => {
    const date = isValidDate(dateString, format);
    if (!date) return null;
    return moment(date).format(format);
};

const futureDate = (dateString, day = 1, format = 'YYYY-MM-DD') => {
    const date = formatedDate(dateString, format);
    if (!date) return null;
    return moment(date).add(day, 'days').format(format);
};

const uniqueFileName = (prefix) => {
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);

    return prefix + '-' + year + month + day + '-' + hours + minutes + seconds;
}

module.exports = {
    isValidDate,
    formatedDateTime,
    formatedDate,
    futureDate,
    uniqueFileName
};