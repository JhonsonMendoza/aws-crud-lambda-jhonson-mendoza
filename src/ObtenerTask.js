const {
    DynamoDB
} = require('aws-sdk');

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
        console.error("Error al obtener tareas:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al obtener tareas',
                error: error.message
            })
        };
    }

};

exports.obtenerTasks = async (event) => {
    const dynamoDB = new DynamoDB.DocumentClient();
    const {
        id
    } = event.pathParameters; // Obtener el id desde la ruta
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'ID de tarea no proporcionado',
            })
        };
    }

    try {
        const response = await dynamoDB.get({
            TableName: 'usersTable',
            Key: {
                id
            }
        }).promise();

        if (!response.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Tarea no encontrada',
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tarea obtenida con éxito',
                data: response.Item
            })
        };
    } catch (error) {
        console.error("Error al obtener tarea:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al obtener tarea',
                error: error.message
            })
        };
    }

};