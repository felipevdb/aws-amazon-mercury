import json
import logging
import boto3

def lambda_handler(event, context):
    # TODO implement
    comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
    text = "Us is a 2019 American horror film written and directed by Jordan Peele, starring Lupita Nyong'o, Winston Duke, Elisabeth Moss, and Tim Heidecker. The film follows Adelaide Wilson (Nyong'o) and her family, who are attacked by a group of mysterious doppelgängers. The project was announced in February 2018, and much of the cast joined in the following months. Peele produced the film alongside Jason Blum and Sean McKittrick (with the trio previously having collaborated on Get Out and BlacKkKlansman), as well as Ian Cooper. Filming took place from July to October 2018 in California, mostly in Los Angeles and Pasadena and also in Santa Cruz. Us had its world premiere at South by Southwest on March 8, 2019, and was theatrically released in the United States on March 22, 2019, by Universal Pictures. It was a critical and commercial success, grossing $255 million worldwide against a budget of $20 million, and received praise for Peele's screenplay and direction, as well as the musical score and Nyong'o's performance."
    
    #Detectar linguagem
    languageJson = comprehend.detect_dominant_language(Text = text)
  
    #Detectar entidades
    entityJson = comprehend.detect_entities(Text=text, LanguageCode='en')

    #Detectar Palavras chaves
    keywordJson = comprehend.detect_key_phrases(Text=text, LanguageCode='en')

    #Detectar Sentimento
    feelingJson = comprehend.detect_sentiment(Text=text, LanguageCode='en')
    
    #Detectar Sintaxes
    syntaxJson = comprehend.detect_syntax(Text=text, LanguageCode='en')
    
    
    return {
        'statusCode': 200,
        'body' : {
            "languageOutput": languageJson,
            "entityOutput": entityJson,
            "keywordOutput": keywordJson,
            "feelingOutput": feelingJson
        }
    }
