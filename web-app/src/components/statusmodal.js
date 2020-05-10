import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API } from 'aws-amplify';
import { ModalHeader, ModalBody, ModalFooter, Progress, Button } from 'reactstrap';
import { Link } from 'react-router-dom';


class StatusModal extends Component {
    constructor(props) {
  	    super(props);
        this.state = {
          state_machine_color: "warning",
          state_machine_value: "15",
          transcript_color: "warning",
          transcript_value: "50",
          comprehend_color: "warning",
          comprehend_value: "0",
          button: true
        }
        this.getStatus = this.getStatus.bind(this);
  	}

    componentDidMount() {
      this.getStatus();
  	}

    componentWillUnmount() {
    clearInterval(this.interval);
    }

    getStatus() {
      var self = this;
      var requestParams = {};
      var url = ['https://rehns3s8gj.execute-api.us-east-1.amazonaws.com/prod','status',this.props.objectid].join('/');
      var myHeaders = new Headers();
      var raw = "";

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var interval = setInterval(function(){ getStateMachineStatus() },30000);

      function getStateMachineStatus() {
        fetch(url, requestOptions)
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
      
            // Examine the text in the response
            response.json().then(function(data) {
              if(data.status === "RUNNING"){
                if((data.transcribe === "SUCCEEDED") && (data.Comprehend === "RUNNING") && (data.ComprehendAsync === "NOT STARTED")){
                  self.setState({
                    state_machine_value: "35",
                    transcript_color: "success",
                    transcript_value: "100",
                    comprehend_value: "30",
                  })
                }
                  if((data.transcribe === "SUCCEEDED") && (data.Comprehend === "SUCCEEDED") && (data.ComprehendAsync === "RUNNING")){
                    self.setState({
                      transcript_color: "success",
                      transcript_value: "100",
                      state_machine_value: "75",
                      comprehend_value: "70"
                    })
                  }
                
              }
              if(data.status === "SUCCEEDED"){
                self.setState({
                  comprehend_color: "success",
                  comprehend_value: "100",
                  state_machine_color: "success",
                  state_machine_value: "100",
                  button: false
                });
                clearInterval(interval);
              }
              if (data.status === "FAILED" || data.status === "TIMED_OUT" || data.status === "ABORTED") {
                self.setState({
                  state_machine_color: "danger",
                  state_machine_value: "100"
                });
                clearInterval(interval);
              }
            });
          }
        )
        .catch(function(err) {
          //console.log('Fetch Error :-S', err);
        });
      }

    }

    render() {
      let result_link = ["/result",this.props.objectid].join('/');

      if (this.props.format === '') {
          return(null);
      }
      else if (this.props.format === "mp3" || this.props.format === "wav" || this.props.format === "wave" || this.props.format === "flac") {
          return(
            <div>
              <ModalHeader toggle={this.toggle}>Media Analysis Progress</ModalHeader>
              <ModalBody>
                <div>Workflow Progress</div>
                <Progress animated color={this.state.state_machine_color} value={this.state.state_machine_value} />
                <hr className="my-2" />
                <div>Transcript</div>
                <Progress animated color={this.state.transcript_color} value={this.state.transcript_value} />
                <div>Comprehend Jobs</div>
                <Progress animated color={this.state.comprehend_color} value={this.state.comprehend_value} />
              </ModalBody>
              <ModalFooter>
                <div>
                  <Link to={result_link}>
                    <Button color="primary" disabled={this.state.button}>View Results</Button>
                  </Link>
                </div>
              </ModalFooter>
            </div>
          );
      }
    }
}

export default withAuthenticator(StatusModal);