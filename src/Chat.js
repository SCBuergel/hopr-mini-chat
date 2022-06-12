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
      message: { this.props.message.msg } <br /><br />
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
    const params = new URLSearchParams(window.location.search)
    const securityToken = params.get("securityToken")
    const wsUrl = new URL(params.get("wsEndpoint"))
    wsUrl.search = `?apiToken=${securityToken}`
    this.state = {
      httpEndpoint: params.get("httpEndpoint"),
      securityToken: securityToken,
      wsUrl: wsUrl,
      messages: []
    }
  }

  componentDidMount() {
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this)
    const ws = new WebSocket(this.state.wsUrl)
    ws.addEventListener('message', this.handleReceivedMessage)
    this.apiCall("settings/includeRecipient", "PUT", { key: "includeRecipient", value: true })
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

  apiCall(endpoint, method="GET", body) {
    const h = new Headers()
    h.set("Authorization", `Basic ${window.btoa(this.state.securityToken)}`)
    if (method === "POST") {
      h.set("Content-Type", "application/json")
      h.set("Accept-Content", "application/json")
    }
    if (method === "PUT") {
      h.set("Content-Type", "application/json")
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
    this.apiCall("messages", "POST", body)
  }

  render() {
    const msgs = this.state.messages.map( (msg, index)  =>
      <Message key={index.toString()} message={msg} />
    )
    return (
      <div>
      <h1>HOPR Mini Chat</h1>
      <h2>Contacts</h2>
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <Contact address="16Uiu2HAkucqh4zJJPdnBiA9nw8WGkm29LoNg7wSC9kVMn5BvhdrU" />
      <h2>Received messages</h2>
      {msgs}
      <h2>Send message</h2>
      <Sender recipient={this.recipient} messageText={this.messageText} onSubmit={this.postMessage} />
      </div>
    );
  }
}

export default Chat;
