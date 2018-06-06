set search_path = meta;
set role = meta_owner;

update tipoc set irrepetible=true where tipoc='BF';
update tipoc set irrepetible=null where tipoc='F';

update casilleros set var_name_especial=coalesce(var_name_especial,'x_'||tipoc||casillero) where tipoc in ('F');
update casilleros set var_name_especial=coalesce(var_name_especial,'x_'||tipoc||casillero) where tipoc in ('BF');

update casilleros set var_name_especial=null where var_name_especial like 'x_%' and tipoc in ('BF','F');