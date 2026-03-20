let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function getValue(id){
    return parseFloat(document.getElementById(id).value);
}

function drawPoint(ctx, x, y, size){
    ctx.fillRect(x - size/2, y - size/2, size, size);
}

function drawPoints(points, size){
    points.forEach(p => drawPoint(ctx, p.x, p.y, size));
}

// EJES

function drawAxes(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();

    // eje X
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);

    // eje Y
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.width/2,canvas.height);

    ctx.stroke();

    // numeración
    ctx.font="10px Arial";
    for(let i=0;i<canvas.width;i+=50){
        ctx.fillText(i - canvas.width/2, i, canvas.height/2 + 10);
    }
    for(let i=0;i<canvas.height;i+=50){
        ctx.fillText(canvas.height/2 - i, canvas.width/2 + 5, i);
    }
}

function drawDDA(x1,y1,x2,y2){
    let dx = x2 - x1; 
    let dy = y2 - y1; 
    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xinc = dx / steps;
    let yinc = dy / steps;

    let x = x1;
    let y = y1;

    for(let i=0; i<=steps; i++){
        drawPoint(ctx, x, y, 3);
        x += xinc;
        y += yinc;
    }
}

function drawBresenham(x1,y1,x2,y2){

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;

    let err = dx - dy;

    while(true){

        drawPoint(ctx, x1, y1, 3);

        if(x1 === x2 && y1 === y2) break;

        let e2 = 2 * err;

        if(e2 > -dy){
            err -= dy;
            x1 += sx;
        }

        if(e2 < dx){
            err += dx;
            y1 += sy;
        }
    }
}

const methods = {
    dda: drawDDA,
    bresenham: drawBresenham
};

function drawLine(x1,y1,x2,y2,method){
    methods[method](x1,y1,x2,y2);
}

function drawTriangle(points, method){
    for(let i = 0; i < points.length; i++){
        let p1 = points[i];
        let p2 = points[(i+1) % points.length];
        drawLine(p1.x, p1.y, p2.x, p2.y, method);
    }
}

function triangleArea(x1,y1,x2,y2,x3,y3){
    return Math.abs(
        x1*(y2-y3) +
        x2*(y3-y1) +
        x3*(y1-y2)
    ) / 2;
}

function isTriangle(x1,y1,x2,y2,x3,y3){
    return triangleArea(x1,y1,x2,y2,x3,y3) !== 0;
}

function procesar(){

    drawAxes();

    let points = [
        {x: getValue("x1"), y: getValue("y1")},
        {x: getValue("x2"), y: getValue("y2")},
        {x: getValue("x3"), y: getValue("y3")}
    ];

    let method = document.getElementById("method").value;

    if(!isTriangle(
        points[0].x, points[0].y,
        points[1].x, points[1].y,
        points[2].x, points[2].y
    )){
        resultado.innerText = "Los puntos NO forman un triángulo";
        resultado.style.color = "red";
        return;
    }

    resultado.innerText = "Los puntos SI forman un triángulo";
    resultado.style.color = "green";

    ctx.fillStyle = "blue";
    drawTriangle(points, method);

    ctx.fillStyle = "black";
    drawPoints(points, 6);
}