// /*
//     particles.js creates the project portion of the website. This involves the creation of different nodes connected
//
// */











// window.addEventListener('load', function(){

//     // change this section
//     var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//     var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//     height = height / 5;

//     var mainCanvas = document.createElement("canvas");
//     var hiddenCanvas = document.createElement("canvas");

//     var data = [];

//     // A dictionary to lookup nodes by color used in the hidden canvas.
//     // Note: if you use this code somewhere else, remember that you may need
//     // to clean up references to objects stored here if the objects are otherwised
//     // removed/deleted from your vis.
//     var colToNode = {};

//     mainCanvas.setAttribute('width',  width);
//     mainCanvas.setAttribute('height', height);
//     mainCanvas.style.background = "white";
//     hiddenCanvas.setAttribute('width', width);
//     hiddenCanvas.setAttribute('height', height);
//     hiddenCanvas.style.display = 'none';

//     var container = document.getElementById("secondary");
//     container.appendChild(mainCanvas);
//     container.appendChild(hiddenCanvas); // Include this to see the hidden canvas.


//     var controls = {
//         count:100,
//         showHiddenCanvas: false,
//         animateHiddenCanvas: false,
//     };


//     /*
//     Generate the data.
//    */
//     function makeData(count) {
//         data = [];
//         for(var i = 0; i < count; i++) {
//             var w = 10 + Math.random() * 20;
//             var obj = {
//                 x: Math.random() * (width - 20),
//                 y: Math.random() * (height - 20),
//                 xVel: (Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
//                 yVel: (Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
//                 width: w,
//                 height: w,
//                 index: i
//             };
//         data.push(obj);
//         }
//         return data;
//     }

//     /*
//     Updates the nodes on each frame to make them bounce around the screen.
//    */
//     function update(data) {
//         var numElements = data.length;
//         for(var i = 0; i < numElements; i++) {
//             var node = data[i];
//             node.x += node.xVel;
//             node.y += node.yVel;

//             if(node.x > width || node.x < 0) {
//                 node.xVel *= -1;
//             }
//             if(node.y > height || node.y < 0) {
//                 node.yVel *= -1;
//             }
//         }
//     }

//     function shuffle(data) {
//         var numElements = data.length;
//         for(var i = 0; i < numElements; i++) {
//             node.x = Math.random * width;
//             node.y = Math.random * width;
//         }
//     }


//     /*
//     Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
//    */
//     var nextCol = 1;
//     function genColor(){
//         var ret = [];
//         // via http://stackoverflow.com/a/15804183
//         if(nextCol < 16777215){
//             ret.push(nextCol & 0xff); // R
//             ret.push((nextCol & 0xff00) >> 8); // G 
//             ret.push((nextCol & 0xff0000) >> 16); // B

//             nextCol += 100; // This is exagerated for this example and would ordinarily be 1.
//         }
//         var col = "rgb(" + ret.join(',') + ")";
//         return col;
//     }

//     function draw(data, canvas, hidden) {
//         var ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, width, height);
    
//         var numElements = data.length;
//         for(var i = 0; i < numElements; i++) {
//             var node = data[i];
    
//             if(node.renderCol) {
//                 // Render clicked nodes in the color of their corresponding node
//                 // on the hidden canvas.
//                 ctx.fillStyle = node.renderCol;
//             } else {
//                 ctx.fillStyle = 'RGBA(105, 105, 105, 0.8)';
//             }
    
//             if(hidden) {
//                 if(node.__pickColor === undefined) {
//                     // If we have never drawn the node to the hidden canvas get a new
//                     // color for it and put it in the dictionary.
//                     node.__pickColor = genColor();
//                     colToNode[node.__pickColor] = node;
//                 }
//                 // On the hidden canvas each rectangle gets a unique color.
//                 ctx.fillStyle = node.__pickColor;
//             }
    
//           drawMark(ctx, node);
//         }
//     }


//     function drawMark(ctx, node) {
//         // Draw the actual rectangle
//         // ctx.fillRect(node.x, node.y, node.width, node.height);
//         ctx.fillRect(node.x, node.y, node.width, node.height);
//     }


//     // Listen for clicks on the main canvas
//     mainCanvas.addEventListener("click", function(e){
//         console.log("entered");
//         draw(data, hiddenCanvas, true);
//         var mouseX = e.layerX;
//         var mouseY = e.layerY;

//         // Get the corresponding pixel color on the hidden canvas
//         // and look up the node in our map.
//         var ctx = hiddenCanvas.getContext("2d");
//         var col = ctx.getImageData(mouseX, mouseY, 1, 1).data;
//         var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";

//         var node = colToNode[colString];
//         if(node) {
//             node.renderCol = node.__pickColor;
//             controls.lastClickedIndex = node.index;
//             console.log("Clicked on node with index:", node.index, node);  
//         }
//     });

//     // Generate the data and start the draw loop.

