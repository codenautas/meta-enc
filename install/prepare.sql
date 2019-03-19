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
  v_separador_tipoc text:=':';
  v_var_name_comun text;
  v_irrepetible boolean;
  v_puede_ser_var boolean;
begin
  if tg_op = 'INSERT' 
     or new.id_casillero is distinct from old.id_casillero 
     or new.casillero is distinct from old.casillero 
     or new.padre     is distinct from old.padre 
     or new.tipoc     is distinct from old.tipoc 
     or new.tipovar   is distinct from old.tipovar
     or new.var_name_especial is distinct from old.var_name_especial
  then
    if new.casillero ~ (E'\\'||v_separador_id) then
      raise 'código de casillero no debe tener "%"', v_separador_id;
    end if;
    select irrepetible, puede_ser_var 
      into v_irrepetible, v_puede_ser_var 
      from tipoc 
      where tipoc = new.tipoc;
    if v_puede_ser_var is true and new.tipovar is null then
      raise 'tiene que tener tipo de variable % de % en %',new.id_casillero,new.padre,new.operativo;
    elsif v_puede_ser_var is false and new.tipovar is not null then
      raise 'no puede tener tipo de variable % de % en %',new.id_casillero,new.padre,new.operativo;
    end if;
    new.irrepetible := (select irrepetible from tipoc where tipoc = new.tipoc);
    new.id_casillero := case when new.irrepetible then new.casillero else coalesce(new.padre||v_separador_id,new.tipoc||v_separador_tipoc)||new.casillero end;
    if new.tipovar is null then
      new.var_name := null;
      v_var_name_comun := null;
    else
      v_var_name_comun := regexp_replace(regexp_replace(replace(translate(lower(new.id_casillero),'áéíóúàèìòùÁÉÍÓÚÀÈÌÒÙÜü','aeiouaeiouaeiouuu'),'ñ','nni'),'[^0-9a-z]','_'),'^([0-9])',
        regexp_replace(lower(new.operativo),'[^a-z]','')||'\1');
      new.var_name := coalesce(new.var_name_especial, v_var_name_comun);
    end if;
  end if;
  return new;
end;
$body$;