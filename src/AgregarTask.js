const { v4: uuidv4 } = require('uuid');
const { DynamoDB } = require('aws-sdk');

exports.agregarTask = async (event) => {
    const { titulo, descripcion } = JSON.parse(event.body);
    const fechaCreacion = new Date().toISOString();
    const id = uuidv4();
    const dynamoDB = new DynamoDB.DocumentClient();
    const item = {
        id,
        titulo,
        descripcion,
        fechaCreacion,
        estado: false,
    };
    try {
        await dynamoDB.put({
            TableName: 'usersTable', 
            Item: item
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tarea agregada con éxito',
                data: item,
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al guardar tarea',
                error: error.message
            })
        };
    }
};

exports.actualizarTask = async (event) => {
    const { titulo, descripcion, estado } = JSON.parse(event.body);
    const fechaActualizacion = new Date().toISOString();
    const { id } = event.pathParameters;
    const dynamoDB = new DynamoDB.DocumentClient();

    try {
        const response = await dynamoDB.update({
            TableName: 'usersTable',
            Key: {
                id, // Usar el id obtenido desde la ruta
            },
            UpdateExpression: 'set titulo = :titulo, descripcion = :descripcion, fechaCreacion = :fechaActualizacion, estado = :estado',
            ExpressionAttributeValues: {
                ':titulo': titulo,
                ':descripcion': descripcion,
                ':fechaActualizacion': fechaActualizacion,
                ':estado': estado
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tarea actualizada con éxito',
                data: response.Attributes,
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al guardar tarea',
                error: error.message
            })
        };
    }
};