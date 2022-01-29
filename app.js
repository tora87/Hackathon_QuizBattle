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
const io = require('socket.io')(http)
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const crypto = require('crypto')
const mongo = require('./mongo.cjs');
var MongoStore = require('connect-mongo')

const mongoURL = 'mongodb://session_user:password@localhost:27017/session'

const userInfo ={
   userid:null,
   Roomid:null
}

app.set("trust proxy", 1);

var options = {
   mongoUrl: mongoURL,
   autoRemove: 'native'
};

//use-session
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

// 8080番ポートで待ちうける
http.listen(8080, () => {

   console.log('Running at Port 8080...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'static')));
// urlencodedとjsonは別々に初期化する
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

   if (!mongo.selectRoom(request.body.roomID, request.session.userid, request.body.name)) {
      response.sendFile(__dirname + '/static/view/index.html');
   }
   request.session.name = request.body.name;
   userInfo.userid = request.session.userid;
   userInfo.Roomid = request.session.r
   response.sendFile(__dirname + '/static/view/answer.html');
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


app.get('/admin', function (request, response) {
   request.session.roomid = getRandomstr(24)
   request.session.userid = getRandomstr(64)

   mongo.insertRoom(request.session.roomid, request.session.userid)

   response.sendFile(__dirname + '/static/view/test.html');
});




// S04. connectionイベントを受信する
io.sockets.on('connection', function (socket) {

   var room = '';
   var name = '';

   // roomへの入室は、「socket.join(room名)」
   socket.on('client_to_room_join', function (data) {
      room = data.value;
      socket.join();
   });


   // S05. client_to_serverイベント・データを受信する
   socket.on('client_to_room', function (data) {
      // S06. server_to_clientイベント・データを送信する
      io.to(room).emit('server_to_room', {
         value: data.value
      });
   });

   // S07. client_to_server_broadcastイベント・データを受信し、送信元以外に送信する
   socket.on('client_to_room_broadcast', function (data) {
      socket.broadcast.to(room).emit('server_to_room', {
         value: data.value
      });
   });

   // S08. client_to_server_personalイベント・データを受信し、送信元のみに送信する
   socket.on('client_to_room_personal', function (data) {
      var id = socket.id;
      name = data.value;
      var personalMessage = "あなたは、" + name + "さんとして入室しました。"
      io.to(id).emit('server_to_room', {
         value: personalMessage
      });
   });

   // S09. dicconnectイベントを受信し、退出メッセージを送信する
   socket.on('disconnect', function () {
      if (name == '') {
         console.log("退出しました。");
      } else {
         var endMessage = name + "さんが退出しました。"
         io.to(room).emit('server_to_client', {
            value: endMessage
         });
      }
   });
});




const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function getRandomstr(num) {
   if (!isNaN(num)) {
      return Array.from(crypto.randomFillSync(new Uint8Array(num))).map((n) => S[n % S.length]).join('')
   }
}






// その他のリクエストに対する404エラー
app.use((req, res) => {
   res.sendStatus(404);
});
