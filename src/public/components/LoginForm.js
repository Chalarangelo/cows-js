import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  updateInputValue(value) {
    this.setState(state => ({ inputValue: value }));
  }

  render(){
    return (
      <div className='login-form'>
        <h2>Pick a username</h2>
        <label htmlFor='username-input'>Username:</label>
        <input 
          value={this.state.inputValue} 
          onChange={evt => this.updateInputValue(evt.target.value)} 
          id='username-input' 
          name='username-input' 
        />
        {this.props.usernameTaken 
          ? <p>This username is not available!</p>
          : ''}
        <br/>
        <button onClick={() => this.props.setUsername(this.state.inputValue)} id='set-username' className='login-button'>Connect</button>
      </div>
    );
  }
}

export default LoginForm;