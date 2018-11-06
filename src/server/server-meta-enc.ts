"use strict";

import { emergeAppMetaEnc } from "./app-meta-enc";
import { emergeAppRelEnc, emergeAppOperativos, AppBackend} from "rel-enc";

var AppMetaEnc = emergeAppMetaEnc(emergeAppRelEnc(emergeAppOperativos(AppBackend)));
new AppMetaEnc().start();