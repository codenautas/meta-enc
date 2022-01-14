"use strict";

import {TableDefinition, TableContext} from "./types-meta-enc";

export function tipoc(context:TableContext):TableDefinition{
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'tipoc',
        title:'tipos de casillero',
        elementName:'tipo de casillero',
        editable:admin,
        fields:[
            {name:"tipoc"             , typeName:'text'                   },
            {name:"denominacion"      , typeName:'text'    ,isName:true   },
            {name:"irrepetible"       , typeName:'boolean'                },
            {name:"desp_casillero"    , typeName:'text'                   },
            {name:"desp_hijos"        , typeName:'text'                   },
            {name:"puede_ser_var"     , typeName:'boolean'                },
        ],
        primaryKey:['tipoc'],
        detailTables:[
            {table:'tipoc_tipoc', fields:[{source:'tipoc', target:'tipoc_hijo' }], abr:'p', label:'padres posibles' },
            {table:'tipoc_tipoc', fields:[{source:'tipoc', target:'tipoc_padre'}], abr:'h', label:'hijos  posibles' },
            {table:'casilleros' , fields:['tipoc'], abr:'c', label:'casilleros' }
        ]
    },context);
}
