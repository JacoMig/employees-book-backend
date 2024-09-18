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
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../../userSchema");
function authRepository() {
    const findOne = (usernameOrEmail) => __awaiter(this, void 0, void 0, function* () {
        const n = yield userSchema_1.UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        return {
            username: n === null || n === void 0 ? void 0 : n.username,
            email: n === null || n === void 0 ? void 0 : n.email,
            password: n === null || n === void 0 ? void 0 : n.password
        };
    });
    const create = (username, email, password) => __awaiter(this, void 0, void 0, function* () {
        return yield new userSchema_1.UserModel({
            username,
            email,
            password,
        }).save();
    });
    return {
        findOne,
        create,
    };
}
exports.default = authRepository;
