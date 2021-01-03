var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup;

var score=0;

var bullet;
var tank;


var gameOver, restart;
var  playertank,enemytank;

var playertankImg,enemytankImg;

localStorage["HighestScore"] = 0;

function preload(){



  trex_running =   loadImage("trexImg.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("Desert.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Catcher.png");
  bulletImg=loadImage("gun shot.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  back2Img=loadImage("Back2.jpg");


  playertankImg=loadImage("playerTankImg.png");
  enemytankImg=loadImage("enemyTankImg.png");
}

function setup() {
  createCanvas(1200, 500);
  
  trex = createSprite(40,40,0,0);
  
  trex.addImage("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.75;
  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.scale=1
  ground.velocityX = -4;
  /*ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);*/
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(400,450,1600,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  trex.debug = false;
  background(255);
  text("Score: "+ score, 500,50);

  if(keyDown("S") && trex.y >= 159) {
    bullet=createSprite(300,400,0,0);
    bullet.addImage("bullet",bulletImg);
    bullet.scale=0.2
    bullet.setCollider("rectangle",0,0,bullet.width,bullet.height);
    bullet.debug=false;
    bullet.velocityX=8
    bullet.lifetime=100
    

    
  }



  //console.log(trex.position);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 550){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        Back2=createSprite(600,250,0,0);
        Back2.addImage("Back2",back2Img);
        Back2.scale=1.5

       // tank.display();
    

       playertank=createSprite(300,430,0,0)
     playertank.addImage("playertank",playertankImg);
      playertank.scale=0.5;
      


      enemytank=createSprite(1000,430,0,0)
     enemytank.addImage("enemytank",enemytankImg);
     enemytank.scale=0.5;
     enemytank.setCollider("rectangle",0,0,enemytank.width,enemytank.height);
      enemytank.debug=false;

     /* if(bullet.istouching(enemytank)){
        enemytank.lifetime=0;
      }*/

    }
  }
  else if (gameState === END) {



    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
   // cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.visible=false;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(400,400,0,0);
    
    obstacle.debug = false;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,1));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
    /*  case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;*/
      default: break;
  
     
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.25;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}