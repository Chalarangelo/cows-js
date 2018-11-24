import React, { Component } from 'react';
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
      inputValue: ''
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    let connection = new WebSocket(`ws://${this.state.host}`);
    connection.onopen = () => connection.send('Hello, I am a client!');
    connection.onmessage = this.receiveMessage;
    this.setState(state => ({ connection: connection }));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveMessage(message) {
    if(this._isMounted)
      this.setState(state => ({ messages: [...state.messages, message.data] }));
  }

  sendMessage(){
    let message = this.state.inputValue;
    this.state.connection.send(message);
    this.setState(state => ({ inputValue: '' }));
  }

  updateInputValue(value) {
    console.log(value);
    this.setState(state => ({ inputValue: value }));
  }

  render() {
    return (
      <div className="App">
        <label htmlFor="message-input">Message:</label>
        <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt.target.value)} id="message-input" name="message-input"/>
        <br />
        <button onClick={this.sendMessage} id="message-send">Send </button>
        <ul id="message-list">
          {this.state.messages.map((message, index) => <li key={index}> {message} </li>)}
        </ul>
      </div>
    );
  }
}

export default App;
