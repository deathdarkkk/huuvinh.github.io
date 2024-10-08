const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 100;

const spaceColors = [
    '#1d2b53',
    '#7e3a8b',
    '#6a0dad',
    '#ff9a8b',
    '#c0c0c0',
];

function randomSpaceColor() {
    return spaceColors[Math.floor(Math.random() * spaceColors.length)];
}

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = Math.random() * (innerWidth - size * 2);
        let y = Math.random() * (innerHeight - size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = randomSpaceColor();

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.5, "magenta");
    gradient.addColorStop(1, "blue");

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = opacityValue;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

const fpsCounter = document.getElementById('fps-counter');
let lastFrameTime = Date.now();
let frameCount = 0;
let fps = 0;

function updateFPS() {
    const now = Date.now();
    const delta = now - lastFrameTime;
    frameCount++;

    if (delta >= 1000) {
        fps = frameCount;
        fpsCounter.textContent = `${fps} FPS`;
        frameCount = 0;
        lastFrameTime = now;
    }

    requestAnimationFrame(updateFPS);
}

updateFPS();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();