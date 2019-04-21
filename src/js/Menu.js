import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import {logOut, isAdmin} from '../firebase/client';

import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';

import "../css/Menu.css";

const color1 = "#FF4900"; // title
const color2 = "#FF5A19"; // button color
const color3 = "#FFB79A"; // background color
const color4 = "#FFF6F3"; // hover
const color5 = "#FF8858"; //

const menuStyle = {
    backgroundColor: color4, borderRadius: "10px 10px 0 0",
};

const menuItemStyle = {
    backgroundColor: color4,
};

const buttonStyle = {
    backgroundColor: color2,
    labelColor: color5
};

const style = {margin: 5};
const iconStyles = {
    marginLeft: 24,
    hoverColor: blue300,
};


export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 3,
            stats:false,
        };
    }

    handleChange = (event, index, value) => this.setState({value});

    homepage=()=>{
        this.props.history.push('/home');
    }

    statistics=()=>{
        this.props.history.push('/statistics');
    }

    logout=()=>{
        logOut(localStorage.getItem("user"));

        this.props.history.push('/');
        localStorage.removeItem("user");
    };

    connectionSettings=()=>{

        let host = prompt("Zadaj IP adresu v tvare '192.168.0.106' alebo 'lienka.local'");
        localStorage.setItem("ipAddress", host);
        //alert(localStorage.getItem("ipAddress"));
    };

    componentWillMount(){
        isAdmin(localStorage.getItem("user")).then(value => this.setState({stats: value}))
        localStorage.setItem("connection", "disconnected")
    }

    render() {
        console.log("isAdmin", isAdmin(localStorage.getItem("user")).then(value => console.log(value)));
        return (
            <Toolbar
                style={menuStyle}>

                <ToolbarGroup firstChild={true}>

                    <FontIcon className="logo" />

                </ToolbarGroup>


                <ToolbarGroup style={menuStyle}>
                    {/* <ToolbarTitle text={localStorage.getItem("connection")} />
                    <ToolbarSeparator />
                    */}

                    <Avatar size={35} style={style}>{localStorage.getItem("user") !== null && localStorage.getItem("user").charAt(0)}</Avatar>
                    <ToolbarTitle text={localStorage.getItem("user")} />
                    <IconMenu style={menuItemStyle}
                        iconButtonElement={
                            <IconButton touch={true}>
                                <NavigationExpandMoreIcon style={menuItemStyle} />
                            </IconButton>
                        }
                    >
                        <MenuItem primaryText="Hlavná stránka" style={menuItemStyle} onClick={this.homepage} />
                        {this.state.stats && <MenuItem primaryText="Štatistiky" style={menuItemStyle} onClick={this.statistics} />}
                        <MenuItem primaryText="Credits" style={menuItemStyle}/>
                    </IconMenu>
                    <ToolbarSeparator />
                    <IconButton iconClassName="connect"  style={iconStyles} onClick={this.connectionSettings} />
                    <IconButton iconClassName="logout"  onClick={this.logout}/>


                </ToolbarGroup>
            </Toolbar>
        );
    }
}
/* <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> */
/*<div>Icons made by <a href="https://www.flaticon.com/authors/rami-mcmin" title="Rami McMin">Rami McMin</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>*/