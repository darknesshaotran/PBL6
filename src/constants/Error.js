class ErrorsWithStatus extends Error {
    constructor({ status, message }) {
        super(message); // (1)
        this.name = 'ErrorsWithStatus'; // (2)
        this.status = status;
    }
}

module.exports = ErrorsWithStatus;
