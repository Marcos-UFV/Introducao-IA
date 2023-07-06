import {SnakeGame} from "./game.js";
import { Plot } from "./helper.js";
import { Info } from "./info.js";
import { Agent } from "./agent.js";

const train = ()=>{
  let plotScore = [];
  let totalScore = 0;
  let record = 0;
  const agent = new Agent();

  // const game = new SnakeGame(320,240);
  const game = new SnakeGame(640,480);

  const plot = new Plot(450,300);

  const info = new Info();
  setInterval(()=>{
    // get old state
    let stateOld = agent.getState(game);
    // get move    
    let [finalMove,act] = agent.getAction(stateOld,game);      

    // perform move and get new state
    let [done,score,reward] = game.playStep(finalMove);

    let stateNew = agent.getState(game);
    // update table
    agent.updateQTable(stateOld,stateNew,reward,act);
    // Update info table
    info.updateScore(score);
    
    if(done){
      game.reset();
      agent.nGames += 1;

      if(score > record){
        record = score;
      }

      if(agent.nGames % 50 == 0){
        localStorage.qTable = JSON.stringify(agent.qTable,null,2)
      }
      //plot
      totalScore += score;
      let meanScore = totalScore/agent.nGames;
      plotScore.push({"score":score,"nGames":agent.nGames,"meanScore":meanScore});      
      plot.update(plotScore);
      info.updateNGamesAndRecord(agent.nGames,record,meanScore);
    }

  },60) // 60
}

window.onload = ()=>{
  train();
}