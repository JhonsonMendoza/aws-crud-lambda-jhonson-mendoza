const {
    DynamoDB
} = require('aws-sdk');

exports.eliminarTask = async (event) => {
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
        const response = await dynamoDB.delete({
            TableName: 'usersTable',
            Key: {
                id
            },
            ReturnValues: 'ALL_OLD'
        }).promise();

        if (!response.Attributes) {
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
                message: 'Tarea eliminada con éxito',
                data: response.Attributes
            })
        };
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error interno al eliminar tarea',
                error: error.message
            })
        };
    }

};