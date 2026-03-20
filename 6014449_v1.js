let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function drawPoint(ctx, x, y, size){
    ctx.fillRect(x-size/2, y-size/2, size, size);
}

function canvasToCartesiana(p1, height){
    return [p1.x, height - p1.y];
}

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
        ctx.fillText(i-canvas.width/2, i, canvas.height/2+10);
    }

    for(let i=0;i<canvas.height;i+=50){
        ctx.fillText(canvas.height/2-i, canvas.width/2+5, i);
    }
}


function drawDDA(x1,y1,x2,y2){

    let dx = x2-x1;
    let dy = y2-y1;

    let steps = Math.max(Math.abs(dx),Math.abs(dy));

    let xinc = dx/steps;
    let yinc = dy/steps;

    let x=x1;
    let y=y1;

    for(let i=0;i<=steps;i++){
        drawPoint(ctx,x,y,3);
        x+=xinc;
        y+=yinc;
    }
}

function drawBresenham(x1,y1,x2,y2){

    let dx = Math.abs(x2-x1);
    let dy = Math.abs(y2-y1);

    let sx = (x1<x2)?1:-1;
    let sy = (y1<y2)?1:-1;

    let err = dx-dy;

    while(true){

        drawPoint(ctx,x1,y1,3);

        if(x1==x2 && y1==y2) break;

        let e2 = 2*err;

        if(e2>-dy){
            err-=dy;
            x1+=sx;
        }

        if(e2<dx){
            err+=dx;
            y1+=sy;
        }
    }
}

function drawLine(x1,y1,x2,y2,size,method){

    if(method=="dda")
        drawDDA(x1,y1,x2,y2);
    else
        drawBresenham(x1,y1,x2,y2);
}

function triangleArea(x1,y1,x2,y2,x3,y3){

    let area = Math.abs(
        x1*(y2-y3)+
        x2*(y3-y1)+
        x3*(y1-y2)
    )/2;

    return area;
}

function procesar(){

    drawAxes();

    let x1=parseFloat(document.getElementById("x1").value);
    let y1=parseFloat(document.getElementById("y1").value);

    let x2=parseFloat(document.getElementById("x2").value);
    let y2=parseFloat(document.getElementById("y2").value);

    let x3=parseFloat(document.getElementById("x3").value);
    let y3=parseFloat(document.getElementById("y3").value);

    let method=document.getElementById("method").value;

    let area = triangleArea(x1,y1,x2,y2,x3,y3);

    if(area==0){

        resultado.innerText="Los puntos NO forman un triángulo";
        resultado.style.color="red";

    }
    else{

        resultado.innerText="Los puntos SI forman un triángulo";
        resultado.style.color="green";

        ctx.fillStyle="blue";

        drawLine(x1,y1,x2,y2,3,method);
        drawLine(x2,y2,x3,y3,3,method);
        drawLine(x3,y3,x1,y1,3,method);
    }

    ctx.fillStyle="black";
    drawPoint(ctx,x1,y1,6);
    drawPoint(ctx,x2,y2,6);
    drawPoint(ctx,x3,y3,6);
}