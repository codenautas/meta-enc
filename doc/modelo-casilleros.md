# Modelo de casilleros para metadatos de encuestas

El modelo de casilleros que proponemos considera a las entidades principales de los metadatos de la encuesta,
**preguntas**, **variables**, **opciones**, **formularios** y **bloques** 
como clases de una entidad que llamamos **casilleros**. 

## Casilleros

Son partes de un cuestionario que:
  
   * tienen una identificación única (V1, I1, Filtro 1)
   * tienen una ubicación precisa dentro de los formularios
   * pueden ser destinos de saltos (un salto puede ser a otra pregunta, a un bloque, a otro formulario, a un filtro)
   * pueden ser/contener/determinar una variable (en principio solo las preguntas y las opciones múltiples podrían serlo)
   * tienen un texto y pueden tener una aclaración (más adelante )
   * 