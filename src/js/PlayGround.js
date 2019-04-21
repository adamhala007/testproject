import React, { Component } from 'react';
import Menu from "./Menu";
import '../css/EasyProg.css';
import { withRouter} from 'react-router-dom'
import ControlPanelPlayground from "./ControlPanelPlayground";
import SimulatorPanel from "./SimulatorPanel";
import CommandPanel from "./CommandPanel";
import {loadBlocklyProgram, saveBlocklyProgram} from "../firebase/client";
//import Blockly from "node-blockly/browser";

import {saveEasyProgram, loadEasyProgram} from '../firebase/client';
import ProgramChooser from "./ProgramChooser";

const color1 = "#FF4900"; // title
const color2 = "#FF5A19"; // button color
const color3 = "#FFB79A"; // background color
const color4 = "#FFF6F3"; // hover
const color5 = "#FF8858"; //

var host = "lienka.local"; //"192.168.0.106
//const host = "192.168.0.106"; //"192.168.0.106
//const host = "192.168.0.113"; //"192.168.0.106
const wsUri = "ws://" + (localStorage.getItem("ipAddress")!=null?localStorage.getItem("ipAddress"): host) + "/websocket/ws.cgi";

class PlayGround extends Component {

    constructor(props) {
        super(props);
        this.state = {
            program: [],
            lastClicked: undefined
        };
        this.simulator = React.createRef();
    }
    componentDidMount(){
        // this is an "echo" websocket service
        this.reconnect();
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                messages : this.state.messages.concat([ evt.data ])
            })
        };

        this.connection.onopen = evt =>{
            console.log("CONNECTED");
            this.doSend("WebSocket rocks");
            localStorage.setItem("connection", "CONNECTED");
        };

        this.connection.onclose = evt =>{
            localStorage.setItem("connection", "DISCONNECTED");
            console.log("DISCONNECTED");
            this.reconnect();
            //this.doSend("WebSocket rocks");
        };

        this.connection.onmessage = evt =>{
            console.log("RECIEVED: " + evt.data);
        };

        this.connection.onerror = evt =>{
            console.log("ERROR: " + evt.data);
            localStorage.setItem("connection", "ERROR");
            this.reconnect();
        };

    }

    handleKeyDown = (e) =>{

        console.log(e.key);

        switch (e.key) {
            case "w":
            case "ArrowUp":
            case "8":
                this.addCommand("up");
                break;

            case "s":
            case "ArrowDown":
            case "2":
                this.addCommand("down");
                break;

            case "a":
            case "ArrowLeft":
            case "4":
                this.addCommand("left");
                break;

            case "d":
            case "ArrowRight":
            case "6":
                this.addCommand("right");
                break;

            case "q":
            case "7":
                this.addCommand("sound");
                break;

            case "e":
            case "9":
                this.addCommand("light");
                break;

            default:
                this.stop();
                break;
        }
    };

    reconnect =() => {
        if (this.connection != null){
            this.connection.close();
        }
        this.connection = new WebSocket(wsUri);
    };

    lastClicked=(clicked)=>{
        this.setState({
            lastClicked: clicked,
        })
    };

    doSend=(message)=>{
        console.log("SENT: " + message);
        console.log("ReadyState: " + this.connection.readyState);
        if (this.connection.readyState == 1){
            this.connection.send(message);
        }

    };

    addCommand=(cmd)=>{

        switch (cmd) {
            case "up":
                this.doSend("18");
                break;
            case "down":
                this.doSend("12");
                break;
            case "left":
                this.doSend("14");
                break;
            case "right":
                this.doSend("16");
                break;
            case "sound":
                this.doSend("17");
                break;
            case "light":
                this.doSend("19");
                break;
            default:
                this.doSend("10");

        }

        /*let joined = this.state.program.concat(cmd);
        this.setState({ program: joined });
        console.log("PROGRAM: " + this.state.program);
        console.log("PROGRAM: " + this.convertProgramToString());*/
    };

    delete=()=>{
        /*if(this.state.lastClicked === undefined){
            let array = this.state.program;
            array.splice(array.length-1, 1);
            this.setState({program: array });
        }else{
            let array = this.state.program;
            array.splice(this.state.lastClicked, 1);
            this.setState({program: array });
            this.state.lastClicked = undefined;
        }*/
        this.doSend("10");
    };

    convertProgramToString=()=>{
        let program = "";
        for (let i = 0; i < this.state.program.length; i++) {
            switch (this.state.program[i]) {
                case "up":
                    program += "MF;";
                    break;
                case "down":
                    program += "MB;";
                    break;
                case "left":
                    program += "ML;";
                    break;
                case "right":
                    program += "MR;";
                    break;
                case "sound":
                    program += "SO;";
                    break;
            }
        }
        return program;
    };

    simulate = () =>{
        //document.getElementById("controlPanel-go").disabled = true;
        //this.simulator.current.timer();
        //this.doSend("00");

        this.doSend(this.convertProgramToString());
    };

    stop = () =>{
        //document.getElementById("controlPanel-go").disabled = true;
        //this.simulator.current.timer();
        //this.doSend("00");
        this.doSend("10");
    };

    save = () => {

        let programName = prompt("Please enter the name of the program:" , "");
        if (programName === null || programName === "") {

        } else {
            saveEasyProgram(localStorage.getItem("user"), programName, this.state.program);
        }

    };

    load = async() => {
        let programName = prompt("Please enter the name of the program:" , "");
        if (programName === null || programName === "") {

        } else {
            let prog = await loadEasyProgram(localStorage.getItem("user"));
            this.setState({
                program: prog[programName]['program']
            })
        }

    };



    render (){
        if(localStorage.getItem("user") === null){
            this.props.history.push('/');
        }
        return(
            <div className={"Home"}  onKeyDown={this.handleKeyDown} tabIndex={0}>
                <Menu history={this.props.history}/>
                <div className={"content"}>

                    <div className="controls">
                        <ControlPanelPlayground addCommand={this.addCommand} delete={this.delete} stop={this.stop} save={this.save} load={this.load}/>
                    </div>

                    <div className="simulator">
                        <SimulatorPanel rows={8} cols={8} program={this.state.program} ref={this.simulator}/>
                    </div>

                    <div className="commands">
                        <CommandPanel rows={2} cols={15} program={this.state.program} lastClicked={this.lastClicked} />

                    </div>

                    { /* <ProgramChooser/> */ }

                </div>
                <footer>
                    <p>© 2018 Adam Halász.  All rights reserved.</p>
                </footer>
            </div>

        )
    }
}

export default withRouter(PlayGround);

