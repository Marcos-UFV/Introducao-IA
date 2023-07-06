class HelperPlot{
  constructor(w,h){
    this.width =w;
    this.height=h;
    this.#setUp();
    this.svg;
    this.line;
    this.meanLine;
    this.xScale;
    this.yScale;
  }
  #setUp(){
    const margin = {"top":10,"right":10,"bottom":40,"left":45};
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    this.xScale = d3.scaleLinear().range([0,width]);
    this.yScale = d3.scaleLinear().range([height,0]);
    this.svg = d3.select("#chart")
      .append("svg")
      .attr("width",width + margin.left + margin.right)
      .attr("height",height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);
    
    this.xScale.domain([0,0]);
    this.yScale.domain([0,0]);

    this.svg.append("g")
      .attr("class","x-axis")
      .attr("transform",`translate(0,${height})`)
      .call(d3.axisBottom(this.xScale));

    this.svg.append("g")
      .attr("class","y-axis")
      .call(d3.axisLeft(this.yScale));
    
    this.line = d3.line()
      .x(d => this.xScale(d.nGames))
      .y(d => this.yScale(d.score));

    this.meanLine = d3.line()
      .x(d => this.xScale(d.nGames))
      .y(d => this.yScale(d.meanScore));

    let tmpData =[{"score":0,"nGames":0,"meanScore":0}];
    
    this.svg.append("path")
      .datum(tmpData)
      .attr("class","line")
      .attr("fill","none")
      .attr("stroke","steelblue")
      .attr("stroke-width",1)
      .attr("d",this.line);

    this.svg.append("path")
      .datum(tmpData)
      .attr("class","mean-line")
      .attr("fill","none")
      .attr("stroke","orange")
      .attr("stoke-width",1)
      .attr("d",this.meanLine);



    this.svg.append("text")
      .attr("transform",`translate(${-margin.left*0.75},${height/2})rotate(-90)`)
      // .attr("transform","rotate(-90)")
      .text("Score");

    this.svg.append("text")
      .attr("transform",`translate(${width/2 -margin.left},${height+margin.bottom})`)
      .text("Nº Games")
  }
  update(gamesScores){
    this.xScale.domain([0,d3.max(gamesScores,d=> d.nGames)]);
    this.yScale.domain([0,d3.max(gamesScores,d=>d.score)]);
    
    this.svg.selectAll("path.line")
      .transition()
      .duration(1000)
      .attr("fill","none")
      .attr("stroke","steelblue")
      .attr("stroke-width",1)
      .attr("d",this.line(gamesScores));

    this.svg.selectAll("path.mean-line")
      .transition()
      .duration(1000)
      .attr("fill","none")
      .attr("stroke","orange")
      .attr("stroke-width",1)
      .attr("d",this.meanLine(gamesScores));

    this.svg.select("g.y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yScale));
    this.svg.select("g.x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(this.xScale));
  }
}

export const Plot = HelperPlot;