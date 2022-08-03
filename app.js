const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = Array.from(
    document.getElementsByClassName("controls__color")
  );
const range = document.getElementById("jsRange");
const crnt_range = document.getElementById("jsCurRange");
const pen = document.getElementById("jsPen");
const fill = document.getElementById("jsFill");
const eraser = document.getElementById("jsErase");
const reset = document.getElementById("jsReset");
const save = document.getElementById("jsSave");
const rect = document.getElementById("jsRect");
const circle = document.getElementById("jsCircle");
const otherColor = document.getElementById("controlsSelect");
const fileBtn = document.getElementById("fileLabel");
const fileInput = document.getElementById("file");
const fileUpload = document.getElementById("fileUpload");
const fontSizes = document.getElementById("fontSizes");
const fontTypes = document.getElementById("fontTypes");
const fontWeights = document.getElementById("fontWeights");
const textInput = document.getElementById("text");
const uploadText = document.getElementById("uploadText");


let INITIAL_COLOR = "2c2c2c";
const CANVAS_SIZE = 650;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.lineWidth = range.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;

ctx.strokeStyle = INITIAL_COLOR;

let mode = 0;
let uploadImage;

let rectX = 0;
let rectY = 0;

console.log(`uploadImage01 ${uploadImage}`);

function onMouseMove(event) {
    if(isPainting) {
        if(mode === 0 || mode === 2){
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
            return;
        }else if(mode === 6){
            const x = event.offsetX;
            const y = event.offsetY;
            const width = x - rectX;
            const height = y - rectY;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.fillRect(rectX, rectY, width, height);
        }else if(mode === 7){
            const circleX = event.offsetX;
            const cwidth = circleX - rectX;
            ctx.arc(rectX, rectY, cwidth, 0, Math.PI*2, true);
            ctx.fill();
        }
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(event) {
    isPainting = true;
    if(mode === 6){
        rectX = event.offsetX;
        rectY = event.offsetY;
        ctx.beginPath();
    }else if(mode == 7){
        rectX = event.offsetX;
        rectY = event.offsetY;
    }
}

function stopPainting() {
    isPainting = false;
    ctx.beginPath();
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
    crnt_range.innerText = size;
}

function handleCanvasClick(event){
    if(mode===1){
        ctx.fillStyle = INITIAL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }else if(mode ===3 ){
        if(window.confirm(
            "Are you sure to empty everything?"
        )){
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }
    }else if(mode===4){
        ctx.drawImage(uploadImage, event.offsetX, event.offsetY, uploadImage.width/2, uploadImage.height/2);
    }else if(mode===5){
        const text = textInput.value;
        const textWeight = fontWeights.value;
        const textSize = fontSizes.value;
        const textFont = fontTypes.value;
        
        if(text !== ""){
            ctx.save();
            ctx.lineWidth = 1;
            ctx.fillStyle = INITIAL_COLOR;
            ctx.font = `${textWeight} ${textSize}px ${textFont}`;
            ctx.fillText(text, event.offsetX, event.offsetY);
            ctx.restore();
        };
    }
}

function handleColorClick(event){
    if(mode !== 2){
        const color = event.target.dataset.color;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        otherColor.value = color;
    }
}

function handleOtherColor(event){
    const oColor = event.target.value;
    INITIAL_COLOR = oColor;
    ctx.strokeStyle = INITIAL_COLOR;
    ctx.fillStyle = INITIAL_COLOR;
}

function handleColorPen(){
    mode = 0;
    canvas.style.cursor = "url(cursors/cursor.cur), auto";
    pen.classList.add("activated");
    fill.classList.remove("activated");
    eraser.classList.remove("activated");
    uploadText.classList.remove("activated");
    reset.classList.remove("activated");
    fileBtn.classList.remove("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
}

function handleColorFill(){
    mode = 1;
    canvas.style.cursor = "url(cursors/paint.cur), auto";
    fill.classList.add("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    uploadText.classList.remove("activated");
    reset.classList.remove("activated");
    fileBtn.classList.remove("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
}

function handleEraser(){
    mode = 2;
    canvas.style.cursor = "url(cursors/erase.cur), auto";
    eraser.classList.add("activated");
    pen.classList.remove("activated");
    fill.classList.remove("activated");
    uploadText.classList.remove("activated");
    reset.classList.remove("activated");
    fileBtn.classList.remove("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
    ctx.strokeStyle = "white";
    isFilling = false;
}


function handleReset(){
    mode = 3;
    canvas.style.cursor = "url(cursors/reset.cur), auto";
    reset.classList.add("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    fill.classList.remove("activated");
    uploadText.classList.remove("activated");
    fileBtn.classList.remove("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
}


function onFileChange(event){
    mode = 4;
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    uploadImage = new Image();
    uploadImage.src = url;
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("imgPreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
    fileInput.value = null;
}

function handleRect(){
    mode = 6;
    canvas.style.cursor = "crosshair";
    rect.classList.add("activated");
    circle.classList.remove("activated");
    reset.classList.remove("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    fill.classList.remove("activated");
    uploadText.classList.remove("activated");
    fileBtn.classList.remove("activated");
}

function handleCircle(){
    mode = 7;
    canvas.style.cursor = "crosshair";
    circle.classList.add("activated");
    rect.classList.remove("activated");
    reset.classList.remove("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    fill.classList.remove("activated");
    uploadText.classList.remove("activated");
    fileBtn.classList.remove("activated");
}

function handleImageBtn(){
    canvas.style.cursor = "url(cursors/Addimage.cur), auto";
    reset.classList.remove("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    uploadText.classList.remove("activated");
    fill.classList.remove("activated");
    fileBtn.classList.add("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
}


function handleImgUpload(){
    if(uploadImage){
        ctx.drawImage(uploadImage, 0, 0, canvas.width, canvas.height);
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


function handleTextUpload(){
    mode = 5;
    canvas.style.cursor = "url(cursors/text.cur), auto";
    reset.classList.remove("activated");
    pen.classList.remove("activated");
    eraser.classList.remove("activated");
    uploadText.classList.add("activated");
    fill.classList.remove("activated");
    fileBtn.classList.remove("activated");
    rect.classList.remove("activated");
    circle.classList.remove("activated");
}





if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
    // canvas.addEventListener("dblclick", onDoubleClick);
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

if(eraser){
    eraser.addEventListener("click", handleEraser);
}

if(rect){
    rect.addEventListener("click", handleRect);
}

if(circle){
    circle.addEventListener("click", handleCircle);
}

if(otherColor) {
    otherColor.addEventListener("input", handleOtherColor);
}

if(reset){
    reset.addEventListener("click", handleReset);
}

if(fileBtn){
    fileBtn.addEventListener("click", handleImageBtn);
}

if(fileUpload) {
    fileUpload.addEventListener("click", handleImgUpload);
}

if(uploadText){
    uploadText.addEventListener("click", handleTextUpload);
}

if(save){
    save.addEventListener("click", handleSaveBtn);
}
