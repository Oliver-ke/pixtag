import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

interface IReqBody {
    image: string;
    name: string;
    mineType?: string;
}

const s3client = new S3Client({});

// this lambda would be uploading to s3 bucket
export const handleUploadS3 = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body: IReqBody = JSON.parse(event.body || '');
    const imageBase64 = body.image;
    const name = body.name;
    const id = nanoid();

    const buffer = Buffer.from(imageBase64, 'base64');
    const bucketParam = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${id}-${name}`,
        Body: buffer,
        ContentType: body.mineType || 'image/png',
    };

    try {
        console.log('Bucket', bucketParam.Bucket, 'key', bucketParam.Key);
        await s3client.send(new PutObjectCommand(bucketParam));
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Uploading Files',
            }),
        };
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'File Upload Successful' }) };
};
