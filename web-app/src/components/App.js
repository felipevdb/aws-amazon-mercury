/* React and Amplify libraries Imports */
import React, { Component } from 'react'
import Amplify from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { NavbarBrand, Navbar, Nav, NavItem, NavLink } from 'reactstrap';


/* Components import */
import Home from './home';
import Settings from './settings';
import Upload from './upload';
import Result from './result';
import Browse from './browse'



Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId:  'us-east-1_egB2bVW7W', //"us-east-1_LIw4slKTV",
    userPoolWebClientId:  '1rmr3hto7am6tjlipsq43surcs', //"2qdq2jrk6jlvd6de1btctq7ok5",
    identityPoolId: 'us-east-1:7ce4975b-92b3-4d47-b4b6-05454a09286b' //"us-east-1:047985bf-1803-4b86-b784-e6324fae707c"
  },
  Storage:{
    AWSS3:{
      bucket: "amazon-mercury-bucket",
      region: "us-east-1",
      identityPoolId: 'us-east-1:7ce4975b-92b3-4d47-b4b6-05454a09286b'
    }
  },
  API: {
    endpoints: [
      {
          name: 'teste',
          region: 'teste',
          endpoint: 'teste'
      }
    ]
  }
});

class App extends Component {

  constructor(){
    super();
    this.state = {};
  }

  render(){
    return(
      <div>
        <Router>
          <div>
            <Navbar color="dark">
              <NavbarBrand tag={Link} to="/home">Amazon Mercury</NavbarBrand>
              <Nav className="ml-auto">
                <NavItem color="white">
                  <NavLink tag={Link} to="/upload" className="text-light">Upload</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/browse" className="text-light">Browse</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/settings" className="text-light">Settings</NavLink>
                </NavItem>
              </Nav>
            </Navbar>
            <hr />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/home' component={Home} />
                <Route path='/upload' component={Upload} />
                <Route path='/browse' component={Browse} />
                <Route path='/settings' component={Settings} />
                <Route path='/result/:objectid' component={Result} />
            </Switch>
          </div>
        </Router>
        <hr />
      </div>
    );
  }

}

export default App;