"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'usuarios',
        title:'usuarios',
        editable:admin,
        fields:[
            {name:'usuario'         , typeName:'text'   , nullable:false, editable:admin },
            {name:'md5clave'        , typeName:'text'                   , allow:{select: context.forDump} },
            {name:'activo_hasta'    , typeName:'date'                   , editable:admin},
            {name:'bloqueado_desde' , typeName:'date'                   , editable:admin},
            {name:'rol'             , typeName:'text'                   , editable:admin},
            {name:'clave_nueva'     , typeName:'text', clientSide:'newPass', editable:admin },
        ],
        primaryKey:['usuario'],
        sql:{
            where:admin?'true':"usuario = "+context.be.db.quoteText(context.user.usuario)
        }
    },context);
}