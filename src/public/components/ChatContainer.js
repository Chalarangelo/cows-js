import React, { Component } from 'react';
import Message from './Message';

class ChatContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };

    this.processMessage = this.processMessage.bind(this);
  }

  updateInputValue(value) {
    this.setState(state => ({ inputValue: value }));
  }

  processMessage() {
    this.props.sendMessage(this.state.inputValue);
    this.setState({ inputValue: '' });
  }

  render() {
    return(
      <div className='chat-app'>
        <label htmlFor='input-message'>Message:</label>
        <input 
          value={this.state.inputValue} 
          onChange={evt => this.updateInputValue(evt.target.value)} 
          id='input-message'
          name='input-message' 
        />
        <br />
        <button 
          onClick={this.processMessage} 
          id='message-send'>
          Send
        </button>
        <ul id='message-list'>
          {this.props.messages.map((message, index) => <Message key={index} data={message} />)}
        </ul>
      </div>
    );
  }
}

export default ChatContainer;