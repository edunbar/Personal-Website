// /*
//     particles.js creates the project portion of the website. 
// */

function getBall(xVal, yVal, dxVal, dyVal, rVal, colorVal) {
    var ball = {
      x: xVal,
      lastX: xVal,
      y: yVal,
      lastY: yVal,
      dx: dxVal,
      dy: dyVal,
      r: rVal,
      color: colorVal,
      normX: 0,
      normY: 0
    };
  
    return ball;
}
  
var canvas = document.getElementById("myCanvas");
  
  var ctx = canvas.getContext("2d");
  
  var containerR = 325;
  var containerInner = containerR / 1.5;
  
  canvas.width = containerR * 2;
  canvas.height = containerR * 2;

  canvas.style["border-radius"] = containerR + "px";
  
  var balls = [
    getBall(containerR, containerR * 2 - 30, 2, -2, 20, "#0095DD"),
    getBall(containerR, containerR * 2 - 50, 3, -3, 30, "#DD9500"),
    getBall(containerR, containerR * 2 - 60, -3, 4, 10, "#00DD95"),
    getBall(containerR, containerR * 2 / 5, -1.5, 3, 40, "#DD0095")
  ];
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (var i = 0; i < balls.length; i++) {
      var curBall = balls[i];
      ctx.beginPath();
      ctx.arc(curBall.x, curBall.y, curBall.r, 0, Math.PI * 2);
      ctx.fillStyle = curBall.color;
      ctx.fill();
      ctx.closePath();
      curBall.lastX = curBall.x;
      curBall.lastY = curBall.y;
      curBall.x += curBall.dx;
      curBall.y += curBall.dy;
      var dx = curBall.x - containerR;
      var dy = curBall.y - containerR;
      var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
  
      if (distanceFromCenter >= containerR - curBall.r || distanceFromCenter <= containerInner - curBall.r) {
        var normalMagnitude = distanceFromCenter;
        var normalX = dx / normalMagnitude;
        var normalY = dy / normalMagnitude;
        var tangentX = -normalY;
        var tangentY = normalX;
        var normalSpeed = -(normalX * curBall.dx + normalY * curBall.dy);
        var tangentSpeed = tangentX * curBall.dx + tangentY * curBall.dy;
        curBall.dx = normalSpeed * normalX + tangentSpeed * tangentX;
        curBall.dy = normalSpeed * normalY + tangentSpeed * tangentY;
      }

    }
    requestAnimationFrame(draw);
  }
  
  draw();
  