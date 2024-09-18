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
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const authRepository_1 = __importDefault(require("../modules/auth/authRepository"));
const authService_1 = require("../modules/auth/authService");
const authService = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const AuthRepository = (0, authRepository_1.default)();
    const service = (0, authService_1.createAuthService)(AuthRepository);
    server.decorate('authService', service);
});
exports.default = (0, fastify_plugin_1.default)(authService);
