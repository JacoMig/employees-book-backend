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
const errors_1 = require("../../common/errors");
const loginService = (usernameOrEmail, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!usernameOrEmail || !password) {
        throw new errors_1.ForbiddenError('username or password missing');
    }
    /*
        let user = await UserModel.findOne({$or: [
            {username: usernameOrEmail},
            {email: usernameOrEmail}
        ] });
    
        if(!user) {
            res.status(404).send('User does not exist!')
            return
        }
    
        
        bcrypt.compare(password, user.password, function(err, result) {
            if(err) {
                console.log(err)
            }
            console.log(result)
            res.status(200)
        }); */
});
exports.default = loginService;
