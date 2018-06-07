// /*
//     particles.js creates the project portion of the website. This involves the creation of different nodes connected
//
// */

//https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js

// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(x, y, w, h, fill) {
    // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    // But we aren't checking anything else! We could put "Lalala" for the value of x 
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#AAAAAA';
  }
  
  // Draws this shape to a given context
  Shape.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  
  // Determine if a point is inside the shape's bounds
  Shape.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
  }
  
  function CanvasState(canvas) {
    // **** First some setup! ****
    
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
      this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
      this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
      this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
      this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;
  
    // **** Keep track of state! ****
    
    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    
    // **** Then events! ****
    
    // This is an example of a closure!
    // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;

    function draw() {

    
    var shapes = myState.shapes;
    //cycles through each of the nodes that were created so each one follows the same rules
    for (var i = 0; i < shapes.length; i++) {

        //finds the current and previous node that we want to select
        var currNode = shapes[i];
    
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
        requestAnimationFrame(draw);
    }
}

    
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
      var mouse = myState.getMouse(e);
      var mx = mouse.x;
      var my = mouse.y;
      var shapes = myState.shapes;
      var l = shapes.length;
      for (var i = l-1; i >= 0; i--) {
        if (shapes[i].contains(mx, my)) {
          var mySel = shapes[i];
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)
          myState.dragoffx = mx - mySel.x;
          myState.dragoffy = my - mySel.y;
          myState.dragging = true;
          myState.selection = mySel;
          myState.valid = false;
          return;
        }
      }
      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (myState.selection) {
        myState.selection = null;
        myState.valid = false; // Need to clear the old selection border
      }
    }, true);
    canvas.addEventListener('mousemove', function(e) {
      if (myState.dragging){
        var mouse = myState.getMouse(e);
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        myState.selection.x = mouse.x - myState.dragoffx;
        myState.selection.y = mouse.y - myState.dragoffy;   
        myState.valid = false; // Something's dragging so we must redraw
      }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
      myState.dragging = false;
    }, true);
    // double click for making new shapes
    canvas.addEventListener('dblclick', function(e) {
      var mouse = myState.getMouse(e);
      myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
    }, true);
    
    // **** Options! ****
    
    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;  
    this.interval = 30;
    setInterval(function() { myState.draw(); }, myState.interval);
  }
  
  CanvasState.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
  }
  
  CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  // While draw is called as often as the INTERVAL variable demands,
  // It only ever does something if the canvas gets invalidated by our code
  CanvasState.prototype.draw = function() {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
      var ctx = this.ctx;
      var shapes = this.shapes;
      this.clear();
      
      // ** Add stuff you want drawn in the background all the time here **
      
      // draw all shapes
      var l = shapes.length;
      for (var i = 0; i < l; i++) {
        var shape = shapes[i];
        // We can skip the drawing of elements that have moved off the screen:
        if (shape.x > this.width || shape.y > this.height ||
            shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
        shapes[i].draw(ctx);
      }
      
      // draw selection
      // right now this is just a stroke along the edge of the selected Shape
      if (this.selection != null) {
        ctx.strokeStyle = this.selectionColor;
        ctx.lineWidth = this.selectionWidth;
        var mySel = this.selection;
        ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
      }
      
      // ** Add stuff you want drawn on top all the time here **
      
      this.valid = true;
    }
  }
  
  
  // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
  // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
  CanvasState.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
  
    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  }
  
  // If you dont want to use <body onLoad='init()'>
  // You could uncomment this init() reference and place the script reference inside the body tag
  init();
  
  function init() {
    var s = new CanvasState(document.getElementById('myCanvas'));
    s.addShape(new Shape(40,40,50,50)); // The default is gray
    s.addShape(new Shape(60,140,40,60, 'lightskyblue'));
    // Lets make some partially transparent
    s.addShape(new Shape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
    s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));
    
  }
  
  // Now go make something amazing!



// function Node(xVal, yVal, dxVal, dyVal, rVal, colorVal) {
//     // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
//     // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
//     // But we aren't checking anything else! We could put "Lalala" for the value of x 
//     this.x = xVal || 0;
//     this.y = yVal || 0;
//     this.lastX = xVal || 0;
//     this.lastY = yVal || 0;
//     this.r = rVal || 0;
//     this.dx = dxVal || 0;
//     this.dy = dyVal || 0;
//     this.normX = 0;
//     this.normY = 0;
//     this.fill = colorVal || '#AAAAAA';
// }

// // Draws this Node to a given context
// Node.prototype.draw = function(ctx) {
//     //creates the node, the size and starting position taken from the initialization of the node
//     ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

//     //colors the node
//     ctx.fillStyle = currNode.color;
//     ctx.fill();
// }

// // Determine if a point is inside the Node's bounds
// Node.prototype.contains = function(mx, my) {
//     // All we have to do is make sure the Mouse X,Y fall in the area between
//     // the Node's X and (X + Width) and its Y and (Y + Height)
//     return  (this.x <= mx) && (this.x + this.w >= mx) &&
//             (this.y <= my) && (this.y + this.h >= my);
// }

// function CanvasState(canvas) {
//     // **** First some setup! ****
    
//     this.canvas = canvas;
//     this.width = canvas.width;
//     this.height = canvas.height;
//     this.ctx = canvas.getContext('2d');
//     // This complicates things a little but but fixes mouse co-ordinate problems
//     // when there's a border or padding. See getMouse for more detail
//     var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
//     if (document.defaultView && document.defaultView.getComputedStyle) {
//         this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
//         this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
//         this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
//         this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
//     }
//     // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
//     // They will mess up mouse coordinates and this fixes that
//     var html = document.body.parentNode;
//     this.htmlTop = html.offsetTop;
//     this.htmlLeft = html.offsetLeft;

