"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const relEnc = require("rel-enc");
__export(require("rel-enc"));
const procedures_meta_enc_1 = require("./procedures-meta-enc");
function emergeAppMetaEnc(Base) {
    return class AppMetaEnc extends Base {
        constructor(...args) {
            super(args);
            this.allProcedures = this.allProcedures.concat(procedures_meta_enc_1.ProceduresMetaEnc);
            //this.allClientFileNames.push({type:'js', module: 'meta-enc', modPath: '../client', file: 'meta-enc.js', path: 'client_modules'})   
            this.sqls = {
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
            };
        }
        getProcedures() {
            var be = this;
            return super.getProcedures().then(function (procedures) {
                return procedures.concat(procedures_meta_enc_1.ProceduresMetaEnc.map(be.procedureDefCompleter, be));
            });
        }
        getMenu(context) {
            return { menu: [
                    { menuType: 'menu', name: 'metadatos', menuContent: [
                            { menuType: 'table', name: 'operativos' },
                            { menuType: 'table', name: 'normal', table: 'casilleros_principales' },
                            { menuType: 'table', name: 'plano', table: 'casilleros' },
                        ] },
                    { menuType: 'menu', name: 'encuestas de prueba', menuContent: [
                            { menuType: 'proc', name: 'caso_traer', proc: 'caso/traer', label: 'traer caso' },
                            { menuType: 'proc', name: 'caso_nuevo', proc: 'caso/nuevo', label: 'nuevo caso' },
                        ] },
                    { menuType: 'menu', name: 'configuracion', menuContent: [
                            { menuType: 'menu', name: 'elementos', menuContent: [
                                    { menuType: 'table', name: 'tipoc', label: 'tipos de celdas', selectedByDefault: true },
                                    { menuType: 'table', name: 'tipoc_tipoc', label: 'inclusiones de celdas' },
                                    { menuType: 'table', name: 'tipovar', label: 'tipos de variables' },
                                ] },
                            { menuType: 'table', name: 'usuarios', selectedByDefault: true },
                        ] },
                    { menuType: 'proc', name: 'generate_tabledef', proc: 'generate/tabledef', label: 'generar tablas' },
                ] };
        }
        getTables() {
            return super.getTables().concat([
                { path: __dirname, name: 'tipoc' },
                { path: __dirname, name: 'tipoc_tipoc' },
                { path: __dirname, name: 'unidad_analisis' },
                { path: __dirname, name: 'casilleros' },
                { path: __dirname, name: 'casilleros_principales' },
                { path: __dirname, name: 'formularios_json' },
            ]);
        }
        prepareGetTables() {
            super.prepareGetTables();
            this.getTableDefinition = Object.assign({}, this.getTableDefinition);
            this.appendToTableDefinition('operativos', function (tableDef) {
                tableDef.detailTables.concat([
                    { table: 'casilleros_principales', fields: ['operativo'], abr: 'C', label: 'casilleros principales', refreshParent: true },
                    { table: 'casilleros', fields: ['operativo'], abr: 'P', label: 'casilleros (forma plana)', refreshParent: true },
                    { table: 'unidad_analisis', fields: ['operativo'], abr: 'UA', label: 'unidades de análisis', refreshParent: true },
                ]);
            });
        }
        clientIncludes(req, hideBEPlusInclusions) {
            var metaEncMod = { type: 'js', path: 'client', src: 'client/meta-enc.js', modPath: '../client' };
            if (!this.rootPath.endsWith("meta-enc")) {
                metaEncMod.module = 'meta-enc';
            }
            return super.clientIncludes(req, hideBEPlusInclusions).concat({ type: 'js', module: 'rel-enc', path: 'lib/client', src: 'lib/client/form-structure.js', modPath: '../client', ts: 'src/client' }, metaEncMod, { type: 'css', file: 'my-things2.css' });
        }
    };
}
exports.emergeAppMetaEnc = emergeAppMetaEnc;
exports.AppMetaEnc = emergeAppMetaEnc(relEnc.emergeAppRelEnc(relEnc.AppOperativos));
//# sourceMappingURL=app-meta-enc.js.map