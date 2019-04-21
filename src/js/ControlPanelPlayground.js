import React, { Component } from 'react';
import "../css/ControlPanel.css"
import ProgramChooser from "./ProgramChooser";


class ControlPanelPlayground extends Component{
    constructor(props){
        super(props);
        this.state = {render:''}

    }

    addCommand =(cmd) =>{

        this.props.program.push(cmd);
        console.log(this.props.program);
    }

    handleClick(compName, e){
        console.log(compName);
        this.setState({render:compName});
    }

    onClick =(comp) =>{
        //comp.props.load;
        //comp.handleClick.bind(comp, 'programChooser');
    };

    /*_renderSubComp(){
        switch(this.state.render){
            case 'programChooser': return <ProgramChooser isOpen={true}/>
        }
    }*/

    render(){
        return(
            <div className="controlPanel-content">
                <div className="controlPanel-lowerControls">
                    <div className="flex-grid">
                        <div className="col">
                            <div id="controlPanel-blank" />

                            {/* <div id="controlPanel-save" onClick={this.props.save} /> */ }
                        </div>
                        <div className="col">
                            <div id="controlPanel-blank" />
                        </div>
                        <div className="col">
                            <div id="controlPanel-blank" />
                            {/*<ProgramChooser />
                               <div id="controlPanel-open" onClick={ this.handleClick.bind(this, 'programChooser')} />  */}
                        </div>
                        {/* {this._renderSubComp()}; */}
                    </div>
                </div>
                <div className="controlPanel-upperControls">
                    <div className="flex-grid">
                        <div className="col">
                            <div id="controlPanel-sound" onClick={() => this.props.addCommand("sound")} />
                            <div id="controlPanel-left" onClick={() => this.props.addCommand("left")} />
                            <div id="controlPanel-blank" onClick={() => this.props.delete()} />
                        </div>
                        <div className="col">
                            <div id="controlPanel-up" onClick={() => this.props.addCommand("up")} />
                            <div id="controlPanel-stop" onClick={() => this.props.stop()}/>
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

export default (ControlPanelPlayground);