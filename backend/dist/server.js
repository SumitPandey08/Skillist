"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const port = env_1.env.PORT;
console.log('🔧 Starting server...');
console.log('Initializing app...');
app_1.default.listen(port, () => {
    console.log(`🚀 ECHFLUX Backend running on http://localhost:${port} in ${env_1.env.NODE_ENV} mode`);
});
//# sourceMappingURL=server.js.map