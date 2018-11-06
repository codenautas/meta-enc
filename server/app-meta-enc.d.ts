/// <reference path="../../../../Users/mdelapenna/AppData/Roaming/npm/node_modules/operativos/node_modules/pg-promise-strict/pg-promise-strict.d.ts" />
/// <reference path="../../../../Users/mdelapenna/AppData/Roaming/npm/node_modules/backend-plus/node_modules/pg-promise-strict/pg-promise-strict.d.ts" />
import * as relEnc from "rel-enc";
export * from "rel-enc";
export declare type Constructor<T> = new (...args: any[]) => T;
export declare function emergeAppMetaEnc<T extends Constructor<relEnc.AppRelEncType>>(Base: T): {
    new (...args: any[]): {
        getProcedures(): Promise<relEnc.ProcedureDef[]>;
        getMenu(context: any): {
            menu: ({
                menuType: string;
                name: string;
                menuContent: ({
                    menuType: string;
                    name: string;
                    table?: undefined;
                } | {
                    menuType: string;
                    name: string;
                    table: string;
                })[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                menuContent: {
                    menuType: string;
                    name: string;
                    proc: string;
                    label: string;
                }[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                menuContent: ({
                    menuType: string;
                    name: string;
                    menuContent: ({
                        menuType: string;
                        name: string;
                        label: string;
                        selectedByDefault: boolean;
                    } | {
                        menuType: string;
                        name: string;
                        label: string;
                        selectedByDefault?: undefined;
                    })[];
                    selectedByDefault?: undefined;
                } | {
                    menuType: string;
                    name: string;
                    selectedByDefault: boolean;
                    menuContent?: undefined;
                })[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                proc: string;
                label: string;
                menuContent?: undefined;
            })[];
        };
        getTables(): any;
        prepareGetTables(): void;
        clientIncludes(req: any, hideBEPlusInclusions: any): any;
        allProcedures: relEnc.ProcedureDef[];
        allClientFileNames: relEnc.ClientModuleDefinition[];
        tablasDatos: relEnc.TablaDatos[];
        myProcedures: relEnc.ProcedureDef[];
        myClientFileName: string;
        initialize: () => void;
        cargarGenerados: (client: import("pg-promise-strict").Client) => Promise<string>;
        getTodayForDB: () => any;
        postConfig: (() => Promise<void>) & ((...params: any[]) => any);
        generateBaseTableDef: (tablaDatos: relEnc.TablaDatos) => relEnc.TableDefinition;
        getTableDefFunction: (tableDef: relEnc.TableDefinition) => relEnc.TableDefinitionFunction;
        loadTableDef: (tableDef: relEnc.TableDefinition) => relEnc.TableDefinitionFunction;
        generateAndLoadTableDef: (tablaDatos: relEnc.TablaDatos) => relEnc.TableDefinitionFunction;
        procedures: relEnc.ProcedureDef[];
        procedure: {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        };
        app: relEnc.ExpressPlus;
        getTableDefinition: relEnc.TableDefinitionsGetters;
        tableStructures: relEnc.TableDefinitions;
        db: typeof import("pg-promise-strict");
        config: any;
        start: (opts?: relEnc.StartOptions) => Promise<void>;
        appendToTableDefinition: (tableName: string, appenderFunction: (tableDef: relEnc.TableDefinition, context?: relEnc.TableContext) => void) => void;
        getContext: (req: relEnc.Request) => relEnc.Context;
        addSchrödingerServices: (mainApp: relEnc.ExpressPlus, baseUrl: string) => void;
        addLoggedServices: () => void;
        inDbClient: <T_1>(req: relEnc.Request, doThisWithDbClient: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
        inTransaction: <T_1>(req: relEnc.Request, doThisWithDbTransaction: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
        procedureDefCompleter: (procedureDef: relEnc.ProcedureDef) => relEnc.ProcedureDef;
        tableDefAdapt: (tableDef: relEnc.TableDefinition, context: relEnc.Context) => relEnc.TableDefinition;
        pushApp: (dirname: string) => void;
        dumpDbSchemaPartial: (partialTableStructures: relEnc.TableDefinitions, opts?: {
            complete?: boolean;
            skipEnance?: boolean;
        }) => Promise<{
            mainSql: string;
            enancePart: string;
        }>;
        getContextForDump: () => relEnc.ContextForDump;
        getClientSetupForSendToFrontEnd: (req: relEnc.Request) => relEnc.ClientSetup;
        configList: () => (string | object)[];
        configStaticConfig: () => void;
        setStaticConfig: (defConfigYamlString: string) => void;
    };
} & T;
export declare var AppMetaEnc: {
    new (...args: any[]): {
        getProcedures(): Promise<relEnc.ProcedureDef[]>;
        getMenu(context: any): {
            menu: ({
                menuType: string;
                name: string;
                menuContent: ({
                    menuType: string;
                    name: string;
                    table?: undefined;
                } | {
                    menuType: string;
                    name: string;
                    table: string;
                })[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                menuContent: {
                    menuType: string;
                    name: string;
                    proc: string;
                    label: string;
                }[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                menuContent: ({
                    menuType: string;
                    name: string;
                    menuContent: ({
                        menuType: string;
                        name: string;
                        label: string;
                        selectedByDefault: boolean;
                    } | {
                        menuType: string;
                        name: string;
                        label: string;
                        selectedByDefault?: undefined;
                    })[];
                    selectedByDefault?: undefined;
                } | {
                    menuType: string;
                    name: string;
                    selectedByDefault: boolean;
                    menuContent?: undefined;
                })[];
                proc?: undefined;
                label?: undefined;
            } | {
                menuType: string;
                name: string;
                proc: string;
                label: string;
                menuContent?: undefined;
            })[];
        };
        getTables(): any;
        prepareGetTables(): void;
        clientIncludes(req: any, hideBEPlusInclusions: any): any;
        allProcedures: relEnc.ProcedureDef[];
        allClientFileNames: relEnc.ClientModuleDefinition[];
        tablasDatos: relEnc.TablaDatos[];
        myProcedures: relEnc.ProcedureDef[];
        myClientFileName: string;
        initialize: () => void;
        cargarGenerados: (client: import("pg-promise-strict").Client) => Promise<string>;
        getTodayForDB: () => any;
        postConfig: (() => Promise<void>) & ((...params: any[]) => any);
        generateBaseTableDef: (tablaDatos: relEnc.TablaDatos) => relEnc.TableDefinition;
        getTableDefFunction: (tableDef: relEnc.TableDefinition) => relEnc.TableDefinitionFunction;
        loadTableDef: (tableDef: relEnc.TableDefinition) => relEnc.TableDefinitionFunction;
        generateAndLoadTableDef: (tablaDatos: relEnc.TablaDatos) => relEnc.TableDefinitionFunction;
        procedures: relEnc.ProcedureDef[];
        procedure: {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        } & {
            [key: string]: relEnc.ProcedureDef;
        };
        app: relEnc.ExpressPlus;
        getTableDefinition: relEnc.TableDefinitionsGetters;
        tableStructures: relEnc.TableDefinitions;
        db: typeof import("pg-promise-strict");
        config: any;
        start: (opts?: relEnc.StartOptions) => Promise<void>;
        appendToTableDefinition: (tableName: string, appenderFunction: (tableDef: relEnc.TableDefinition, context?: relEnc.TableContext) => void) => void;
        getContext: (req: relEnc.Request) => relEnc.Context;
        addSchrödingerServices: (mainApp: relEnc.ExpressPlus, baseUrl: string) => void;
        addLoggedServices: () => void;
        inDbClient: <T>(req: relEnc.Request, doThisWithDbClient: (client: import("pg-promise-strict").Client) => Promise<T>) => Promise<T>;
        inTransaction: <T>(req: relEnc.Request, doThisWithDbTransaction: (client: import("pg-promise-strict").Client) => Promise<T>) => Promise<T>;
        procedureDefCompleter: (procedureDef: relEnc.ProcedureDef) => relEnc.ProcedureDef;
        tableDefAdapt: (tableDef: relEnc.TableDefinition, context: relEnc.Context) => relEnc.TableDefinition;
        pushApp: (dirname: string) => void;
        dumpDbSchemaPartial: (partialTableStructures: relEnc.TableDefinitions, opts?: {
            complete?: boolean;
            skipEnance?: boolean;
        }) => Promise<{
            mainSql: string;
            enancePart: string;
        }>;
        getContextForDump: () => relEnc.ContextForDump;
        getClientSetupForSendToFrontEnd: (req: relEnc.Request) => relEnc.ClientSetup;
        configList: () => (string | object)[];
        configStaticConfig: () => void;
        setStaticConfig: (defConfigYamlString: string) => void;
    };
} & (new (...args: any[]) => {
    allProcedures: relEnc.ProcedureDef[];
    allClientFileNames: relEnc.ClientModuleDefinition[];
    tablasDatos: relEnc.TablaDatos[];
    myProcedures: relEnc.ProcedureDef[];
    myClientFileName: string;
    initialize(): void;
    cargarGenerados(client: import("pg-promise-strict").Client): Promise<string>;
    getTodayForDB(): any;
    postConfig: (() => Promise<void>) & ((...params: any[]) => any);
    generateBaseTableDef(tablaDatos: relEnc.TablaDatos): relEnc.TableDefinition;
    getTableDefFunction(tableDef: relEnc.TableDefinition): relEnc.TableDefinitionFunction;
    loadTableDef(tableDef: relEnc.TableDefinition): relEnc.TableDefinitionFunction;
    generateAndLoadTableDef(tablaDatos: relEnc.TablaDatos): relEnc.TableDefinitionFunction;
    getProcedures: () => Promise<relEnc.ProcedureDef[]>;
    clientIncludes: ((req: relEnc.Request, hideBEPlusInclusions: boolean) => relEnc.ClientModuleDefinition[]) & ((req: relEnc.Request, hideBEPlusInclusions?: boolean) => relEnc.ClientModuleDefinition[]);
    getMenu: (() => relEnc.MenuDefinition) & ((context?: relEnc.Context) => relEnc.MenuDefinition);
    prepareGetTables: () => void;
    getTables: () => relEnc.TableItemDef[];
    procedures: relEnc.ProcedureDef[];
    procedure: {
        [key: string]: relEnc.ProcedureDef;
    } & {
        [key: string]: relEnc.ProcedureDef;
    };
    app: relEnc.ExpressPlus;
    getTableDefinition: relEnc.TableDefinitionsGetters;
    tableStructures: relEnc.TableDefinitions;
    db: typeof import("pg-promise-strict");
    config: any;
    start: (opts?: relEnc.StartOptions) => Promise<void>;
    appendToTableDefinition: (tableName: string, appenderFunction: (tableDef: relEnc.TableDefinition, context?: relEnc.TableContext) => void) => void;
    getContext: (req: relEnc.Request) => relEnc.Context;
    addSchrödingerServices: (mainApp: relEnc.ExpressPlus, baseUrl: string) => void;
    addLoggedServices: () => void;
    inDbClient: <T_1>(req: relEnc.Request, doThisWithDbClient: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
    inTransaction: <T_1>(req: relEnc.Request, doThisWithDbTransaction: (client: import("pg-promise-strict").Client) => Promise<T_1>) => Promise<T_1>;
    procedureDefCompleter: (procedureDef: relEnc.ProcedureDef) => relEnc.ProcedureDef;
    tableDefAdapt: (tableDef: relEnc.TableDefinition, context: relEnc.Context) => relEnc.TableDefinition;
    pushApp: (dirname: string) => void;
    dumpDbSchemaPartial: (partialTableStructures: relEnc.TableDefinitions, opts?: {
        complete?: boolean;
        skipEnance?: boolean;
    }) => Promise<{
        mainSql: string;
        enancePart: string;
    }>;
    getContextForDump: () => relEnc.ContextForDump;
    getClientSetupForSendToFrontEnd: (req: relEnc.Request) => relEnc.ClientSetup;
    configList: () => (string | object)[];
    configStaticConfig: () => void;
    setStaticConfig: (defConfigYamlString: string) => void;
}) & {
    new (...args: any[]): {
        allProcedures: relEnc.ProcedureDef[];
        allClientFileNames: relEnc.ClientModuleDefinition[];
        myProcedures: relEnc.ProcedureDef[];
        myClientFileName: string;
        tablasDatos: relEnc.TablaDatos[];
        initialize(): void;
        cargarGenerados(client: import("pg-promise-strict").Client): Promise<string>;
        getTodayForDB(): any;
        postConfig(): Promise<void>;
        generateBaseTableDef(tablaDatos: relEnc.TablaDatos): relEnc.TableDefinition;
        getTableDefFunction(tableDef: relEnc.TableDefinition): relEnc.TableDefinitionFunction;
        loadTableDef(tableDef: relEnc.TableDefinition): relEnc.TableDefinitionFunction;
        generateAndLoadTableDef(tablaDatos: relEnc.TablaDatos): relEnc.TableDefinitionFunction;
        getProcedures(): Promise<relEnc.ProcedureDef[]>;
        clientIncludes(req: relEnc.Request, hideBEPlusInclusions: boolean): relEnc.ClientModuleDefinition[];
        getMenu(): relEnc.MenuDefinition;
        prepareGetTables(): void;
        getTables(): relEnc.TableItemDef[];
        procedures: relEnc.ProcedureDef[];
        procedure: {
            [key: string]: relEnc.ProcedureDef;
        };
        app: relEnc.ExpressPlus;
        getTableDefinition: relEnc.TableDefinitionsGetters;
        tableStructures: relEnc.TableDefinitions;
        db: typeof import("pg-promise-strict");
        config: any;
        start(opts?: relEnc.StartOptions): Promise<void>;
        appendToTableDefinition(tableName: string, appenderFunction: (tableDef: relEnc.TableDefinition, context?: relEnc.TableContext) => void): void;
        getContext(req: relEnc.Request): relEnc.Context;
        addSchrödingerServices(mainApp: relEnc.ExpressPlus, baseUrl: string): void;
        addLoggedServices(): void;
        inDbClient<T>(req: relEnc.Request, doThisWithDbClient: (client: import("pg-promise-strict").Client) => Promise<T>): Promise<T>;
        inTransaction<T>(req: relEnc.Request, doThisWithDbTransaction: (client: import("pg-promise-strict").Client) => Promise<T>): Promise<T>;
        procedureDefCompleter(procedureDef: relEnc.ProcedureDef): relEnc.ProcedureDef;
        tableDefAdapt(tableDef: relEnc.TableDefinition, context: relEnc.Context): relEnc.TableDefinition;
        pushApp(dirname: string): void;
        dumpDbSchemaPartial(partialTableStructures: relEnc.TableDefinitions, opts?: {
            complete?: boolean;
            skipEnance?: boolean;
        }): Promise<{
            mainSql: string;
            enancePart: string;
        }>;
        getContextForDump(): relEnc.ContextForDump;
        getClientSetupForSendToFrontEnd(req: relEnc.Request): relEnc.ClientSetup;
        configList(): (string | object)[];
        configStaticConfig(): void;
        setStaticConfig(defConfigYamlString: string): void;
    };
    prefixTableName(tableName: string, prefix: string): string;
} & typeof relEnc.AppBackend;
export declare type AppProcesamientoType = InstanceType<typeof AppMetaEnc>;
