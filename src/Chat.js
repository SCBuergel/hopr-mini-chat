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
        received: { this.props.message.ts} <br />
        message: { this.props.message.msg }
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
      </div>
    )
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.postMessage = this.postMessage.bind(this)
    this.apiCall = this.apiCall.bind(this)
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this)
    const params = new URLSearchParams(window.location.search)
    const securityToken = params.get("securityToken")
    const wsUrl = new URL(params.get("wsEndpoint"))
    wsUrl.search = `?apiToken=${securityToken}`
    const ws = new WebSocket(wsUrl)
    ws.addEventListener('message', this.handleReceivedMessage)
    this.state = {
      httpEndpoint: params.get("httpEndpoint"),
      ws: ws,
      securityToken: securityToken,
      messages: []
    }
  }

  handleReceivedMessage(e) {
    try {
      const data = JSON.parse(e.data)
      console.log('WebSocket Data', data)
      if (data.type === 'message') {
        this.setState({ 
          messages: [...this.state.messages, data]
        })
      }
    } catch (err) {
      console.log(err)
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
    const msgs = this.state.messages.map( (msg, index)  =>
      <Message key={index.toString()} message={msg} />
    )
    return (
      <div>
        HOPR mini chat
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
        {msgs}
        <Sender recipient={this.recipient} messageText={this.messageText} onSubmit={this.postMessage} />
      </div>
    );
  }
}

export default Chat;
