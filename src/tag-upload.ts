import { S3CreateEvent } from 'aws-lambda';
import { RekognitionClient, DetectLabelsCommand, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { nanoid } from 'nanoid';

const rekognitionClient = new RekognitionClient({});
const dynamoDbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient, { marshallOptions: { removeUndefinedValues: true } });

// Recognition Helpers
const detectLabel = async (Bucket: string, key: string) => {
    const command = new DetectLabelsCommand({ Image: { S3Object: { Bucket, Name: key } } });
    const res = await rekognitionClient.send(command);
    return res.Labels;
};

const detectText = async (Bucket: string, key: string) => {
    const command = new DetectTextCommand({ Image: { S3Object: { Bucket, Name: key } } });
    const res = await rekognitionClient.send(command);
    return res.TextDetections;
};

// this lambda would gen tag/label, and save tag result to dynamodb
export const handleTagUpload = async (event: S3CreateEvent): Promise<string> => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const tableName = process.env?.TABLE_NAME || '';
    try {
        const labels = await detectLabel(bucket, key);
        const textDetections = await detectText(bucket, key);
        const savePayload = { image: key, labels, textDetections, id: nanoid() };
        const dynamodbPutCommand = new PutCommand({ TableName: tableName, Item: savePayload });
        await ddbDocClient.send(dynamodbPutCommand);
    } catch (err) {
        console.log(err);
        return `Error Occurred, ${err?.message}`;
    }

    return `Success, ${key}`;
};
