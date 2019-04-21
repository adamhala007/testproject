import React, { Component } from 'react';
import '../css/App.css';
import FirstPage from "./FirstPage";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Home from "./Home";
import Statistics from "./Statistics";
import PlayGround from "./PlayGround";
import EasyProg from "./EasyProg";
import BlocklyProg from "./BlocklyProg";


/*https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/#react-firebase-setup*/

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {

    }

  render() {
    return (
        <MuiThemeProvider>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" history={this.props.history} component={FirstPage}/>
                    <Route exact path="/home" history={this.props.history} component={Home}/>
                    <Route exact path="/statistics" history={this.props.history} component={Statistics}/>


                    <Route exact path="/playground" history={this.props.history} component={PlayGround}/>
                    <Route exact path="/easyprog" history={this.props.history} component={EasyProg}/>
                    <Route exact path="/blocklyprog" history={this.props.history} component={BlocklyProg}/>


                </Switch>
            </BrowserRouter>
        </MuiThemeProvider>

    );
  }
}

export default (App);
