"use strict";

module.exports = function(context){
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
        ],
        primaryKey:['tipoc'],
        detailTables:[
            {table:'tipoc_tipoc', fields:[{source:'tipoc', target:'tipoc_hijo' }], abr:'p', label:'padres posibles' },
            {table:'tipoc_tipoc', fields:[{source:'tipoc', target:'tipoc_padre'}], abr:'h', label:'hijos  posibles' },
            {table:'casilleros' , fields:['tipoc'], abr:'c', label:'casilleros' }
        ]
    },context);
}
