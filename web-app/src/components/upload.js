import React, { Component, useState, } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Alert, Container, Row, Col, Form, Button, FormGroup, Input, FormText, Modal, Progress, ModalHeader, Dropdown, DropdownMenu, ModalBody, } from 'reactstrap';
import Amplify, { Storage } from 'aws-amplify';
import preview from '../img/audio.png';
import audio from '../img/audio.png';

import StatusModal from './statusmodal';


const uuidv4 = require('uuid/v4');

class Upload extends Component {
  constructor(props) {
	    super(props);
      this.state = {
        media_file: preview,
        media_type: 'image',
        uploading: false,
        error: false,
        file: '',
        face_file: preview,
        face_type: 'image',
        face: '',
        facename: '',
        modal_status: false,
        format: '',
        object_id: '',
        error_msg: 'Error',
        SpeakerNumber: "none",
        audioDuration: ''
      }

      this.Change = this.Change.bind(this);
      this.Upload = this.Upload.bind(this);
      this.Dismiss = this.Dismiss.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.toggle = this.toggle.bind(this);
    }


    Upload(e) {
      e.preventDefault();
      var self = this;
      var form = e.target;

      if (this.state.file !== '' && this.state.SpeakerNumber !== 'none') {
        
        self.setState({
          uploading: true
        });
        
        let content_map = {
          'mp3': 'audio/mp3',
          'wav': 'audio/wav',
          'wave': 'audio/wav',
          'flac': 'audio/flac',
          'mp4': 'video/mp4'
        };

        let file_ext = this.state.file.name.split('.').pop().toLowerCase();
        let content_type = content_map[file_ext];


        let uuid = uuidv4();
        // media/91b81042-13e7-4e33-931a-9bf242a21596/content/AWS_Podcast_Episode_364-teste2.mp3"
        let filename = [uuid, [this.state.file.name.split('.').slice(0,-1).join('.'),file_ext].join('.')].join("/");
        let tags = [
          'guid='+uuid,
          'numberSpeaker='+this.state.SpeakerNumber,
          'audioDuration='+this.state.audioDuration
        ].join("&");
        
        Storage.put(filename, this.state.file, {
            level: 'private',
            contentType: content_type,
            tagging: tags
        })
            .then (function(result) {
            	console.log(result);
              
              self.setState({
                /*
                "media_file": preview,
                "media_type": "image",
                modal_status: true,
                file: '',
                format: file_ext,
                object_id: uuid */
                uploading: false,
              });
              form.reset(); 
            })
            .catch(function(err) {
              console.log(err);
              self.setState({
                error: true,
                error_msg: "Failed to upload the file",
                uploading: false,
              });
              form.reset();
            });
      }
      else {
        let msg;
        if(this.state.SpeakerNumber === 'none') { msg = "You must specify the number of speakers" }else msg = "Error"
        this.setState({
          error: true,
          error_msg: msg
        }); 
      } 
  }
  

  Change(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    var video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
    
    if (file) {
      if (file.size <= 100000000) {
          let file_type = file.type.split('/')[0];
          reader.onloadend = () => {
            this.setState({
              "file": file,
              "media_file": reader.result,
              "media_type": file_type,
              "error": false,
              "audioDuration": video.duration
            });
          }
          reader.readAsDataURL(file)
      }
      else {
        this.setState({
          "file": '',
          "media_file": preview,
          "media_type": "image",
          'error': true,
          'error_msg': 'File previews are limited to 100MB or less for this demo page.'
        });
      }
    }
  }

  Dismiss(e) {
    e.preventDefault();
      this.setState({
        error: false,
        "media_file": preview,
        "media_type": "image",
      });
  }

  toggle() {
    this.setState({
      modal_status: false,
      object_id: '',
      format: '',
    });
  }

  handleChange(e) {
    this.setState({ SpeakerNumber: e.target.value });
  }


render() {
    var media_file = this.state.media_file;
    var media_type = this.state.media_type;
    var face_file = this.state.face_file;
    

    return (
      <Container>
        <Alert name="error" color="danger" isOpen={this.state.error} toggle={this.Dismiss}>{this.state.error_msg}</Alert>
        <Modal isOpen={this.state.modal_status} toggle={this.toggle}>
          <StatusModal format={this.state.format} objectid={this.state.object_id}/>
        </Modal>
        <Modal isOpen={this.state.uploading}>
          <ModalHeader>Upload Progress</ModalHeader>
          <ModalBody>
            <div>Uploading</div>
            <Progress animated color="warning" value="100" />
          </ModalBody>
        </Modal>
        <Row>
          <Col>
              <h1 className="display-6" align="center">Analyze new meeting</h1>
              <hr className="my-2" />
              <p className="lead" align="center">Upload new meeting video or audio file to be analyzed by Amazon Mercury</p>
              <div align="center">
                {media_type === "video" &&
                  <video align="center" src={media_file} controls autoPlay className="img-fluid border"/>
                }
                {media_type === "audio" &&
                  <div>
                    <audio id="audio_preview" src={media_file} controls autoPlay style={{"width":audio.width}}/>
                  </div>
                }
              </div>
              <div className="mt-3 mb-3">
                <Form onSubmit={this.Upload}>
                <FormGroup className="mt-3">
                    <Input type="file" accept="audio/mp3, audio/flac, audio/wav, video/quicktime, video/mp4" name="file" value={this.file} onChange={this.Change} />
                </FormGroup>
                <div className="form-inline">
                  <Input name="mediafilename" type="text" disabled placeholder={this.state.file.name} />
                  <label>Number of speakers: </label>
                  <select value={this.state.SpeakerNumber} onChange={this.handleChange}>
                    <option hidden disabled selected value = "none"> -- select a number -- </option>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                    <option value = "6">6</option>
                    <option value = "7">7</option>
                    <option value = "8">8</option>
                    <option value = "9">9</option>
                    <option value = "10">10</option>
                  </select>
                  
                </div>
                <FormText color="muted"> Media will be uploaded with the same name </FormText>
                <div>
                  <Button type="submit" disabled={this.state.file === ''}>Upload Meeting</Button>
                </div>
                </Form>
              </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withAuthenticator(Upload);