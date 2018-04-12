"use strict";

var Path = require('path');
var relenc = require("rel-enc");
var MiniTools = require('mini-tools');

var changing = require('best-globals').changing;
var fs = require('fs-extra');

class AppMetaEnc extends relenc.AppRelEnc{
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
                {menuType:'proc', name:'cargar_enc', proc:'cargar/enc', label:'Cargar Encuesta'  },
                {menuType:'proc', name:'nueva_enc' , proc:'nueva/enc' , label:'Nueva Encuesta'   },
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
            'tipoc',
            'tipoc_tipoc',
            'operativos',
            'unidad_analisis',
            'casilleros',
            'casilleros-principales',
            'formularios_json'
        ]);
    }
    clientIncludes(req, hideBEPlusInclusions) {
        return super.clientIncludes(req, hideBEPlusInclusions).concat(
            { type: 'js' , module:'rel-enc', path: 'lib/client', src: 'lib/client/form-structure.js', modPath:'../client', ts:'src/client'   },
            { type: 'css', file: 'my-things2.css' }
        )
    }
}
var metaEnc = {}
metaEnc.AppMetaEnc = AppMetaEnc;
module.exports = metaEnc;