//     // **** Keep track of state! ****
    
//     this.valid = false; // when set to false, the canvas will redraw everything
//     this.shapes = [];  // the collection of things to be drawn
//     this.dragging = false; // Keep track of when we are dragging
//     // the current selected object. In the future we could turn this into an array for multiple selection
//     this.selection = null;
//     this.dragoffx = 0; // See mousedown and mousemove events for explanation
//     this.dragoffy = 0;
    
//     // **** Then events! ****
    
//     // This is an example of a closure!
//     // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
//     // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
//     // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
//     // This is our reference!
//     var myState = this;
    
//     //fixes a problem where double clicking causes text to get selected on the canvas
//     canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
//     // Up, down, and move are for dragging
//     canvas.addEventListener('mousedown', function(e) {
//     var mouse = myState.getMouse(e);
//     var mx = mouse.x;
//     var my = mouse.y;
//     var shapes = myState.shapes;
//     var l = shapes.length;
//     for (var i = l-1; i >= 0; i--) {
//         if (shapes[i].contains(mx, my)) {
//         var mySel = shapes[i];
//         // Keep track of where in the object we clicked
//         // so we can move it smoothly (see mousemove)
//         myState.dragoffx = mx - mySel.x;
//         myState.dragoffy = my - mySel.y;
//         myState.dragging = true;
//         myState.selection = mySel;
//         myState.valid = false;
//         return;
//         }
//     }
//     // havent returned means we have failed to select anything.
//     // If there was an object selected, we deselect it
//     if (myState.selection) {
//         myState.selection = null;
//         myState.valid = false; // Need to clear the old selection border
//     }
//     }, true);
//     canvas.addEventListener('mousemove', function(e) {
//     if (myState.dragging){
//         var mouse = myState.getMouse(e);
//         // We don't want to drag the object by its top-left corner, we want to drag it
//         // from where we clicked. Thats why we saved the offset and use it here
//         myState.selection.x = mouse.x - myState.dragoffx;
//         myState.selection.y = mouse.y - myState.dragoffy;   
//         myState.valid = false; // Something's dragging so we must redraw
//     }
//     }, true);
//     canvas.addEventListener('mouseup', function(e) {
//     myState.dragging = false;
//     }, true);
//     // double click for making new shapes
//     canvas.addEventListener('dblclick', function(e) {
//     var mouse = myState.getMouse(e);
//     myState.addNode(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
//     }, true);
    
//     // **** Options! ****
    
//     this.selectionColor = '#CC0000';
//     this.selectionWidth = 2;  
//     this.interval = 30;
//     setInterval(function() { myState.draw(); }, myState.interval);
// }

// CanvasState.prototype.addNode = function(shape) {
//     this.shapes.push(shape);
//     this.valid = false;
// }

// CanvasState.prototype.clear = function() {
//     this.ctx.clearRect(0, 0, this.width, this.height);
// }

// // While draw is called as often as the INTERVAL variable demands,
// // It only ever does something if the canvas gets invalidated by our code
// CanvasState.prototype.draw = function() {
//     // if our state is invalid, redraw and validate!
//     if (!this.valid) {
//     var ctx = this.ctx;
//     var shapes = this.shapes;
//     this.clear();
    
//     // ** Add stuff you want drawn in the background all the time here **
    
//     // draw all shapes
//     var l = shapes.length;
//     for (var i = 0; i < l; i++) {
//         var shape = shapes[i];
//         // We can skip the drawing of elements that have moved off the screen:
//         if (shape.x > this.width || shape.y > this.height ||
//             shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
//         shapes[i].draw(ctx);
//     }
    
//     // draw selection
//     // right now this is just a stroke along the edge of the selected Shape
//     if (this.selection != null) {
//         ctx.strokeStyle = this.selectionColor;
//         ctx.lineWidth = this.selectionWidth;
//         var mySel = this.selection;
//         ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
//     }
    
//     // ** Add stuff you want drawn on top all the time here **
    
//     this.valid = true;
//     }
// }

// // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
// CanvasState.prototype.getMouse = function(e) {
//     var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    
//     // Compute the total offset
//     if (element.offsetParent !== undefined) {
//       do {
//         offsetX += element.offsetLeft;
//         offsetY += element.offsetTop;
//       } while ((element = element.offsetParent));
//     }
  
//     // Add padding and border style widths to offset
//     // Also add the <html> offsets in case there's a position:fixed bar
//     offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
//     offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  
//     mx = e.pageX - offsetX;
//     my = e.pageY - offsetY;
    
//     // We return a simple javascript object (a hash) with x and y defined
//     return {x: mx, y: my};
//   }

// init();

// function init() {
//     //creates the two containers, the inner circular container and the outer circular container
//     var containerOuter = 325;
//     var containerInner = containerOuter / 1.5;

//     var s = new CanvasState(document.getElementById('myCanvas'));
//     s.addNode(new Node(containerOuter + 40, containerOuter * 2 - 30, -.6, -.4, 20, "#0095DD"));
//     s.addNode(new Node(containerOuter * 1.5, containerOuter * 2 - 100, -.9, -.6, 30, "#DD9500"));
//     s.addNode(new Node(containerOuter + 100, containerOuter * 2 - 600, .75, .9, 15, "#00DD95"));
//     s.addNode(new Node(containerOuter, containerOuter * 2 / 5, .8, .9, 40, "#DD0095"));
// }




/* //creates each node, the position of the start and where it should be next
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
        normY: 0,
        clicked: false
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
            ctx.strokeStyle = "grey";
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
draw(); */
  