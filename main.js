let canvas  = document.querySelector('canvas');
let context = canvas.getContext('2d');
let ballCounterPara = document.querySelector('p');

let width   = canvas.width  = window.innerWidth;
let height  = canvas.height = window.innerHeight;

let ballCount = 0;

//function to generate random number
function random(min, max){
  let num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// Parent constructor, shape
function Shape(x, y, velX, velY, exists){
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}
//Child shape constructor, Ball
function Ball(x,y,velX, velY, exists, color, size){
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size  = size;
}

// Inheriting shape methods
Ball.prototype = Object.create(Shape.prototype);

// Set Ball's prototype's constructor to be Ball not Shape
Ball.prototype.constructor = Ball;

//Method draw, to draw a ball
Ball.prototype.draw = function(){
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y,this.size,0,2*Math.PI);
  context.fill();
};

//Method update
Ball.prototype.update = function(){
  if((this.x + this.size) >= width){
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0){
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height){
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0){
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// ball collision detection method
Ball.prototype.collisionDetect = function(){
  for(let j = 0; j<balls.length; j++){
    if(!(this === balls[j])){
      let dx = this.x - balls[j].x;
      let dy = this.y - balls[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// Defining EvilCircle()
function EvilCircle(x, y , exists){
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'white';
  this.size = 10;
}

// Inheriting shape methods 
EvilCircle.prototype = Object.create(Shape.prototype);

//Setting EvilCircle prototype's constructor
EvilCircle.prototype.constructor = EvilCircle;
//EvilCircle method draw()
EvilCircle.prototype.draw = function(){
  context.beginPath();
  context.lineWidth=3;
  context.strokeStyle = this.color;
  context.arc(this.x, this.y, this.size, 0, 2*Math.PI);
  context.stroke();
};

// EvilCircle method update()
EvilCircle.prototype.checkBounds = function(){
  if((this.x + this.size) >= width){
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0){
    this.x += this.size;
  }

  if((this.y + this.size) >= height){
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0){
    this.y += this.size;
  }
};

// EvilCircle method setControls()
EvilCircle.prototype.setControls = function (){
  let _this = this;
  // key codes 
    /*
    a => 65
    d => 68 
    s => 83
    w => 87
    */
  window.onkeydown = function(e){
    if(e.keyCode === 65){
      _this.x -= _this.velX;
    }else if(e.keyCode === 68){
      _this.x += _this.velX;
    }else if(e.keyCode ===87 ){
      _this.y -= _this.velY;
    }else if(e.keyCode === 83){
      _this.y += _this.velY;
    }
  }
}

// EvilCircle collision detection method
EvilCircle.prototype.collisionDetect = function(){
  for(let k = 0; k<balls.length; k++){
    if(balls[k].exists){
      let dx = this.x - balls[k].x;
      let dy = this.y - balls[k].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[k].size) {
        balls[k].exists = false;
        ballCount--;
        ballCounterPara.textContent = 'Ball count: ' + ballCount;
      }
    }
  }
};


// Array to store balls
let balls = [];

// Create new evil circle object instance
let evilCircle = new EvilCircle(random(0,width), random(0,height),true);
evilCircle.setControls();

// a loop to set canvas, create new instance of Ball and run // the function again using requestAnimationFrame() method
function loop(){
  context.fillStyle = 'rgba(0,0,0,0.25)';
  context.fillRect(0,0, width,height);

  while(balls.length < 27){
    let size = random(20,30);
    let ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the adge of the canvas, to avoid drawing errors
      random(0 + size, width - size), 
      random(0 + size, height - size),
      random(-2,5),
      random(-3,5),
      true,
      'rgb('+random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')', 
      size
    );
    balls.push(ball);
    ballCount++;
    ballCounterPara.textContent = 'Ball count: ' + ballCount;
  }

  //Call ball's methods only if it exists
    for(let i = 0; i < balls.length; i++){
      if(balls[i].exists){
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }

    // Call evil circle methods, draw(), checkBounds(), and collisionDetect()
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    requestAnimationFrame(loop);
}
loop();
