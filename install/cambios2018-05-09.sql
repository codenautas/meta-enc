set search_path = meta;
set role = meta_owner;

create table "tipovar" (
  "tipovar" text, 
  "html_type" text, 
  "type_name" text, 
  "validar" text, 
  "radio" boolean
, primary key ("tipovar")
);
grant select, insert, update, delete on "tipovar" to "meta_user";

insert into "tipovar" ("tipovar", "html_type", "type_name", "validar", "radio") values
('si_no_nn', 'number', 'bigint', 'opciones', 'true'),
('si_no', 'number', 'bigint', 'opciones', 'true'),
('numero', 'number', 'bigint', 'numerico', 'false'),
('opciones', 'number', 'bigint', 'opciones', 'true'),
('texto', 'text', 'text', 'texto', 'false'),
('decimal', 'number', 'decimal', 'numerico', 'false'),
('fecha', 'text', 'date', 'texto', 'false'),
('hora', 'text', 'interval', 'texto', 'false');

alter table "casilleros" add constraint  "casilleros tipovar REL" foreign key ("tipovar") references "tipovar" ("tipovar")  on update cascade;