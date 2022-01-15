"use strict";

import {TableDefinition, TableContext} from "./types-meta-enc";

var { casilleros } = require('./table-casilleros.js')

export function subcasilleros(context:TableContext):TableDefinition{
    var def = casilleros(context);
    def.sql.isTable=false;
    def.functionDef={parameters:[
        {name:'operativo'   , typeName:'text'},
        {name:'id_casillero', typeName:'text'}
    ]};
    def.sql.from=`(
        with recursive subcasilleros(operativo, id_casillero) as (
                select $1 as operativo, $2 as id_casillero, 0::bigint as depth
            union all
                select c.operativo, c.id_Casillero, s.depth+1
                    from subcasilleros s inner join casilleros c 
                        on s.operativo = c.operativo and s.id_casillero = c.padre
        )
        select c.*, cr.*
            from subcasilleros s inner join casilleros c using (operativo, id_casillero)
                , lateral casilleros_recursivo(operativo, id_casillero) cr
            where s.depth>0
    )`;
    return def;
}
