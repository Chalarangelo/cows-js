import React, { Component } from 'react';

const Message = (props) => {
  return (
    <li>[{props.data.timestamp}]{props.data.user}:{props.data.message}</li>
  );
}

export default Message;