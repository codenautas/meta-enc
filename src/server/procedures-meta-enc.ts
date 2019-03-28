"use strict";

var changing = require('best-globals').changing;
var bestGlobals = require('best-globals');
var datetime = bestGlobals.datetime;
var fs = require('fs-extra');
var likeAr = require('like-ar');

//var ProceduresMetaEnc = {};

var ProcedureCasillerosDesplegar={
    action:'operativo_estructura',
    parameters:[
        {name:'operativo'            ,typeName:'text', references:'operativos'},
    ],
    resultOk:'desplegarFormulario',
    coreFunction:function(context, parameters){
        return context.client.query(
            "select casilleros_jerarquizados($1)",
            [parameters.operativo]
        ).fetchUniqueValue().then(function(result){
            return result.value;
        });
    }
};

var ProcedureFormularioEstructura={
    action:'formulario_estructura',
    method:'get',
    parameters:[
        {name:'operativo'            ,typeName:'text', references:'operativos'},
        {name:'formulario'           ,typeName:'text',                        },
    ],
    coreFunction:function(context, parameters){
        return context.client.query(
            "select casilleros_jerarquizados($1, $2)",
            [parameters.operativo, parameters.formulario]
        ).fetchUniqueRow().then(function(result){
            return result.row; 
        });
    }        
};

var ProcedureCasoGuardar = {
    action:'caso_guardar',
    parameters:[
        {name:'operativo'   , typeName:'text', references:'operativos'},
        {name:'id_caso'     , typeName:'text'      },
        {name:'datos_caso'  , typeName:'jsonb'     },
    ],
    coreFunction:function(context, parameters){
        var client=context.client;
        var be=context.be;
        return Promise.resolve().then(function(){
            return client.query('update formularios_json set datos_caso = $3 where operativo = $1 and id_caso=$2 returning *', [parameters.operativo, parameters.id_caso, parameters.datos_caso]).fetchOneRowIfExists().then(function(result){
                if (result.rowCount===0){
                    return client.query("insert into formularios_json(operativo, id_caso, datos_caso) values ($1, $2, $3) returning *",
                    [parameters.operativo, parameters.id_caso, parameters.datos_caso]).fetchUniqueRow();
                }else {
                    return result;
                }
            });
        }).then(function(result){
            return result.row;
        });
    }
};

var ProcedureNuevaEncuesta={
    action: 'caso_nuevo',
    parameters: [
        {name:'operativo'     ,references:'operativos',  typeName:'text'},
    ],
    resultOk: 'goToEnc',
    coreFunction: function(context, parameters){
        return context.client.query(
            `select *
               from unidad_analisis
               where principal = true and operativo = $1
            `,
            [parameters.operativo]
        ).fetchOneRowIfExists().then(function(result){
            if (result.rowCount === 0){
                throw new Error('No se configuró una unidad de analisis como principal');
            }
            return result.row;
        }).then(function(row){
            var be=context.be;
            return be.procedure['preguntas_ua_traer'].coreFunction(context, row).then(function(result){
                var object = {};
                result.forEach(function(question){
                    object[question.var_name] = question.unidad_analisis?[]:null;
                });
                return context.client.query(
                    `insert into formularios_json values ($1,(select (coalesce(max(id_caso::integer),0) + 1)::text from formularios_json where operativo = $1),$2) returning *`,
                    [row.operativo, object]
                ).fetchUniqueRow().then(function(result){
                    return be.procedure['caso_traer'].coreFunction(context, result.row);
                });    
            });
        });
    }
};

var ProcedureTraerCaso={
    action: 'caso_traer',
    parameters: [
        {name:'operativo'     ,references:'operativos',  typeName:'text'},
        {name:'id_caso'       ,typeName:'text'},
    ],
    resultOk: 'goToEnc',
    coreFunction: function(context, parameters){
        return context.client.query(
            `select f.*, c.id_casillero as formulario 
               from formularios_json f join casilleros c on  f.operativo = c.operativo
               where c.operativo = $1 and f.id_caso=$2 and c.formulario_principal
            `,
            [parameters.operativo, parameters.id_caso]
        ).fetchOneRowIfExists().then(function(result){
            if (result.rowCount === 0){
                throw new Error('No existe dicho formulario cargado en DB');
            }else if (!result.row.datos_caso) {
                throw new Error('El campo forms_js se encuentra vacío, verifique si la encuesta está bien rescatada');
            }
            return result.row;
        });
    }
};

