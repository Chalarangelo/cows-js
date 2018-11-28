import React, { Component } from 'react';
import Message from './Message';
import './ChatContainer.css';

class ChatContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };

    this.processMessage = this.processMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  updateInputValue(value) {
    this.setState(state => ({ inputValue: value }));
  }

  processMessage() {
    this.props.sendMessage(this.state.inputValue);
    this.setState({ inputValue: '' });
  }

  handleKeyPress (event) {
    if (event.key === 'Enter') this.processMessage();
  }

  render() {
    return(
      <div className='chat-app'>
        <ul id='message-list' className='message-list'>
          {this.props.messages.map((message, index) => <Message key={index} data={message} />)}
        </ul>
        <div className='message-control'>
          <input 
            value={this.state.inputValue} 
            onChange={evt => this.updateInputValue(evt.target.value)} 
            id='input-message'
            name='input-message' 
            className='input-message'
            placeholder='Type your message here...'
            onKeyPress={(event) => this.handleKeyPress(event)}
          />
          <button 
            onClick={this.processMessage} 
            id='message-send'
            className='message-send'>
            Moo!
          </button>
        </div>
      </div>
    );
  }
}

export default ChatContainer;