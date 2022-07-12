var bgImg,database,form,player,game,playerCount,gameState;
var car1,car2,car1img,car2img,cars = [];
var trackimg;
var allPlayers;
var fuelImg,fuels,coinImg,coins,obs1img,obs2img,obs;
var lifeImage;
var blastImg;

function preload() {
  bgImg = loadImage("./assets/planodefundo.png");
  trackimg = loadImage("./assets/track.jpg");
  car1img = loadImage("./assets/car1.png");
  car2img = loadImage("./assets/car2.png");
  fuelImg = loadImage("./assets/fuel.png");
  coinImg = loadImage("./assets/goldCoin.png");
  obs1img = loadImage("./assets/obstacle1.png");
  obs2img = loadImage("./assets/obstacle2.png");
  lifeimage = loadImage("./assets/life.png");
  blastImg = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start()

}

function draw() {
  background(bgImg);

  if(playerCount === 2){
    game.update(1);
  }

  if(gameState === 1){
    game.play();
  }

  if(gameState === 2){
    game.showRank();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


