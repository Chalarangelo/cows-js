import React, { Component } from 'react';
import { MESSAGE_CODES } from '../../config/messageCodes';
import { MESSAGE_DESCRIPTORS } from '../../config/messageDescriptors';
import './Message.css';

const Message = ({ data }) => {
  switch (data.messageCode) {
    case MESSAGE_CODES.system: 
      switch (data.message) {
        case MESSAGE_DESCRIPTORS.established: 
          return (
            <div className='message system-message'>User '{data.user}' joined the room. {new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</div>
          );
        case MESSAGE_DESCRIPTORS.terminated:
          return (
            <div className='message system-message'>User '{data.user}' left the room. {new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</div>
          );
        case MESSAGE_DESCRIPTORS.welcome:
          return (
            <div className='message system-message'>Welcome to the room, '{data.user}'! {new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</div>
          );
        default:
          return (
            <div className='message system-message'>{data.user} - {data.message} {new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</div>
          );
      }
    case MESSAGE_CODES.message:
      return (
        <div className='message'>
          <span className='metadata'>{data.user}</span>
          <span className='content'>{data.message}</span>
          <span className='metadata'>{new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
      );
    default:
      return (
        <div className='message'>
          <span className='metadata'>{data.user}</span>
          <span className='content'>{data.message}</span>
          <span className='metadata'>{new Date(data.timestamp).toLocaleDateString()} {new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
      );
  }
}

export default Message;