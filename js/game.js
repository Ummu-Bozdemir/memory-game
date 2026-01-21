function preload() {
    
}

function create() {

    if (this.level === undefined) {
        this.level = 1;
    }

   
    this.cameras.main.setBackgroundColor("#f5f6fa");

  
    this.levelText = this.add.text(650, 20, "Level: " + this.level, {
        fontSize: "20px",
        fill: "#2c3e50"
    });

    this.moves = 0;
    this.movesText = this.add.text(20, 20, "Moves: 0", {
        fontSize: "20px",
        fill: "#2c3e50"
    });

    this.timePassed = 0;
    this.timeText = this.add.text(20, 50, "Time: 0", {
        fontSize: "20px",
        fill: "#2c3e50"
    });

    this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
            this.timePassed++;
            this.timeText.setText("Time: " + this.timePassed);
        },
        loop: true
    });

   
    const restartButton = this.add.text(650, 50, "Restart", {
        fontSize: "20px",
        fill: "#ffffff",
        backgroundColor: "#d63031",
        padding: { x: 10, y: 5 }
    });

    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on("pointerdown", () => {
        this.scene.restart();
    });

    
    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.canClick = true;
    this.matchedPairs = 0;

   
    let rows;
    if (this.level === 1) rows = 2;
    else if (this.level === 2) rows = 3;
    else rows = 4;

    const cols = 4;
    const pairs = (rows * cols) / 2;

   
    const colorPalette = [
        0x0984e3, 
        0x00b894, 
        0xd63031, 
        0xf9ca24, 
        0x6c5ce7, 
        0xe84393, 
        0x00cec9, 
        0xf0932b  
    ];

    let colors = [];
    for (let i = 0; i < pairs; i++) {
        const color = colorPalette[i % colorPalette.length];
        colors.push(color, color);
    }
    Phaser.Utils.Array.Shuffle(colors);

    
    const startX = 200;
    const startY = 150;

    let cardSize = 100;
    if (rows >= 4) cardSize = 80;

    let index = 0;

 
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            const card = this.add.rectangle(
                startX + col * (cardSize + 10),
                startY + row * (cardSize + 10),
                cardSize,
                cardSize,
                0xd0d7de 
            );

            card.colorValue = colors[index];
            card.isFlipped = false;

            card.setInteractive();
            card.on("pointerdown", () => {
                handleCardClick(this, card);
            });

            this.cards.push(card);
            index++;
        }
    }
}

function update() {

}


function handleCardClick(scene, card) {
    if (!scene.canClick || card.isFlipped) return;

    card.fillColor = card.colorValue;
    card.isFlipped = true;

    if (!scene.firstCard) {
        scene.firstCard = card;
        return;
    }

    scene.secondCard = card;
    scene.canClick = false;

    scene.moves++;
    scene.movesText.setText("Moves: " + scene.moves);

    scene.time.delayedCall(800, () => {

        if (scene.firstCard.colorValue === scene.secondCard.colorValue) {
            scene.matchedPairs++;

            const totalPairs = scene.cards.length / 2;

            if (scene.matchedPairs === totalPairs) {
                scene.timerEvent.remove(false);

                scene.add.text(230, 520, "LEVEL COMPLETE!", {
                    fontSize: "28px",
                    fill: "#27ae60"
                });

                scene.time.delayedCall(1500, () => {
                    if (scene.level >= 3) {
                        scene.add.text(200, 560, "GAME COMPLETED!", {
                            fontSize: "32px",
                            fill: "#27ae60"
                        });
                    } else {
                        scene.level++;
                        scene.scene.restart();
                    }
                });
            }

        } else {
            scene.firstCard.fillColor = 0xd0d7de;
            scene.firstCard.isFlipped = false;
            scene.secondCard.fillColor = 0xd0d7de;
            scene.secondCard.isFlipped = false;
        }

        scene.firstCard = null;
        scene.secondCard = null;
        scene.canClick = true;
    });
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#f5f6fa",
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);
