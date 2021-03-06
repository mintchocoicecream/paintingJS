const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const crnt_range = document.getElementById("jsCurRange");
const pen = document.getElementById("jsPen");
const fill = document.getElementById("jsFill");
const reset = document.getElementById("jsReset");
const save = document.getElementById("jsSave");
const curColor = document.getElementById("curColor");
const otherColor = document.getElementById("controlsSelect");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");


let INITIAL_COLOR = "2c2c2c";
const CANVAS_SIZE = 650;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.strokeStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;
ctx.lineCap = "round";

pen.style.backgroundColor = "rgb(215, 243, 255)";

let painting = false;
let mode = 0;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y);
    } else{
        if(!mode){
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    }
}

function handleColorClick(event){
    // console.log(event.target.style);
    const color = event.target.style.backgroundColor;
    INITIAL_COLOR = color;
    curColor.style.backgroundColor = INITIAL_COLOR;
    ctx.strokeStyle = INITIAL_COLOR;
    ctx.fillStyle = INITIAL_COLOR;
}

function handleOtherColor(event){
    const oColor = event.target.value;
    INITIAL_COLOR = oColor;
    curColor.style.backgroundColor = INITIAL_COLOR;
    ctx.strokeStyle = INITIAL_COLOR;
    ctx.fillStyle = INITIAL_COLOR;
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
    crnt_range.innerText = size;
}

function handleColorPen(){
    mode = 0;
    canvas.style.cursor = "url(cursor.cur), auto";
    pen.style.backgroundColor = "rgb(215, 243, 255)";
    fill.style.backgroundColor = "white";
    reset.style.backgroundColor = "white";
}

function handleColorFill(){
    mode = 1;
    canvas.style.cursor = "url(paint.cur), auto";
    fill.style.backgroundColor = "rgb(215, 243, 255)";
    pen.style.backgroundColor = "white";
    reset.style.backgroundColor = "white";
}

function handleReset(){
    mode = 2;
    canvas.style.cursor = "url(erase.cur), auto";
    reset.style.backgroundColor = "rgb(215, 243, 255)";
    pen.style.backgroundColor = "white";
    fill.style.backgroundColor = "white";
}

function handleCanvasClick(){
    if(mode===1){
        ctx.fillStyle = INITIAL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }else if(mode ===2 ){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}

function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        fileInput.value = null;
    }
}

function handleCM(event){
    event.preventDefault();
}

function handleSaveBtn(){
    const imageUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "Masterpiece";
    link.click();
}

function onDoubleClick(event){
    const text = textInput.value;
    if(text !== ""){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "25px serif";
        ctx.strokeText(text, event.offsetX, event.offsetY);
        ctx.restore();
    };
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
    canvas.addEventListener("dblclick", onDoubleClick);
}


Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));
fileInput.addEventListener("change", onFileChange);


if(range){
    range.addEventListener("input", handleRangeChange);
}

if(pen){
    pen.addEventListener("click", handleColorPen);
}

if(fill){
    fill.addEventListener("click", handleColorFill);
}

if(otherColor) {
    otherColor.addEventListener("input", handleOtherColor);
}

if(reset){
    reset.addEventListener("click", handleReset);
}

if(save){
    save.addEventListener("click", handleSaveBtn);
}
