"use strict";

import {TableDefinition, TableContext} from "./types-meta-enc";

var { casilleros } = require('./table-casilleros.js')

export function formularios_json(context:TableContext):TableDefinition{
    var def = casilleros(context);
    def.filterColumns = [{column:'padre', operator:'\u2205', value:null}];
    def.sql.isTable=false;
    return def;
}
