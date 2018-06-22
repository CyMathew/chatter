import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import InputPanel from './components/InputPanel'

var socket;
var userID;
var username;

const MessageBubble = (props) => 
( 
    <div className="bubble">
        <p>{props.message}</p>
    </div>
);

const MessageGroup = (props) => 
(
    <div className={"messageGroup "  + ((props.author == userID)? "from":"to")}>
        <h3>{username}</h3>
       {props.messageGroup.messages.map((message, index) => <MessageBubble message={message} key={index} />)}
    </div>
);

const Chat = (props) => 
(
    props.messageList.map((messageGroup, index) => 
    (
        <MessageGroup messageGroup={messageGroup} author={messageGroup.author} key={index} />
    ))
);

class UsernameModal extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        if(!this.props.isShown)
            return null;

        return(
            <div id="modalBackground">
                <div id="modal">
                    <form onSubmit={this.props.onSubmit}>
                        <p>Please enter a username</p>
                        <input ref={this.props.inputRef} type="text" name="username" id="username" autoFocus />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            messageList: [],
            isNameModalShown: true
        };

        this.messagePackage = {
            author: "",
            messages: []
        }

        this.replacePrevious = true;
        this.usernameInput = React.createRef();
        //Setup function references
        this.sendMessage = this.sendMessage.bind(this);
        this.recieveMessage = this.recieveMessage.bind(this);
        this.recieveInfoMessage = this.recieveInfoMessage.bind(this);
        this.groupMessages = this.groupMessages.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.getUsername = this.getUsername.bind(this);

        socket = io('http://localhost:3400', {reconnect:true});
        socket.on('clientID', (id) => (userID = id));
        socket.on('message', this.recieveMessage);
        socket.on('server-info', this.recieveInfoMessage)
    }

    recieveMessage(message)
    {
        let newMessageGroup = this.groupMessages(message);
        this.updateMessages(newMessageGroup);
    }

    sendMessage(text)
    {
        if(text)
        {
            let message = {
                text: text,
                userID: userID
            };

            //check for grouping
            let newMessageGroup = this.groupMessages(message);
            this.updateMessages(newMessageGroup);

            socket.send(message);
        }
    }

    recieveInfoMessage(message)
    {
        let infoMessage = {
            text: message,
            userID: 'server'
        };
    }

    groupMessages(message)
    {
        //If there is no previous author or it is a new author
        if((!this.messagePackage.author) || (this.messagePackage.author != message.userID))
        {
            this.replacePrevious = false;
            this.messagePackage = {
                author: message.userID,
                messages: [message.text]
            }
        }
        else if(this.messagePackage.author == message.userID)
        {
            this.replacePrevious = true;
            this.messagePackage.messages.push(message.text);
        }
        // return this.messagePackage.messageGroup;
        return this.messagePackage;
    }

    updateMessages(newMessageGroup)
    {
         //If last group author is same as current group author, replace last group data with new data
         if(this.replacePrevious)
         {
             //Get a copy of the messageList
             let newMessageList = this.state.messageList.concat();

             //replace last messageobject
             newMessageList[newMessageList.length-1] = newMessageGroup;
             this.setState({ messageList: newMessageList });
         }
         else
         {
             //if new group author is different, add new group
             let newMessageList = this.state.messageList.concat(newMessageGroup);
             this.setState({ messageList: newMessageList });
         }
    }

    getUsername(event)
    {
        event.preventDefault();
        username = this.usernameInput.current.value;

        if(username)
        {
            console.log("Welcome,", username);
            this.setState({
                isNameModalShown: false
            });

            socket.emit('named', username);
        }

    }

    render()
    {
        return (
            <React.Fragment>
                <Chat messageList={this.state.messageList} />
                <InputPanel onAdd={this.sendMessage}/>
                <UsernameModal onSubmit={this.getUsername} inputRef={this.usernameInput} isShown={this.state.isNameModalShown}/>
            </React.Fragment>
            );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));