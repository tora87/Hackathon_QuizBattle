var app = require('./app');
//sessionMiddlewareの取り出し
var sessionMiddleware = app.session;
var debug = require('debug')('chat-app:server');
var http = require('http');
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//セッションをsocket上で使えるように
io.use(function(socket, next){
  sessionMiddleware(socket.request, socket.request.res, next);
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
