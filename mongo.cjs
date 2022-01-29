const mongoURL = 'mongodb://session_user:password@localhost:27017/session'
const MongoClient = require('mongodb').MongoClient;

var db


exports.insertRoom = async function (roomID, userID) {
   MongoClient.connect(mongoURL, (err, db) => {
      // ... start the server
      const room = db.db('session').collection('room')
      room.insertOne({
         roomID: roomID,
         userID: userID
      })

   })
};


exports.selectRoom = async function (roomID, userID,name) {
   MongoClient.connect(mongoURL, (err, db) => {
      // ... start the server
      const room = db.db('session').collection('room')
      room.find({
         roomID: roomID
      }).toArray((error, documents) => {
        
         if (documents.length >=1) {
            console.log("found the room")
            room.updateOne({
               roomID: roomID
            }, {
               $addToSet: {
                  joinUser: {userID:userID,
                     userName:name
                  }
               }
            })
            return room;
         } else {
            return false;
         }


      });

   })
};
