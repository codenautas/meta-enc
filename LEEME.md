<!--multilang v0 es:LEEME.md en:README.md -->

<!--lang:es-->
<!--lang:en--]
[!--lang:*-->
# meta-enc

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->
## Metadatos de las encuestas

Es un aplicativo desarrollado para la carga de los metadatos de operativos.

## Definición de Operativos

Para crear un operativo es necesario dirigirse a la opción del menú **metadatos > operativos** y crear un nuevo registro con su operativo y nombre. Luego será necesario definir las Unidades de Analisis.

## Definición de Unidades de Análisis
Desplegar la columna **UA** dentro del operativo creado en el paso anterior. Una de las unidades de análisis debe ser marcada como principal.

La fila que define una **UA** tiene la siguiente forma:

columna        |tipo   |descripción
---------------|-------|------------------------------------------------------------------------
unidad_analisis|texto  |unidad de analisis considerada (no usar espacios en blanco ni mayúsculas)
nombre         |texto  |nombre descriptivo de la unidad de análisis
pk_agregada    |texto  |nombre de campo/s (separados por coma) que identifica/n unívocamente a una instancia de la UA (***sin considerar la PK de la UA padre***)
padre          |texto  |unidad de análisis padre (para la principal dejar vacío)
orden          |numero |orden de despliegue en la grilla de UAs
principal      |boolean|determina la unidad de análisis principal (completar únicamente la principal)

## Definición de Casilleros
### Tipos de casilleros

tipoc	| denominacion	                |irrepetible|desp casillero|desp hijos	|es var
--------|-------------------------------|-----------|--------------|------------|--------------
B	    | bloque	                    |sí			|              |            |no  
BF	    | Botón para formulario	      	| 		    |              |            |si/no   
CONS    | consistencia	                |sí			|              |            |no  
CP	    | conjunto de preguntas	        |sí			|              |            |no  
F	    | formulario	                |sí			|              |            |no  
FILTRO	| filtro	                    |sí			|              |            |no  
MATRIZ	| matriz (de varias preguntas)	|sí			|              |            |no  
O	    | opción			            |           |              |nueva_fila	|no
OM	    | opción múltiple			    |           |              |misma_fila	|sí
P	    | pregunta	                    |sí		    |              |tabla	    |si/no
PMATRIZ	| pregunta en forma de matriz	|sí		    |              |tabla_matriz|no
TEXTO	| texto aclaratorio sin pregunta|			|	           |            |no

Para los casilleros que tienen permiten tener asociada una variable, los tipos de variables permitidos se definen a continuación.

#### Tipos de variables permitidos

tipovar	 |descripcion
---------|-------------------------------------------------------
decimal	 |número con decimales
fecha	 |fecha con formato dd/mm/aaaa
hora	 |hora con formato hh:mm:ss
numero	 |numero entero
opciones |categorías posibles de una variable
si_no_nn |opciones acotadas a valores sí,no, no sabe/no contesta
si_no	 |opciones acotadas a valores sí y no
texto	 |texto



### Inclusiones válidas de casilleros

Para crear casilleros desplegar la columna **C** dentro del operativo creado anteriormente.

El/los casilleros ***padre*** (último ancestro) siempre debe/n ser de tipo **F** y uno de ellos debe ser elegido como ***formulario principal***

El resto de las combinaciones de casilleros se definen a continuación.

tipoc padre|denominacion	              |tipoc hijo	|denominacion
-----------|------------------------------|-------------|-------------------------------
F	       |formulario	                  |B	        |bloque
F	       |formulario	                  |BF	        |Botón para formulario
F	       |formulario	                  |CP	        |conjunto de preguntas
F	       |formulario	                  |FILTRO	    |filtro
F	       |formulario	                  |MATRIZ	    |matriz (de varias preguntas)
F	       |formulario	                  |P	        |pregunta
F	       |formulario	                  |PMATRIZ  	|pregunta en forma de matriz
F	       |formulario	                  |TEXTO	    |texto aclaratorio sin pregunta
B	       |bloque	                      |CP	        |conjunto de preguntas
B	       |bloque	                      |FILTRO	    |filtro
B	       |bloque	                      |MATRIZ	    |matriz (de varias preguntas)
B	       |bloque	                      |P	        |pregunta
B	       |bloque	                      |PMATRIZ	    |pregunta en forma de matriz
B	       |bloque	                      |TEXTO	    |texto aclaratorio sin pregunta
CP	       |conjunto de preguntas	      |P	        |pregunta
MATRIZ	   |matriz (de varias preguntas)  |P	        |pregunta
O	       |opción	                      |P	        |pregunta
OM	       |opción múltiple	              |O	        |opción
OM	       |opción múltiple	              |P	        |pregunta
P	       |pregunta	                  |O	        |opción
P	       |pregunta	                  |OM	        |opción múltiple
PMATRIZ	   |pregunta en forma de matriz   |OM	        |opción múltiple

#### Botones de formularios (BF)
Los botones de formularios se utilizan para poder navegar de un formulario a otro.

Para definir un BF, es necesario:

    1.ingresar en el campo casillero el id_casillero del formulario asociado.

    2.El campo cantidad_resumen determina la cantidad de campos que se van a mostrar en la grilla resumen. Si no se especifica, no se incluye la grilla resumen y únicamente se muestran los botones de navegación entre formularios.

        2.1. Si se ingresa cantidad resumen y se setea la unidad_de analisis del formulario referenciado. La grilla muestra los botones correspondientes a las unidades análisis hijas de la seteada.

        Ej: si tenemos las UA: ***viviendas(principal)->hogares->personas*** y definimos un BF de la siguiente forma:

        [BF](./doc/img/bf.png)

        el resultado obtenido es el siguiente:

        [grilla](./doc/img/grilla.png)

        2.2. Si se ingresa cantidad resumen sin setear la unidad_de analisis del formulario referenciado. La grilla omite los botones correspondientes a las unidades de análisis hijas.

<!--lang:en--]

see spanish

[!--lang:*-->
see spanish

## License

[MIT](LICENSE)

----------------


