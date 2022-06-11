import React from "react";

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
    const recipient = "16Uiu2HAmEhrw2e8tsxnGSfpjznPTLo6U99Ngtw2NLbauK7i8F9Bj"
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
    this.apiCall = this.apiCall.bind(this)
    this.state = {
      httpEndpoint: params.get("httpEndpoint"),
      wsEndpoint: params.get("wsEndpoint"),
      securityToken: params.get("securityToken")
    }
  }

  apiCall(endpoint, isPost, body) {
    const h = new Headers()
    h.set("Authorization", `Basic ${window.btoa(this.state.securityToken)}`)
    let method = "GET"
    if (typeof isPost !== "undefined" && isPost) {
      method = "POST"
      h.set("Content-Type", "application/json")
      h.set("Accept-Content", "application/json")
    }
    let payload = {
      headers: h,
      method: method
    }
    
    if (typeof body !== "undefined") {
      payload.body = JSON.stringify(body)
    }
    fetch(`${this.state.httpEndpoint}/api/v2/${endpoint}`, payload)
    .catch((err) => console.error(err))
  }

  postMessage(recipient, messageText) {
    const body = {
      recipient: recipient,
      body: messageText
    }
    this.apiCall("messages", true, body)
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
