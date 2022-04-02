# pixtag
A serverless application built for tagging and classification of images uploaded to s3, built with AWS Serverless Application Model (SAM);

Architectural Diagram

![architectural diagram](/diagram.png?raw=true "Diagram")

SAM makes use of Cloudformation templates, therefore all resource required for this project is defined in the template file.
To clone this project ensure you have the following
- local setup aws cli
- local setup SAM
- local setup docker (optional but required if you want to test locally)

Steps to recreate this project
- clone this repository
- `cd src` and run `npm install`
- `cd ..` and run `sam build`, this would build the project
- run `sam deploy guided` and follow the prompt to deploy to the cloud 

Serverless Functions
`upload-s3.ts`: lambda function connected to an API gateway that handles image to be uploaded to s3
`tag-upload`: lambda function that gets triggered when an image is completely uploaded to s3, this lambda function handles the actual image label/tagging using AWS Rekognition service and then saving the result to dynamodb for retrieval 
`get-upload`: return all tag uploads saved on dynamo db through API gateway 