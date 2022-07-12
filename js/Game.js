class Game {
  constructor(){
    this.resetTitle = createElement("h2");
    this.resetButon = createButton("")
    this.ledeabord = createElement("h2");
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false;
    this.leftActive = false;
    this.IsBlast = false;
  }

  getState(){
    var gameStateref = database.ref("gameState");
    gameStateref.on("value",function(data){
      gameState = data.val();
    })
  }

  update(state){
    database.ref("/").update({
      gameState: state
    })
  }

  start(){
      form = new Form();
      form.display();
      player = new Player();
      playerCount = player.getCount();

      car1 = createSprite(width/2-50,height-100);
      car1.addImage("Carro1",car1img);
      car1.addImage("Blast",blastImg);
      car1.scale = 0.07;

      car2 = createSprite(width/2+100,height-100);
      car2.addImage("Carro2",car2img);
      car2.addImage("Blast",blastImg);
      car2.scale = 0.07;

      cars = [car1,car2];

      //Criando Moedas/Gasolina/Obstaculos

      fuels = new Group();
      coins = new Group();
      obs = new Group();

      this.addSprites(fuels,4,fuelImg,0.02);
      this.addSprites(coins,10,coinImg,0.09);

      var obstaclesPositions = [ {
         x: width / 2 + 250, y: height - 800, image: obs2img },
         { x: width / 2 - 150, y: height - 1300, image: obs1img },
          { x: width / 2 + 250, y: height - 1800, image: obs1img },
           { x: width / 2 - 180, y: height - 2300, image: obs2img },
            { x: width / 2, y: height - 2800, image: obs2img },
             { x: width / 2 - 180, y: height - 3300, image: obs1img },
              { x: width / 2 + 180, y: height - 3300, image: obs2img },
               { x: width / 2 + 250, y: height - 3800, image: obs2img },
                { x: width / 2 - 150, y: height - 4300, image: obs1img },
                 { x: width / 2 + 250, y: height - 4800, image: obs2img },
                  { x: width / 2, y: height - 5300, image: obs1img },
                   { x: width / 2 - 180, y: height - 5500, image: obs2img } ];

                   this.addSprites(obs,obstaclesPositions.length,obs1img,0.04,obstaclesPositions);

  }

  addSprites(spriteGroup,NumberOfSprite,SpriteImg,Scale,positions = []){
    for(var i = 0;i<NumberOfSprite;i++){
      var x,y;

      if(positions.length>0){
        x = positions[i].x;
        y = positions[i].y;
        SpriteImg = positions[i].image;
      }
      else{
      x = random(width/2+150,width/2-150);
      y = random(-height*4.5,height-400);
      }

      var sprite = createSprite(x,y);
      sprite.addImage(SpriteImg)
      sprite.scale = Scale;
      spriteGroup.add(sprite)
    }
  }

  handleElements(){
    this.resetTitle.html("Reiniciar o Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButon.class("resetButton");
    this.resetButon.position(width/2+230,100);

    this.ledeabord.html("Rank");
    this.ledeabord.class("resetText");
    this.ledeabord.position(width/3-60,40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);
  }

  play(){
    form.hideElements();
    this.handleElements();
    this.resetBase();

    Player.getPlayerInfo();
    player.getCarsAtEnd();


    if(allPlayers!==undefined){
      image(trackimg,0,-height*5,width,height*6);

      this.showLeadeabord();
      this.showFuelBar();
      this.showLife();
      
      var index = 0;
      for(var plr in allPlayers){
        index = index+1;
        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;

        var tempLife = allPlayers[plr].life;
        if(tempLife<=0){
          cars[index-1].changeImage("Blast");
          cars[index-1].scale = 0.3;

        }

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill('red');
          ellipse(x,y,60,60);
          this.handleFuels(index);
          this.handleCoins(index);

          this.handleObstacleColision(index);
          this.handleCarsColission(index);

          if(player.life<=0){
            this.IsBlast = true;
            this.playerMoving = false;
          }

          camera.position.y = cars[index-1].position.y;
        }
      }

      if(this.playerMoving){
        player.positionY = player.positionY+5;
        player.updatePlayer();

      }

      this.handlePlayerControl()

      const finishLine = height*6-100
      if(player.positionY > finishLine){
        gameState = 2;
        player.rank = player.rank+1;
        Player.updateCarsAtEnd(player.rank);
        player.updatePlayer();
        this.showRank();

      }

      drawSprites();
    }
  }

  showLeadeabord(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    if(
      (players[0].rank === 0 && players[1].rank === 0)||players[0].rank === 1
    ){
      leader1 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score;
      leader2 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score;
    }

    if(players[1].rank === 1){
      leader2 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score;
      leader1 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  resetBase(){
    this.resetButon.mousePressed(()=>{
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        carsAtEnd: 0,
        players: {}
      });
      window.location.reload();
    });

  }

  handlePlayerControl(){
    if(!this.IsBlast){

    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true;

      player.positionY = player.positionY +10;
      player.updatePlayer();
    }
    if(keyIsDown(LEFT_ARROW)&&player.positionX>width/2-300){
      this.leftActive = true;
      player.positionX = player.positionX -5 ;
      player.updatePlayer();
    }
    if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+280){
      this.leftActive = false;
      player.positionX = player.positionX +5 ;
      player.updatePlayer();
    }
  }
}

  handleFuels(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel = 185;
      collected.remove();
    });
    if(player.fuel>0 && this.playerMoving){
      player.fuel = player.fuel - 0.3;
    }
    if(player.fuel<=0){
      gameState = 2;
      this.gameOver();
    }
  }

  handleCoins(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score = player.score+21;
      player.updatePlayer();
      collected.remove();
    })
  }

  showLife(){
    push()
    image(lifeimage,width/2-130,height-player.positionY-250,20,20)
    fill("white");
    rect(width/2-100,height-player.positionY-250,185,20);
    fill("#f50057");
    rect(width/2-100,height-player.positionY-250,player.life,20);
    noStroke();
    pop()
  }

  showFuelBar(){
    push()
    image(fuelImg,width/2-130,height-player.positionY-200,20,20)
    fill("white");
    rect(width/2-100,height-player.positionY-200,185,20);
    fill("#ff6400");
    rect(width/2-100,height-player.positionY-200,player.fuel,20);
    noStroke();
    pop()
  }

  handleObstacleColision(index){
    if(cars[index-1].collide(obs)){

      if(this.leftActive === true){
        player.positionX = player.positionX+100;
      }
      else{
        player.positionX = player.positionX-100;
      }

      if(player.life>0){
        player.life = player.life-185/4;
      }
      player.updatePlayer();
    }
  }

  handleCarsColission(index){
    if(index === 1){
      if(cars[index-1].collide(cars[1])){
        if(this.leftActive === true){
          player.positionX = player.positionX+100;
        }
        else{
          player.positionX = player.positionX-100;
        }
  
        if(player.life>0){
          player.life = player.life-185/4;
        }
        player.updatePlayer();
      }
    }
    if(index === 2){
      if(cars[index-1].collide(cars[0])){
        if(this.leftActive === true){
          player.positionX = player.positionX+100;
        }
        else{
          player.positionX = player.positionX-100;
        }
  
        if(player.life>0){
          player.life = player.life-185/4;
        }
        player.updatePlayer();
      }
    }
  }

  showRank(){
    swal({
      title: `Parabéns!${"\n"}${player.rank}ºlugar`,
      text: "Você alcançou a linha de chegada!",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"

    })
  }

  gameOver(){
    swal({
      title: `Fim de jogo!`,
      text: "Você perdeu a corrida! :(",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar!!"
    })
  }

  end(){
    console.log("Fim De Jogo. :(")
  }

}
