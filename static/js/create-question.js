document.addEventListener('DOMContentLoaded', () => {
  const create_btn = document.querySelector('#create-btn')
  const inputsElArray = document.querySelectorAll('.inputs')
  const ansElArray = document.querySelectorAll('.ans')
  const list_ul = document.querySelector('.qustion-list')
  const alert = document.querySelector('.alert')
  const questionEl = document.querySelector('#question-text')
  const timeEl = document.querySelector('#time')
  const hidden = document.getElementById('hidden')
  const link = document.querySelector('.invite-link')
  let ask_btns = document.querySelectorAll('.ask-btn')
  let list_num = 1
  let question_list = []
  let timeUp = false;
  let countNum = 0
  
  //ソケット
  const socket = io()

  create_btn.addEventListener('click', () => {
    let checkList = []
    inputsElArray.forEach( el => {
      if(el.value == '') {
        checkList.push(false)
      }
    })

    if(checkList.length > 0 ){
      alert.innerText = '未入力項目があります'
      alert.classList.add('show','error')
      setTimeout(() => {
        alert.classList.remove('show','error')
      },3000)
      return
    }

    let question_obj = {}
    const answers = [...ansElArray].map(el => el.value)
    const question = questionEl.value
    const time = timeEl.value

    alert.innerText = '問題を作成しました'
    alert.classList.add('show','success')
    setTimeout(() => {
      alert.classList.remove('show','success')
    },3000)

    //問題オブジェクトの作成
    question_obj['id'] = Number(list_num)
    question_obj['question'] = question
    question_obj['answer'] = answers
    question_obj['time'] = Number(time)

    question_list.push(question_obj)

    const question_text = document.querySelector('#question-text').value.toString()
    const sliced_text = question_text.length > 15 ? question_text.slice(0,10) + '...' : question_text

    //出題リストの追加
    list_ul.innerHTML += `
    <li class="list-item-wrapper">
      <div class="left">
        <span class="list-number">${list_num}</span>
        <span class="question-text">${sliced_text}</span>
      </div>
      <button id="${list_num}" class="btn ask-btn">出題</button>
    </li>
    `

    list_num++

    //出題ボタンの取得し直し
    // ask_btns = document.querySelectorAll('li .btn')
    // console.log(ask_btns)
  })

  //クリックしたボタン要素のidを取得する
  document.addEventListener('click', (e) => {
    if(e.target && e.target.classList.contains('ask-btn')){
      const id = e.target.id
      const selectedQuestion = question_list[id-1]

      //アラートの表示
      alert.innerText = '問題を出しました'
      alert.classList.add('show','info')
      setTimeout(() => {
        alert.classList.remove('show','info')
      },3000)

      socket.emit('set_question',selectedQuestion)

      countNum = selectedQuestion['time']

      timeStart(selectedQuestion['answer'][0])
    }
  })

  link.addEventListener('click', () => {
    socket.emit('create_url','undefined')
    socket.on('send_url',url => {
      copyTextToClipboard(url)
    })

    //アラートの表示
    alert.innerText = 'リンクをコピーしました'
    alert.classList.add('show','copy')
    setTimeout(() => {
      alert.classList.remove('show','copy')
    },3000)
  })



  const timeStart = (correctAns) => {
    const timer = setInterval(() => {
      if(countNum <= 0){
        socket.emit('review_question',correctAns)
        clearInterval(timer)
        return
      }

      --countNum
      
    },1000)
  }

  const copyTextToClipboard = text => {
    navigator.clipboard.writeText(text)
    .then(() => {
      alert('正解')
    })
    .catch(() => {
      alert('不正解')
    })
  }
})