var ProcedureTraerPreguntasUnidadAnalisis={
    action: 'preguntas_ua_traer',
    parameters: [
        {name:'operativo'     ,references:'operativos',  typeName:'text'},
        {name:'unidad_analisis' ,typeName:'text' },
    ],
    coreFunction: function(context, parameters){
        return context.client.query(
            `(select lower(c1.var_name) as var_name, false as unidad_analisis, tipovar, orden:: integer, orden_total
              from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
              (select operativo, id_casillero from casilleros where operativo =$1 and unidad_analisis=$2 and tipoc='F') c0
              where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
            )
            union
            (
            select unidad_analisis as var_name, true as unidad_analisis, null as tipovar, orden::integer, null as orden_total
              from unidad_analisis
              where operativo = $1 and padre = $2
            )
                order by orden_total
            `,
            [parameters.operativo, parameters.unidad_analisis]
        ).fetchAll().then(function(result){
            return result.rows;
        }).catch(function(err){
            console.log('ERROR',err.message);
            throw err;
        });
    }
};

var ProcedureObtenerVariablesUnidadAnalisis={
    action: 'variables_ua_obtener',
    parameters: [
        {name:'operativo'     ,references:'operativos',  typeName:'text'},
        {name:'unidad_analisis' ,typeName:'text' },
    ],
    coreFunction: async function(context, parameters){
        var sqlParams=[parameters.operativo, parameters.unidad_analisis];
        var results = {
            variables: await context.client.query(
                `select var_name, false as unidad_analisis, tipovar, orden:: integer
                from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                (select operativo, id_casillero from casilleros where operativo =$1 and unidad_analisis=$2 and tipoc='F') c0
                where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                order by orden_total
                `, sqlParams
            ).fetchAll(),
            unidadAnalisisHijas: await context.client.query(`
                select unidad_analisis as var_name, true as unidad_analisis, null as tipovar, orden::integer
                from unidad_analisis
                where operativo = $1 and padre = $2
                `, sqlParams
            ).fetchAll()
        };
        return likeAr(results).map(result => result.rows);
    }
};

var ProcedureTraerPreguntasOperativo={
    action: 'preguntas_operativo_traer',
    parameters: [
        {name:'operativo'     ,references:'operativos',  typeName:'text'},
    ],
    coreFunction: function(context, parameters){
        return context.client.query(
            `
            select 
                ua.unidad_analisis,
                c.id_casillero as id_casillero_formulario,
                c.casillero as casillero_formulario,
                coalesce(principal, false)::boolean as unidad_de_analisis_principal,
                ua.padre as unidad_analisis_padre, 
                coalesce(
                    (select jsonb_agg(aux)
                        from (
                            (
                                select lower(c1.var_name) as var_name, false as es_unidad_analisis, orden::integer, orden_total
                                    from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                                    (select operativo, id_casillero from casilleros where operativo =$1 and unidad_analisis=ua.unidad_analisis and tipoc='F') c0
                                    where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                                union
                                select unidad_analisis as var_name, true as es_unidad_analisis, orden::integer, null as orden_total
                                    from unidad_analisis
                                    where operativo = $1 and padre = ua.unidad_analisis
                            )
                            order by orden_total
                        ) as aux
                    )
                ,'[]'::jsonb) as preguntas
                from unidad_analisis ua inner join casilleros c on ua.unidad_analisis = c.unidad_analisis and tipoc = 'F' and c.operativo = $1
                where ua.operativo = $1
                group by ua.unidad_analisis, c.id_casillero, c.casillero, principal, ua.padre
            `,
            [parameters.operativo]
        ).fetchAll().then(function(result){
            return result.rows;
        }).catch(function(err){
            console.log('ERROR',err.message);
            throw err;
        });
    }
};

//TODO: REVISAR esto estaba en la app Repsic
var ProcedureGenerateVariablesRelevadas={
    action: 'variables_relevadas/generar',
    parameters: [
        { name: 'operativo', typeName: 'text', references: 'operativos', }
    ],
    coreFunction: async function (context, parameters) {
        var be = context.be;
        var db = be.db;
        await context.client.query(
            `DELETE FROM variables_opciones op
                WHERE EXISTS 
                    (SELECT variable FROM variables v 
                        WHERE v.operativo=op.operativo and v.variable=op.variable 
                            and v.clase='relevamiento' and v.operativo=$1)`
            , [parameters.operativo]
        ).execute();
        await context.client.query(
            `DELETE FROM varcal.variables WHERE operativo = $1 and clase = 'relevamiento'`,
            [parameters.operativo]
        ).execute();
        await context.client.query(`INSERT INTO varcal.variables(
            operativo, variable, unidad_analisis, tipovar, nombre,  activa, 
            clase, cerrada)
            select c1.operativo, var_name, c0.unidad_analisis, 
            case tipovar 
                when 'si_no' then 'opciones' 
                when 'si_no_nn' then 'opciones' 
            else tipovar end, 
            nombre, true, 
            'relevamiento', true
            from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
            (select operativo, id_casillero, unidad_analisis from casilleros where operativo =$1 and tipoc='F') c0
            where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
            order by orden_total`,
            [parameters.operativo]
        ).execute();
        await context.client.query(`
            with pre as (
                select c1.operativo, var_name, c0.unidad_analisis, tipovar, orden_total, c1.id_casillero
                    from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                        (select operativo, id_casillero,unidad_analisis from casilleros where operativo = $1 and tipoc='F') c0
                    where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                    order by orden_total
            )
            INSERT INTO varcal.variables_opciones(
                    operativo, variable, opcion, nombre, orden)
                select op.operativo, pre.var_name, casillero::integer,op.nombre, orden
                from  pre join casilleros op on pre.operativo=op.operativo and pre.id_casillero=op.padre 
                order by orden_total, orden`
            , [parameters.operativo]
        ).execute();
    }
};

