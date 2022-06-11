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
  constructor(props) {
    super(props)
    this.submitMessage = this.submitMessage.bind(this)
  }

  submitMessage() {
    const recipient = document.getElementById("recipient").value
    const message = document.getElementById("message").value
    this.props.onSubmit(recipient, message)
  }

  render() {
    const recipient = "16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU"
    const message = "Hello World!"

    return (
      <div>
        <label htmlFor="recipient">recipient:</label>
        <input type="text" id="recipient" defaultValue={recipient} /> <br />
        <label htmlFor="message">message:</label>
        <textarea maxLength="600" id="message" defaultValue={message} /> <br />
        <button id="btn" value={message} onClick={this.submitMessage}>send</button>

        recipient: { this.props.message }
      </div>
    )
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    const params = new URLSearchParams(window.location.search)
    this.postMessage = this.postMessage.bind(this)
    this.state = {
      httpEndpoint: params.get("httpEndpoint"),
      wsEndpoint: params.get("wsEndpoint"),
      securityToken: params.get("securityToken")
    }
    console.log(`security token: ${this.state.securityToken}`)
  }

  postMessage(recipient, messageText) {
    console.log(`recipient: ${recipient}, message: ${messageText}`)
    console.log(`security token: ${this.state.securityToken}`)
    const h = new Headers()
    h.set('Authorization', 'Basic ' + btoa(this.state.securityToken))
    h.set('Content-Type', 'application/json')
    h.set('Accept-Content', 'application/json')
    fetch(`${this.state.httpEndpoint}/api/v2/messages/`,
      { "headers": h, "method": "POST", "body": {
        "recipient": recipient,
        "body": messageText
      } })
      .then(res => res.json())
      .then(data => console.log(`data: ${data}`))
  }

  render() {
    return (
      <div>
        HOPR mini chat
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        <Message message="Hello World!" />
        <Message message="Hello World!" />
        <Message message="Hello World!" />
        <Sender recipient={this.recipient} messageText={this.messageText} onSubmit={this.postMessage} />
      </div>
    );
  }
}

export default Chat;
