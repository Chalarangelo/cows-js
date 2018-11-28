import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import ChatContainer from './components/ChatContainer';


//import logo from './logo.svg';
//import './App.css';

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
    // let connection = new WebSocket(`ws://${this.state.host}`);
    // connection.onopen = () => connection.send('Hello, I am a client!');
    // connection.onmessage = this.receiveMessage;
    // this.setState(state => ({ connection: connection }));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveMessage(message) {
    if(this._isMounted)
      this.setState(state => ({ messages: [...state.messages, message.data] }));
  }

  sendMessage(data){
    this.state.connection.send(data);
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
        connection.onopen = () => connection.send(`Hello, I am ${data.username}!`);
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
      this.state.username === undefined 
        ? 
        <LoginForm 
          setUsername={this.setUsername}
          usernameTaken={this.state.usernameTaken}
        />
        :
        <ChatContainer
          sendMessage={this.sendMessage}
          messages={this.state.messages}
        />
    );
  }
}

export default App;
