"use strict";

import {TableDefinition, TableContext} from "./types-meta-enc";

export function formularios_json(context:TableContext):TableDefinition{
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'formularios_json',
        editable:admin,
        fields:[
            {name:"operativo"         , typeName:'text'    },
            {name:"id_caso"           , typeName:'text'    },
            {name:"datos_caso"        , typeName:'jsonb'   },
        ],
        primaryKey:['operativo','id_caso'],
    },context);
}
