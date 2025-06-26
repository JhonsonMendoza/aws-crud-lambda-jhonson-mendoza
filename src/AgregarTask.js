const {
    v4: uuidv4
} = require('uuid');

const {
    DynamoDB
} = require('aws-sdk');

exports.agregarTask = async (event) => {
    const body = JSON.parse(event.body);
    const {
        titulo,
        descripcion
    } = body;
    
    if (!titulo || !descripcion) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Título y descripción son obligatorios',
            })
        };
    }

    const fechaCreacion = new Date().toISOString();
    const id = uuidv4();
    const dynamoDB = new(require('aws-sdk')).DynamoDB.DocumentClient();

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
        console.error("Error al guardar tarea:", error);
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
    const {
        titulo,
        descripcion,
        estado
    } = JSON.parse(event.body);
    const fechaActualizacion = new Date().toISOString();
    const {
        id
    } = event.pathParameters;
    if (!titulo || !descripcion || typeof estado !== 'boolean') {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Datos incompletos o inválidos',
            })
        };
    }
    const dynamoDB = new(require('aws-sdk')).DynamoDB.DocumentClient();

    try {
        const response = await dynamoDB.update({
            TableName: 'usersTable',
            Key: {
                id
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
        console.error("Error al actualizar tarea:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al actualizar tarea',
                error: error.message
            })
        };
    }

};