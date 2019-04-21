import React, { Component } from 'react';
import "../css/SimulatorPanel.css"
import Square from "./Square";


class SimulatorPanel extends Component{

    constructor(props){
        super(props);
        this.state = {
            rows: this.props.rows,
            cols: this.props.cols,
            squares: [],
            degree: 0,
            ladyBugX: 4,
            ladyBugY: 4,
            index:0,
            intervalID: null,
        }

    }

    componentDidMount () {


    }

    timer = () => {

        if (this.state.intervalID===null){

            let intervalId = setInterval(this.simulate, 1000);
            //this.state.intervalID = intervalId;
            this.setState({intervalId: intervalId});
        }
        //let intervalId = setInterval(this.simulate, 1000);
        // store intervalId in the state so it can be accessed later:
        //this.setState({intervalId: intervalId});
    }

    canMove = (dir) => {
        console.log("DEG: ", this.state.degree, this.state.ladyBugX, this.state.ladyBugY)
        if(this.state.degree===0 ){

            if(dir==="up" && this.state.ladyBugX === 0) return false;
            if(dir==="down" && this.state.ladyBugX === this.state.rows-1) return false;

        }else if(this.state.degree===90){

            if(dir==="up" && this.state.ladyBugY === this.state.cols-1) return false;
            if(dir==="down" && this.state.ladyBugY === 0) return false;

        }else if(this.state.degree===180){

            if(dir==="up" && this.state.ladyBugX === this.state.rows-1) return false;
            if(dir==="down" && this.state.ladyBugX === 0) return false;

        }else if(this.state.degree===270){

            if(dir==="up" && this.state.ladyBugY === 0) return false;
            if(dir==="down" && this.state.ladyBugY === this.state.cols-1) return false;

        }
        return true;
    }

    mod = (n,m) => {
        return ((n % m) + m) % m;
    }

    simulate = () =>{
        if (this.state.index === this.props.program.length ){
            clearInterval(this.state.intervalId);
            this.setState({
                index: 0,
                intervalID: null,
            })
            try {
                document.getElementById("controlPanel-go").disabled = false;
            }catch (err){
            }
            try {
                document.getElementById("bSimulate").disabled = false;
            }catch (err){
            }
        }else{
            if(this.props.program[this.state.index] === "up" && this.canMove("up")){

                switch (this.state.degree){
                    case 0:
                        this.setState({
                            ladyBugX: this.state.ladyBugX - 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 180:
                        this.setState({
                            ladyBugX: this.state.ladyBugX + 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 90:
                        this.setState({
                            ladyBugY: this.state.ladyBugY + 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 270:
                        this.setState({
                            ladyBugY: this.state.ladyBugY - 1,
                            index : this.state.index + 1,
                        })
                        break;

                    default:
                        this.setState({
                            index : this.state.index + 1,
                        })
                        break;
                }



            }else if(this.props.program[this.state.index] === "down" && this.canMove("down")){
                switch (this.state.degree){
                    case 0:
                        this.setState({
                            ladyBugX: this.state.ladyBugX + 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 180:
                        this.setState({
                            ladyBugX: this.state.ladyBugX - 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 90:
                        this.setState({
                            ladyBugY: this.state.ladyBugY - 1,
                            index : this.state.index + 1,
                        })
                        break;
                    case 270:
                        this.setState({
                            ladyBugY: this.state.ladyBugY + 1,
                            index : this.state.index + 1,
                        })
                        break;
                    default:
                        this.setState({
                            index : this.state.index + 1,
                        })
                        break;
                }

            }else if(this.props.program[this.state.index] === "left"){

                this.setState({
                    degree: this.mod(this.state.degree-90,360),
                    index : this.state.index + 1,
                })
                console.log("turn left: " + this.state.degree );
            }else if(this.props.program[this.state.index] === "right"){
                this.setState({
                    degree: this.mod(this.state.degree+90,360),
                    index : this.state.index + 1,
                })
                console.log("turn right: " + this.state.degree );
            }else if(this.props.program[this.state.index] === "light"){
                alert("Light");
                console.log("Light");
                this.setState({
                    index : this.state.index + 1,
                })
            }else if(this.props.program[this.state.index] === "sound"){
                //alert("Sound");
                console.log("Sound");
                let audio = new Audio(require('../sound/beep.mp3'));
                console.log(audio.play());
                this.setState({
                    index : this.state.index + 1,
                })
            }else{
                this.setState({
                    index : this.state.index + 1,
                })
            }


        }
    };


    render(){

        let w = 510;
        let h = 510;

        this.state.squares=[];

        for(let i=0; i<this.state.cols; i++){
            for(let j=0; j<this.state.rows; j++){
                let val1 = (i === this.state.ladyBugX);
                let val2 = (j === this.state.ladyBugY);

                if( val1 && val2){
                    if(this.state.degree === 0)
                        this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"ladyBug"} lastClicked={(i)=>{}} /> );
                    else if(this.state.degree === 90)
                        this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"ladyBug90"} lastClicked={(i)=>{}}/>);
                    else if(this.state.degree === 180)
                        this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"ladyBug180"} lastClicked={(i)=>{}}/>);
                    else if(this.state.degree === 270)
                        this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"ladyBug270"} lastClicked={(i)=>{}}/>);
                }else{

                    this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={""} lastClicked={(i)=>{}}/>)
                }

            }

        }
        return(
            <div className="simulatorPanel-content"  >

                <div className="flex-grid" ref={input => {this.myInput = input;}}>
                    {this.state.squares}

                </div>


            </div>
        );
    }
}

export default SimulatorPanel;