let express = require("express");
let path = require("path");
let app =  express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// for serving static files
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());
let result = {};
const firebase = require('./src/firebase/firebase');
let md5 = require('md5');

app.listen(3001,() =>  console.log("Running on localhost:3001"));

// listen for all GET requests and server built html, can listen for "/" also, in case you have another GET endpoints
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"));
});

// just a tip: it is good to prefix API urls with /api/{endpoint}
app.post('/getlogged', async (req,res) => {
    const all = req.body;
    result = await firebase.readUserData("id");
    res.status(200).json(result);
});

app.post('/register',  async (req,res) => {
    const all = req.body;

    if (await firebase.existsUser(all.username)){
        result = {
            errorCode: "1",
            errorMessage: "userExists"
        };
    }else{
        firebase.writeUserData(all.username, all.password, all.email, all.salt);
        result = {
            errorCode: "0",
            errorMessage: "OK"
        };
    }

    res.status(200).json(result);
});

app.post('/login',  async (req,res) => {
    const all = req.body;

    if (!(await firebase.existsUser(all.username))){
        result = {
            errorCode: "2",
            errorMessage: "userNotExists"
        };
    }else{
        let userData = await firebase.readUserData(all.username);
        if(md5(all.password + userData.salt) !== userData.password){
            result = {
                errorCode: "3",
                errorMessage: "wrongPassword"
            };
        }else{
            result = {
                errorCode: "0",
                errorMessage: "OK"
            };
        }

    }

    res.status(200).json(result);
});

app.post('/saveBlocklyProgram',  async (req,res) => {
    const all = req.body;
    let user = all.user;
    let programName = all.programName;
    let program = all.program;

    firebase.writeBlocklyProgram(user, programName, program);
    result = {
        errorCode: "0",
        errorMessage: "OK"
    };


    res.status(200).json(result);
});

app.post('/loadBlocklyProgram',  async (req,res) => {
    const all = req.body;
    let user = all.user;

    let result = ( await firebase.readBlocklyProgram(user));

    res.status(200).json(result);
});

app.post('/logInOut',  async (req,res) => {
    const all = req.body;
    let user = all.user;
    let timeStamp = all.timeStamp;
    let log_in_out = all.log_in_out;

    firebase.writeLog(user, timeStamp, log_in_out);
    result = {
        errorCode: "0",
        errorMessage: "OK"
    };


    res.status(200).json(result);
});

app.post('/deleteLog',  async (req,res) => {
    const all = req.body;
    let user = all.user;
    let timeStamp = all.timestamp;

    await firebase.deleteLog(user, timeStamp);
    result = {
        errorCode: "0",
        errorMessage: "OK"
    };


    res.status(200).json(result);
});

app.post('/deleteLogAll',  async (req,res) => {
    const all = req.body;
    let user = all.user;

    await firebase.deleteLogAll(user);
    result = {
        errorCode: "0",
        errorMessage: "OK"
    };


    res.status(200).json(result);
});

app.post('/getLogs',  async (req,res) => {
    const all = req.body;
    let user = all.user;

    let result = await firebase.getLogs(user);

    res.status(200).json(result);
});

app.post('/getAllUsers',  async (req,res) => {
    const all = req.body;

    let result = await firebase.getAllUsers();

    res.status(200).json(result);
});

app.post('/isAdmin',  async (req,res) => {
    const all = req.body;
    let user = all.user;

    let result = await firebase.isAdmin(user);

    res.status(200).json(result);
});

app.post('/saveEasyProgram',  async (req,res) => {
    const all = req.body;
    let user = all.user;
    let programName = all.programName;
    let program = all.program;

    firebase.writeEasyProgram(user, programName, program);
    result = {
        errorCode: "0",
        errorMessage: "OK"
    };


    res.status(200).json(result);
});

app.post('/loadEasyProgram',  async (req,res) => {
    const all = req.body;
    let user = all.user;

    let result = ( await firebase.readEasyProgram(user));

    res.status(200).json(result);
});
