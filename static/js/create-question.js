document.addEventListener('DOMContentLoaded', () => {
  const create_btn = document.querySelector('#create-btn')
  const inputsElArray = document.querySelectorAll('.inputs')
  const list_ul = document.querySelector('.qustion-list')
  let list_num = 1;

  create_btn.addEventListener('click', () => {
    let checkList = []
    inputsElArray.forEach( el => {
      if(el.value == '') {
        checkList.push(false)
      }
    })

    if(checkList.length > 0 ){
      console.log('未入力項目があります')
    }else {
      const question_text = document.querySelector('#question-text').value.toString()
      const sliced_text = question_text.length > 15 ? question_text.slice(0,10) + '...' : question_text

      list_ul.innerHTML += `
      <li class="list-item-wrapper">
        <div class="left">
          <span class="list-number">${list_num++}</span>
          <span class="question-text">${sliced_text}</span>
        </div>
        <button class="btn">出題</button>
      </li>
      `
    }
  })

  const listItemHtml = ``;
})
