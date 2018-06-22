import React from 'react';


class InputPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.chatInputRef = React.createRef();
        this.addMessage = this.addMessage.bind(this);
    }

    addMessage(event)
    {
        event.preventDefault();
        let chat_input = this.chatInputRef.current;
        this.props.onAdd(chat_input.value);
        chat_input.value = "";
    }

    render()
    {
        return ( <div id="input_panel">
                    <form onSubmit={this.addMessage}>
                        <input type="text" ref={this.chatInputRef} name="input" id="input" placeholder="Type here" />
                        <button type="submit">Submit</button>
                    </form>
               </div>)
    }
}

export default InputPanel;