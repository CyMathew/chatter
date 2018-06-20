import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

var socket;

const MessageBubble = (props) => ( 
    <div className={"bubble " + (props.message.from == props.userID? "from":"to")}>
        <p>{props.message.text}</p>
    </div>
);


class InputPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.addMessage = this.addMessage.bind(this);
    }

    addMessage(event)
    {
        event.preventDefault();
        let chat_input = this.refs.chat_input;
        this.props.onAdd(chat_input.value);
        chat_input.value = "";
    }

    render()
    {
        return ( <div id="input_panel">
                    <form onSubmit={this.addMessage}>
                        <input type="text" ref="chat_input" name="input" id="input" placeholder="Type here" />
                        <button type="submit">Submit</button>
                    </form>
               </div>)
    }
}

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            messageList: []
        };

        //Setup function references
        this.sendMessage = this.sendMessage.bind(this);
        this.recieveMessage = this.recieveMessage.bind(this);
        // this.askUsername = this.askUsername.bind(this);

        socket = io('http://localhost:3400', {reconnect:true});
        socket.on('clientID', (id) => {
            this.userID = id;
                } );
        socket.on('message', this.recieveMessage);
    }

    // componentDidMount()
    // {
    //     this.askUsername();
    // }

    recieveMessage(message)
    {
        let newMessageList = this.state.messageList.concat(message);
        this.setState(
        {
            messageList: newMessageList
        });
    }

    join()
    {
        
    }

    sendMessage(text)
    {
        if(text)
        {
            let message = {
                text: text,
                from: this.userID
            };

            let newMessageList = this.state.messageList.concat(message);
            this.setState(
                {
                    messageList: newMessageList
                });
            socket.send(message);
        }
    }

    render()
    {
        return (
            <React.Fragment>
                {
                    this.state.messageList.map((message, index) => 
                    {
                        return <MessageBubble message={message} userID={this.userID} key={index} />
                    })
                }
                <InputPanel onAdd={this.sendMessage}/>
            </React.Fragment>
            );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));