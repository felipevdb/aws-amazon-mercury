import json
import boto3

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    s3BucketName = event['bucketName']
    s3ObjectKey = event['objectKey']
    # print(s3BucketName)
    # print(s3ObjectKey)

    s3_clientobj = s3_client.get_object(Bucket=s3BucketName, Key=s3ObjectKey)
    s3_clientdata = s3_clientobj['Body'].read().decode('utf-8')
    data = json.loads(s3_clientdata)

    transcript = data['results']['transcripts'][0]['transcript']
    wordList = transcript.split()
    #print(wordList)
    counter = 0

    fullTranscriptSegmentList = []
    perSpeakerContent = {}

    for segment in data['results']['speaker_labels']['segments']:
        numWords = len(segment['items'])
        raw_speaker = segment['speaker_label']
        speaker = raw_speaker.replace("spk_", "Speaker ") + ":"
        # print(speaker)
        
        # Full transcript labeling
        segmentText = wordList[counter:counter + numWords]
        segmentText.insert(0, speaker)
        fullTranscriptSegmentList.append(" ".join(segmentText))
        
        # Per Speaker grouping
        strSegmentText = ' '.join(segmentText[1:])
        perSpeakerContent[raw_speaker] = perSpeakerContent[raw_speaker] + '\n\n' + strSegmentText if raw_speaker in perSpeakerContent else strSegmentText
        

        counter = counter + numWords
    
    # keys = [key for key in perSpeakerContent]
    # print(keys)
    # print(perSpeakerContent[keys[0]][:100])
    
    sourceJobName = s3ObjectKey.replace('.json', '')
    outputText = "\n\n".join(fullTranscriptSegmentList)
    s3_client.put_object(
        Bucket='amazon-mercury-bucket',
        Key='transcriptionText/{0}/{0}-full.txt'.format(sourceJobName),
        # Key='transcriptionText/' + sourceJobName + '/' + sourceJobName + '-full.txt' ,
        Body=outputText
    )
    
    for spk in perSpeakerContent:
        s3_client.put_object(
            Bucket='amazon-mercury-bucket',
            Key='transcriptionText/{0}/{0}-{1}.txt'.format(sourceJobName, spk),
            # Key='transcriptionText/' + sourceJobName + '/' + sourceJobName + '-' + spk + '.txt',
            Body=perSpeakerContent[spk]
        )        