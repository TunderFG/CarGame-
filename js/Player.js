class Player {
  constructor(){
     this.name = null;
     this.index = null;
     this.positionX = 0;
     this.positionY = 0;
     this.rank = 0;
     this.score = 0;
     this.fuel = 185;
     this.life = 185;
  }

  addPlayer(){
    var playerIndex = "players/player"+this.index;

    if(this.index === 1){
      this.positionX = width/2-100;
    }
    else{
      this.positionX = width/2+100;
    }

    database.ref(playerIndex).set({
      name:this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score
    })
  }

  getCount(){
    var playerCountref = database.ref("playerCount");
    playerCountref.on("value",function(data){
      playerCount = data.val();
    })
  }

  updateCount(count){
    database.ref("/").update({
      playerCount: count
    })
  }

  static getPlayerInfo(){
    var playerInforef = database.ref("players");
    playerInforef.on("value",function(data){
      allPlayers = data.val();
    })
  }

  updatePlayer(){
    var playerIndex = "players/player"+this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    })
  }

  getDistance(){
    var playerDistance = "players/player"+this.index;
    database.ref(playerDistance).on("value",data=>{
      var dado = data.val();
      this.positionX = dado.positionX;
      this.positionY = dado.positionY
    })
  }

  getCarsAtEnd(){
    database.ref('CarsAtEnd').on("value",data=>{
      this.rank = data.val();
    })
  }

  static updateCarsAtEnd(rank){
    database.ref('/').update({
      CarsAtEnd: rank
    })
  }

}
