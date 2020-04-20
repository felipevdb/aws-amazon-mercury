import json
import boto3
import uuid
import json
from urllib.parse import unquote_plus

comprehend_client = boto3.client(service_name='comprehend', region_name='us-east-1')
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    #print(event)
    
    for record in event['Records']:
        s3BucketName = record['s3']['bucket']['name']
        s3ObjectKey = unquote_plus(record['s3']['object']['key'])
        print(s3BucketName)
        print(s3ObjectKey)
        
        s3_clientobj = s3_client.get_object(Bucket=s3BucketName, Key=s3ObjectKey)
        s3_clientdata = s3_clientobj['Body'].read().decode('utf-8')
        s3clientlist=json.loads(s3_clientdata)
        
        textContent = s3clientlist['results']['transcripts'][0]['transcript']
        keyNameTxtFile = 'transcriptionText/' + s3ObjectKey.replace('trascribe-sourceAudio-', '').replace('.json', '.txt')
        print(keyNameTxtFile)
        
        s3_client.put_object(
            Bucket='amazon-mercury-bucket',
            Key=keyNameTxtFile,
            Body=textContent
        )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
