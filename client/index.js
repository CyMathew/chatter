import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';




//         <div class="bubble to">
//             <p>yo</p>
//         </div>

//         

var socket;

const MessageBubble = (props) => ( 
    <div className="bubble from">
        <p>{props.message}</p>
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
        this.sendMessage = this.sendMessage.bind(this);
        this.recieveMessage = this.recieveMessage.bind(this);

        socket = io('http://localhost:3400', {reconnect:true});
        // socket.emit('join', 'a user joined');
        socket.on('message', this.recieveMessage);
    }

    // componentDidMount()
    // {
    //     setInterval(this.recieve, 1000);
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

    sendMessage(message)
    {
        let newMessageList = this.state.messageList.concat(message);
        this.setState(
            {
                messageList: newMessageList
            });
        socket.send(message);
    }

    render()
    {
        return (
            <React.Fragment>
                {
                    this.state.messageList.map((message, index) => 
                    {
                        return <MessageBubble message={message} key={index} />
                    })
                }
                <InputPanel onAdd={this.sendMessage}/>
            </React.Fragment>
            );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));