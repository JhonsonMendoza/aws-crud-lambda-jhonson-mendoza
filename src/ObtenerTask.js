const { DynamoDB } = require('aws-sdk');

exports.obtenerTask = async (event) => {
    const dynamoDB = new DynamoDB.DocumentClient();

    try {
        const response = await dynamoDB.scan({
            TableName: 'usersTable',
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tareas obtenidas con éxito',
                data: response.Items
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

exports.obtenerTasks = async (event) => {
    const dynamoDB = new DynamoDB.DocumentClient();
    const {id} = event.pathParameters; // Obtener el id desde la ruta
    try {
        const response = await dynamoDB.get({
            TableName: 'usersTable',
            Key: {
                id, // Usar el id obtenido de los parámetros de la ruta
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tarea obtenidas con éxito',
                data: response.Item
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al encontrar tarea',
                error: error.message
            })
        };
    }
};