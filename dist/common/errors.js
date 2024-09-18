"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = void 0;
class CustomError extends Error {
    constructor(code, statusCode, message) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}
class UnauthorizedError extends CustomError {
    constructor(message) {
        super('UNAUTHORIZED', 401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message, customCode) {
        super(customCode !== null && customCode !== void 0 ? customCode : 'FORBIDDEN', 403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends CustomError {
    constructor(message) {
        super('NOT_FOUND', 404, message);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends CustomError {
    constructor(message) {
        super('INTERNAL_SERVER_ERROR', 500, message);
    }
}
exports.InternalServerError = InternalServerError;
