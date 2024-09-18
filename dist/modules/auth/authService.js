"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthService = createAuthService;
const errors_1 = require("../../common/errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authService = (AuthRepository) => {
    const register = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (!email || !password)
            throw new errors_1.ForbiddenError('email or password missing');
        let user = yield AuthRepository.findOne(email);
        if (user.email)
            throw new errors_1.ForbiddenError('user already exists');
        try {
            const newUser = yield AuthRepository.create(username, email, password);
        }
        catch (e) {
            console.log(e);
            throw new errors_1.InternalServerError(e);
        }
        console.log('Send Successfully!!!');
    });
    const login = (usernameOrEmail, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (!usernameOrEmail || !password) {
            throw new errors_1.ForbiddenError('username or password missing');
        }
        let user = yield AuthRepository.findOne(usernameOrEmail);
        if (!user) {
            throw new errors_1.NotFoundError('user does not exists!');
        }
        const bcryptPromise = new Promise((resolve, reject) => {
            bcrypt_1.default.compare(password, user.password, function (err, result) {
                if (err) {
                    reject(err.message);
                }
                if (!result)
                    reject('username or password is wrong');
                resolve('username logged in');
            });
        });
        try {
            yield bcryptPromise;
        }
        catch (e) {
            throw new errors_1.ForbiddenError(e);
        }
        return {
            loggedIn: true,
        };
    });
    return {
        register,
        login,
    };
};
function createAuthService(AuthRepository) {
    return authService(AuthRepository);
}
