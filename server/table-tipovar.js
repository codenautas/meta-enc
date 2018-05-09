"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'tipovar',
        title:'tipos de variables',
        elementName:'tipo de variable',
        editable:admin,
        fields:[
            {name:"tipovar"   , typeName:'text'     },
            {name:"html_type" , typeName:'text'     },
            {name:"type_name" , typeName:'text'     },
            {name:"validar"   , typeName:'text'     },
            {name:"radio"     , typeName:'boolean'  },
        ],
        primaryKey:['tipovar'],
        detailTables:[
            {table:'casilleros' , fields:['tipovar'], abr:'c', label:'casilleros' }
        ]
    },context);
}
