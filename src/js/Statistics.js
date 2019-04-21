import React, { Component } from 'react';
import Menu from "./Menu";
import '../css/Statistics.css';
import { Link, withRouter} from 'react-router-dom'
import {getLogs, deleteLog, deleteLogAll, getAllUsers, isAdmin} from '../firebase/client';

import ReactTable from "react-table";
import "react-table/react-table.css";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {blue500} from "material-ui/styles/colors";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';


const color1 = "#FF4900"; // title
const color2 = "#FF5A19"; // button color
const color3 = "#FFB79A"; // background color
const color4 = "#FFF6F3"; // hover
const color5 = "#FF8858"; //

const style = {
    margin: 12,
    backgroundColor: color2,
};

const styles = {
    errorStyle: {
        color: "#bf360c",
    },
    underlineStyle: {
        borderColor: "#bf360c",
    },
    floatingLabelStyle: {
        color: "#bf360c",
    },
    floatingLabelFocusStyle: {
        color: blue500,
    },
    block: {
        maxWidth: 50,
    },
    toggle: {
        marginBottom: 16,
    },
    checkbox: {
        marginBottom: 16,
    },
    thumbOff: {
        backgroundColor: '#ffcccc',
    },
    trackOff: {
        backgroundColor: '#ff9d9d',
    },
    thumbSwitched: {
        backgroundColor: 'red',
    },
    trackSwitched: {
        backgroundColor: '#ff9d9d',
    },
    labelStyle: {
        color: 'red',
    },
};

class Home extends Component {
    constructor(props){
        super(props);

        this.state={
            selected: null,
            users: [],
            value: "",
            isAdmin: false,
            chosenUser: "",
            data:
            [
                {
                    id: '',
                    username: '',
                    date: '',
                    time: '',
                    action: '',
                },
            ]
        }
        this.columns = [
            {
                Header: 'ID',
                accessor: 'id' // String-based value accessors!
            },
            {
            Header: 'Meno',
            accessor: 'username' // String-based value accessors!
        }, {
            Header: 'Dátum',
            accessor: 'date',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            //id: 'friendName', // Required because our accessor is not a string
            Header: 'Čas',
            accessor: 'time',
            //accessor: d => d.friend.name // Custom value accessors!
        }, {
            Header: props => <span>Akcia</span>, // Custom header components!
            accessor: 'action'
        }],
            this.id = React.createRef();
            this.adminRef = React.createRef();

    }

    setData = async(u) => {
        let user;
        if(u===undefined){
            user = localStorage.getItem("user")
        } else{
            user = u;
        }

        let json = await getLogs(user);
        let res = new Array(0);
        try {
            Object.keys(json).forEach(function(key) {
                let date = new Date(parseInt(key))

                let data = {
                    id: json[key].id,
                    username: user,
                    date: date.toLocaleDateString(),
                    time: date.toLocaleTimeString(),
                    action: json[key].logInOut===true?"login":"logout",
                }
                res.push(data);
            });
        }catch (err){
            console.log(err)
        }

        return res;
    }

    componentWillMount() {

        Promise.all([this.setData()]).then(data=>{
            this.setState({
                data:data[0]
            })
            this.state.data = data[0];
            console.log(data[0])
        });
    }

    onChange = (e) => {

        this.setState({ selected: e.target.value })

    };

    onChangeAdmin = (e) => {

        this.setState({ isAdmin: e.target.value })

    };

    handleChange = async(event, index, value) => {
        //this.setState({ value })
        //this.state.value = value;
        //alert(index + " " + this.state.users[index]);
        Promise.all([this.setData(value)]).then(data=>{
            this.setState({
                data:data[0]
            })
            this.state.data = data[0];
            console.log(data[0])
        });
        this.setState({
            chosenUser: value,
        })




    }



    render (){
        if(localStorage.getItem("user") === null){
            this.props.history.push('/');
        }
        getAllUsers().then(value => {

            if (this.state.users.length===0){
                this.setState({
                    users:value
                })
            }

            //this.state.users=value
        console.log(this.state.users)}
            )
        return(
            <div className={"Statistics"}>
                <Menu history={this.props.history}/>
                <div className={"content"}>
                    <div className={"statsController"}>
                        <TextField
                            ref={this.usernameRef}
                            value={this.state.selected}
                            name="selected"
                            onChange={this.onChange}
                            underlineStyle={styles.underlineStyle}
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineStyle}/>
                        <RaisedButton label="Vymazať" style={style} onClick={()=> {
                            deleteLog(this.state.chosenUser===""? localStorage.getItem("user") : this.state.chosenUser, this.state.selected);
                            this.setState({
                                selected: "",
                            })
                            window.location.reload();
                        }}/>

                        <RaisedButton label="Vymazať všetko" style={style} onClick={()=> {
                            deleteLogAll(this.state.chosenUser===""? localStorage.getItem("user") : this.state.chosenUser);
                            this.setState({
                                selected: "",
                            })
                            window.location.reload();
                        }}/>
                        <br/>
                        <SelectField
                            floatingLabelText={"User"}
                            value={this.state.value}
                            onChange={this.handleChange}
                        >
                            {this.state.users.map((user, index) =>
                                <MenuItem key={index} value={user} primaryText={user} />
                            )}

                        </SelectField>


                    </div>


                    <ReactTable
                        data={this.state.data}
                        columns={this.columns}
                        getTrProps={(state, rowInfo, column, instance) => ({
                            onClick: e => this.setState({selected: rowInfo.original.id,})
                        })}
                    />

                </div>
                <footer>
                    <p>© 2018 Adam Halász.  All rights reserved.</p>
                </footer>
            </div>

        )
    }
}

export default (Home);

