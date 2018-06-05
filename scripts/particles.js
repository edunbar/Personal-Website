// /*
//     particles.js creates the project portion of the website. This involves the creation of different nodes connected
//
// */

//creates each node, the position of the start and where it should be next
function getNode(xVal, yVal, dxVal, dyVal, rVal, colorVal) {
    var node = {
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

    return node;
}
  
//creates the canvas variable and creates the context for the animations
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); 

//creates the two containers, the inner circular container and the outer circular container
var containerOuter = 325;
var containerInner = containerOuter / 1.5;

//creates the height and the width of the canvas, along with the circular border
canvas.width = containerOuter * 2;
canvas.height = containerOuter * 2;
//creates the circular border with the size of the outer container, making a in px
canvas.style["border-radius"] = containerOuter + "px";

//creates the nodes that are seen moving within the cirle
var nodes = [
    getNode(containerOuter + 40, containerOuter * 2 - 30, -.6, -.4, 20, "#0095DD"),
    getNode(containerOuter * 1.5, containerOuter * 2 - 100, -.9, -.6, 30, "#DD9500"),
    getNode(containerOuter + 100, containerOuter * 2 - 600, .75, .9, 15, "#00DD95"),
    getNode(containerOuter, containerOuter * 2 / 5, .8, .9, 40, "#DD0095")
];

//function that actually creates the drawing on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //cycles through each of the nodes that were created so each one follows the same rules
    for (var i = 0; i < nodes.length; i++) {

        //finds the current and previous node that we want to select
        var currNode = nodes[i];
        if (i > 0) {
            var prevNode = nodes[i - 1];

            ctx.moveTo(currNode.x, currNode.y);
            //need to adjust lineTo to make it only hit the edges of the nodes
            ctx.lineTo(prevNode.x, prevNode.y - prevNode.r);
            ctx.stroke();
        }

        //creates the node, the size and starting position taken from the initialization of the node
        ctx.beginPath();
        ctx.arc(currNode.x, currNode.y, currNode.r, 0, Math.PI * 2);

        //colors the node
        ctx.fillStyle = currNode.color;
        ctx.fill();
        ctx.closePath();

        //stores the current position of the nod into the previous postion of the node
        currNode.lastX = currNode.x;
        currNode.lastY = currNode.y;

        //adds the direction the node is going to the current position of the node to get movement
        currNode.x += currNode.dx;
        currNode.y += currNode.dy;

        //creates variables for the direction of the coordinates along with the distance from the center of the container
        var dx = currNode.x - containerOuter;
        var dy = currNode.y - containerOuter;
        var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

        //if the distance from the outer container is greater than the position of the current node OR
        //if the distance from the inner container is less than the position of the current node THEN
        //we have to bounce the node, it hit its boundries so it needs to bounce as if it hit the edge of a circle
        if (distanceFromCenter >= containerOuter - currNode.r || distanceFromCenter <= containerInner - currNode.r) {

            //creates the variables that will be used to find the new direction the node needs to be going
            var normalMagnitude = distanceFromCenter;
            var normalX = dx / normalMagnitude;
            var normalY = dy / normalMagnitude;
            var tangentX = -normalY;
            var tangentY = normalX;
            var normalSpeed = -(normalX * currNode.dx + normalY * currNode.dy);
            var tangentSpeed = tangentX * currNode.dx + tangentY * currNode.dy;
            
            //based on the previous math, this assigns the new directions the nodes need to be traveling after impact
            currNode.dx = normalSpeed * normalX + tangentSpeed * tangentX;
            currNode.dy = normalSpeed * normalY + tangentSpeed * tangentY;
        }
    }
    //creates the animations
    requestAnimationFrame(draw);
}

//calls the function that runs the node particles
draw();
  