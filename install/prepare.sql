-- pg-parents

create or replace function with_parent_id_trg() returns trigger
  language plpgsql as
$body$
declare
  v_separador_id text:='/';
begin
  if new.casillero ~ (E'\\'||v_separador_id) then
    raise 'código de casillero no debe tener "%"', v_separador_id;
  end if;
  new.id_casillero:=coalesce(new.id_padre||v_separador_id,'')||new.casillero;
  return new;
end;
$body$;

create or replace function irrepetible_trg() returns trigger
  language plpgsql as
$body$
declare
  v_separador_id text:='/';
begin
  if tg_op = 'INSERT' 
     or new.casillero is distinct from old.casillero 
     or new.padre     is distinct from old.padre 
     or new.tipoc     is distinct from old.tipoc 
  then
    if new.casillero ~ (E'\\'||v_separador_id) then
      raise 'código de casillero no debe tener "%"', v_separador_id;
    end if;
    new.irrepetible := (select irrepetible from tipoc where tipoc = new.tipoc);
    new.id_casillero := case when new.irrepetible then new.casillero else new.padre||v_separador_id||new.casillero end;
  end if;
  return new;
end;
$body$;


