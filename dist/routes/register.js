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
const login_1 = __importDefault(require("../modules/login/login"));
const registerRoutes = (server) => __awaiter(void 0, void 0, void 0, function* () {
    server.post('/login', (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { usernameOrEmail, password } = request.body;
        if (server.mongo.db) {
            const coll1 = server.mongo.db.collection('users');
            console.log(yield coll1.find().toArray());
        }
        return (0, login_1.default)(usernameOrEmail, password);
    }));
});
exports.default = registerRoutes;
