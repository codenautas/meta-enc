export const defConfig=`
server:
  port: 3055
  base-url: /meta-enc
  session-store: memory
db:
  motor: postgresql
  host: localhost
  database: metaenc_db
  schema: meta
  user: meta_user
install:
  dump:
    db:
      owner: meta_owner
    scripts:
      prepare: 
      - ../node_modules/operativos/install/rel_tabla_relacionada.sql
      post-adapt: 
      - casilleros_orden_total_fun.sql
      - casilleros_jerarquizados_fun.sql
      - ../node_modules/pg-triggers/lib/recreate-his.sql
      - ../node_modules/pg-triggers/lib/table-changes.sql
      - ../node_modules/pg-triggers/lib/function-changes-trg.sql
      - ../node_modules/pg-triggers/lib/enance.sql
    skip-content: true
login:
  table: usuarios
  userFieldName: usuario
  passFieldName: md5clave
  rolFieldName: rol
  infoFieldList: [usuario, rol]
  activeClausule: activo
  lockedClausule: not activo
  plus:
    allowHttpLogin: true
    fileStore: false
    skipCheckAlreadyLoggedIn: true
    loginForm:
      formTitle: metaEncuesta
      usernameLabel: usuario
      passwordLabel: clave
      buttonLabel: entrar
      formImg: img/login-lock-icon.png
    chPassForm:
      usernameLabel: usuario
      oldPasswordLabel: clave anterior
      newPasswordLabel: nueva clave
      repPasswordLabel: repetir nueva clave
      buttonLabel: Cambiar
      formTitle: Cambio de clave
  messages:
    userOrPassFail: el nombre de usuario no existe o la clave no corresponde
    lockedFail: el usuario se encuentra bloqueado
    inactiveFail: es usuario está marcado como inactivo
client-setup:
  cursors: true
  lang: es
  skin: ""
  menu: true
`;