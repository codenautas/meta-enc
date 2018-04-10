"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'casilleros',
        elementName:'casillero',
        editable:admin,
        fields:[
            {name:"operativo"             , typeName:'text'                      , editable:admin },
            {name:"id_casillero"          , typeName:'text', nullable:true       , editable:false },
            {name:"padre"                 , typeName:'text'                      , editable:admin },
            {name:"tipoc"                 , typeName:'text'                      , editable:admin },
            {name:"casillero"             , typeName:'text'                      , editable:admin },
            {name:"orden"                 , typeName:'bigint'                    , editable:admin },
            {name:"nombre"                , typeName:'text'                      , editable:admin },
            {name:"tipovar"               , typeName:'text'                      , editable:admin },
            {name:"longitud"              , typeName:'text'                      , editable:admin },
            {name:"tipoe"                 , typeName:'text'                      , editable:admin },
            {name:"aclaracion"            , typeName:'text'                      , editable:admin },
            {name:"salto"                 , typeName:'text'                      , editable:admin },
            {name:"unidad_analisis"       , typeName:'text'                      , editable:admin },
            {name:"con_resumen"           , typeName:'boolean'                   , editable:admin },
            {name:"irrepetible"           , typeName:'boolean'                   , editable:false },
            {name:"despliegue"            , typeName:'text'                      , editable:admin },
            {name:"ver_id"                , typeName:'text'                      , editable:admin },
            {name:"optativo"              , typeName:'boolean'                   , editable:admin },
            {name:"orden_total"           , typeName:'ARRAY:text' ,inTable:false , editable:false },
            {name:"ultimo_ancestro"       , typeName:'text'       ,inTable:false , editable:false },
            {name:"formulario_principal"  , typeName:'boolean'                   , editable:admin },
            {name:"var_name"              , typeName:'text'                      , editable:false },
            {name:"var_name_especial"     , typeName:'text'                      , editable:admin },
        ],
        hiddenColumns:['id_casillero', 'irrepetible'],
        sortColumns:[{column:'orden_total'}],
        primaryKey:['operativo','id_casillero'],
        foreignKeys:[
            {references:'operativos', fields:['operativo']},
            {references:'tipoc'     , fields:['tipoc']},
            {references:'casilleros', fields:['operativo', {source:'padre', target:'id_casillero'}], alias:'p' ,consName:'casilleros padre REL'},
            {references:'casilleros', fields:['operativo', {source:'salto', target:'id_casillero'}], alias:'s' ,consName:'casilleros salto REL'}
        ],
        detailTables:[
            {table:'casilleros', fields:['operativo',{source:'id_casillero', target:'padre'}], abr:'c', label:'contenido' }
        ],
        constraints:[
            {constraintType:'unique', fields:['operativo','casillero','irrepetible']},
            {constraintType:'unique', fields:['operativo','var_name']},
            {constraintType:'check' , expr:'irrepetible is not false'   },
            {constraintType:'check' , name:"para poner 'no' en optativo dejar en blanco", expr:'optativo'   },
        ],
        sql:{
            isTable:true,
            from:'(select * from casilleros, lateral casilleros_recursivo(operativo, id_casillero))',
            postCreateSqls:'create trigger irrepetible_trg before insert or update on casilleros for each row execute procedure irrepetible_trg();',
        }
    },context);
}
