"use strict";

import {TableDefinition, TableContext} from "./types-meta-enc";

export function tipoc_tipoc(context:TableContext):TableDefinition{
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'tipoc_tipoc',
        title:'inclusiones válidas de casillero',
        elementName:'validez',
        editable:admin,
        fields:[
            {name:"tipoc_padre"       , typeName:'text'                   },
            {name:"tipoc_hijo"        , typeName:'text'                   },
        ],
        primaryKey:['tipoc_padre','tipoc_hijo'],
        foreignKeys:[
            {references:'tipoc', fields:[{source:'tipoc_padre', target:'tipoc'}], alias:'p', consName:'tipoc_tipoc padre REL'},
            {references:'tipoc', fields:[{source:'tipoc_hijo' , target:'tipoc'}], alias:'h', consName:'tipoc_tipoc hijos REL'},
        ]
    },context);
}
