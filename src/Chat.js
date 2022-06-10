import React from 'react';

class Contact extends React.Component {
  render() {
    return (
      <div>
        contact: { this.props.address }
      </div>
    )
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        message: { this.props.message }
      </div>
    )
  }
}

class Sender extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor="recipient">recipient:</label>
        <input type="text" id="recipient" defaultValue="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" /> <br />
        <label htmlFor="message">message:</label>
        <textarea maxLength="600" id="message" defaultValue="HellowWorld" /> <br />
        <button>send</button>
        
        recipient: { this.props.message }
      </div>
    )
  }
}

function Chat() {
  const params = new URLSearchParams(window.location.search)

  return (
    <div>
      HOPR mini chat
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <Message message="Hello World!" />
      <Message message="Hello World!" />
      <Message message="Hello World!" />
      <Sender />
      { params.get("securityToken") }
    </div>
  );
}

export default Chat;
