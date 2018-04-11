"use strict";

var changing = require('best-globals').changing;
var bestGlobals = require('best-globals');
var datetime = bestGlobals.datetime;

var ProceduresMetaEnc = {};

var ProcedureCasillerosDesplegar={
    action:'operativo/estructura',
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
    action:'formulario/estructura',
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

var ProcedureNuevaEncuesta={
    action: 'nueva/enc',
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
            return be.procedure['cargar/preguntas_ua'].coreFunction(context, row).then(function(result){
                var object = {};
                result.forEach(function(question){
                    object[question.var_name] = question.unidad_analisis?[]:null;
                });
                return context.client.query(
                    `insert into formularios_json values ($1,(select (coalesce(max(id_caso::integer),0) + 1)::text from formularios_json where operativo = $1),$2) returning *`,
                    [row.operativo, object]
                ).fetchUniqueRow().then(function(result){
                    return be.procedure['cargar/enc'].coreFunction(context, result.row);
                });    
            });
        });
    }
};

var ProcedureCargarEncuesta={
    action: 'cargar/enc',
    parameters: [
        {name:'operativo'     ,typeName:'text'},
        {name:'id_caso'       ,typeName:'text'},
    ],
    resultOk: 'goToEnc',
    coreFunction: function(context, parameters){
        return context.client.query(
            `select f.*, c.casillero as formulario 
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

var ProcedureCargarPreguntasUnidadAnalisis={
    action: 'cargar/preguntas_ua',
    parameters: [
            {name:'operativo'       ,typeName:'text' },
            {name:'unidad_analisis' ,typeName:'text' },
    ],
    coreFunction: function(context, parameters){
        return context.client.query(
            `(select lower(c1.var_name) as var_name, false as unidad_analisis, orden:: integer
              from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
              (select operativo, id_casillero from casilleros where operativo =$1 and unidad_analisis=$2 and tipoc='F') c0
              where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
            )
            union
            (
            select unidad_analisis as var_name, true as unidad_analisis, orden::integer
              from unidad_analisis
              where operativo = $1 and padre = $2
            )
                order by orden
            `,
            [parameters.operativo, parameters.unidad_analisis]
        ).execute().then(function(result){
            return result.rows;
        }).catch(function(err){
            console.log('ERROR',err.message);
            throw err;
        });
    }
};

var ProcedureCargarPreguntasOperativo={
    action: 'cargar/preguntas_operativo',
    parameters: [
            {name:'operativo'       ,typeName:'text' },
    ],
    coreFunction: function(context, parameters){
        return context.client.query(
            `
            select 
                ua.unidad_analisis,
                c.casillero as casillero_formulario,
                coalesce(principal, false)::boolean as unidad_de_analisis_principal,
                ua.padre as unidad_analisis_padre, 
                coalesce(
                    (select jsonb_agg(aux)
                        from (
                            (
                                select lower(c1.var_name) as var_name, false as es_unidad_analisis, orden::integer
                                    from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
                                    (select operativo, id_casillero from casilleros where operativo =$1 and unidad_analisis=ua.unidad_analisis and tipoc='F') c0
                                    where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
                                union
                                select unidad_analisis as var_name, true as es_unidad_analisis, orden::integer
                                    from unidad_analisis
                                    where operativo = $1 and padre = ua.unidad_analisis
                            )
                            order by orden
                        ) as aux
                    )
                ,'[]'::jsonb) as preguntas
                from unidad_analisis ua inner join casilleros c on ua.unidad_analisis = c.unidad_analisis and tipoc = 'F' and c.operativo = $1
                where ua.operativo = $1
                group by ua.unidad_analisis, c,casillero, principal, ua.padre
            `,
            [parameters.operativo]
        ).execute().then(function(result){
            return result.rows;
        }).catch(function(err){
            console.log('ERROR',err.message);
            throw err;
        });
    }
};

ProceduresMetaEnc = [
    ProcedureCasillerosDesplegar,
    ProcedureFormularioEstructura,
    {
        action:'datos/guardar',
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
    },
    ProcedureCargarEncuesta,
    ProcedureNuevaEncuesta,
    ProcedureCargarPreguntasUnidadAnalisis,
    ProcedureCargarPreguntasOperativo
];

module.exports = ProceduresMetaEnc;