//     data = makeData(100); // Increase this number to get more boxes
//     function animate() {
//         draw(data, mainCanvas);
//         if(controls.animateHiddenCanvas){
//             draw(data, hiddenCanvas, true);  
//         }
//         update(data);
//         window.requestAnimationFrame(animate);
//     }

//     window.requestAnimationFrame(animate);


// }, false);










//creates each node, the position of the start and where it should be next
// function getNode(xVal, yVal, dxVal, dyVal, rVal, colorVal) {
//     var node = {
//         x: xVal,
//         lastX: xVal,
//         y: yVal,
//         lastY: yVal,
//         dx: dxVal,
//         dy: dyVal,
//         r: rVal,
//         color: colorVal,
//         normX: 0,
//         normY: 0,
//         clicked: false
//     };

//     return node;
// }

// var colToNode = {};
  
// //creates the canvas variable and creates the context for the animations
// var canvas = document.getElementById("myCanvas");
// var hiddenCanvas = document.getElementById("myHiddenCanvas");
// var ctx = canvas.getContext("2d"); 

// //creates the two containers, the inner circular container and the outer circular container
// var containerOuter = 325;
// var containerInner = containerOuter / 1.5;

// //creates the height and the width of the canvas, along with the circular border
// canvas.width = containerOuter * 2;
// canvas.height = containerOuter * 2;

// hiddenCanvas.width = containerOuter * 2;
// hiddenCanvas.height = containerOuter * 2;
// hiddenCanvas.style.display = 'none'; //hide the second one.

// //creates the circular border with the size of the outer container, making a in px
// canvas.style["border-radius"] = containerOuter + "px";


// //creates the nodes that are seen moving within the cirle
// var nodes = [
//     getNode(containerOuter + 40, containerOuter * 2 - 30, -.6, -.4, 20, "#0095DD"),
//     getNode(containerOuter * 1.5, containerOuter * 2 - 100, -.9, -.6, 30, "#DD9500"),
//     getNode(containerOuter + 100, containerOuter * 2 - 600, .75, .9, 15, "#00DD95"),
//     getNode(containerOuter, containerOuter * 2 / 5, .8, .9, 40, "#DD0095")
// ];


// //function that actually creates the drawing on the canvas
// function draw(hidden) {

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     //cycles through each of the nodes that were created so each one follows the same rules
//     for (var i = 0; i < nodes.length; i++) {
        


//         //finds the current and previous node that we want to select
//         var currNode = nodes[i];
//         if (i > 0) {
//             var prevNode = nodes[i - 1];

//             ctx.moveTo(currNode.x, currNode.y);
//             //need to adjust lineTo to make it only hit the edges of the nodes
//             ctx.lineTo(prevNode.x, prevNode.y - prevNode.r);
//             ctx.strokeStyle = "grey";
//             ctx.stroke();
//         }

//         //creates the node, the size and starting position taken from the initialization of the node
//         ctx.beginPath();
//         ctx.arc(currNode.x, currNode.y, currNode.r, 0, Math.PI * 2);

//         //colors the node
//         ctx.fillStyle = currNode.color;
//         ctx.fill();
//         ctx.closePath();

//         //stores the current position of the nod into the previous postion of the node
//         currNode.lastX = currNode.x;
//         currNode.lastY = currNode.y;

//         //adds the direction the node is going to the current position of the node to get movement
//         currNode.x += currNode.dx;
//         currNode.y += currNode.dy;

//         //creates variables for the direction of the coordinates along with the distance from the center of the container
//         var dx = currNode.x - containerOuter;
//         var dy = currNode.y - containerOuter;
//         var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

//         //if the distance from the outer container is greater than the position of the current node OR
//         //if the distance from the inner container is less than the position of the current node THEN
//         //we have to bounce the node, it hit its boundries so it needs to bounce as if it hit the edge of a circle
//         if (distanceFromCenter >= containerOuter - currNode.r || distanceFromCenter <= containerInner - currNode.r) {

//             //creates the variables that will be used to find the new direction the node needs to be going
//             var normalMagnitude = distanceFromCenter;
//             var normalX = dx / normalMagnitude;
//             var normalY = dy / normalMagnitude;
//             var tangentX = -normalY;
//             var tangentY = normalX;
//             var normalSpeed = -(normalX * currNode.dx + normalY * currNode.dy);
//             var tangentSpeed = tangentX * currNode.dx + tangentY * currNode.dy;
            
//             //based on the previous math, this assigns the new directions the nodes need to be traveling after impact
//             currNode.dx = normalSpeed * normalX + tangentSpeed * tangentX;
//             currNode.dy = normalSpeed * normalY + tangentSpeed * tangentY;
//         }
//     }
//     //creates the animations
//     requestAnimationFrame(draw);
// }


// //adds an even listener for mouse movements
// //canvas.addEventListener('click', hoverEffect);


// //calls the function that runs the node particles
// draw(hiddenCanvas, false);
  