import React, { Component } from 'react';
import "../css/ControlPanel.css"
import ProgramChooser from "./ProgramChooser";
//import { Input } from 'react-input-component';


class ControlPanel extends Component{
    constructor(props){
        super(props);

    }

    addCommand =(cmd) =>{

        this.props.program.push(cmd);
        console.log(this.props.program);
    }

    handleKeyDown(e) {
        // arrow up/down button should select next/previous list element
        switch (e.keyCode) {
            case 38:
            case 87:
            case 104:
                this.props.addCommand("up");
                console.log("key: UP");
                break;

            case 40:
            case 83:
            case 98:
                this.props.addCommand("down");
                console.log("key: DOWN");
                break;

            case 37:
            case 65:
            case 100:
                this.props.addCommand("left");
                console.log("key: LEFT");
                break;

            case 39:
            case 68:
            case 102:
                this.props.addCommand("right");
                console.log("key: RIGHT");
                break;
        }

    }

    render(){
        console.log(this.props.load());
        return(

            <div className="controlPanel-content" onKeyPress={ this.handleKeyDown }>
                <div className="controlPanel-lowerControls">
                    <div className="flex-grid">
                        <div className="col">
                            <div id="controlPanel-save" onClick={this.props.save} />
                        </div>
                        <div className="col">
                            <div id="controlPanel-blank" onClick={this.props.reconnect}/>
                        </div>
                        <div className="col">
                            <ProgramChooser load={this.props.load} setProgram={this.props.setProgram}/>
                            {/* <div id="controlPanel-open" onClick={this.props.load} /> */}
                        </div>
                    </div>
                </div>
                <div className="controlPanel-upperControls">
                    <div className="flex-grid">
                        <div className="col">
                            <div id="controlPanel-sound" onClick={() => this.props.addCommand("sound")} />
                            <div id="controlPanel-left" onClick={() => this.props.addCommand("left")} onKeyDown={this.onKeyPressed} />
                            <button id="controlPanel-go" onClick={() => this.props.simulate()} />
                        </div>
                        <div className="col">
                            <div id="controlPanel-up" onClick={() => this.props.addCommand("up")} />
                            <div id="controlPanel-delete" onClick={() => this.props.delete()}/>
                            <div id="controlPanel-down" onClick={() => this.props.addCommand("down")} />
                        </div>
                        <div className="col">
                            <div id="controlPanel-light" onClick={() => this.props.addCommand("light")} />
                            <div id="controlPanel-right" onClick={() => this.props.addCommand("right")} />
                            <div id="controlPanel-blank" />
                        </div>
                    </div>


                </div>


            </div>
        );
    }
}

export default ControlPanel;