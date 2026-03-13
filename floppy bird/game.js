const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

canvas.width = 400
canvas.height = 600

let gravity = 0.5
let velocity = 0
let lift = -9

let gameRunning = false
let frame = 0
let score = 0

// images
const avatar = new Image()
avatar.src = "avatar.png"

const pipeImg = new Image()
pipeImg.src = "pipe.png"

const bg = new Image()
bg.src = "background.png"

// sounds
const hitSound = new Audio("hit.mp3")
const jumpSound = new Audio("jump.mp3")

let bird={
x:80,
y:200,
width:40,
height:40
}

let pipes=[]
let gap=150
let pipeWidth=70

function resetGame(){
bird.y=200
velocity=0
pipes=[]
score=0
frame=0
}

function drawBackground(){
ctx.drawImage(bg,0,0,canvas.width,canvas.height)
}

function drawBird(){
ctx.drawImage(avatar,bird.x,bird.y,bird.width,bird.height)
}

function drawPipes(){
pipes.forEach(pipe=>{
ctx.drawImage(pipeImg,pipe.x,0,pipeWidth,pipe.top)
ctx.drawImage(pipeImg,pipe.x,pipe.bottom,pipeWidth,canvas.height)
})
}

function updatePipes(){

if(frame%100===0){

let top=Math.random()*250+50

pipes.push({
x:canvas.width,
top:top,
bottom:top+gap
})

}

pipes.forEach(pipe=>pipe.x-=2)

pipes=pipes.filter(pipe=>pipe.x+pipeWidth>0)

}

function collision(){

if(bird.y<0 || bird.y+bird.height>canvas.height)
return true

for(let pipe of pipes){

if(
bird.x+bird.width>pipe.x &&
bird.x<pipe.x+pipeWidth &&
(bird.y<pipe.top || bird.y+bird.height>pipe.bottom)
){
return true
}

}

return false
}

function drawScore(){

ctx.fillStyle="white"
ctx.font="30px Arial"
ctx.fillText(score,180,50)

}

function update(){

if(!gameRunning) return

ctx.clearRect(0,0,canvas.width,canvas.height)

drawBackground()

velocity+=gravity
bird.y+=velocity

updatePipes()

drawPipes()
drawBird()
drawScore()

if(frame%100===0) score++

if(collision()){

hitSound.play()

gameRunning=false

document.getElementById("gameOverScreen").classList.remove("hidden")
document.getElementById("scoreText").innerText="Score: "+score

document.getElementById("endVideo").play()

}

frame++

requestAnimationFrame(update)

}

function jump(){

if(!gameRunning) return

velocity=lift
jumpSound.play()

}

document.addEventListener("keydown",e=>{
if(e.code==="Space") jump()
})

document.addEventListener("touchstart",jump)

document.getElementById("startBtn").onclick=()=>{
document.getElementById("startScreen").classList.add("hidden")
resetGame()
gameRunning=true
update()
}

document.getElementById("restartBtn").onclick=()=>{
document.getElementById("gameOverScreen").classList.add("hidden")
resetGame()
gameRunning=true
update()

}
