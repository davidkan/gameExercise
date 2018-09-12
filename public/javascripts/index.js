class game {
    constructor(gameState) {
        this.startElem = document.getElementById('game__control__button');
        this.canvasElem = document.getElementById('canvas__inner');
        this.sliderElem = document.getElementById('slider__');
        this.speedElem=document.getElementById('game__slider__input__label');
        this.scoreElem = document.getElementById('game__controls__score');
        this.gameHeaderElem = document.getElementsByClassName('game__header');
//State
        this.gameState = Boolean(false);
        this.score = 0;
        this.speed = 20;
        this.fps = 0;
        this.dif = 5;
        this.bubbleBlowingRate = 18 ;
    }

    //Methods
    //Points-Score w/ 10 min 100 max
    rangedRandom() {
        return Math.floor(Math.random() * 90) + 10;
    }

    blowBubble(e) {
        let bubble = document.createElement('a');
        const diameter=this.rangedRandom() + 'px';
        const bubbleSize = {
            width: diameter,
            height: diameter,
        };
        bubble.classList.add('bubble');
        bubble.style.width = bubbleSize.width;
        bubble.style.height = bubbleSize.height;
        bubble.addEventListener('click', this.setScore.bind(this), {once: true});
        return bubble;
    }

    setScore(e) {
        if (this.gameState) {
            const bubbleValue = 100 / parseInt(e.target.offsetHeight.toFixed());
            this.score += parseInt(bubbleValue);
            this.scoreElem.innerHTML = this.score;
            this.popBubble(e);
        }
    }

    popBubble(e) {
        e.target.classList.add('popped-bubble');
    }


    randomizePosition(bubble) {
        const bubbleWidth = parseInt(bubble.style.width);
        let headerHeight = parseInt(this.gameHeaderElem.offsetHeight);
//WORK ON THE DISTRIBUTION
        bubble.style.left = Math.abs(Math.random() * ((this.canvasElem.offsetWidth - bubbleWidth)*.8)) + "px";
        bubble.style.top = ((bubbleWidth) - 150) + "px";

    }

    blowBubbles() {
        if (this.gameState) {
            document.querySelectorAll('.bubble').forEach(bubble => {
                const topStart = parseInt(bubble.style.top);
                //How frequently we want the to animate the bubbles
                if (this.fps % 2 === 0) {
                    bubble.style.top = topStart + parseInt(this.speed / this.dif, 10) + "px";

                }
                //Destroy the bubble once it's beyond the canvas view
                if (topStart > this.canvasElem.offsetHeight) {
                    this.canvasElem.removeChild(bubble);
                }
            });
        }
        ;
    }

    addBubble() {
        if (this.gameState) {
            //How frequently we wish to add a bubble
            if (this.fps % this.bubbleBlowingRate === 0) {
                let newCircle = this.blowBubble();
                this.randomizePosition(newCircle);
                this.canvasElem.appendChild(newCircle);
            }
            this.blowBubbles();
            window.requestAnimationFrame(this.addBubble.bind(this));
            this.fps++;
        }
    }


    handleStart() {
        let btnText = '';
        this.gameState = !this.gameState;
        this.gameState ? btnText = 'Pause' : btnText = 'Start';
        this.startElem.innerHTML = btnText;
        if (!this.gameState ){
            this.canvasElem.classList.add('paused')
        }
        if (this.gameState) {
            this.canvasElem.classList.remove('paused');
            this.speedElem.innerText='Speed: ' + this.speed;
            window.requestAnimationFrame(this.addBubble.bind(this));
        }

    }

    setSpeed() {
        this.speed = parseInt(this.sliderElem.value);
        this.speedElem.innerText='Speed: ' + this.speed;

    }


    init() {
        this.sliderElem.addEventListener('input', this.setSpeed.bind(this));
        this.startElem.addEventListener('click', this.handleStart.bind(this));
    }


}

const nGame = new game();
nGame.init();
