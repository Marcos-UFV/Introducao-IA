import Direction from "./game.js";
class AgentIA{
  constructor(){
    this.nGames = 0;
    this.epsilon = 1.0; // Control randomness
    this.epsDescont = 0.9992;
    this.minEpsilon = 0.001;
    this.gamma = 0.85; //discount rate
    this.learningRate = 0.80;
    this.qTable= this.#initQTable();
  }
  #initQTable(){
    if(localStorage.qTable){
      return JSON.parse(localStorage.qTable);
    }
    return {};
  }
  getState(game){
    let head = game.snake[0];
    
    let point_l = {x:head.x - 20,y:head.y};
    let point_r = {x:head.x + 20,y:head.y};
    let point_u = {x:head.x,y:head.y - 20};
    let point_d = {x:head.x,y:head.y + 20};

    let dir_l = game.direction == Direction.LEFT;
    let dir_r = game.direction == Direction.RIGHT;
    let dir_u = game.direction == Direction.UP;
    let dir_d = game.direction == Direction.DOWN;
    
    
    let state = [
      //Danger straight
      (dir_r && game.isCollision(point_r)) ||
      (dir_l && game.isCollision(point_l)) ||
      (dir_u && game.isCollision(point_u)) ||
      (dir_d && game.isCollision(point_d)),

      // Danger right
      (dir_u && game.isCollision(point_r)) ||
      (dir_d && game.isCollision(point_l)) ||
      (dir_l && game.isCollision(point_u)) ||
      (dir_r && game.isCollision(point_d)),

      // Danger left
      (dir_d && game.isCollision(point_r)) ||
      (dir_u && game.isCollision(point_l)) ||
      (dir_r && game.isCollision(point_u)) ||
      (dir_l && game.isCollision(point_d)),

      // Move direction
      dir_l,
      dir_r,
      dir_u,
      dir_d,

      // Food location
      game.food.x < game.head.x, // Food left
      game.food.x > game.head.x, // Food right
      game.food.y < game.head.y, // Food up
      game.food.y > game.head.y // Food down

    ]
    return ""+state.map(v => v?1:0);
  }
  getAction(state,game){
    const availableActions =['up','down','left','right'];
    let dir_l = game.direction == Direction.LEFT;
    let dir_r = game.direction == Direction.RIGHT;
    let dir_u = game.direction == Direction.UP;
    let dir_d = game.direction == Direction.DOWN;
    const currentDirection = [dir_l,dir_r,dir_u,dir_d]; //left, right, up, down

    let q = this.getTable(state);
    this.epsilon = Math.max(this.epsilon*this.epsDescont,this.minEpsilon);

    
    let move =[0,0,0];
    
    if(Math.random() < this.epsilon){
      let pos = Math.floor(Math.random()*3 + 0);

      move[pos] = 1;
      let act;
      if([1,0,0].every((e,i)=> move[i] == e)){
        act=currentDirection[2]?availableActions[0]:availableActions[1];
        
      }else if([0,1,0].every((e,i)=> move[i]==e)){
        act = availableActions[2];
      }else{
        act = availableActions[1];
      }
      return [move,act];
    }

    let maxValue = q[availableActions[0]];
    let choseAction = availableActions[0];
    let actionsZero = [];
    for(let i = 0; i < availableActions.length; i++) {
      if(q[availableActions[i]] == 0) actionsZero.push(availableActions[i]);
      if(q[availableActions[i]] > maxValue){
        maxValue = q[availableActions[i]];
        choseAction = availableActions[i];
      }
    }
    
    if(maxValue == 0){
      let random = Math.floor(Math.random() * actionsZero.length);
      
      choseAction = actionsZero[random];
    }
    
    
    let vet = [(choseAction=='left' && currentDirection[0]),(choseAction =='right' && currentDirection[1]),(choseAction =='up' && currentDirection[2]),(choseAction =='down' && currentDirection[3])];
    let idx = availableActions.indexOf(choseAction);
    let rightTurn = ((currentDirection[0] && (choseAction == 'up')) || (currentDirection[1] && (choseAction == 'down')) || currentDirection[2] && (choseAction == 'right') || currentDirection[3] && (choseAction == 'right'));
    let streight = vet.some(e => e == true);
    if(streight){
      move[0] = 1;
    }else if(rightTurn){
      move[1] = 1; //[0,1,0] right turn
    }else{
      move[2] = 1; //[0,0,1] left turn
    }
    return [move,choseAction];
  }

  getTable(state){
    if(!this.qTable[state]){
      this.qTable[state] = {"up":0,"down":0,"left":0,"right":0};
    }
    return this.qTable[state];
  }
  updateQTable(state0,state1,reward,act){
    var q0 = this.getTable(state0);
    var q1 = this.getTable(state1);
    var newValue = reward + this.gamma * Math.max(q1.up, q1.down, q1.left, q1.right) - q0[act];
    this.qTable[state0][act] = q0[act] + this.learningRate * newValue;
  }
}

export const Agent = AgentIA;  