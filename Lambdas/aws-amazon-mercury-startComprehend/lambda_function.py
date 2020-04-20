import json
import boto3
import uuid
import json
from urllib.parse import unquote_plus

comprehend_client = boto3.client(service_name='comprehend', region_name='us-east-1')
s3_client = boto3.client('s3')


def lambda_handler(event, context):
    
    print(event)
    
    for record in event['Records']:
        s3BucketName = record['s3']['bucket']['name']
        s3ObjectKey = unquote_plus(record['s3']['object']['key'])
        print(s3BucketName)
        print(s3ObjectKey)
        
        S3URi= "s3://%s/%s"%(s3BucketName,s3ObjectKey)
        
        response = comprehend_client.start_sentiment_detection_job(
            JobName = "comprehend-transcriptionText-%s"%(s3ObjectKey.replace('transcriptionText/', '').replace('.txt', '')),
            InputDataConfig={
                'S3Uri': S3URi,
                'InputFormat': 'ONE_DOC_PER_FILE'
            },
            OutputDataConfig={
                'S3Uri': "s3://%s/comprehendTEST"%(s3BucketName)
            },
            LanguageCode = 'en',
            DataAccessRoleArn= 'arn:aws:iam::544464437166:role/service-role/AmazonComprehendServiceRoleS3FullAccess-teste'
        )
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

# Function for detecting sentiment
def detect_sentiment(text):
    response = comprehend_client.start_sentiment_detection_job()
    return response
    
    
# Function for detecting named entities
def detect_entities(text):
    response = comprehend_client.detect_entities(Text=text, LanguageCode='en')
    return response

# Function for detecting key phrases
def detect_key_phraes(text):
    response = comprehend_client.detect_key_phrases(Text=text, LanguageCode='en')
    return response

# Function for detecting Sintax
def detect_sintax(text):
    response = comprehend_client.detect_syntax(Text=text, LanguageCode='en')
    return response