var ProcedureGenerateTableDef={
    action: 'tabledef_generate',
    parameters: [
        {name:'operativo'            ,references:'operativos',  typeName:'text'}
    ],
    coreFunction: async function(context, parameters){
        var be=context.be;
        try{
            var result = await context.client.query(`
                select *, ${be.sqls.exprFieldUaPkPadre} as pk_padre,
                  (select jsonb_agg(to_jsonb(h.*)) from unidad_analisis h where ua.unidad_analisis=h.padre ) as details
                  from unidad_analisis ua
                  where operativo = $1
                `,[parameters.operativo]
            ).fetchAll();
            var UAs = result.rows;
            var result2 = await context.client.query(`
                select *
                  from casilleros
                  where operativo = $1 and var_name is not null
                `,[parameters.operativo]
            ).fetchAll();
            var casillerosConVarname = result2.rows;
            var result = await context.client.query(`select * from tipovar`).fetchAll();
            var tipovars = result.rows;
            var varsByUA = await Promise.all(UAs.map(async function(ua){
                var uaDef = await context.be.procedure['variables_ua_obtener'].coreFunction(context, ua);
                var varsDef = uaDef.variables;
                ua.pk_padre.unshift('operativo');
                ua.pk=ua.pk_padre.concat(ua.pk_agregada);
                var tableDef={
                    name:ua.unidad_analisis,
                    fields:varsDef.map(function(varDef){
                        return {
                            name:varDef.var_name,
                            typeName:tipovars.find(function(tipovar){return tipovar.tipovar == varDef.tipovar}).type_name,
                            nullable: varDef.var_name!=ua.pk_agregada
                        }
                    }),    
                    primaryKey:ua.pk,
                    detailTables:(ua.details||[]).map(function(detailDef){
                        return {table: detailDef.unidad_analisis, fields:ua.pk, abr:detailDef.unidad_analisis.substr(0,1)}
                    }),
                }
                if(ua.padre){
                    tableDef.foreignKeys=[
                        {references: ua.padre, fields:ua.pk_padre}
                    ];
                }
                if(ua.principal){
                    tableDef.fields.unshift({
                        name:ua.pk_agregada,
                        typeName:'text',
                        nullable: false
                    })
                    tableDef.fields.unshift({
                        name:'operativo',
                        typeName:'text',
                        visible: false,
                        nullable: false
                    })
                }else{
                    for(var i=ua.pk_padre.length;  i>0; i--){
                        var casileroEncontrado = casillerosConVarname.find(function(casillero){
                            return casillero.var_name == ua.pk_padre[i-1];
                        });
                        tableDef.fields.unshift({
                            name:ua.pk_padre[i-1],
                            typeName:casileroEncontrado?(tipovars.find(function(tipovar){return tipovar.tipovar == casileroEncontrado.tipovar}).type_name):'text',
                            nullable: false
                        })
                    }
                }
                var jsTextFile=`"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt(${JSON.stringify(tableDef, null, 4)},context);
}`;
                var tsTextFile=`"use strict";
                
import {TableDefinition, TableContext} from "backend-plus";
export function ${tableDef.name}(context:TableContext):TableDefinition {
    var admin=context.user.rol==='admin';
    return ${JSON.stringify(tableDef, null, 4)};
}`;
                await fs.writeFile('./local-table-'+ua.unidad_analisis+'.js',jsTextFile,{encoding:'utf8'});
                await fs.writeFile('./local-table-'+ua.unidad_analisis+'.ts',tsTextFile,{encoding:'utf8'});
            }));
            return 'OK';
        }catch(err){
            console.log('ERROR',err.message);
            throw err;
        };
    }
};

var ProceduresMetaEnc = [
    ProcedureCasillerosDesplegar,
    ProcedureFormularioEstructura,
    ProcedureCasoGuardar,
    ProcedureTraerCaso,
    ProcedureNuevaEncuesta,
    ProcedureTraerPreguntasUnidadAnalisis,
    ProcedureTraerPreguntasOperativo,
    ProcedureObtenerVariablesUnidadAnalisis, 
    ProcedureGenerateTableDef,
    // ProcedureGenerateVariablesRelevadas
];
export {ProceduresMetaEnc};