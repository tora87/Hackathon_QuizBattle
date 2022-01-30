/**
 * /app.js
 */
// express モジュールのインスタンス作成

const express = require('express');
const app = express();
// パス指定用モジュール
const session = require('express-session');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http,{allowEIO3: true})
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const crypto = require('crypto')
const mongo = require('./mongo.cjs');
var MongoStore = require('connect-mongo')

const mongoURL = 'mongodb://session_user:password@localhost:27017/session'

//保持しておくやつ(後からDBに格納したものを取れるようにする)
const userInfo = {
   adminid: null,
   userid: null,
   username: null,
   Roomid: null
}

app.set("trust proxy", 1);

var options = {
   mongoUrl: mongoURL,
   autoRemove: 'native'
};

app.use(session({
   secret: 'session-id',
   resave: true,
   rolling: true,
   saveUninitialized: true,
   store: new MongoStore(options),
   cookie: {
      httpOnly: false,
      maxAge: 60000 * 300
   }
}));

app.set("trust proxy", 1);

// 8080Port
http.listen(8080, () => {

   console.log('Running at Port 8080...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());



app.get('/', function (request, response) {
   console.log(request.session.userid)
   response.sendFile(__dirname + '/static/view/index.html');
});


app.post('/answer', function (request, response) {
   console.log(request.body)
   if (!request.session.userid) {
      
      request.session.userid = getRandomstr(64);
   }

   if(request.body.namei){
      mongo.selectRoom(userInfo.Roomid, request.session.userid, request.body.name).then(room => {
         if (!room) {
            response.sendFile(__dirname + '/static/view/index.html');
         }
         userInfo.username = request.body.namei
         request.session.name = request.body.namei;
         userInfo.adminid = room.documents[0].userID
         userInfo.userid = request.session.userid;
         userInfo.Roomid = request.body.roomID
         console.log(userInfo.adminid)
         response.sendFile(__dirname + '/static/view/answer.html');
      })
   }

   mongo.selectRoom(request.body.roomID, request.session.userid, request.body.name).then(room => {
      if (!room) {
         response.sendFile(__dirname + '/static/view/index.html');
      }
      userInfo.username = request.body.name
      request.session.name = request.body.name;
      userInfo.adminid = room.documents[0].userID
      userInfo.userid = request.session.userid;
      userInfo.Roomid = request.body.roomID
      console.log(userInfo.adminid)
      response.sendFile(__dirname + '/static/view/answer.html');
   })

});

app.get('/test', function (request, response) {
   console.log(request.session.userid)
   if (!request.session.userid) {
      console.log("create New ID")
      request.session.userid = getRandomstr(64);
   }

   if (request.body) {
      request.session.name = request.body.name
   }
   response.sendFile(__dirname + '/static/view/test.html');
});

app.get('/invite', (request, response) => {
   console.log(request.query.roomid)
   if(request.query.roomid){
     mongo.findroom(request.query.roomid).then((f) =>{
        console.log(f)
        if(f){
         userInfo.Roomid = request.query.roomid
         
            response.sendFile(__dirname + '/static/view/invite.html');
        }else{
         response.sendFile(__dirname + '/static/view/index.html');
        }
     })
   }
});

app.get('/admin', function (request, response) {
   request.session.roomid = getRandomstr(24)
   request.session.userid = getRandomstr(64)

   userInfo.adminid = request.session.userid
   userInfo.Roomid = request.session.roomid

   mongo.insertRoom(request.session.roomid, request.session.userid)

   response.sendFile(__dirname + '/static/view/create-question.html');
});


io.sockets.on('connection', function (socket) {

   var room = '';
   var name = '';
   console.log("connected");
   socket.join(userInfo.Roomid);

   if(userInfo.adminid == userInfo.userid){
      socket.join(userInfo.adminid)
   }

   
   console.log("room:"+userInfo.Roomid)
   var personalMessage = "あなたは、" + userInfo.username + "さんとして入室しました。"
      io.to(userInfo.Roomid).emit('server_to_room', {
         value: personalMessage
      });
   
      //TODO クライアントの処理
      //各クライアントへの問題の設定
      socket.on('set_question',function(question){
         console.log(question)
         //TODO エラー処理する
         question.time = question.time;
         question.answer = arrayShuffle(question.answer)
         io.to(userInfo.Roomid).emit('server_to_send_question',question)
      });


       //ユーザーから答えが送られてきた時
       socket.on('user_answer', function (data) {
         //TODO: 教師側にデータの送信をする
         console.log(data)
      });

      socket.on('create_url', function (data) {
         //TODO: 教師側にデータの送信をする
         // io.to(userInfo.adminid).emit('send_url',`http://localhost:8080/invite?roomid${userInfo.Roomid}`)
         io.to(socket.id).emit('send_url',`http://localhost:8080/invite?roomid=${userInfo.Roomid}`)
      });

      // //userからanswerが送られてきた時の処理
      // socket.on('get_answer',function(question){
      //    io.to(userInfo.Roomid).emit('send_question',question)
      // });

      //答え合わせ時の処理
      socket.on('review_question',function(correct){
         //答えをユーザー側に送る
         console.log("this is coorect"+ correct)
         io.to(userInfo.Roomid).emit('server_to_send_ans', correct)
      })


   // 退出処理
   socket.on('disconnect', function () {
      //退出処理

   });
});

const S = "0123456789"

function getRandomstr(num) {
   if (!isNaN(num)) {
      return Array.from(crypto.randomFillSync(new Uint8Array(num))).map((n) => S[n % S.length]).join('')
   }
}

function arrayShuffle(array) {
   for(var i = (array.length - 1); 0 < i; i--){
 
     var r = Math.floor(Math.random() * (i + 1));

     var tmp = array[i];
     array[i] = array[r];
     array[r] = tmp;
   }
   return array;
 }

// その他のリクエストに対する404エラー
app.use((request, response) => {
   response.sendStatus(404);
});
