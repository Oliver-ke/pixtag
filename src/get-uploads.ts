import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// this lambda would be reading from dynamodb
export const handleGetUploads = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const tableName = process.env?.TABLE_NAME || '';
    const comm = new ScanCommand({ TableName: tableName });

    try {
        const res = await ddbDocClient.send(comm);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successful',
                payload: {
                    items: res.Items || [],
                    count: res.Count || 0,
                },
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
