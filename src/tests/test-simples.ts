import * as assert from 'assert';
import 'mocha';

// Se prueba lo compilado en dist/ (npm run build antes de npm test): el código de src/server todavía tiene errores de
// TypeScript que el build deja pasar (ver CLAUDE.md, deuda conocida), y compilarlo acá haría fallar los tests.
import { AppMetaEnc, emergeAppMetaEnc } from '../../dist/server/app-meta-enc';
import { ProceduresMetaEnc } from '../../dist/server/procedures-meta-enc';

// Los tests que necesitan base de datos (estructura, casos, tabledef_generate) no están acá.

function nuevaApp() {
    var app = new AppMetaEnc();
    app.prepareGetTables();
    return app;
}

describe("meta-enc", function () {
    it("exporta la función que emerge la aplicación y la aplicación armada sobre rel-enc", function () {
        assert.strictEqual(typeof emergeAppMetaEnc, 'function');
        assert.strictEqual(AppMetaEnc.name, 'AppMetaEnc');
    });
    it("define los procedimientos de estructura, casos de prueba y generación de tablas", function () {
        var acciones = ProceduresMetaEnc.map(p => p.action);
        ['operativo_estructura', 'formulario_estructura', 'caso_nuevo', 'caso_traer', 'caso_guardar', 'tabledef_generate']
            .forEach(accion => assert.ok(acciones.includes(accion), 'falta ' + accion));
    });
    it("agrega sus tablas a las de operativos", function () {
        var nombres = new AppMetaEnc().getTables().map(t => typeof t == 'string' ? t : t.name);
        ['tipoc', 'tipoc_tipoc', 'unidad_analisis', 'casilleros', 'subcasilleros', 'casilleros_principales', 'formularios_json']
            .forEach(tabla => assert.ok(nombres.includes(tabla), 'falta ' + tabla));
    });
    it("agrega a operativos el detalle de unidades de análisis y casilleros", function () {
        var app = nuevaApp();
        var operativos = app.getTableDefinition.operativos(app.getContextForDump());
        var detalle = (operativos.detailTables || []).map(d => d.table);
        assert.deepStrictEqual(detalle.slice(-3), ['unidad_analisis', 'casilleros_principales', 'casilleros']);
    });
    it("agrega al cliente su módulo", function () {
        var incluidos = new AppMetaEnc().clientIncludes(null, { hideBEPlusInclusions: true });
        assert.ok(incluidos.some(m => m.module == 'meta-enc' && m.file == 'meta-enc.js'));
    });
    it("el menú incluye generar tablas", function () {
        var menu = new AppMetaEnc().getMenu().menu;
        assert.ok(menu.some(m => m.name == 'generate_tabledef'));
    });
});
