
let darkToggle = true 
const style = {
    background: darkToggle ? 'black' : 'white',
    color: darkToggle ? '#cf540d86' : '#cf540d86',
    light: darkToggle ? 'yellow' : '#77777780'
}
const light = document.querySelector('.round');
light.style.background = style.light;


class Particle {
    constructor(x, y, mass, size) {
        this.x = x;
        this.y = y;
        this.prevx = x;
        this.prevy = y;
        this.mass = mass;
        this.dragging = false; // флаг для отслеживания перетаскивания
    }
}

class Stick {
    constructor(p1, p2, length) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = length;
    }
}

let particles = [];
let sticks = [];

function getDistance(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
let pA;
let pB;
let pC;
let pD;
let pE;
let pI;
let pF;
let pG;
let pH;
let pLast;
function setup() {
    createCanvas(500, 400);
    stroke(255);
    // noFill();

    // pg = createGraphics(400, 250);

    pA = new Particle(250, 20, 10000);
    pB = new Particle(245, 20, 1000);
    pC = new Particle(240, 20, 1000);
    pD = new Particle(235, 20, 1000);
    pE = new Particle(230, 20, 1000);
    pI = new Particle(225, 20, 1000);
    pF = new Particle(220, 20, 1000);
    pG = new Particle(215, 20, 1000);
    pH = new Particle(210, 20, 1000);
    pZ = new Particle(205, 20, 1000);

    particles.push(pA, pB, pC, pD, pE, pI, pF, pG, pH, pZ);

    // Устанавливаем свойство dragging для одной из точек в false,
    // чтобы она не двигалась
    pA.dragging = false;

    let stickAB = new Stick(pA, pB, getDistance(pA, pB));
    let stickBC = new Stick(pB, pC, getDistance(pB, pC));
    let stickCD = new Stick(pC, pD, getDistance(pC, pD));
    let stickDE = new Stick(pD, pE, getDistance(pD, pE));
    let stickEI = new Stick(pE, pI, getDistance(pE, pI));
    let stickIF = new Stick(pI, pF, getDistance(pI, pF));
    let stickFG = new Stick(pF, pG, getDistance(pF, pG));
    let stickGH = new Stick(pG, pH, getDistance(pG, pH));
    let stickHZ = new Stick(pH, pZ, getDistance(pH, pZ));
    sticks.push(
        stickAB,
        stickBC,
        stickCD,
        stickDE,
        stickEI,
        stickIF,
        stickFG,
        stickGH,
        stickHZ
    );
}
function keepInsideView(particle) {
    if (particle.y >= height) particle.y = height;
    if (particle.x >= width) particle.x = width;
    if (particle.y < 0) particle.y = 0;
    if (particle.x < 0) particle.x = 0;
}
function update() {
    for (const element of particles) {
        let particle = element;
        if (particle === pA || particle.dragging) continue; // Пропускаем pA при обновлении
        let force = { x: 0.0, y: 0.5 };

        let acceleration = {
            x: force.x / particle.mass,
            y: force.y / particle.mass,
        };

        let prevPosition = { x: particle.x, y: particle.y };

        particle.x =
            2 * particle.x -
            particle.prevx +
            acceleration.x * (deltaTime * deltaTime);
        particle.y =
            2 * particle.y -
            particle.prevy +
            acceleration.y * (deltaTime * deltaTime);

        particle.prevx = prevPosition.x;
        particle.prevy = prevPosition.y;

        keepInsideView(particle);
    }
}


function updateSticks() {
    for (const stick of sticks) {
        if (stick.p1 === pA) {
            // Если первая точка (p1) равна фиксированной точке (pA), фиксируем вторую точку (p2)
            let dx = stick.p2.x - stick.p1.x;
            let dy = stick.p2.y - stick.p1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let difference = stick.length - distance;
            let percent = difference / distance / 2;
            let offsetX = dx * percent;
            let offsetY = dy * percent;
            stick.p2.x += offsetX;
            stick.p2.y += offsetY;
        } else if (stick.p2 === pA) {
            // Если вторая точка (p2) равна фиксированной точке (pA), фиксируем первую точку (p1)
            let dx = stick.p1.x - stick.p2.x;
            let dy = stick.p1.y - stick.p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let difference = stick.length - distance;
            let percent = difference / distance / 2;
            let offsetX = dx * percent;
            let offsetY = dy * percent;
            stick.p1.x += offsetX;
            stick.p1.y += offsetY;
        } else {
            // Если ни одна из точек не равна фиксированной точке (pA), обновляем обе точки
            let dx = stick.p2.x - stick.p1.x;
            let dy = stick.p2.y - stick.p1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let difference = stick.length - distance;
            let percent = difference / distance / 2;
            let offsetX = dx * percent;
            let offsetY = dy * percent;
            stick.p1.x -= offsetX;
            stick.p1.y -= offsetY;
            stick.p2.x += offsetX;
            stick.p2.y += offsetY;
        }
    }
}

function draw() {
    background(style.background || "white");;

    update();



    // ------------------------------
    for (const element of particles) {
        let particle = element;
        if (particle.dragging) {
            particle.x = mouseX;
            particle.y = mouseY;
        }
        circle(particle.x, particle.y, 2);
    }
    // -------------------
   

    stroke(style.color); 
    fill("#613c04"); // Выберите цвет заливки кружка
    circle(pZ.x, pZ.y, 6); // Рисуем кружок вокруг точки pA

    updateSticks();

    for (const element of sticks) {
        let stick = element;
        stroke("#613c04");
        strokeWeight(2);
        line(stick.p1.x, stick.p1.y, stick.p2.x, stick.p2.y);
    }
}

function mousePressed() {
    // let threshold = 50;

    for (const element of particles) {
        let particle = element;
        if (particle === pA) continue; // skip first dot
        let d = dist(mouseX, mouseY, particle.x, particle.y);
        // Рассчитываем расстояние между текущей частицей и точкой pZ
        // let threshold = 30;

        // let с = dist(mouseX, mouseY, pZ.x, pZ.y);
        // if (с < threshold) {
        //     darkToggle = !darkToggle;
        //     style.background = darkToggle ? "black" : "white";
        //     background(style.background);
        //     style.color = darkToggle ? "cf540d86" : "#cf540d86";
        //     stroke(style.color);
        //     style.light = darkToggle ? "yellow" : "#7777772c";
        //     light.style.background = style.light;
        //     light.classList.toggle("dark");
        // }
        if (d < 10) {
            particle.dragging = true;
        }
    }
}

function mouseReleased() {
    let threshold = 30;
    for (const element of particles) {
        let particle = element;
        if (particle === pA) continue; // skip first dot
        let d = dist(mouseX, mouseY, particle.x, particle.y);
        let с = dist(mouseX, mouseY, pZ.x, pZ.y);
        if (с < threshold) {
            darkToggle = !darkToggle;
            style.background = darkToggle ? "black" : "white";
            background(style.background);
            style.color = darkToggle ? "#cf540d86" : "#cf540d86"; // исправлена ошибка в цвете
            stroke(style.color);
            style.light = darkToggle ? "yellow" : "#7777772c";
            light.style.background = style.light;
            light.classList.toggle("dark");
        }
    }
    for (const element of particles) {
        let particle = element;
        if (particle === pA) continue; // skip first dot
    
        particle.dragging = false;
    }
    

}
