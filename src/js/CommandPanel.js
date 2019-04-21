import React, { Component } from 'react';
import "../css/CommandPanel.css"
import Square from "./Square";


class CommandPanel extends Component{

    constructor(props){
        super(props);
        this.state = {
            rows: this.props.rows,
            cols: this.props.cols,
            squares: []
        }

    }

    componentDidMount () {

        this.setState({squares: []});

    }


    render(){

        this.state.squares=[]

        for(let i = 0; i< this.props.program.length; i++){
            this.state.squares.push(<Square key={i} i={i} width={60} height={60} image={this.props.program[i]} lastClicked={this.props.lastClicked}/>)
        }

        /*let w = 510;
        let h = 510;

        for(let i=0; i<this.state.cols; i++){
            for(let j=0; j<this.state.rows; j++){
                let val1 = (i === Math.floor(this.state.cols/2));
                let val2 = (j === Math.floor(this.state.rows/2));

                if( val1 && val2){
                    console.log(i + " " + j);
                    this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"ladyBug"}/>)
                }else{

                    this.state.squares.push(<Square key={i*100+j} i={i} j={j} width={(w/this.state.cols)-2} height={(h/this.state.rows)-2} image={"light"}/>)
                }

            }

        }*/
        return(
            <div className="commandPanel-content"  >

                <div className="flex-grid">
                    {this.state.squares}
                </div>


            </div>
        );
    }
}

export default CommandPanel;