let admin = require("firebase-admin");
let serviceAccount = require("./lienka-d28a4-firebase-adminsdk-7my6l-53df53a4a8.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lienka-d28a4.firebaseio.com"
});

let db = admin.database();


module.exports = {
    writeUserData: (username, passwd, email, salt) => {
        db.ref('users/' + username).set({
            name: username,
            email: email,
            password: passwd,
            salt : salt,
            admin: false
        });
    },

    readUserData: async (userId) => {
        let res;
        await db.ref('users/' + userId).once("value", function(snapshot) {

            res = snapshot.val();

        });
        return res;
    },

    existsUser: async (username) => {
        let res;
        await db.ref('users/' + username).once("value", function(snapshot) {
            res = (snapshot.val() !== null);


        });

        return res;
    },

    isAdmin: async (username) => {
        let res;
        await db.ref('users/' + username).once("value", function(snapshot) {
            res = (snapshot.val().admin === true);


        });

        return res;
    },

    writeBlocklyProgram: (username, programName, program) => {
        db.ref('prog_blockly/' + username).child(programName).set({
            program: program,

        });
    },

    readBlocklyProgram: async (user) => {
        let res;

        await db.ref('prog_blockly/' + user).once("value", function(snapshot) {
            res = snapshot.val();

            console.log(res)

        });

        return res;

    },

    writeLog: async (user, timeStamp, logInOut) => {
        db.ref('logs/' + user).child(timeStamp).set({
            logInOut: logInOut,
            id: timeStamp,
        });
    },

    deleteLog: async (user, timeStamp) => {
        try {
            db.ref('logs/' + user).child(timeStamp).remove();
        }catch (err){
            console.log(err)
        }

    },

    deleteLogAll: async (user) => {
        try {
            db.ref('logs/' + user).set({});
        }catch (err){
            console.log(err)
        }

    },

    getLogs: async(user) => {
        let result;
        await db.ref('logs/' + user).once("value", function(snapshot) {
            result= snapshot.val();


        });
        //console.log(result);
        return result;
    },

    getAllUsers: async() => {

        let result;
        await db.ref('users/').once("value", function(snapshot) {
            result= Object.keys(snapshot.val());


        });
        //console.log(result);
        return result;
    },

    writeEasyProgram: (username, programName, program) => {
        db.ref('prog_easy/' + username).child(programName).set({
            program: program,

        });
    },

    readEasyProgram: async (user) => {
        let res;

        await db.ref('prog_easy/' + user).once("value", function(snapshot) {
            res = snapshot.val();

            console.log(res)

        });

        return res;

    },



};
