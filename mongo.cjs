const mongoURL = 'mongodb://session_user:password@localhost:27017/session'
const MongoClient = require('mongodb').MongoClient;

var db


exports.insertRoom = function (roomID, userID) {
   return new Promise(function (res, reject) {
      MongoClient.connect(mongoURL, (err, db) => {

         const room = db.db('session').collection('room')
         room.insertOne({
            roomID: roomID,
            userID: userID
         })

      })
   });

};


exports.selectRoom = async function (roomID, userID, name) {
   return new Promise(function (res, reject) {
      MongoClient.connect(mongoURL, (err, db) => {

         const room = db.db('session').collection('room')
         room.find({
            roomID: roomID
         }).toArray((error, documents) => {

            if (documents.length >= 1) {
               console.log("found the room")
               room.updateOne({
                  roomID: roomID
               }, {
                  $addToSet: {
                     joinUser: {
                        userID: userID,
                        userName: name
                     }
                  }
               })
               res({
                  documents
               })
            } else {
               return false;
            }


         });

      });
   });
}


exports.findroom = async function (roomID) {
   return new Promise(function (res, reject) {
      MongoClient.connect(mongoURL, (err, db) => {
         const room = db.db('session').collection('room')
         room.find({
            roomID: roomID
         }).toArray((error, documents) => {

            if (documents.length >= 1) {
               console.log("found the room")
               res(true)
            } else {
               res(false)
            }


         });

      });
   });
}


exports.insertQuestion = function (question) {
   return new Promise(function (res, reject) {
      MongoClient.connect(mongoURL, (err, db) => {

         const room = db.db('session').collection('room')
         room.find({
            roomID: roomID
         }).toArray((error, documents) => {

            if (documents.length >= 1) {
               console.log("found the room")
               room.updateOne({
                  roomID: roomID
               }, {
                  question: question
               })
               res({
                  documents
               })
            } else {
               return false;
            }
         });

      })
   });

};

exports.getquestion = async function (roomID) {
   return new Promise(function (res, reject) {
      MongoClient.connect(mongoURL, (err, db) => {
         const room = db.db('session').collection('room')
         room.find({
            roomID: roomID
         }).toArray((error, documents) => {

            if (documents.length >= 1) {
               console.log("found the room")
               res(documents[0].question)
            } else {
               res(false)
            }
         });

      });
   });
}
