import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import InputPanel from './components/InputPanel'

var socket;
var userID;
const username = "John";

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

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            messageList: []
        };

        this.messageInfo = {
            author: "",
            messages: []
        }

        this.replacePrevious = true;
        //Setup function references
        this.sendMessage = this.sendMessage.bind(this);
        this.recieveMessage = this.recieveMessage.bind(this);
        this.groupMessages = this.groupMessages.bind(this);
        this.updateMessages = this.updateMessages.bind(this);

        socket = io('http://localhost:3400', {reconnect:true});
        socket.on('clientID', (id) => (userID = id));
        socket.on('message', this.recieveMessage);
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
                from: userID
            };

            //check for grouping
            let newMessageGroup = this.groupMessages(message);

            this.updateMessages(newMessageGroup);
            socket.send(message);
        }
    }

    groupMessages(message)
    {
        //If there is no previous author or it is a new author
        if((!this.messageInfo.author) || (this.messageInfo.author != message.from))
        {
            this.replacePrevious = false;
            this.messageInfo = {
                author: message.from,
                messages: [message.text]
            }
        }
        else if(this.messageInfo.author == message.from)
        {
            this.replacePrevious = true;
            this.messageInfo.messages.push(message.text);
        }
        // return this.messageInfo.messageGroup;
        return this.messageInfo;
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

    render()
    {
        return (
            <React.Fragment>
                <Chat messageList={this.state.messageList} />
                <InputPanel onAdd={this.sendMessage}/>
            </React.Fragment>
            );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));