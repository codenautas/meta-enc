"use strict";

import * as relEnc from "rel-enc";
export * from "./types-meta-enc";
import {MenuDefinition, Request, OptsClientPage} from "./types-meta-enc";
import {ProceduresMetaEnc} from "./procedures-meta-enc";
import {defConfig} from "./def-config"

export type Constructor<T> = new(...args: any[]) => T;

export function emergeAppMetaEnc<T extends Constructor<relEnc.AppRelEncType>>(Base:T){
    return class AppMetaEnc extends Base{
        metaEncIncluirCasillerosSaltoREL:boolean
        constructor(...args:any[]){ 
            super(args); 
            this.sqls={
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
            this.metaEncIncluirCasillerosSaltoREL = true;
        }
        configStaticConfig(){
            super.configStaticConfig();
            this.setStaticConfig(defConfig);
        }
        getMenu(): MenuDefinition {
            let menu: MenuDefinition =
                {menu:[
                    {menuType:'menu', name:'metadatos', menuContent:[
                        {menuType:'table', name:'operativos'},
                        {menuType:'table', name:'normal'          , table:'casilleros_principales'},
                        {menuType:'table', name:'plano'           , table:'casilleros'},
                    ]},
                    {menuType:'menu', name:'encuestas_de_prueba', menuContent:[
                        {menuType:'proc', name:'caso_nuevo' , proc:'caso_nuevo' , label:'nuevo caso'   },
                        {menuType:'proc', name:'caso_traer', proc:'caso_traer', label:'traer caso'  },
                        {menuType:'proc', name:'caso_traer_o_crear' , proc:'caso_traer_o_crear' , label:'traer o crear caso'   },
                    ]},
                    {menuType:'menu', name:'configuracion', menuContent:[
                        {menuType:'menu', name:'elementos', menuContent:[
                            {menuType:'table', name:'tipoc', label:'tipos de celdas', selectedByDefault:true},
                            {menuType:'table', name:'tipoc_tipoc', label:'inclusiones de celdas'},
                            {menuType:'table', name:'tipovar', label:'tipos de variables'},
                        ]},
                        {menuType:'table', name:'usuarios', selectedByDefault:true},
                    ]},
                    {menuType:'proc', name:'generate_tabledef', proc:'tabledef_generate', label:'generar tablas'  },
                ]};
            return menu;
        }
        getTables(){
            return super.getTables().concat([
                {path:__dirname, name:'tipoc'                 },
                {path:__dirname, name:'tipoc_tipoc'           },
                {path:__dirname, name:'unidad_analisis'       },
                {path:__dirname, name:'casilleros'            },
                {path:__dirname, name:'casilleros_principales'},
                {path:__dirname, name:'formularios_json'      },
            ]);
        }
        getProcedures(){
            var be = this;
            return super.getProcedures().then(function(procedures){
                return procedures.concat(
                    ProceduresMetaEnc.map(be.procedureDefCompleter, be)
                )
            });
        }
        prepareGetTables(){
            super.prepareGetTables();
            this.getTableDefinition={
                ...this.getTableDefinition,
            }
            this.appendToTableDefinition('operativos', function(tableDef){
                tableDef.detailTables = (tableDef.detailTables||[]).concat([
                    {table:'unidad_analisis'       , fields:['operativo'], abr:'UA', label:'unidades de análisis', refreshParent:true  },
                    {table:'casilleros_principales', fields:['operativo'], abr:'C' , label:'casilleros principales', refreshParent:true  },
                    {table:'casilleros'            , fields:['operativo'], abr:'P' , label:'casilleros (forma plana)', refreshParent:true  },
                ]);
            });
        }
        clientIncludes(req:Request, hideBEPlusInclusions:OptsClientPage){
            return super.clientIncludes(req, hideBEPlusInclusions).concat([
                { type: 'js',  module:'meta-enc',  modPath: '../client', file: 'meta-enc.js', path:'client_modules' }
            ])
        }
    }
}
export var AppMetaEnc = emergeAppMetaEnc(relEnc.emergeAppRelEnc(relEnc.AppOperativos));
export type AppMetaEncType = InstanceType<typeof AppMetaEnc>;
