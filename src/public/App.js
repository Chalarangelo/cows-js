import React, { Component } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import ChatContainer from './components/ChatContainer';
import './App.css';
import { MESSAGE_CODES } from '../config/messageCodes';
import { MESSAGE_DESCRIPTORS } from '../config/messageDescriptors';

class App extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
    let host = window.location.host; 
    this.state = {
      host: host,
      connection: undefined,
      messages: [],
      username: undefined,
      usernameTaken: false
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveMessage(message) {
    if(this._isMounted)
      this.setState(state => ({ messages: [...state.messages, JSON.parse(message.data)] }));
  }

  sendMessage(data){
    let message = {
      user: this.state.username,
      message: data,
      messageCode: MESSAGE_CODES.message
    };
    this.state.connection.send(JSON.stringify(message));
  }

  setUsername(username) {
    fetch(`/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        username: username
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        let connection = new WebSocket(`ws://${this.state.host}`);
        connection.onopen = () => {
          let connectionMessage = {
            user: data.username,
            message: MESSAGE_DESCRIPTORS.established,
            messageCode: MESSAGE_CODES.system
          }
          connection.send(JSON.stringify(connectionMessage));
        }
        connection.onmessage = this.receiveMessage;
        this.setState({ 
          username: data.username, 
          usernameTaken: !data.username ,
          connection: connection
        });
      }
      else {
        this.setState({ usernameTaken: true });
      }
    });
  }

  render() {
    return (
      <div className='external-container'>
        <Header></Header>
        <div className='container'>
          {this.state.username === undefined 
            ? 
            <LoginForm 
              setUsername={this.setUsername}
              usernameTaken={this.state.usernameTaken}
            />
            :
            <ChatContainer
              sendMessage={this.sendMessage}
              messages={this.state.messages}
            />}
        </div>
      </div>
    );
  }
}

export default App;
