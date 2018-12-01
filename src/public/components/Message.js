import React, { Component } from 'react';
import { MESSAGE_CODES } from '../../config/messageCodes';
import { MESSAGE_DESCRIPTORS } from '../../config/messageDescriptors';

const Message = ({ data }) => {
  switch (data.messageCode) {
    case MESSAGE_CODES.system: 
      switch (data.message) {
        case MESSAGE_DESCRIPTORS.established: 
          return (
            <li>[{data.timestamp}]User '{data.user}' joined the room.</li>
          );
        case MESSAGE_DESCRIPTORS.terminated:
          return (
            <li>[{data.timestamp}]User '{data.user}' left the room.</li>
          );
        case MESSAGE_DESCRIPTORS.welcome:
          return (
            <li>[{data.timestamp}]Welcome to the room, '{data.user}'!</li>
          );
        default:
          return (
            <li>[{data.timestamp}]{data.user}:{data.message}</li>
          );
      }
    case MESSAGE_CODES.message:
      return (
        <li>[{data.timestamp}]{data.user}:{data.message}</li>
      );
    default:
      return (
        <li>[{data.timestamp}]{data.user}:{data.message}</li>
      );
  }
}

export default Message;