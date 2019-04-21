import React, { Component } from 'react';
import Menu from "./Menu";
import '../css/BlocklyProg.css';
import { withRouter} from 'react-router-dom'
import ControlPanel from "./ControlPanel";
import SimulatorPanel from "./SimulatorPanel";
import CommandPanel from "./CommandPanel";
import {up, down, left, right, sound, light} from "./Blockly/Blockly";

import Blockly from 'node-blockly/browser';
import Workspace from 'node-blockly/browser';

import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import {saveBlocklyProgram, loadBlocklyProgram, loadEasyProgram} from '../firebase/client';
import axios from 'axios';
import ProgramChooser from "./ProgramChooser";

const color1 = "#FF4900"; // title
const color2 = "#FF5A19"; // button color
const color3 = "#FFB79A"; // background color
const color4 = "#FFF6F3"; // hover
const color5 = "#FF8858"; //

const host = "lienka.local";
//const host = "192.168.0.113"; //"192.168.0.106
const wsUri = "ws://" + (localStorage.getItem("ipAddress")!=null?localStorage.getItem("ipAddress"): host) + "/websocket/ws.cgi";

class BlocklyProg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            program: [],
            lastClicked: undefined,
        }
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
        };

        this.connection.onclose = evt =>{
            console.log("DISCONNECTED");
            this.reconnect();
            //this.doSend("WebSocket rocks");
        };

        this.connection.onmessage = evt =>{
            console.log("RECIEVED: " + evt.data);
        };

        this.connection.onerror = evt =>{
            console.log("ERROR: " + evt.data);
            this.reconnect();
        };

    }

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

    refresh =() =>{
        this.connection = new WebSocket(wsUri);
    };

    addCommand=(cmd)=>{
        let joined = this.state.program.concat(cmd);
        this.setState({ program: joined })
    };

    doSend=(message)=>{
        console.log("SENT: " + message);
        console.log("ReadyState: " + this.connection.readyState);
        if (this.connection.readyState == 1){
            this.connection.send(message);
        }

    };


    delete=()=>{
        if(this.state.lastClicked === undefined){
            let array = this.state.program;
            array.splice(array.length-1, 1);
            this.setState({program: array });
        }else{
            let array = this.state.program;
            array.splice(this.state.lastClicked, 1);
            this.setState({program: array });
            this.state.lastClicked = undefined;
        }
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
                case "light":
                    program += "SL;";
                    break;
            }
        }
        return program;
    };

    simulate = () =>{
        //document.getElementById("bSimulate").disabled = true;
        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        let elements = xml.getElementsByTagName("block");
        //console.log(elements)

        while(this.state.program.length > 0) {
            this.state.program.pop();
        }
        this.interpret(elements.item(0));

        console.log(this.state.program);
        this.doSend("00");
        this.doSend(this.convertProgramToString());

        /*this.simulator.current.setState({
            index: 0,
            intervalId: null,
        })
        this.simulator.current.timer();*/
    }

    /*load = async() => {

        let programName = prompt("Please enter the name of the program:" , "");
        if (programName === null || programName === "") {

        } else {
            let loadedValue = await loadBlocklyProgram(localStorage.getItem("user"));
            let xml = Blockly.Xml.textToDom(loadedValue[programName]['program']);

            Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
        }



    };*/

    load = async() => {
        return await loadBlocklyProgram(localStorage.getItem("user"));
    };

    setProgram = (programs, chosen) => {
        console.log(programs[chosen]['program']);
        let xml = Blockly.Xml.textToDom(programs[chosen]['program']);
        Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
    };


    save=()=>{
        //console.log(workspace);
        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());

        let xml_text = Blockly.Xml.domToText(xml);
        console.log(xml);
        let programName = prompt("Please enter the name of the program:" , "");
        if (programName === null || programName === "") {

        } else {
            saveBlocklyProgram(localStorage.getItem("user"), programName, xml_text);
        }

        console.log(xml_text);
    };

    run=()=>{
        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        let elements = xml.getElementsByTagName("block");
        //console.log(elements)

        while(this.state.program.length > 0) {
            this.state.program.pop();
        }
        this.interpret(elements.item(0));
        //console.log(this.state.program)

        /*for (let i = 0; i< elements.length; i++){
            console.log(elements.item(i))
            console.log(elements.item(i).childNodes)
            //console.log(elements.item(i).childNodes.keys())
            //console.log(xml.getElementsByTagName("block")[i])
        }*/

        //console.log(xml.getElementsByTagName("block"))
       // console.log(xml.getElementsByTagName("block")[0])

        //console.log(xml.getElementsByTagName("block")[0].getAttribute("type"))

    };

    interpret=(block)=>{
        //console.log(block.getAttribute("type"))

        try {
           switch (block.getAttribute("type")){
               case "forward":
                   for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent ; i++){
                       this.state.program.push("up");
                   }
                   break;

               case "backward":
                   for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent ; i++){
                       this.state.program.push("down");
                   }
                   break;

               case "left":
                   for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent / 90 ; i++){
                       this.state.program.push("left");
                   }
                   break;

               case "right":
                   for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent / 90 ; i++){
                       this.state.program.push("right");
                   }
                   break;

               case "light":
                   this.state.program.push("light");
                   break;

               case "sound":
                   this.state.program.push("sound");
                   break;
           }
        }catch (err){
            console.log("block value error");
        }

        /*if (block.getAttribute("type") === "forward"){
            //block.childNodes['value']
            try {
                for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent ; i++){
                    this.state.program.push("up");
                }
            }catch (err) {
                console.log("block value error")
            }
        }else if (block.getAttribute("type") === "backward"){
            //block.childNodes['value']
            try {
                for (let i = 0; i< block.getElementsByTagName("value").item(0).childNodes.item(0).childNodes.item(0).textContent ; i++){
                    this.state.program.push("down");
                }
            }catch (err) {
                console.log("block value error")
            }
        }*/

        try {
            let nextBlock = block.getElementsByTagName("next").item(0).getElementsByTagName("block").item(0);
            //console.log("nextBlock", nextBlock.item(0).getElementsByTagName("block").item(0))
            if (nextBlock !== null){
                this.interpret(nextBlock);
            }
        }catch (err){
            console.log("there is no other next block")
        }

    };

    render (){
        if(localStorage.getItem("user") === null){
            this.props.history.push('/');
        }
        return(
            <div className={"Home"}>
                <Menu history={this.props.history}/>
                <div className={"content"}>
                    <div className={"blocklyDrawer"}>
                        <BlocklyDrawer
                            tools={[up, down,  left, right, sound, light]}
                            onChange={(code, workspace) => {
                                //console.log(code, workspace);
                            }}
                            appearance={{
                                categories: {
                                    Movement: {
                                        colour: '180'
                                    },
                                },
                            }}
                        >


                            {/*
                            <Category name="Movement" colour="320">
                                <Block type="forward" tool={[up]}/>

                            </Category>
                        */}

                            <Category name="Cycles" colour="200">

                                <Block type="controls_repeat" />

                            </Category>


                            <Category name="Values" colour="240">
                                <Block type="math_number" />
                            </Category>
                        </BlocklyDrawer>
                    </div>


                    <div className={"controlPanel"}>
                        <div className="controls2">
                            <div id={"controlPanel-save"} onClick={this.save}></div>
                            <ProgramChooser load={this.load} setProgram={this.setProgram}/>
                            {/*  <div id={"controlPanel-open"} onClick={this.load}></div> */}

                            <button id="bSimulate" onClick={this.simulate}></button>
                        </div>

                        <div className="simulator2">
                            <SimulatorPanel rows={8} cols={8} program={this.state.program} ref={this.simulator}/>
                        </div>
                    </div>





                </div>
                <footer>
                    <p>© 2018 Adam Halász.  All rights reserved.</p>
                </footer>
            </div>

        )
    }
}

export default withRouter(BlocklyProg);

