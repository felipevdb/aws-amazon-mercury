import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { Card, CardBody, CardSubtitle, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withAuthenticator } from 'aws-amplify-react';
import preview from '../img/preview.png';
import audio from '../img/audio.png';
import video from '../img/video.png';

class MediaCard extends Component {
  constructor(props) {
	    super(props)
      this.state = {
        media: preview
      }
    }

  componentDidMount() {
      var self = this;
      Storage.get(self.props.item.thumbnail,{level: 'private'})
      .then(function(result) {
        //console.log(result);
        self.setState({
          media: result
        });
      })
      .catch(function(err) {
        //console.log(err);
        self.setState({
          media: preview
        });
      });
  }

  render(){
    var name = this.props.item.meetingName;
    var result_link = ["/result",this.props.item.guid].join('/');
    var file_name = this.props.item.originalFile.s3ObjectKey.match(/([^\/]*)\/*$/)[1];
    var speakers = this.props.item.speakers;
    var uploadDate = this.props.item.uploadDate;

    return(
        <div>
            <Card className="text-center" body outline color="secondary">
                <CardHeader style={{"whiteSpace":"nowrap","textOverflow": "ellipsis","overflow": "hidden"}}>{name}</CardHeader>
                <CardBody>
                    <CardSubtitle style={{"whiteSpace":"nowrap","textOverflow": "ellipsis","overflow": "hidden"}}>{file_name}</CardSubtitle>
                    <div><label>Number of Speakers: {speakers}</label></div>
                    <div><label>Uploaded at: {uploadDate}</label></div>
                    <div className="pt-2">
                        <Link to={result_link}>
                            <Button color="primary">View Results</Button>
                        </Link>
                    </div>
                </CardBody>
            </Card>
      </div>
    );
  }
}

export default withAuthenticator(MediaCard);