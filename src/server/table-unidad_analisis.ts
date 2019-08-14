"use strict";

//TODO: solucionar redundancia en el manejo de Tablas de datos/relaciones/unidad de analisis/array en server-app.ts
// una opción es generar tabla_datos y relaciones a partir de UAs
module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'unidad_analisis',
        elementName:'unidad de análisis',
        editable:admin,
        fields:[
            {name:"operativo"        , typeName:'text'                },
            {name:"unidad_analisis"  , typeName:'text'                },
            {name:"nombre"           , typeName:'text'                },
            {name:"pk_agregada"      , typeName:'text'                },
            {name:"padre"            , typeName:'text'                },
            {name:"orden"            , typeName:'text'                },
            {name:"principal"        , typeName:'boolean'             },
        ],
        primaryKey:['operativo','unidad_analisis'],
        foreignKeys:[
            {references:'operativos', fields:['operativo']},
        ],
        detailTables:[
            {table:'casilleros_principales', fields:['operativo','unidad_analisis'], abr:'C', label:'casilleros'  },
        ],
        sortColumns:[
            {column:'orden'}
        ]
    },context);
}
