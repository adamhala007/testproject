import {Component} from "react";
import React from "react";
import Modal from "react-responsive-modal";
import '../css/ProgramChooser.css';

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
};

const stylesModal={
    background: "red"
};

class ProgramChooser extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
        };
    }


    getPrograms = async () => {
        return await this.props.load();
    };

    setProgram = (programs, prog) =>{
        this.props.setProgram(programs, prog);
        this.onCloseModal();
    };

    onOpenModal = () => {

        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    lastClicked =() =>{
        this.props.lastClicked(this.state.i);
    };

    createList = () => {
        let lis = [];

        this.getPrograms().then(
            (programs) => {
                console.log(programs);
                console.log(this);
                let self = this;
                if (programs !== null && programs !== undefined) {
                    Object.keys(programs).map(function(key){

                        console.log(this);
                        lis.push(<li onClick={() => self.setProgram(programs,key)}>{key}</li>);

                    })
                }

            }

        )
        return lis;
    }

    render() {
        const { open } = this.state;






        return (
            <div  style={styles}>
                <div id={"controlPanel-open"} onClick={this.onOpenModal}> </div>
                <Modal id="modal-programs" style={stylesModal} open={open} onClose={this.onCloseModal} center>
                    <h2>Vyber program:</h2>
                    <ul id="programs-list">
                    {

                        this.createList()
                        }



                    </ul>

                </Modal>
            </div>
        );
    }
}

export default ProgramChooser;