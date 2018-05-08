set search_path = meta;
set role = meta_owner;

alter table casilleros add column cantidad_resumen integer;
 
update casilleros cas set cantidad_resumen = (select 
						(select count(*)
							from casilleros c1, lateral casilleros_recursivo(operativo, id_casillero),
							(select operativo, id_casillero from casilleros where operativo =cas.operativo and unidad_analisis=ua.unidad_analisis and tipoc='F') c0
							where c1.operativo =c0.operativo and ultimo_ancestro = c0.id_casillero and c1.tipovar is not null
						) as cantidad_preguntas                    
						from unidad_analisis ua inner join casilleros c on ua.unidad_analisis = c.unidad_analisis and tipoc = 'F' and c.operativo = cas.operativo
						where ua.operativo = cas.operativo and ua.unidad_analisis = cas.unidad_analisis and cas.con_resumen
					      );
					      
alter table casilleros drop column con_resumen;
	

