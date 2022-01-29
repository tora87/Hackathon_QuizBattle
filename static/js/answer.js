window.addEventListener('DOMContentLoaded', (event) => {
   var socket = io(); // C02. ソケットへの接続
   var isEnter = false;
   var name = '';

   const id = window.sessionStorage;
   console.log(id);

   // C04. server_to_clientイベント・データを受信する
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


   document.getElementById("ch0").addEventListener("click", () =>sendans(1));
   document.getElementById("ch1").addEventListener("click", () =>sendans(2));
   document.getElementById("ch2").addEventListener("click", () =>sendans(3));
   document.getElementById("ch3").addEventListener("click", () =>sendans(4));

   function sendans(num) {
      socket.emit("user_answer", {
         value: num
      });
   }
   

});


