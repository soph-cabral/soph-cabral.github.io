//current x & y
var x = 0;
var y = 0;
//x & y for mouse stop listener
var x_log = 0;
var y_log = 0;
var divs = [[],[],[]];
//number of divs
var trail_length = 100;

//listen for mouse motion
document.addEventListener('mousemove',trail);
function trail(evt) {
    x = evt.clientX;  
    y = evt.clientY;
    updateArray(x,y);
}

//listen for mouse stop
var magnetInterval = setInterval(mouseStop, 10);
//magnet function if mouse stopped
function mouseStop() {
    if ((x_log == x) && (y_log == y)) {
        magnet();
    } 
    else {
        x_log = x;
        y_log = y;
    }
}

//add new x&y to front of array; pop last x&y
//update div styles
function updateArray(left,top) {
    divs[1].unshift(left);
    divs[1].pop();  divs[2].unshift(top);
    divs[2].pop(); for(i=trail_length;i>=0;i--){
        divs[0][i].style.left=divs[1][i]+"px";
        divs[0][i].style.top=divs[2][i]+"px";
    }
}

//shuffle together
function magnet() {
    updateArray(x,y);
}

//build div containers
(function addDivs() {
    document.body.style.backgroundColor = 'black';
    for (i=trail_length;i>=0;i--) {
        var container = document.createElement("div");
        container.className = "trailer_" + i + " box";
        document.body.appendChild(container);
        var size = ((trail_length-i) * 30/trail_length).toFixed(0);
        // size=30;
        divs[0][i] = container;
        divs[1][i] = -100;
        divs[2][i] = -100;
        hue = (i * 360/trail_length).toFixed(2);
        divs[0][i].style.height=size+'px';
        divs[0][i].style.width=size+'px';
        divs[0][i].style.backgroundColor = 'hsla('+hue+', 100%, 50%, 1)';
      //   divs[0][i].style.mixBlendMode='lighten';
      // divs[0][i].style.position='absolute';
      // divs[0][i].style.borderRadius='50%';
    }
}());