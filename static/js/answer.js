window.addEventListener('DOMContentLoaded', (event) => {
   var socket = io(); // C02. ソケットへの接続
   var isEnter = false;
   var name = '';

   const id = window.sessionStorage;
   console.log(id);

   socket.on("server_to_room", function (data) {
      appendMsg(data.value)
   });

   function appendMsg(text) {
      document.getElementById("log")
         .append("<div>" + text + "</div>");
      socket.emit("client_to_server", {
         value: "aaa"
      });
   }

   socket.on("server_to_send_question",function(question){
      document.getElementById("question-text").innerText = question.question
      document.getElementById("uestion-number").innerText = question.id
      document.getElementById("ch0").innerText = question.answer[0];
      document.getElementById("ch1").innerText = question.answer[1];
      document.getElementById("ch2").innerText = question.answer[2];
      document.getElementById("ch3").innerText = question.answer[3]; 
   });

});


