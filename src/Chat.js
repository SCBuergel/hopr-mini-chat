import React, {useState, useEffect} from "react";

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

function Send0000r(props) {
	const [recipient, setRecipient] = useState("16Uiu2HAm9esLTuYnh8ERem5nk7XtGFyZbNz6a9afXnAdteWjgCVN")
	const [msgText, setMsgText] = useState("Hello World")

	const keyPressHandler = (event) => {
    if (event.code === "Enter") {
      props.onSubmit(recipient, msgText);
    }
  }

	return(
		<div>
    <h2>Send message:</h2>
    <label htmlFor="recipient">recipient:</label>
    <input 
    type="text" 
    id="recipient" 
    value={recipient}
    onChange={e=>setRecipient(e.target.value)}
    /> <br />
    <label htmlFor="message">message:</label>
    <textarea 
    maxLength="400"
    id="message"
    value={msgText}
    onChange={e=>setMsgText(e.target.value)}
    onKeyDown={keyPressHandler}
    />
    <br />
    <button
    id="btn"
    onClick={() => { props.onSubmit(recipient, msgText) }}>send</button> 
 		</div>
	)
}

function Sett0000r (props) {
	return(
		<div>
    <h2>HOPR node API settings</h2>
    <label htmlFor="httpUrl">HTTP API URL:</label>
    <input 
    type="text" 
    id="httpUrl" 
    value={props.httpUrl} 
    onChange={(e)=>{props.setHttpUrl(e.target.value)}}
    /> <br />
    <label htmlFor="wsUrl">websocket API URL:</label>
    <input
    type="text"
    id="wsUrl" 
    value={props.wsUrl}
    onChange={(e)=>{props.setWsUrl(e.target.value)}}
    /> <br />
    <label htmlFor="apiToken">API token:</label>
    <input 
    type="text" 
    id="apiToken" 
    value={props.apiToken}
    onChange={(e)=>{props.setApiToken(e.target.value)}}
    /> <br />
		</div>
	)
}

function Chat0000r(props) {
	const [httpUrl, setHttpUrl] = useState("http://localhost:13301")
	const [wsUrl, setWsUrl] = useState("ws://localhost:19501")
	const [apiToken, setApiToken] = useState("^^LOCAL-testing-123^^")
	const [messages, setMessages] = useState([])
	const ws = newWebSocket(wsUrl)

	useEffect(() => {
		console.log("USE_EFFECT0000r!!!")
    if (typeof(ws) !== "undefined")
      ws.close()
    const wsU = new URL(wsUrl)
    wsU.search = `?apiToken=${apiToken}`
    setWs(new WebSocket(wsU))
    ws.addEventListener("message", handleReceivedMessage)
    return (() => { ws.close() } )
  })

	// websocket message receiving handler
  function handleReceivedMessage(e) {
    try {
      const data = JSON.parse(e.data)
      console.log("WebSocket Data", data)
      if (data.type === "message") {
      	setMessages([...messages, data])
      	console.log(`Now we got ${messages.length} messages, latest: ${JSON.stringify(data)}`)
        //const msgDiv = document.createElement("div")
        //msgDiv.innerHTML = data.ts + ":<br />" + data.msg + "<br /><br />"
        //document.getElementById("messageList").appendChild(msgDiv)
      }
    } catch (err) {
      console.log(err)
    }
  }
	
	function apiCall(endpoint, method="GET", body) {
    const h = new Headers()
    h.set("Authorization", `Basic ${window.btoa(apiToken)}`)
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
    fetch(`${httpUrl}/api/v2/${endpoint}`, payload)
    	.catch((err) => console.error(err))
  }

	function postMessage(recipient, messageText) {
    const body = {
      recipient: recipient,
      body: messageText
    }
    apiCall("messages", "POST", body)
  }

	return (
		<div>
		<h1>HOPR Mini Chat</h1>
		<Sett0000r 
		httpUrl={httpUrl}
		wsUrl={wsUrl}
		apiToken={apiToken}
		setHttpUrl={setHttpUrl}
		setWsUrl={setWsUrl}
		setApiToken={setApiToken}
		/>
   	<Send0000r
   	onSubmit={postMessage}
   	/> 
   	<div id="messageList">
    <h2>Received messages:</h2>
    </div>
    </div>
 	)
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.postMessage = this.postMessage.bind(this)
    this.apiCall = this.apiCall.bind(this)
    const params = new URLSearchParams(window.location.search)
    const securityToken = params.get("securityToken")
    const wsUrl = new URL(params.get("wsUrl"))
    wsUrl.search = `?apiToken=${securityToken}`
    this.state = {
      httpUrl: params.get("httpUrl"),
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
    fetch(`${this.state.httpUrl}/api/v2/${endpoint}`, payload)
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

export default Chat0000r;
