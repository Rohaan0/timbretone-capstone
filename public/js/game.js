let sequence = [];
let humanSequence = [];
let level = 0;
let score = 0;
let good = true;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');
const gameStart = document.querySelector('#game-start')
const saveBtn = document.querySelector('.save-btn')

function humanTurn(level) {
  tileContainer.classList.remove('unclickable'); 
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}

function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = document.querySelector(`[data-sound='${color}']`);

  tile.classList.add('activated');
  sound.play();

  setTimeout(() => {
    tile.classList.remove('activated');
  }, 300);
}

function lastScore(event){
  event.preventDefault()


}

function check() {
  try {

    if (humanSequence[humanSequence.length - 1] !== sequence[humanSequence.length - 1]){
      good = false;
    }
    
    if (good === false){
      gameReset()
    }

  } catch {
    console.log('ignored')
  }
}



function saveScore() {
  axios
  .get('http://localhost:5030/game')
  .then(res => {
    const user = res.data

    const {
      user_name: username,
      score: level
    } = user

    username.value = username,
    score.value = level

  })
}

// function getHighScores() {
//   scoresList.innerHTML = '<h4>LEADER BOARD</h4>'
//   axios.get('/scores')
//   .then(res => {
//       // console.log(res.data)
//       let scoresArr = []
//       for (let i = 0; i < res.data.length; i++) {
//           scoresArr.push(res.data[i])
//           createScoreLine(res.data[i])
//       }

//       let scoreCard = document.createElement('li')
//       scoreCard.innerHTML = '<h3>----------</h3>'

//       scoresList.appendChild(scoreCard)
//   })
// }



// function createScoreLine(score) {
//   // console.log(score)
//   // console.log(scoresArr)
//   scoresArr.push(score.score)
//   let scoreCard = document.createElement('li')  
//   scoreCard.innerHTML = `<h3>${score.name} ... ${score.score} </h3>`

//   scoresList.appendChild(scoreCard)

// }



function gameReset() {
    setTimeout(() => {
      startButton.classList.remove('hidden')
      info.classList.add('hidden')
      tileContainer.classList.add('unclickable')
      sequence = []
      humanSequence = []
      level = 0
    }, 1000);

}

function endGame() {
    saveScore()
    gameReset()
    const endedGame = document.querySelector('.ended-game')
    const closeGame = document.querySelector('.changeForm')
    closeGame.classList.add('hidden')
    const f = document.createElement('form')
    const h = document.createElement('h1')

    h.textContent = 'Save Your Score'

    f.innerHTML = 
      `
      <form id="profile-form">
        <label for="Username">Username:</label>
        <input type="text" id="user-name"/>

        <button>Save</button>
    </form>
    `
    endedGame.appendChild(h)
    endedGame.appendChild(f)

    console.log(endedGame.innerHTML)

}


function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * 600);
  });
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink'];
  const random = tiles[Math.floor(Math.random() * tiles.length)];

  return random;
}


function nextRound() {
  level += 1;


  tileContainer.classList.add('unclickable');

  info.textContent = 'Wait for the computer';

  heading.textContent = `Level ${level}`;


  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}



function handleClick(tile) {
  const index = humanSequence.push(tile) - 1;
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();

  const remainingTaps = sequence.length - humanSequence.length;



  if (humanSequence.length === sequence.length) {
    humanSequence = [];
    info.textContent = 'Success! Keep going!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''
  }`
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';
  nextRound();
  console.log('hello')
}


startButton.addEventListener('click', startGame);
console.dir(startButton)
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;

  if (tile) handleClick(tile);
});


saveBtn.addEventListener('click', endGame)




// module.exports = {
//   scoreBoard,
//   gameReset
// }