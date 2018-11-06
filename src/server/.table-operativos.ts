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
            {table:'casilleros_principales', fields:['operativo'], abr:'C' , label:'casilleros principales', refreshParent:true  },
            {table:'casilleros'            , fields:['operativo'], abr:'P' , label:'casilleros (forma plana)', refreshParent:true  },
            {table:'unidad_analisis'       , fields:['operativo'], abr:'UA', label:'unidades de análisis', refreshParent:true  },
        ],
    },context);
}
