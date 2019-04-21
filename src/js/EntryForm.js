import React, { Component } from 'react';
import div from 'react-dom';
import '../css/App.css';
import Button from './Button'
import "../css/EntryForm.css";
import axios from 'axios';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import { Link, withRouter} from 'react-router-dom'
import {logIn} from '../firebase/client'


let randomstring = require("randomstring");
let md5 = require('md5');

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
};

class EntryForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpened: false,
            text: "",
            formStyle: "",
            registration: {
                username: "",
                email: "",
                password: "",
                password2: "",
                salt: ""
            },
            error: {
                username: "",
                password: "",
                password2: "",
                email: "",
            },
            successfulRegistration: false,
            successfulLogin: false,

        };
        this.usernameRef = React.createRef();
        this.passwd1Ref = React.createRef();
        this.passwd2Ref = React.createRef();
        this.emailRef = React.createRef();
    }


    handleClick  = (e) => {

        this.setState({
            text: e
        })
    };

    login = () => {

        if (this.isValidLogin()){
            axios.post('/login', this.state.registration )
                .then(res => {
                    this.errorHandle(res.data.errorCode, res.data.errorMessage);
                    if(this.state.successfulLogin){
                        console.log(this.state.registration)
                        localStorage.setItem("user", this.state.registration.username);
                        logIn(this.state.registration.username)
                        this.emptyFields();
                        this.props.history.push('/home');
                    }else{
                        console.log(res.data);
                    }
                    //console.log("RES: " + res.data.errorMessage);
                    //console.log("RES DATA: " +res.data.email);


                })
        }
    };

    register = () => {
        this.state.registration.salt = randomstring.generate(10);

        this.state.registration.password = md5(this.state.registration.password + this.state.registration.salt);
        this.state.registration.password2 = md5(this.state.registration.password2 + this.state.registration.salt);
        //this.state.registration.username = this.state.username;
        //this.state.registration.email = this.state.email;
        console.log( this.state.registration);

        if(this.isValidRegistration()){
            axios.post('/register', this.state.registration )
                .then(res => {
                    this.errorHandle(res.data.errorCode, res.data.errorMessage);
                    if(this.state.successfulRegistration){
                        localStorage.setItem("user", this.state.registration.username);
                        logIn(this.state.registration.username);
                        this.emptyFields();
                        this.props.history.push('/home');
                    }
                    console.log("RES: " + res.data.errorMessage);
                    //console.log("RES DATA: " +res.data.email);
                })
        }else{
            this.setState({
                formStyle: "560px"
            })
        }


    };

    emptyFields=()=>{
        const {registration} = this.state;
        const {error} = this.state;

        registration['username'] = "";
        registration['password'] = "";
        registration['password2'] = "";
        registration['email'] = "";
        registration['salt'] = "";

        error['username'] = "";
        error['password'] = "";
        error['email'] = "";
        error['password2'] = "";
        this.setState({registration, error});
    }

    errorHandle = (code, msg) =>{


        if(code === "0"){
            this.setState({
                successfulRegistration: true,
                successfulLogin: true,
            })

        }
        else{
            this.setState({
                successfulRegistration: false,
                successfulLogin: false,
            })
        }

    };

    onChange = (e) => {
        const { registration } = this.state;
        registration[e.target.name] = e.target.value;
        this.setState({ registration })

    };

    isValidLogin = () => {
        let isValid = true;
        const { registration } = this.state;
        const { error } = this.state;
        if(this.state.registration.username === ""){
            isValid = false;
            error['username'] = "Prázdne pole";
        }else{
            error['username'] = "";
        }

        if(this.state.registration.password === ""){
            isValid = false;
            error['username'] = "Prázdne pole";
        }else{
            error['username'] = "";
        }

        if(!isValid){
            registration['password'] = "";
        }

        this.setState({error});
        this.setState({registration});

        return isValid;

    };

    isValidRegistration = () => {
        let isValid = true;
        const { error } = this.state;
        const { registration } = this.state;
        let regex = new RegExp(".+@.+\..+", "ig");

        if(this.state.registration.username === ""){
            isValid = false;
            error['username'] = "Prázdne pole";
        }else{
            error['username'] = "";
        }

        if(this.state.registration.password !== this.state.registration.password2){
            isValid = false;
            error['password2'] = "Heslá sa nezhodujú!";

        }else{
            error['password2'] = "";
        }

        if(!regex.test(this.state.registration.email)){
            isValid = false;
            error['email'] = "Chybný formát!";
        }else{
            error['email'] = "";
        }

        if(!isValid){
            registration['password'] = "";
            registration['password2'] = "";
        }

        this.setState({error});
        this.setState({registration});

        return isValid;
    };


    showSignIn = () =>{



      return(
          <div className="showForm prihlasenie" >

              <span id="close" onClick={() => this.setState({text: ""})}>X</span>

              <h1>Prihlásenie</h1>
              <TextField  ref={this.usernameRef} floatingLabelText="Prihlasovacie meno" name="username" onChange={this.onChange} value={this.state.registration.username}
                          errorText={this.state.error.username}
                          underlineStyle={styles.underlineStyle}
                  /*floatingLabelStyle={styles.floatingLabelStyle}*/
                          floatingLabelFocusStyle={styles.floatingLabelStyle}
                          underlineFocusStyle={styles.underlineStyle} />

              <TextField  ref={this.passwd1Ref} type="password" floatingLabelText="Heslo" name="password" onChange={this.onChange} value={this.state.registration.password}
                          errorText={this.state.error.password}
                          underlineStyle={styles.underlineStyle}
                  /*floatingLabelStyle={styles.floatingLabelStyle}*/
                          floatingLabelFocusStyle={styles.floatingLabelStyle}
                          underlineFocusStyle={styles.underlineStyle}/>


                  <Button icon={require("../images/login2.png")} text={"Prihlásenie"} buttonClick={ this.login} clName={"button btn"} />

              <p>Nemáte ešte účet? <span onClick={() => {this.setState({text: "Registrácia"}); this.errorHandle("0", "OK") }}>Zaregistrujte sa!</span></p>


          </div>
      )
    };

    showSignUp = () =>{
        return(
            <div className="showForm registracia" style={{height: this.state.formStyle}} >

                <span id="close" onClick={() => this.setState({text: ""})}>X</span>



                <h1>Registrácia</h1>

                <TextField  ref={this.usernameRef} floatingLabelText="Prihlasovacie meno" name="username" onChange={this.onChange} value={this.state.registration.username}
                            errorText={this.state.error.username}
                            underlineStyle={styles.underlineStyle}
                            /*floatingLabelStyle={styles.floatingLabelStyle}*/
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineStyle} />
                <TextField  ref={this.passwd1Ref} type="password" floatingLabelText="Heslo" name="password" onChange={this.onChange} value={this.state.registration.password}
                            errorText={this.state.error.password}
                            underlineStyle={styles.underlineStyle}
                            /*floatingLabelStyle={styles.floatingLabelStyle}*/
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineStyle}/>
                <TextField  ref={this.passwd2Ref} type="password" floatingLabelText="Heslo znova" name="password2" onChange={this.onChange} value={this.state.registration.password2}
                            errorText={this.state.error.password2}
                            underlineStyle={styles.underlineStyle}
                            /*floatingLabelStyle={styles.floatingLabelStyle}*/
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineStyle}/>
                <TextField  ref={this.emailRef} type="email" floatingLabelText="Email" name="email" onChange={this.onChange} value={this.state.registration.email}
                            errorText={this.state.error.email}
                            underlineStyle={styles.underlineStyle}
                            /*floatingLabelStyle={styles.floatingLabelStyle}*/
                            floatingLabelFocusStyle={styles.floatingLabelStyle}
                            underlineFocusStyle={styles.underlineStyle}/>




                <Button icon={require("../images/signin.png")} text={"Registrácia"} buttonClick={this.register} clName={"button btn"} />

                <p>Máte už účet? <span onClick={() => { this.setState({text: "Prihlásenie"}); this.errorHandle("0", "OK") }}>Prihláste sa!</span></p>


            </div>
        )
    };

    hide = () =>{
        return(
            <div id="formHidden" >
                <Button icon={require("../images/login2.png")} text={"Prihlásenie"} buttonClick={this.handleClick} clName={"btn"} />
                <Button icon={require("../images/signin.png")} text={"Registrácia"} buttonClick={this.handleClick} clName={"btn"} />
            </div>
        )
    };

    copyObject = (object) => {
        return Object.assign({}, object);    //creating copy of object
    };

    render() {
        return (
            <div className="EntryForm">
                {this.state.text === "" && this.hide()}
                {this.state.text === "Prihlásenie" && this.showSignIn()}
                {this.state.text === "Registrácia" && this.showSignUp()}
            </div>
        );
    }
}

export default withRouter(EntryForm);