const respError = (status, message, data) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    err.data = data || {};
    data && (err.total = data?.length || 0);
    return err;
};

module.exports = respError;
