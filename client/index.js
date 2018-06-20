import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';




//         <div class="bubble to">
//             <p>yo</p>
//         </div>

//         

const socket = io.connect('http://localhost:3000');

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
        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(message)
    {
        let newMessageList = this.state.messageList.concat(message);
        this.setState(
            {
                messageList: newMessageList
            });
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
                <InputPanel onAdd={this.onAdd}/>
            </React.Fragment>
            );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));