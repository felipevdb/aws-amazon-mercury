import json
import boto3
from urllib.parse import unquote_plus
import json
import uuid 

def lambda_handler(event, context):
    transcribe = boto3.client('transcribe')
    print(event)
    
    
    for record in event['Records']:
        s3BucketName = record['s3']['bucket']['name']
        s3ObjectKey = unquote_plus(record['s3']['object']['key'])
        print(s3BucketName)
        print(s3ObjectKey)
        
        
        job_name = "trascribe-sourceAudio-%s"%(uuid.uuid1())
        job_uri = "s3://%s/%s"%(s3BucketName,s3ObjectKey)
        print(job_name)
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat='mp3',
            LanguageCode='en-US',
            OutputBucketName = 'amazon-mercury-bucket-transcriptionjob'
            
        )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
