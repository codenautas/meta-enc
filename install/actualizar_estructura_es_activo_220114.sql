set role meta_owner;
set search_path=meta;
alter table casilleros add column es_activo boolean default true;