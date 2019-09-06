set search_path = eder;
set role to eder2019_owner;

-- actualiza el campo nombre desde la grilla de casilleros

update variables v
set nombre = c.nombre
from casilleros c
where v.variable=c.var_name and v.clase = 'interna' and v.nombre is null and c.nombre is not null

-- chequeo
--    select v.variable, v.nombre, c.nombre, c.var_name 
--    from variables v left join casilleros c on v.variable = c.var_name
--    where v.clase = 'interna'