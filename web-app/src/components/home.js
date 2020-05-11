import React, { Component } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Container, Row, Col } from 'reactstrap';


class Home extends Component{
    render(){
        return(
            <div>
            <div>
            <h1 className="display-6" align="center">Main Dashboard</h1>
            </div>
            <div align="center">
                <iframe src="https://search-new-elasticsearch-domain-x64vk3x6b37yjycdxefk5idnci.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana?security_tenant=global#/dashboard/92516340-8edf-11ea-9a95-ebea1d2214da?embed=true&_g=(filters%3A!())" height="1500" width="95%"></iframe>
            </div>
            </div>
        );
    }
}

export default withAuthenticator(Home);