var trex, trex_running, edges;
var groundImage;
var solo;
var solo_invisivel;
var cloudImage, obstacleImage1, obstacleImage2,obstacleImage3,obstacleImage4,obstacleImage5,obstacleImage6;
var score = 0;
var gameState = "play";
var obstacleGroup;
var cloudsGroup;
var trexCollided;
var restart, restartImage, gameOver, gameOverImage;
var checkPoint, die, jump;
var flag = true;
var mensagem = "Isso é uma mensagem";

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");
  trexCollided = loadAnimation("trex_collided.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  checkPoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criando o solo
  solo = createSprite(windowWidth/2, windowHeight-10, windowWidth, 20);
  solo.addImage(groundImage);
  solo.velocityX = -(3+score/10);

  //criando o trex
  trex = createSprite(50,windowHeight-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("colisao", trexCollided);
  trex.scale = 0.5;
  trex.x = 50;
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,110,trex.height);

  restart = createSprite(windowWidth/2,windowHeight/2-20);
  restart.addImage(restartImage);
  restart.scale = 0.6;
  restart.visible = false;

  gameOver = createSprite(windowWidth/2,windowHeight/2+30);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.6;
  gameOver.visible =  false;

  solo_invisivel = createSprite(windowWidth/2,windowHeight+4,windowWidth,20);
  solo_invisivel.visible = false;

  var rand = Math.round (random(10,100));
  console.log(rand)

  obstacleGroup = new Group();

  cloudsGroup = new Group();

}


function draw(){
  //definir a cor do plano de fundo 
  background("white");

  //gravidade do trex
  trex.velocityY = trex.velocityY + 0.5;

  if(gameState == "play"){
    score = score+ getFrameRate()/1400;
    //pular quando tecla de espaço for pressionada
    if(touches.length>0 ||keyDown("space") && trex.y > 169){
      trex.velocityY = -10;
      jump.play();
      touches=[];
    }
    spawnClouds();
    spawnObstacles();
    if(trex.isTouching(obstacleGroup)){
      gameState = "end";
      die.play();
      //trex.velocityY = -10;
    }
    if(score%3 == 0 && score > 0 && flag ){
      checkPoint.play();
      flag = false;
    }
    if(score%3 == 2 && score > 0 ){
      flag =  true;

    }
    
    solo.velocityX = -(3+score/10);
  }
  else if(gameState == "end"){
   trex.velocityX = 0;
   solo.velocityX = 0;
   cloudsGroup.setVelocityXEach(0);
   obstacleGroup.setVelocityXEach(0);
   cloudsGroup.setLifetimeEach(-1);
   obstacleGroup.setLifetimeEach(-1);
   trex.changeAnimation("colisao", trexCollided);
   restart.visible = true;
   gameOver.visible = true;
   if(mousePressedOver(restart)){
    console.log("Reiniciar jogo");
    reset();
   }

   console.log(gameState);
  }

  text("Pontos: "+Math.round (score),20,20);
  
  //registrando a posição y do trex
  //console.log(trex.y)
  
  //impedir que o trex caia
  trex.collide(solo_invisivel);
  drawSprites();

  if(solo.x < 0){
    solo.x = solo.width/2;
  }
  console.log(getFrameRate());
}

function spawnClouds(){
  if(frameCount%60 == 0){
    var cloud;
    cloud = createSprite(windowWidth,windowHeight/2,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round (random(windowHeight/20,windowHeight/2));
    cloud.velocityX = -3;
    cloud.scale = 0.7;
    cloud.lifetime = windowWidth/3;
    cloud.depth = trex.depth;
    trex.depth = trex.depth +1;
    cloudsGroup.add(cloud);
    cloud.depth = restart.depth;
    restart.depth = restart.depth +1;
  }
  
}

function spawnObstacles(){
  if(frameCount%100 == 0){
    var obstacle;
    obstacle = createSprite(windowWidth,windowHeight-30,40,10);
    obstacle.addImage(obstacleImage1);
    obstacle.velocityX = -(3 + score/10);
    obstacle.scale = 0.7;
    obstacle.lifetime = windowWidth/obstacle.velocityX;
    obstacleGroup.add(obstacle);
  }
  
}

function reset(){
  gameState="play";
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible=false;
  restart.visible=false;
  trex.changeAnimation("running", trex_running);
  score=0;
}