CREATE OR REPLACE FUNCTION meta.casilleros_jerarquizados(
    p_operativo text,
    p_id_casillero text)
  RETURNS jsonb AS
$BODY$
  select jsonb_build_object('data',to_jsonb(p.*),'childs',
    coalesce((
      select jsonb_agg(casilleros_jerarquizados(h.operativo, h.id_casillero) order by orden )
        from (select * from casilleros c, lateral casilleros_recursivo(operativo, id_casillero)) as h
        where h.operativo = p_operativo
          and h.padre = p_id_casillero
      ),'[]'::jsonb))
    from (select i.*, t.desp_casillero, t.desp_hijos
            from (select * from casilleros a, lateral casilleros_recursivo(operativo, id_casillero)) as i inner join tipoc t on t.tipoc=i.tipoc
          ) p
    where p.operativo = p_operativo
      and p.id_casillero = p_id_casillero
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION meta.casilleros_jerarquizados(text, text)
  OWNER TO meta_owner;