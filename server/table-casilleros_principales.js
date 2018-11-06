"use strict";
var tableCasilleros = require('./table-casilleros.js');
module.exports = function (context) {
    var def = tableCasilleros(context);
    def.filterColumns = [{ column: 'padre', operator: '\u2205', value: null }];
    def.sql.isTable = false;
    return def;
};
//# sourceMappingURL=table-casilleros_principales.js.map