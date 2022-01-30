let user_answer;
let popupMassage;
let waitpopup;
window.addEventListener('DOMContentLoaded', (event) => {
   popupMassage = document.getElementById('js-wait-text');
   waitpopup = document.getElementById('js-wait-popup');   
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
      document.getElementById("log").innerHTML = `<div>${text}</div>`
      socket.emit("client_to_server", {
         value: "aaa"
      });
   }

   socket.on("server_to_send_question", function (question) {
      userans = ""
      document.getElementById("question-text").innerText = question.question
      document.getElementById("question-number").innerText = question.id
      document.getElementById("ch0").innerText = question.answer[0];
      document.getElementById("ch1").innerText = question.answer[1];
      document.getElementById("ch2").innerText = question.answer[2];
      document.getElementById("ch3").innerText = question.answer[3];
      document.getElementById("ch0").style.display = 'block';
      document.getElementById("ch1").style.display = 'block';
      document.getElementById("ch2").style.display = 'block';
      document.getElementById("ch3").style.display = 'block';


      let count = question.time;

      const timerId = setInterval(() => {
         if (count > 0) {
            questionTimer.innerText = `${count}秒`;
            count--;

            if(userans != ""){
               document.getElementById("steymsg").innerText = `${count}秒`;
            }
         } else {
            questionTimer.innerText = `${count}秒`;
            if(userans != ""){
               document.getElementById("steymsg").innerText = `待機中`;
            }
            clearInterval(timerId);
            showMassages(waitText);
            //showresult();
         }
      }, 1000);

   });


   socket.on("server_to_send_ans",
      function (ans) {
         waitpopup.classList.toggle('is-show');
         if (userans == ans) {
            console.log("正解")
         } else {
            console.log("不正解")
         }
      });

   document.getElementById("ch0").addEventListener("click", () => sendans(document.getElementById("ch0").innerText));
   document.getElementById("ch1").addEventListener("click", () => sendans(document.getElementById("ch1").innerText));
   document.getElementById("ch2").addEventListener("click", () => sendans(document.getElementById("ch2").innerText));
   document.getElementById("ch3").addEventListener("click", () => sendans(document.getElementById("ch3").innerText));

   function sendans(num) {
      console.log(num)
      userans = num;
      showMassages(waitText)
      waitpopup.classList.toggle('is-show');
      socket.emit("user_answer", {
         "value": num
      });
   }



   const questionTimer = document.getElementById('question-timer') // 回答時間要素



   // ---ポップアップでテキストを表示する---------------------------------
   function showMassages(text) {
      popupMassage.innerHTML = text;
   }

   // ---リザルト画面の表示(仮)---------------------------------
   let resulttext = `
        <div class="flex-wrapper">
            <div class="ul">
                <div class="name">
                    <ul class="ranking">
                        <li>たかはしはじめ 5秒</li>
                        <li>なかむらじろう 6秒</li>
                        <li>たなかさんこ 7秒</li>
                    </ul>
                </div>
            </div>
            <div class="cor-rate">
                    <p>正答率</p>
                    <div class="pie" id="pie"><span>60%</span></div>
            </div>
        </div>
        <div class="user-score" id="user-score">
            <p>あなた</p>
        </div>
        `;

   const waitText = `
        <div class="popup-container">
            <p class="wait-text" id="js-wait-text">みんなが答え終わるまで待ってね...</p>'
            <div class="sk-wrapper">
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
                <div id="steymsg"></div>
            </div>
        </div>
        `;



   // ---タイマーメソッド---------------------------------




   // ---問題が出題されるまでの待機---------------------------------



});

// ---リザルト画面の表示(仮)---------------------------------


const waitText = `
<div class="popup-container">
    <p class="wait-text" id="js-wait-text">みんなが答え終わるまで待ってね...</p>'
    <div class="sk-wrapper">
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    </div>
</div>
`;


function showresult() {
   setTimeout(() => {
      let resulttext = `
<div class="flex-wrapper">
    <div class="ul">
        <div class="name">
            <ul class="ranking">
                <li>たかはしはじめ 5秒</li>
                <li>なかむらじろう 6秒</li>
                <li>たなかさんこ 7秒</li>
            </ul>
        </div>
    </div>
    <div class="cor-rate">
            <p>正答率</p>
            <div class="pie" id="pie"><span>60%</span></div>
    </div>
</div>
<div class="user-score" id="user-score">
    <p>あなた</p>
</div>
`;
      console.log('showresult()');
      //showMassages(resulttext);
      waitpopup.classList.toggle('is-show');
      document.getElementById('pie').style.backgroundImage = `conic-gradient(#d5525f 0% 60%, #d9d9d9 60% 100%)`;
      document.getElementById('user-score').innerHTML += `<p>14位 たちばなかずひこ 14秒</p>`;
   }, 3000);
}

// ---ポップアップでテキストを表示する---------------------------------
function showMassages(text) {
   popupMassage.innerHTML = text;
}


