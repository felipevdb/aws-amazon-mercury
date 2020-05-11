import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Button, Modal, ModalHeader, ModalBody, Progress, UncontrolledTooltip, Alert } from 'reactstrap';
import { Storage, API } from 'aws-amplify';
import preview from '../img/preview.png';
import AudioResults from './audioresults';
const uuidv4 = require('uuid/v4');


class Result extends Component {
  constructor(props) {
	    super(props);
      this.state = {
        filename: '', //needed
        meetingName: '',//needed
        media_file: preview, //needed
        label_list: [], //needed
        face_list: [], //needed
        face_match_list: [],
        celeb_list: [],
        entity_list: [],
        phrase_list: [],
        transcript: '',
        persons: [],
        file_type: 'mp3', //needed
        celeb_boxes: [],
        face_match_boxes: [],
        face_boxes: [],
        att_list: [], //needed
        celeb_faces: [], //needed
        known_faces: [], //needed
        downloading: false,
        celeb_video: {},
        att_video: {},
        video_face_list: [],
        video_indv_celebs: [],
        video_indv_known_faces: [],
        known_face_video: {},
        captions: {},
        error_status: false,
        error_msg: ''

      }

      this.getTranscript = this.getTranscript.bind(this);
      this.getEntities = this.getEntities.bind(this);
      this.getPhrases = this.getPhrases.bind(this);
      this.getCaptions = this.getCaptions.bind(this);

    }

  componentDidMount() {
    var self = this;

    var url = ['https://rehns3s8gj.execute-api.us-east-1.amazonaws.com/prod','/details',this.props.match.params.objectid].join('/');
    var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    var requestParams = {};
    self.setState({
        downloading: true
    });
    fetch(url, requestOptions)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                    return;
                  }
                response.json().then(function(data) {
                    Storage.get(data.s3OriginalFile, {level: 'private'})
                    .then(function(file) {
                        self.setState({
                            downloading: false,
                            media_file: file,
                            error_status: false
                        })
                    }).catch(function(err){
                        self.setState({
                            downloading: false,
                            error_msg: 'Unable to download the File',
                            error_status: true
                        })
                    })
                    self.setState({
                        filename: data.fileName,
                        meetingName: data.meetingName
                    });
                    
                });
        }).catch(function(err) {
                //console.log('Fetch Error :-S', err);
        });


    /*
    API.get('MediaAnalysisApi', path, requestParams)
      .then(function(response) {

        var filepath = ['media',response.object_id,'content',response.details.filename].join('/');
        Storage.get(filepath,{level: 'private'})
        .then(function(file) {
          self.setState({
            downloading: false,
            media_file: file,
            error_status: false
          })
        })
        .catch(function(err) {
          //console.log(err);
        });

        self.setState({
            filename: response.details.filename,
            file_type: response.details.file_type
        });

        if ( response.details.file_type === 'mp3' || response.details.file_type === 'wav' || response.details.file_type === 'flac' || response.details.file_type === 'wave') {
            self.getTranscript();
            self.getEntities();
            self.getPhrases();
            self.getCaptions();
        }

      })
      .catch(function(error) {
        //console.log(error);
        self.setState({
            downloading: false,
            error_msg: 'Unable to see the file meeting',
            error_status: true
        });
      });*/
  }

  getCaptions() {
    var self = this;
    var video_captions = {};
    var captions_path = ['/lookup',this.props.match.params.objectid,'captions'].join('/');
    API.get('MediaAnalysisApi', captions_path, {})
      .then(function(data) {
          var ts = 0;
          for (var c in data.Captions) {
              if (data.Captions[c].hasOwnProperty("Content")) {
                for (ts = (Math.floor((data.Captions[c].Timestamp)/100)*100) - 200; ts <= (Math.floor((data.Captions[c].Timestamp)/100)*100) + 2000; ts += 100) {
                    if (video_captions.hasOwnProperty(ts)) {
                        video_captions[ts].Captions += (" "+data.Captions[c].Content);
                    }
                    else {
                        video_captions[ts] = {"Captions":data.Captions[c].Content};
                    }
                }
              }
          }
          self.setState({
              "captions": video_captions
          });
      })
      .catch(function(err) {
          //console.log(err);
      });
  }

  getTranscript() {
    var self = this;
    var transcript_path = ['/lookup',this.props.match.params.objectid,'transcript'].join('/');
    API.get('MediaAnalysisApi', transcript_path, {})
      .then(function(data) {
          self.setState({
              "transcript": data.Transcripts[0].Transcript
          });
      })
      .catch(function(err) {
          //console.log(err);
      });
  }

  getEntities() {
    var self = this;
    var entities_path = ['/lookup',this.props.match.params.objectid,'entities'].join('/');
    var entity_list = [];
    API.get('MediaAnalysisApi', entities_path, {})
      .then(function(data) {
          for (var e in data.Entities) {
              entity_list.push({"Name":data.Entities[e].Name, "Confidence":data.Entities[e].Impressions[0].Score*100, "Id":[data.Entities[e].Name.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " "),uuidv4()].join('-')});
          }
          self.setState({
              "entity_list": entity_list
          });
      })
      .catch(function(err) {
          //console.log(err);
      });
  }

  getPhrases() {
    var self = this;
    var phrases_path = ['/lookup',this.props.match.params.objectid,'phrases'].join('/');
    var phrase_list = [];
    API.get('MediaAnalysisApi', phrases_path, {})
      .then(function(data) {
          for (var p in data.Phrases) {
              phrase_list.push({"Name":data.Phrases[p].Name, "Confidence":data.Phrases[p].Impressions[0].Score*100, "Id":[data.Phrases[p].Name.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " "),uuidv4()].join('-')});
          }
          self.setState({
              "phrase_list": phrase_list
          });
      })
      .catch(function(err) {
          //console.log(err);
      });
  }

  render() {
    
    
    if (this.state) {
        //var self = this;
        

        //let persons = this.state.persons;
        let transcript = this.state.transcript;
        
        if (this.state.file_type === 'wav' || this.state.file_type === 'wave' || this.state.file_type === 'flac' || this.state.file_type === 'mp3') {
            return (
                <div>
                <Alert name="error" color="danger" isOpen={this.state.error_status} toggle={this.Dismiss}>
                {this.state.error_msg}
                </Alert>
                <Modal isOpen={this.state.downloading}>
                    <ModalHeader>Retrieving Media File</ModalHeader>
                    <ModalBody>
                    <div>Downloading</div>
                    <Progress animated color="warning" value="100" />
                    </ModalBody>
                </Modal>
                    <AudioResults mediafile={this.state.media_file} guid={this.props.match.params.objectid} meetingName={this.state.meetingName} filename={this.state.filename} filetype={this.state.file_type}  transcript={transcript}/>
                </div>

            );
        }
    }
    
  }
}

export default withAuthenticator(Result);