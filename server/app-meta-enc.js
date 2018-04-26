"use strict";

var Path = require('path');
var relenc = require("rel-enc");
var MiniTools = require('mini-tools');

var changing = require('best-globals').changing;
var fs = require('fs-extra');

class AppMetaEnc extends relenc.AppRelEnc{
    sqls:{
        exprFieldUaPkPadre: `
        coalesce((
                    with recursive uas(operativo, profundidad, padre, pk) as (
                      select ua.operativo, 1 as profundidad, ua.padre, null as pk
                    union all
                      select uas.operativo, profundidad+1, p.padre, p.pk_agregada
                        from uas left join unidad_analisis p on p.unidad_analisis = uas.padre and p.operativo = uas.operativo
                        where p.unidad_analisis is not null
                    ) select array_agg(pk order by profundidad desc) from uas where pk is not null
                  ),array[]::text[])`
    }
    constructor(){
        super();
    }
    getProcedures(){
        var be = this;
        return super.getProcedures().then(function(procedures){
            return procedures.concat(
                require('./procedures-meta-enc.js').map(be.procedureDefCompleter, be)
            );
        });
    }
    getMenu(context){
        return {menu:[
            {menuType:'menu', name:'Metadatos', menuContent:[
                {menuType:'table', name:'operativos'},
                {menuType:'table', name:'normal'          , table:'casilleros-principales'},
                {menuType:'table', name:'plano'           , table:'casilleros'},
            ]},
            {menuType:'menu', name:'Encuestas de prueba', menuContent:[
                {menuType:'proc', name:'caso_traer', proc:'caso/traer', label:'Cargar Encuesta'  },
                {menuType:'proc', name:'caso_nuevo' , proc:'caso/nuevo' , label:'Nueva Encuesta'   },
            ]},
            {menuType:'menu', name:'Configuración', menuContent:[
                {menuType:'menu', name:'elementos', menuContent:[
                    {menuType:'table', name:'tipoc', label:'tipos de celdas', selectedByDefault:true},
                    {menuType:'table', name:'tipoc_tipoc', label:'inclusiones de celdas'},
                ]},
                {menuType:'table', name:'usuarios', selectedByDefault:true},
            ]},
        ]}
    }
    getTables(){
        return super.getTables().concat([
            {path:__dirname, name:'tipoc'                 },
            {path:__dirname, name:'tipoc_tipoc'           },
            {path:__dirname, name:'operativos'            },
            {path:__dirname, name:'unidad_analisis'       },
            {path:__dirname, name:'casilleros'            },
            {path:__dirname, name:'casilleros-principales'},
            {path:__dirname, name:'formularios_json'      },
        ]);
    }
    clientIncludes(req, hideBEPlusInclusions) {
        return super.clientIncludes(req, hideBEPlusInclusions).concat(
            { type: 'js' , module:'rel-enc', path: 'lib/client', src: 'lib/client/form-structure.js', modPath:'../client', ts:'src/client'   },
            { type: 'js' , module:'rel-enc', path: 'lib/client', src: 'lib/client/form-types.js', modPath:'../client', ts:'src/client'   },
            { type: 'js' , module:'meta-enc', path: 'client', src: 'client/meta-enc.js', modPath:'../client'   },
            { type: 'css', file: 'my-things2.css' }
        )
    }
}
var metaEnc = {}
metaEnc.AppMetaEnc = AppMetaEnc;
module.exports = metaEnc;
