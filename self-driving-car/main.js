const canvas = document.querySelector("#myCanvas");

canvas.width=200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.getLaneCenter(3),100,30,50);



animate();

function animate(){
  car.update();
  canvas.height=window.innerHeight;
  ctx.save();
  ctx.translate(0,-car.y+canvas.height*0.5);
  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate)
}