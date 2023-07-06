export class Info{
  constructor(){
    this.nGames=document.querySelector("#nGames");
    this.score=document.querySelector("#score");
    this.record=document.querySelector("#record");
    this.meanScore=document.querySelector("#mean-score");
  }

  updateScore(newScore){
    this.score.innerText=newScore;    
    
    if(newScore > this.record.innerText){
      this.score.classList.add('red-color');
    }else{
      this.score.classList.remove('red-color')
    }
  }
  updateNGamesAndRecord(nGames,record,meanScore){
    this.nGames.innerText=nGames;
    this.record.innerText=record;
    this.meanScore.innerText=meanScore.toFixed(2);
  }
}