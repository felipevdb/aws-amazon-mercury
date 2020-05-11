import React, { Component } from 'react';
import Amplify, { API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { Alert, Container, Row, Col, Form, FormGroup, Input, Button, Modal, ModalHeader, Progress, ModalBody, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import MediaCard from './mediacard';

class Browse extends Component {
	constructor(props) {
	    super(props);
			this.state = {
				results: [],
				searchterm: "*",
				error: false,
				current_page: 1,
				searching: false,
				noresults: false,
				page_count: 1,
				result_count: 0
			}
	        this.Search = this.Search.bind(this);
			this.Change = this.Change.bind(this);
			this.Dismiss = this.Dismiss.bind(this);
	}

	componentDidMount() {
		this.Search({"change_page":1});
	}

	componentDidUpdate() {
  window.scrollTo(0,0);
	}

	Change(e) {
		var self = this;
		self.setState({
			"searchterm": e.target.value,
			"results": [],
			noresults: false
		});
	}

	Search(e) {
		var self = this;
		var url = "";
		var term = "";

		self.setState({
			searching: true
		});

		if ("change_page" in e) {
			term =  encodeURIComponent(self.state.searchterm);
			url = ['https://rehns3s8gj.execute-api.us-east-1.amazonaws.com/prod','/search'].join('');
		}
		else {
			e.preventDefault();
			e.target.reset();
			this.setState({
				current_page: 1
			});
			term =  encodeURIComponent(self.state.searchterm);
			url = ['https://rehns3s8gj.execute-api.us-east-1.amazonaws.com/prod','/search'].join('');
        }
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let requestParams = {};
        
        fetch(url, requestOptions)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
                    return;
                  }
                response.json().then(function(data) {
                    if(data.length !== 0){
                        self.setState({
                            results: data,
                            searching:false
                        })
                    }
                    else {
                        self.setState({
                            results: [],
                                searching: false,
                                noresults: true,
                                result_count: 0,
                                page_count: 1
                        });
                    }
                });
        }).catch(function(err) {
                //console.log('Fetch Error :-S', err);
        });
    /*
    API.get('MediaAnalysisApi', path, requestParams)
      .then (function(response) {
        //console.log(response);
        if(response.Items !== 0) {
		    	self.setState({
		    		results: response.Items,
						searching:false,
						noresults: false,
						result_count: response.total,
						page_count: Math.ceil(response.total/30)
		    	});
        }
        else {
			    	self.setState({
			    		results: [],
							searching: false,
							noresults: true,
							result_count: 0,
							page_count: 1
			    	});
			    	//console.log("no results found");
		    }
      })
      .catch(function (error) {
				self.setState({
					"error": true,
					searching: false
				});
		    //console.log(error);
		  });*/
    }
    

	Dismiss(e) {
    e.preventDefault();
      this.setState({
        error: false,
				noresults: false
      });
  }

	render(){
		var media_cards = this.state.results.map(item => {
			return(
				<Col md="4" className="py-2">
					<MediaCard item={item} />
				</Col>
			)
		});

		return(
			<Container fluid className="bg-light">
				<div>
					<Alert name="noresults" color="warning" isOpen={this.state.noresults} toggle={this.Dismiss}>
	                    Search returned no results
	                </Alert>
					<Alert name="error" color="danger" isOpen={this.state.error} toggle={this.Dismiss}>
						Search Error
					</Alert>
				</div>
				<div>
					<Modal isOpen={this.state.searching}>
						<ModalHeader>Searching</ModalHeader>
						<ModalBody>
							<Progress animated color="warning" value="100" />
						</ModalBody>
					</Modal>
				</div>
				<div>
					<Container>
						<Row>
							{media_cards}
						</Row>
					</Container>
				</div>
			</Container>

		);
	}
}

export default withAuthenticator(Browse);