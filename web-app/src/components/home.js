import React, { Component } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Container, Row, Col } from 'reactstrap';


class Home extends Component{

    fetchKibanaAuth(){
        fetch("https://search-new-elasticsearch-domain-x64vk3x6b37yjycdxefk5idnci.us-east-1.es.amazonaws.com/_plugin/kibana/api/security/v1/login", {
            body: JSON.stringify({
              username: "yamarim",
              password:"Abcd123#",
            }),
            credentials: 'include',
            headers: {
              "kbn-version": "7.4.2",
              "Access-Control-Allow-Origin": "*"
            },
            method: "POST",
          })       
    }

    componentWillMount(){
        this.fetchKibanaAuth();
    }

    render(){
        return(
            <div>
                <Container>
                    <Col>
                    <iframe src="https://search-new-elasticsearch-domain-x64vk3x6b37yjycdxefk5idnci.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana?security_tenant=global#/dashboard/6d797a00-9081-11ea-9a95-ebea1d2214da?embed=true&_g=(filters%3A!())" height="1850" width="100%"></iframe>
                    </Col>
                </Container>
            </div>
        );
    }
}

export default withAuthenticator(Home);