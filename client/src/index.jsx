import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import { Divider, Form, Label, Button, Header, Menu } from 'semantic-ui-react'

import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Submit from './components/Submit.jsx';
import EntryList from './components/EntryList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      title: '',
      url: '',
      text: '',
      entries: []
    }
  }

  componentDidMount() {
    this.getEntries()
    .then(data => this.setState({entries: data.data}));
  }

  getEntries(){
    return axios.get('/entries');
  }

  getComments(entryid){
    return axios.get('/entries', {
      params: {
        entryid: entryid
      }
    });
  }

  postEntry(user, title, url){
    axios.post('/entries', {
      title: this.state.title,
      url: this.state.url
    }).then((res) => {console.log(res.data)});
  }

  postComment(user, text, entryid){
    axios.post('/comments', {
      user: user,
      text: text,
      entryid: entryid
    });
  }

  // checks if a user is who they say they are (verifies username & password)
  authenticate(url) {
    axios.post(url, { username: this.state.username, password: this.state.password })
    .then((res) => { console.log('authenticate: ', res.data)});
  }

  usernameChange(input) {
    this.setState({
      username: input.target.value
    });
  }

  passwordChange(input) {
    this.setState({
      password: input.target.value
    });
  }

  titleChange(input) {
    this.setState({
      title: input.target.value
    });
  }

  urlChange(input) {
    this.setState({
      url: input.target.value
    });
  }

  textChange(input) {
    this.setState({
      text: input.target.value
    });
  }

  authenticate() {
    return false
  }

  render() {
  	return (
      <div>
        <Switch class="ui three item menu">
          <Route exact path="/" class="item" render={(props) => (
            <Home class="item" {...props}
              data = {this.state.entries}
              authenticate={this.authenticate.bind(this)}
            />
          )}/>
          <Route exact path="/login" class="item" render={(props) => (
            <Login class="item" {...props} 
              authenticate={this.authenticate.bind(this)}
              usernameChange={this.usernameChange.bind(this)}
              passwordChange={this.passwordChange.bind(this)}
            />
          )}/> 
          <Route exact path="/submit" class="item" render={(props) => (
            this.authenticate() === true
            ? <Submit class="item" {...props} 
              submit={this.postEntry.bind(this)}
              titleChange={this.titleChange.bind(this)}
              urlChange={this.urlChange.bind(this)}
              textChange={this.textChange.bind(this)}
            />
            : <Redirect to='/login' />
          )}/> 
          )}/> 
        </Switch>
      </div>
  	)
  }

}

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'))
