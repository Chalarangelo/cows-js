import React, { Component } from 'react';
import Message from './Message';
import { MESSAGE_CODES } from '../../config/messageCodes';
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
    if(this.state.inputValue.trim().length == 0) return;
    this.props.sendMessage(this.state.inputValue);
    this.setState({ inputValue: '' });
    this.messageInput.focus();
  }

  handleKeyPress (event) {
    if (event.key === 'Enter') this.processMessage();
  }

  componentDidMount() {
    this.scrollToBottom();
    this.messageInput.focus();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return(
      <div className='chat-app'>
        <div id='message-list' className='message-list'>
          {this.props.messages.map((message, index) => 
            <React.Fragment>
              <Message key={index} data={message} />
              {message.messageCode !== MESSAGE_CODES.system ? <br/> : ''}
            </React.Fragment>
            )}
          <div ref={el => { this.el = el; }} />
        </div>
        <div className='message-control'>
          <input 
            value={this.state.inputValue} 
            onChange={evt => this.updateInputValue(evt.target.value)} 
            id='input-message'
            name='input-message' 
            className='input-message'
            placeholder='Type your message here...'
            onKeyPress={(event) => this.handleKeyPress(event)}
            ref={(input) => { this.messageInput = input; }} 
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