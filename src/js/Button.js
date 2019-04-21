import React, { Component } from 'react';
import '../css/Button.css';


class Button extends Component{
    constructor(props){
        super(props);
        this.state = {
            icon: props.icon,
            text: props.text,
            buttonClick: props.buttonClick,
            clName: props.clName,
            entryForm: props.entryForm
        }
        //this.state.buttonClick = props.buttonClick.bind(this);

    }

    render(){
        return(
            <button className={this.state.clName} onClick={() => this.state.buttonClick(this.state.text)}>
                <img src={this.state.icon} width="50" height="50" alt="hvn" />
                <span>{this.state.text}</span>
            </button>
        )
    }
}

export default Button;