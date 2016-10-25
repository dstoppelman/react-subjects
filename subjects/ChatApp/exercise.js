////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Create a chat application using the utility methods we give you
//
// Need some ideas?
//
// - Cause the message list to automatically scroll as new
//   messages come in
// - Highlight messages from you to make them easy to find
// - Highlight messages that mention you by your GitHub username
// - Group subsequent messages from the same sender
// - Create a filter that lets you filter messages in the chat by
//   sender and/or content
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { login, sendMessage, subscribeToMessages } from './utils/ChatUtils'
import './styles'

/*
Here's how to use the ChatUtils:

login((error, auth) => {
  // hopefully the error is `null` and you have a auth.github object
})

sendMessage(
  auth.uid,                       // the auth.uid string
  auth.github.username,           // the username
  auth.github.profileImageURL,    // the user's profile image
  'hello, this is a message'      // the text of the message
)

const unsubscribe = subscribeToMessages(messages => {
  // here are your messages as an array, it will be called
  // every time the messages change
})

unsubscribe() // stop listening for new messages

The world is your oyster!
*/

class ChatScroller extends React.Component {
  componentDidMount() {
    this.autoScroll = true;
  }

  componentDidUpdate() {
    if (this.autoScroll) this.scrollToBottom()
  }

  scrollToBottom() {
    findDOMNode(this).scrollTop = 9999999
  }

  handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight)
    this.autoScroll = distanceToBottom < 10
  }

  render() {
    return (
      <div {...this.props} onScroll={this.handleScroll}/>
    )
  }
}

class Chat extends React.Component {
  state = {
    auth: null,
    messages: []
  }

  componentDidMount() {
    login((error, auth) => {
      if (error) {
        console.log(error)
      }
      this.setState({ auth })
    })

    subscribeToMessages(messages => {
      this.setState({ messages })
    })
  }

  componentDidUpdate() {
    // const messageNodes = document.querySelectorAll("li.message")
    // const lastMessageNode = messageNodes[messageNodes.length - 1]
    // lastMessageNode.scrollIntoView()
    // this.scrollToBottom()
  }

  // scrollToBottom() {
  //   this.refs.scroller.scrollTop = 9999999
  // }

  handleSubmit = (event) => {
    event.preventDefault()
    const messageText = this.refs.message.value
    if (messageText) {
      const { auth } = this.state
      sendMessage(
        auth.uid,                       // the auth.uid string
        auth.github.username,           // the username
        auth.github.profileImageURL,    // the user's profile image
        messageText                     // the text of the message
      )
    }
    event.target.reset()
  }

  render() {
    const { auth, messages } = this.state

    const messageGroups = []
    let currentGroup = []
    let lastMessage

    // console.log(messages)

    // let messageGroups = messages.reduce((currentGroup, messages) => {
    //
    // }, []);

    messages.forEach(message => {
      if (lastMessage && lastMessage.uid === message.uid) {
        //same group
        currentGroup.push(message)
      } else {
        //new group
        if (currentGroup.length) {
          messageGroups.push(currentGroup)
        }
        currentGroup = [ message ]
      }
      lastMessage = message
    })

    if (currentGroup.length) {
      messageGroups.push(currentGroup)
    }

    if (!auth) {
      return <p>Loading...</p>
    }

    return (
      <div className="chat">
        <header className="chat-header">
          <h1 className="chat-title">HipReact</h1>
          <p className="chat-message-count"># messages: {messages.length}</p>
        </header>
        <ChatScroller className="messages">
          <ol className="message-groups">
            {messageGroups.map((messages, index) => (
              <li key={index} className="message-group">
                <div className="message-group-avatar">
                  <img src={messages[0].avatarURL}/>
                </div>
                <ol className="messages">
                  {messages.map((message, index) => (
                    <li key={index} className="message">{message.text}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </ChatScroller>
        <form className="new-message-form" onSubmit={this.handleSubmit}>
          <div className="new-message">
            <input name="message" ref="message" type="text" placeholder="say something..."/>
          </div>
        </form>
      </div>
    )
  }
}

render(<Chat/>, document.getElementById('app'))
