"use strict";

import { AppMetaEncType } from "./app-meta-enc";
import {TableDefinition, TableContext} from "./types-meta-enc";

export function casilleros(context:TableContext):TableDefinition{
    var be = context.be as AppMetaEncType;
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
            {name:"ok"                    , typeName:'text'                      , editable:false , inTable:false},
            {name:"nombre"                , typeName:'text'                      , editable:admin },
            {name:"tipovar"               , typeName:'text'                      , editable:admin },
            {name:"longitud"              , typeName:'text'                      , editable:admin },
            {name:"tipoe"                 , typeName:'text'                      , editable:admin },
            {name:"aclaracion"            , typeName:'text'                      , editable:admin },
            {name:"salto"                 , typeName:'text'                      , editable:admin },
            {name:"unidad_analisis"       , typeName:'text'                      , editable:admin },
            {name:"cantidad_resumen"      , typeName:'integer'                   , editable:admin },
            {name:"irrepetible"           , typeName:'boolean'                   , editable:false },
            {name:"despliegue"            , typeName:'text'                      , editable:admin },
            {name:"ver_id"                , typeName:'text'                      , editable:admin },
            {name:"optativo"              , typeName:'boolean'                   , editable:admin },
            {name:"orden_total"           , typeName:'ARRAY:text' ,inTable:false , editable:false },
            {name:"ultimo_ancestro"       , typeName:'text'       ,inTable:false , editable:false },
            {name:"formulario_principal"  , typeName:'boolean'                   , editable:admin },
            {name:"var_name"              , typeName:'text'                      , editable:false },
            {name:"var_name_especial"     , typeName:'text'                      , editable:admin },
            {name:"expresion_habilitar"   , typeName:'text'                      , editable:admin },
            {name:"valor_ns_nc"           , typeName:'text'                      , editable:admin },
            {name:"valor_sin_dato"        , typeName:'text'                      , editable:admin },
            {name:"leer"                  , typeName:'boolean'                   , editable:admin },
            {name:"calculada"             , typeName:'boolean'                   , editable:admin },
            {name:"libre"                 , typeName:'boolean'                   , editable:admin },
            {name:"especial"              , typeName:'jsonb'                     , editable:admin },
            {name:"es_activo"             , typeName:'boolean'   ,nullable:false , editable:admin , defaultValue:true},
        ],
        hiddenColumns:['id_casillero', 'irrepetible'],
        sortColumns:[{column:'orden_total'}],
        primaryKey:['operativo','id_casillero'],
        foreignKeys:[
            {references:'operativos'        , fields:['operativo']},
            {references:'tipoc'             , fields:['tipoc']},
            {references:'tipovar'           , fields:['tipovar']},
            {references:'unidad_analisis'   , fields:['operativo', 'unidad_analisis']},
            {references:'casilleros'        , fields:['operativo', {source:'padre', target:'id_casillero'}], alias:'p' ,consName:'casilleros padre REL', forceDeferrable:true},
            ...(be.metaEncIncluirCasillerosSaltoREL?[{references:'casilleros'        , fields:['operativo', {source:'salto', target:'id_casillero'}], alias:'s' ,consName:'casilleros salto REL', forceDeferrable:true}]:[])
        ],
        detailTables:[
            {table:'casilleros', fields:['operativo',{source:'id_casillero', target:'padre'}], abr:'c', label:'contenido' }
        ],
        constraints:[
            {constraintType:'unique', fields:['operativo','casillero','irrepetible']},
            // {constraintType:'unique', fields:['operativo','var_name']},
            {constraintType:'check' , expr:'irrepetible is not false'   },
            {constraintType:'check' , consName:"para poner 'no' en optativo dejar en blanco", expr:'optativo'   },
        ],
        sql:{
            fields:{
                ok:{ 
                    expr:`coalesce(nullif(
                            case when casilleros.padre is not null then 
                              coalesce((
                                select ''::text
                                  from tipoc_tipoc tt 
                                  where tt.tipoc_padre=p.tipoc and tt.tipoc_hijo=casilleros.tipoc
                              ), '⛔'::text) -- El hijo no es válido
                            else null end
                            ||case when puede_ser_var is false and casilleros.tipovar is not null then '☒'
                                   when puede_ser_var is true and casilleros.tipovar is null then '!☐'
                            else '' end -- Sobra o falta el tipovar 
                            ||(select case 
                                        when string_agg(lower(nombre), ',' order by nombre)='no,sí' and casilleros.tipoc in ('P','OM') and casilleros.tipovar is distinct from 'si_no' then '!si_no'
                                        when string_agg(lower(nombre), ',' order by nombre)='no,si' then '!Sí!'
                                        when count(*)>0 and casilleros.tipoc in ('P','OM') and (casilleros.tipovar is null or casilleros.tipovar not in ('opciones','si_no')) then '!opciones'
                                        when count(*)>0 and casilleros.tipoc not in ('P','OM') then '¬O'
                                        when count(*)=0 and casilleros.tipoc in ('P','OM') and casilleros.tipovar in ('opciones','si_no') then '!O'
                                        else '' end
                                  from casilleros h 
                                  where h.padre=casilleros.id_casillero and h.operativo=casilleros.operativo
                                    and h.tipoc='O') -- faltan o sobran hijos opciones
                         ,''),'✔')
                    `
                }
            },
            isTable:true,
            from:'(select * from casilleros, lateral casilleros_recursivo(operativo, id_casillero))',
            postCreateSqls:'create trigger irrepetible_trg before insert or update on casilleros for each row execute procedure irrepetible_trg();',
            constraintsDeferred:true,
        }
    },context);
}
