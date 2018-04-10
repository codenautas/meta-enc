"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'operativos',
        elementName:'operativo',
        editable:admin,
        fields:[
            {name:"operativo"         , typeName:'text'                   ,},
            {name:"nombre"            , typeName:'text'                   ,},
        ],
        primaryKey:['operativo'],
        detailTables:[
            {table:'casilleros-principales', fields:['operativo'], abr:'C' , label:'casilleros principales'  },
            {table:'casilleros'            , fields:['operativo'], abr:'P' , label:'casilleros (forma plana)'},
            {table:'unidad_analisis'       , fields:['operativo'], abr:'UA', label:'unidades de análisis'    },
        ],
    },context);
}
