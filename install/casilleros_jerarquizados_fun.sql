set search_path = meta;
set role = meta_owner;

create or replace view casilleros_ordenados as (
  select * from casilleros, lateral casilleros_recursivo(operativo, id_casillero)
);

create or replace view casilleros_completos as (
  select *, 
    (
      select var_name
        from casilleros_ordenados cdoi
        where cdoi.operativo = co.operativo and cdoi.orden_total >= (
            select cd.orden_total
              from casilleros_ordenados cd
              where cd.operativo = co.operativo and cd.id_casillero = co.salto
          )  
          and var_name is not null     
        order by cdoi.orden_total asc
        limit 1
    ) variable_destino
  from casilleros_ordenados co
);

GRANT SELECT ON TABLE casilleros_ordenados TO meta_user;
GRANT SELECT ON TABLE casilleros_completos TO meta_user;

DROP TYPE IF EXISTS json_uv CASCADE;
CREATE TYPE json_uv as (
  json jsonb,
  primera_variable text
);

CREATE OR REPLACE FUNCTION first_agg ( anyelement, anyelement )
RETURNS anyelement LANGUAGE SQL IMMUTABLE STRICT AS $$
        SELECT $1;
$$;
 
CREATE AGGREGATE FIRST (
        sfunc    = first_agg,
        basetype = anyelement,
        stype    = anyelement
);

CREATE OR REPLACE FUNCTION casilleros_jerarquizados_yuv(
    p_operativo text,
    p_id_casillero text)
RETURNS json_uv 
  language sql
AS
$SQL$
  select jsonb_build_object('data',to_jsonb(p.*)||jsonb_build_object('primera_variable',cje.primera_variable),'childs',
    coalesce(cje.json,'[]'::jsonb)) as json, cje.primera_variable
    from (select i.*, t.desp_casillero, t.desp_hijos
            from casilleros_ordenados as i inner join tipoc t on t.tipoc=i.tipoc
          ) p, lateral (
      select jsonb_agg(cj.json order by orden ) json, coalesce(p.var_name,first(h.var_name order by h.orden_total)) as primera_variable
        from casilleros_ordenados as h, lateral casilleros_jerarquizados_yuv(h.operativo, h.id_casillero) cj
        where h.operativo = p_operativo
          and h.padre = p_id_casillero
      ) cje
    where p.operativo = p_operativo
      and p.id_casillero = p_id_casillero;
$SQL$;

drop function if exists casilleros_jerarquizados(text,text);
create or replace function casilleros_jerarquizados(p_operativo text, id_casillero text) returns jsonb
  language sql
as
$SQL$
  select (casilleros_jerarquizados_yuv(p_operativo,id_casillero)).json
$SQL$;

create or replace function casilleros_jerarquizados(p_operativo text) returns jsonb
  language sql
as
$SQL$
  select jsonb_object_agg(id_casillero,casilleros_jerarquizados(p_operativo, id_casillero))
    from casilleros
    where operativo=p_operativo 
      and padre is null;
$SQL$;