
insert into variables_opciones (operativo, tabla_datos, variable, opcion, nombre, orden)
select vv.operativo, vv.tabla_datos, vv.variable, o.casillero::integer, o.nombre, o.orden
    from casilleros o join casilleros v on o.padre=(case when v.tipoc='OM' then v.padre||'/'||v.casillero else v.casillero end) and v.var_name is not null and o.tipoc='O'
     join variables vv on vv.operativo=v.operativo and v.var_name= variable -- tabla_datos ??? es lo que quiero determinar
    order by vv.operativo, vv.tabla_datos, vv.variable, o.orden;


update variables v
set nombre = c.nombre
from casilleros c
where v.variable=c.var_name and v.clase = 'interna'
