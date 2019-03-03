class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/Audio/bensound-ukulele.mp3');
        this.flipSound = new Audio('assets/Audio/flip.mp3');
        this.matchSound = new Audio('assets/Audio/match.mp3');
        this.victorySound = new Audio('assets/Audio/victory.mp3');
        this.gameOverSound = new Audio('assets/Audio/gameOver.mp3');
        this.bgMusic.volume = 0.4;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}
//================================================================================================
class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController
    }
    startGame() {
        this.cardsToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.cardsArray = [];
        this.busy = true;
            setTimeout(() => {
                this.audioController.startMusic();
                this.shuffleCards();
                this.countDown = this.startCountDown();
                this.busy = false;
                }, 500);

            this.timer.innerText = this.timeRemaining;
            this.ticker.innerText = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMisMatch(card, this.cardToCheck);
        this.cardToCheck = null;

    }
    cardMatch(card1, card2) {
        this.cardsArray.push(card1, card2);
        console.log(this.cardsArray, this.matchedCards);
            if (this.cardsArray.card1 === this.cardsArray.card2) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedCards.push(card1,card2);
                this.audioController.match();
                console.log(this.matchedCards);
            }
            else if (this.matchedCards.card1 !== this.matchedCards.card2)
            console.log('This isnt a match');

            if (this.matchedCards.length === 12) {
                this.victory();
                console.log('Only should fire during win');
            }
    }
    cardMisMatch(card1, card2){
        this.busy = true;
        setTimeout(() => {
            this.cardsArray.pop();
            this.card1.classList.remove('visible');
            this.card1.classList.remove('matched');
            this.cardsArray.pop();
            this.card2.classList.remove('matched');
            this.card2.classList.remove('visible');
            this.busy = false;
            }, 100);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0];
    }
    //================================================
// function cardOpen() {
//     openedCards.push(this);
//     var len = openedCards.length;
//     if(len === 2){
//         moveCounter();
//         if(openedCards[0].type === openedCards[1].type){
//             matched();
//         } else {
//             unmatched();
//         }
//     }
// };
    //===================================================
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
                if (this.timeRemaining === 0)
                this.gameOver();
        }
        ,1000);
    }
    //==============Win/Loss Functions===============================================
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
        this.hideCards();
    }
    victory() {
        this.audioController.victory();
        clearInterval(this.countDown);
        document.getElementById('victory-text').classList.add('visible');
        this.hideCards();
    }
    //=========================================================
    shuffleCards() {
        for( let i = this.cardsArray.length-1; i > 0; i-- ) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }
    canFlipCard(card) {
        return !this.busy 
        && !this.matchedCards.includes(card) 
        && card !== this.cardToCheck;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);
        
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
            // let audioController = new AudioController();
            //     audioController.startMusic();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
            // console.log(card);
        });
    });
}

if ( document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
}
else {
    ready();
}
