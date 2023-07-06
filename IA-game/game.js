const Direction = {
  'RIGHT':1,
  'LEFT':2,
  'UP':3,
  'DOWN':4
}
const BLOCK_SIZE = 20;
class SnakeGameIA{
  
  constructor(width,height){
    this.stage = document.querySelector("#stage");
    this.stage.width = width;
    this.stage.height= height;
    this.ctx = this.stage.getContext("2d");  
    this.w = width;
    this.h = height;

    // Init display
    // document.onkeydown = this.keyPush.bind(this);
    

    this.reset();

   
  }

  reset(){
    // Init game state
    this.direction = [Direction.RIGHT,Direction.LEFT][Math.floor(Math.random()*2)];
    
    this.head = {x:this.w/2,y:this.h/2}
    this.snake = [this.head,{x:this.head.x-BLOCK_SIZE,y:this.head.y},{x:this.head.x-(2*BLOCK_SIZE),y:this.head.y}];
    this.score = 0;
    this.gameOver = false;
    this.food = null;
    this.#placeFood();
    this.frameIteration = 0;
  }
  #updateUI(){
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0,0,this.w,this.h);
    
    for(const pt of this.snake){
      this.ctx.fillStyle = "#0000FF";
      this.ctx.fillRect(pt.x,pt.y,BLOCK_SIZE,BLOCK_SIZE);
      this.ctx.fillStyle = "#0064FF";
      this.ctx.fillRect(pt.x+4,pt.y+4,12,12);
    }
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(this.food.x,this.food.y,BLOCK_SIZE,BLOCK_SIZE);
  }
  #placeFood(){
    let x = Math.floor((Math.random()*((this.w - BLOCK_SIZE)/BLOCK_SIZE)))*BLOCK_SIZE;
    let y = Math.floor((Math.random()*((this.h - BLOCK_SIZE)/BLOCK_SIZE)))*BLOCK_SIZE;
    this.food = {x:x,y:y};
    for(let i= 0; i < this.snake.length;i++){
      if(this.food.x == this.snake[i].x && this.food.y == this.snake[i].y) this.#placeFood();
    }
  }
  playStep(action) {
    this.frameIteration +=1;
    // console.log(this.snake.splice(1));
    // 1.collect user input
    
    // 2. move
    this.#move(action); // update the head
    this.snake.unshift(this.head);
   
    // 3. check if game over
    let reward = 0;
    if(this.isCollision() || this.frameIteration > 64*this.snake.length){
      this.gameOver = true;
      reward = -10;
      return [this.gameOver,this.score,reward];
    }
    // 4. place new food or just move
    if(this.head.x == this.food.x && this.head.y == this.food.y){
      this.score += 1;
      reward = 10;
      this.#placeFood();
    }else{
      this.snake.pop();
    }
    // 5. update ui
    this.#updateUI();
    // 6. return game over and score
    
    return [this.gameOver,this.score,reward];
  }
  isCollision(pt=null){
    if(pt == null) pt =this.head;
    // hits boundary
    if(pt.x > this.w - BLOCK_SIZE || pt.x < 0 || pt.y > this.h - BLOCK_SIZE || pt.y < 0) 
      return true;
    // hits itself
    // if(this.head in this.snake.splice(1)){
    //   return true;
    // }
    let colision = false;
    for(let i=1; i < this.snake.length; i++){
      colision = (pt.x == this.snake[i].x && pt.y == this.snake[i].y);
      if(colision) break; 
    }

    return false || colision;
  }
  #move(action){
    // [straight,right,left]

    let clockWise =[Direction.RIGHT, Direction.DOWN,Direction.LEFT,Direction.UP];
    let idx = clockWise.indexOf(this.direction);
    let newDir = null;
    if([1,0,0].every((e,i)=> e == action[i])){
      newDir = clockWise[idx]; // No change
    }else if([0,1,0].every((e,i)=> e == action[i])){      
      let nextIndex = this.#remainder(idx + 1,4);
      newDir = clockWise[nextIndex]; // right turn r -> d -> l -> u
    }else{ // [0,0,1]
      let nextIndex = this.#remainder(idx - 1,4);
      newDir = clockWise[nextIndex]; // left turn r -> u -> l -> d
    }
    this.direction = newDir;
  
    let x = this.head.x;
    let y = this.head.y;

    switch (this.direction) {
      case Direction.LEFT:
        x -= BLOCK_SIZE;
        break;
      case Direction.UP:
        y -= BLOCK_SIZE;
        break;
      case Direction.RIGHT:
        x += BLOCK_SIZE;
        break;
      case Direction.DOWN:
        y += BLOCK_SIZE;
        break;
    }
    this.head = {x:x,y:y};
  }
  #remainder(x,r){
    return (x - Math.floor((x)/r)*r);
  }
  keyPush(e){
    switch (e.keyCode) {
      case 37:
        this.direction = Direction.LEFT;
        break;
      case 38:
        this.direction = Direction.UP;
        break;
      case 39:
        this.direction = Direction.RIGHT;
        break;
      case 40:
        this.direction = Direction.DOWN;
        break;
    }
  }
  
}
export const SnakeGame = SnakeGameIA;
export default Direction;

