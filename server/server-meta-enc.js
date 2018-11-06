"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_meta_enc_1 = require("./app-meta-enc");
const rel_enc_1 = require("rel-enc");
var AppMetaEnc = app_meta_enc_1.emergeAppMetaEnc(rel_enc_1.emergeAppRelEnc(rel_enc_1.emergeAppOperativos(rel_enc_1.AppBackend)));
new AppMetaEnc().start();
//# sourceMappingURL=server-meta-enc.js.map