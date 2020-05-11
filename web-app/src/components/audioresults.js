import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import audio_img from '../img/audio.png';

class AudioResults extends Component {
  constructor(props) {
	    super(props);
      this.state = {
        activeTab: 'analysis',
        captions: false
      }
      this.tabToggle = this.tabToggle.bind(this);
      this.draw = this.draw.bind(this);
      this.audioControl = this.audioControl.bind(this);
    }


  tabToggle(tab) {
    if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
    }
  }

  draw() {

      var self = this;
      var div = document.getElementById("resultview");
      var audio = document.getElementById("resultaudio");
      var audio_image = document.getElementById("resultaudio_img");
      var canvas = document.getElementById("resultcanvas");

      if (canvas == null) {

          //Create canvas
          canvas = document.createElement('canvas');

          //Configure canvas
          canvas.id = "resultcanvas";
          canvas.width=audio_image.width;
          canvas.height=audio_image.height;
          canvas.style.maxWidth="750px";
          canvas.style.maxHeight="400px";
          canvas.style.position = "relative";
          //audio.style.display='none';
          audio_image.style.display='none';


          //Append canvas to div
          div.appendChild(canvas);

          //Draw image
          var context = canvas.getContext('2d');
          //Hide image

          var interval = setInterval(function(){ drawCaptions() },10);
          function drawCaptions() {
              context.drawImage(audio_image,0,0,canvas.width,canvas.height);
              if (self.state.captions) {
                  context.beginPath();
                  context.fillStyle = "black";
                  context.fillRect(0,0,canvas.width,60);
                  context.closePath();
                  if ((Math.ceil((audio.currentTime*1000)/100)*100) in self.props.captions) {
                      context.beginPath();
                      context.font = "15px Comic Sans MS";
                      context.fillStyle = "white";
                      context.fillText(self.props.captions[Math.ceil((audio.currentTime*1000)/100)*100].Captions,10,40)
                      context.closePath();
                  }
              }

              if (audio.ended || audio.paused) {
                  clearInterval(interval);
              }
          }
      }

      else {
          //Canvas already exists

          //Clear canvas
          var context = canvas.getContext('2d');

          var interval = setInterval(function(){ drawCaptions() },10);
          function drawCaptions() {

              context.drawImage(audio_image,0,0,canvas.width,canvas.height);
              if (self.state.captions) {
                  context.beginPath();
                  context.fillStyle = "black";
                  context.fillRect(0,0,canvas.width,60);
                  context.closePath();
                  if ((Math.ceil((audio.currentTime*1000)/100)*100) in self.props.captions) {
                      context.beginPath();
                      context.font = "15px Comic Sans MS";
                      context.fillStyle = "white";
                      context.fillText(self.props.captions[Math.ceil((audio.currentTime*1000)/100)*100].Captions,10,40)
                      context.closePath();
                  }
              }

              if (audio.ended || audio.paused) {
                  clearInterval(interval);
              }
          }
      }
  }

  audioControl(action) {
      var audio = document.getElementById("resultaudio");
      var self = this;
      if (action === "play") {
          if (audio.paused || audio.ended || audio.currentTime === 0){
              audio.play();
              self.draw();
          }
      }
      else if (action === "pause") {
          audio.pause();
      }
      else if (action === "restart") {
          audio.pause();
          setTimeout(function(){
              audio.currentTime = 0;
              audio.play();
          }, 20);
      }
  }

  

  render() {

    //var file_type = this.props.filetype;
    var file_name = this.props.filename;
    var media_source = this.props.mediafile;
    var transcript = this.props.transcript;
    var meeting_name = this.props.meetingName;

    //Kibana Embedded src creation
    var kibanasrc = "https://search-new-elasticsearch-domain-x64vk3x6b37yjycdxefk5idnci.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana?security_tenant=global#/dashboard/6d797a00-9081-11ea-9a95-ebea1d2214da?embed=true&_g=(filters%3A!())&_a="
    var kibanaP1 = "(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:aa478eb0-9093-11ea-9a95-ebea1d2214da,key:guid,negate:!f,params:(query:";
    var guid = this.props.guid;
    var kibanaP2 = "),type:phrase,value:"
    var kibanaP3 = "),query:(match:(guid:(query:"
    var kibanaP4 = ",type:phrase))))))"

    var analysis = [kibanasrc,kibanaP1, guid, kibanaP2, guid, kibanaP3, guid, kibanaP4].join("");

        return(
          <Container>
            <Row>
              <Col>
                <div>
                    <h1 align="center">{meeting_name}</h1>
                    <hr className="my-2" />
                    <p className="lead" align="center">{file_name}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col-6>
                <div id="resultview" align="center" className='mb-3' style={{"maxWidth":"500px", "maxHeight": "200px"}}>
                  <img alt="preview" id="resultaudio_img" src={audio_img} style={{"overflow":"scroll", "maxWidth":"500px", "maxHeight": "200px"}} />
                  <audio id="resultaudio" src={media_source}/>
                </div>
              </Col-6>
              <Col>
                <div>
                  <h5>Controls:</h5>
                  <hr className="my-2" />
                </div>
                <div align="center">
                  <Button className="mr-2 my-2" color="info" onClick={() => {this.audioControl('play'); }}>Play</Button>
                  <Button className="mr-2 my-2" color="info" onClick={() => {this.audioControl('pause'); }}>Pause</Button>
                  <Button className="mr-2 my-2" color="info" onClick={() => {this.audioControl('restart'); }}>Restart</Button>
                  {/*<Button className="mr-2 my-2" color="info" active={this.state.captions} onClick={() => {this.setState({captions: !this.state.captions}); }}>Captions</Button>*/}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                <Nav tabs className="mb-3">
                    <NavItem>
                      <NavLink active={this.state.activeTab === "analysis"} onClick={() => { this.tabToggle('analysis'); }}>Analysis</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink active={this.state.activeTab === "transcript"} onClick={() => { this.tabToggle('transcript'); }}>Transcript</NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="analysis">
                      <Row>
                        <Col align="center">
                        <iframe src={analysis} height="600" width="100%"></iframe>
                        {/*<iframe src="https://search-new-elasticsearch-domain-x64vk3x6b37yjycdxefk5idnci.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana?security_tenant=global#/dashboard/6d797a00-9081-11ea-9a95-ebea1d2214da?embed=true&_g=(filters:!())&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:aa478eb0-9093-11ea-9a95-ebea1d2214da,key:guid,negate:!f,params:(query:d8bafd14-f4ad-42b5-bf27-98b53697e392),type:phrase,value:d8bafd14-f4ad-42b5-bf27-98b53697e392),query:(match:(guid:(query:d8bafd14-f4ad-42b5-bf27-98b53697e392,type:phrase))))),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(title:'Meeting!'s+Statements+Sentiment+Breakout'),gridData:(h:12,i:'41d5a00f-ca6d-4817-b49c-8612a4e63596',w:14,x:34,y:0),id:c19e85d0-91f8-11ea-9a95-ebea1d2214da,panelIndex:'41d5a00f-ca6d-4817-b49c-8612a4e63596',title:'Meeting!'s+Statements+Sentiment+Breakout',type:visualization,version:'7.4.2'),(embeddableConfig:(title:''),gridData:(h:12,i:'4ad20bbb-fae1-4aed-916e-411f86d895fa',w:9,x:0,y:0),id:'0b8fc1d0-909c-11ea-9a95-ebea1d2214da',panelIndex:'4ad20bbb-fae1-4aed-916e-411f86d895fa',type:visualization,version:'7.4.2'),(embeddableConfig:(colors:(SILENCEDURATION:%23EAB839,'SPEAKER+1':%23508642),title:'Meeting+Speech+Time+Breakout',vis:(colors:(SILENCEDURATION:%23EAB839,'SPEAKER+1':%23508642,'SPEAKER+2':%23447EBC))),gridData:(h:12,i:'724f4672-3a14-4b9f-95c4-e5865878538b',w:25,x:9,y:0),id:'51395f30-9096-11ea-9a95-ebea1d2214da',panelIndex:'724f4672-3a14-4b9f-95c4-e5865878538b',title:'Meeting+Speech+Time+Breakout',type:visualization,version:'7.4.2'),(embeddableConfig:(title:'Top+Mentionned+People',vis:(colors:('%23+Mentions':%23447EBC))),gridData:(h:15,i:'1b172cb4-e0c7-4744-bb4d-841e345d21e8',w:16,x:0,y:12),id:'126a5a00-91fb-11ea-9a95-ebea1d2214da',panelIndex:'1b172cb4-e0c7-4744-bb4d-841e345d21e8',title:'Top+Mentionned+People',type:visualization,version:'7.4.2'),(embeddableConfig:(colors:('%23+Mentions':%23F2C96D),title:'Top+Mentionned+Organizations',vis:(colors:('%23+Mentions':%23EAB839))),gridData:(h:15,i:b777f45f-5c7d-4c4b-ba8b-cf9eeb2f3892,w:16,x:16,y:12),id:'6bc03980-91fb-11ea-9a95-ebea1d2214da',panelIndex:b777f45f-5c7d-4c4b-ba8b-cf9eeb2f3892,title:'Top+Mentionned+Organizations',type:visualization,version:'7.4.2'),(embeddableConfig:(colors:('%23+Mentions':%23967302),title:'Top+Mentionned+Locations',vis:(colors:('%23+Mentions':%23508642))),gridData:(h:15,i:'357fa463-ce85-4033-851b-84f70ff29f1a',w:16,x:32,y:12),id:f64a1350-91fb-11ea-9a95-ebea1d2214da,panelIndex:'357fa463-ce85-4033-851b-84f70ff29f1a',title:'Top+Mentionned+Locations',type:visualization,version:'7.4.2'),(embeddableConfig:(title:'Top+10+Keywords+per+Speaker'),gridData:(h:19,i:b40c6220-97f4-4496-b4b8-9c1fab194d29,w:48,x:0,y:27),id:d8fc62c0-9094-11ea-9a95-ebea1d2214da,panelIndex:b40c6220-97f4-4496-b4b8-9c1fab194d29,title:'Top+10+Keywords+per+Speaker',type:visualization,version:'7.4.2'),(embeddableConfig:(title:'Per+Speaker+Statement!'s+Sentiment+Breakout'),gridData:(h:18,i:e508e577-5ad4-479a-a79e-9417fb2047b2,w:48,x:0,y:46),id:'66664780-9094-11ea-9a95-ebea1d2214da',panelIndex:e508e577-5ad4-479a-a79e-9417fb2047b2,title:'Per+Speaker+Statement!'s+Sentiment+Breakout',type:visualization,version:'7.4.2')),query:(language:kuery,query:''),timeRestore:!f,title:MercurySingleMeetingDashboard,viewMode:view)" height="600" width="800"></iframe>*/}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="transcript">
                      <Row>
                        <Col align="center">
                          {transcript}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Container>
        );
  }
}

export default withAuthenticator(AudioResults);
