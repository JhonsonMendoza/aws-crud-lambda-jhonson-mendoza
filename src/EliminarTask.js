const {DynamoDB} = require('aws-sdk');

exports.eliminarTask = async (event) => {
    const dynamoDB = new DynamoDB.DocumentClient();
    const { id } = event.pathParameters; // Obtener el id desde la ruta
    try {
        const response = await dynamoDB.delete({
            TableName: 'usersTable',
            Key: {
                id, // Usar el id obtenido de los parámetros de la ruta
            },
            ReturnValues: 'ALL_OLD' // Devuelve el elemento eliminado
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tarea eliminada con éxito',
                data: response.Attributes // Devuelve el elemento eliminado
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al eliminar tarea',
                error: error.message
            })
        };
    }
};
