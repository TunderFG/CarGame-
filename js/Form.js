class Form {
    constructor(){
        this.input = createInput("").attribute("placeholder","Digite o seu Nome:");
        this.playbutton = createButton("Jogar");
        this.titleimg = createImg("./assets/TITULO.png");
        this.mensagem = createElement("h2");
    }

    setElementsPosition(){
        this.titleimg.position(120,50);
        this.input.position(width/2-110,height/2-80);
        this.playbutton.position(width/2-90,height/2-20)
        this.mensagem.position(width/2-300,height/2-100)
    }

    setElementsStyle(){
        this.titleimg.class("gameTitle");
        this.input.class("customInput");
        this.playbutton.class("customButton");
        this.mensagem.class("greeting");
    }

    handlemousePressed(){
        this.playbutton.mousePressed(()=>{
            this.playbutton.hide();
            this.input.hide();
            var nome = this.input.value();
            var msg = `Olá,${nome} </br> Espere outro jogador entrar...`
            this.mensagem.html(msg);
            playerCount = playerCount +1;
            player.name = this.input.value();
            player.index = playerCount;
            player.addPlayer();
            player.updateCount(playerCount);
            player.getDistance();
        })
    }

    display(){
        this.setElementsPosition();
        this.setElementsStyle();
        this.handlemousePressed();

    }

    hideElements(){
        this.mensagem.hide();
        this.playbutton.hide();
        this.input.hide();
        this.titleimg.position(40,50);
        this.titleimg.class("gameTitleAfterEffect")
    }
}
