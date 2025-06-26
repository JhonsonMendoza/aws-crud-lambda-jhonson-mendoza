# Universidad de las Fuerzas Armadas ESPE

**Estudiante:** Jhonson Benigno Mendoza Jaramillo
**Fecha:** 26 de Junio del 2025

# Manejo de Excepciones en Node.js con AWS Lambda y DynamoDB

## Introducción

En el ámbito del desarrollo backend moderno, uno de los aspectos más críticos y a menudo subestimados es el manejo adecuado de errores y excepciones. En un sistema real, los errores no solo son inevitables, sino que representan una oportunidad para fortalecer el código, mejorar la experiencia del usuario y garantizar la estabilidad del servicio. Node.js, con su enfoque asincrónico y event-driven, proporciona potentes herramientas para detectar y manejar fallos, pero también presenta retos únicos cuando se trata de capturar errores que pueden surgir en distintas capas de una aplicación.

Este informe se centra en explorar cómo implementar un manejo robusto de excepciones en aplicaciones desarrolladas en Node.js, específicamente en un contexto serverless utilizando AWS Lambda y DynamoDB. El proyecto en cuestión es una API sin frontend que gestiona tareas y ha sido probada exclusivamente mediante la herramienta Postman. A lo largo de este documento, se analizarán las decisiones técnicas tomadas, las validaciones incorporadas y los errores simulados para validar la resiliencia de la solución.

El objetivo no es solo demostrar el uso correcto de bloques try/catch, sino también mostrar cómo una buena estrategia de validación, respuesta y registro de errores puede transformar un backend funcional en uno confiable, mantenible y listo para producción.

## Objetivos

### Objetivo General

Aplicar e integrar buenas prácticas de manejo de excepciones en una API RESTful desarrollada con Node.js y desplegada en AWS Lambda, asegurando mayor estabilidad, trazabilidad y claridad en la respuesta a errores.

### Objetivos Específicos

* Incorporar validaciones lógicas previas a la ejecución de operaciones sensibles en DynamoDB.
* Simular distintos tipos de errores mediante Postman para observar y documentar el comportamiento de la aplicación ante condiciones inesperadas.

## Desarrollo

### Herramientas y tecnologías

* Node.js
* AWS Lambda
* AWS DynamoDB
* Postman
* CloudWatch Logs

### Descripción del proyecto

El sistema consiste en una API de gestión de tareas, implementada como un conjunto de funciones Lambda que interactúan con una tabla de DynamoDB llamada `usersTable`. Cada función representa una operación CRUD:

* `agregarTask`: crear una nueva tarea.
* `actualizarTask`: modificar una tarea existente.
* `eliminarTask`: borrar una tarea por ID.
* `obtenerTask`: recuperar todas las tareas.
* `obtenerTasks`: recuperar una tarea específica por ID.

Cada una fue refactorizada para incluir:

* Validaciones de entrada antes del bloque try.
* Bloques try/catch con console.error.
* Respuestas HTTP claras y significativas.

---

### agregarTask

Esta función crea una nueva tarea. Antes de intentar guardar en DynamoDB, se verifica que tanto el `título` como la `descripción` estén presentes.

Código clave de validación:

```js
if (!titulo || !descripcion) {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Título y descripción son obligatorios' })
  };
}
```

Si ocurre un error en la base de datos, se captura así:

```js
catch (error) {
  console.error("Error al guardar tarea:", error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Error al guardar tarea', error: error.message })
  };
}
```

### Ejemplo de prueba en Postman

- Método: PUT  
- Endpoint: `/tareas`  
- Headers: `Content-Type: application/json`  
- Body enviado y respuesta de error recibido:

![Respuesta de error en Postman](https://i.imgur.com/Xkm42Wx.png)

### actualizarTask

Al actualizar una tarea, se requiere verificar que los campos `titulo`, `descripcion` y `estado` sean válidos. El campo `estado` debe ser un valor booleano real (`true` o `false`).

Código de validación:

```js
if (!titulo || !descripcion || typeof estado !== 'boolean') {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Datos incompletos o inválidos' })
  };
}
```

Ejemplo de prueba en Postman:

* Método: PUT
* Endpoint: /tareas/abc123
* Headers: Content-Type: application/json
* Body enviado y respuesta de error recibido:

![Respuesta de error en Postman](https://imgur.com/6BMJ1la.png)


### eliminarTask

Para eliminar una tarea, se requiere un `id` válido. Si no se proporciona, o si el ID no existe, se retorna un error 400 o 404 respectivamente:

Código:

```js
if (!id) {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'ID de tarea no proporcionado' })
  };
}

if (!response.Attributes) {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Tarea no encontrada' })
  };
}
```

Ejemplo de prueba en Postman:

* Método: DELETE
* Endpoint: /tarea/9999
* Body enviado y respuesta de error recibido:

- EJEMPLO: Id mal colocada

![Respuesta de error en Postman](https://imgur.com/A7WWvps.png)

- EJEMPLO: Parametro Id inexistente

![Respuesta de error en Postman](https://imgur.com/6IGOWlO.png)

### obtenerTask

Esta función lista todas las tareas. No requiere parámetros ni validación previa. Solo puede fallar si DynamoDB está inaccesible. Para forzar un error, se puede cambiar el nombre de la tabla.

Ejemplo de respuesta ante fallo de tabla:

```json
{
  "message": "Error al guardar tarea",
  "error": "Requested resource not found"
}
```

---

### obtenerTasks (por ID)

Funciona similar a eliminarTask: primero valida que el ID esté presente, luego revisa si el item existe en DynamoDB.

Código:

```js
if (!id) {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'ID de tarea no proporcionado' })
  };
}

if (!response.Item) {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Tarea no encontrada' })
  };
}
```

Ejemplo de prueba en Postman:

* Método: GET
* Endpoint: /tarea/abc1234
* Body enviado y respuesta de error recibido:

![Respuesta de error en Postman](https://imgur.com/zhpkD14.png)

### Consola de AWS Lambda

Se incorporó logging para monitorear errores directamente en AWS CloudWatch. Por ejemplo, ante un error de parsing:

Log registrado en CloudWatch:

```
Error al guardar tarea: SyntaxError: Unexpected token a in JSON at position 1
```
ENLACE REPOSITORIO GITHUB: https://github.com/JhonsonMendoza/aws-crud-lambda-jhonson-mendoza.git

## Conclusiones

1. El proceso de implementar manejo de excepciones permitió mejorar significativamente la calidad del código. Pasamos de funciones básicas a un backend robusto que responde adecuadamente ante condiciones inesperadas. Gracias a las validaciones, errores triviales como campos vacíos o tipos incorrectos ya no afectan el sistema.

2. Este ejercicio reforzó la importancia de generar respuestas coherentes en toda la API. Ahora, los clientes (como Postman) pueden interpretar fácilmente si un error es por datos del usuario (400), por ausencia de recursos (404), o por fallos internos (500). Esto estandariza la comunicación backend-frontend y mejora la experiencia del desarrollador.

3. Trabajar con AWS Lambda y DynamoDB nos permitió entender cómo los errores pueden surgir en capas externas (como el SDK de AWS). Tener un manejo de excepciones apropiado evita que estos errores colapsen todo el sistema y, en su lugar, los registra de forma ordenada para su posterior análisis y corrección.

## Recomendaciones

* Aplicar validaciones desde el inicio en cada función, incluso si parecen innecesarias.
* Probar activamente las funciones con entradas erróneas en Postman antes de considerar el desarrollo terminado.
* Usar console.error o servicios de logging externos para capturar detalles del error y facilitar el debugging.

---