import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "../css/SimulatorPanel.css";


class Square extends Component {
    constructor(props){
        super(props);
        this.state = {
            i: this.props.i,
            j: this.props.j,
            width: this.props.width,
            height: this.props.height,
            ladyBug: this.props.ladyBug,

            squareStyle: {
                width: Math.floor(Math.min(this.props.width, this.props.height)) + "px",
                height: Math.floor(Math.min(this.props.width, this.props.height)) + "px",
                backgroundColor: "#FFF6F3",
                border: "1px solid #000",
                color: 'black',
            },
        };
    }

    lastClicked =() =>{
        this.props.lastClicked(this.state.i);
    };

    render(){

        return(
            <div>
                {this.props.image === "" && <div style={this.state.squareStyle} onClick={this.lastClicked} />}
                {this.props.image !== "" && <div className={this.props.image}  onClick={this.lastClicked} />}
            </div>

        )
    }
}

export default Square;