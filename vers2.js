
// =======WORKI!
class Particle {
    constructor(x, y, mass, size) {
        this.x = x;
        this.y = y;
        this.prevx = x;
        this.prevy = y;
        this.mass = mass;
        this.size = size || 10; // Значение по умолчанию равно 10, если size не передан
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
function setup() {
    createCanvas(500, 400);

    pA = new Particle(220, 20, 10000);
    let pB = new Particle(250, 20, 1000);
    let pC = new Particle(250, 60, 10000);
    let pD = new Particle(220, 60, 2000,50);
    particles.push(pA, pB, pC, pD);

    // Устанавливаем свойство dragging для одной из точек в false,
    // чтобы она не двигалась
    pA.dragging = false;

    let stickAB = new Stick(pA, pB, getDistance(pA, pB));
    let stickBC = new Stick(pB, pC, getDistance(pB, pC));
    let stickCD = new Stick(pC, pD, getDistance(pC, pD));
    let stickDA = new Stick(pD, pA, getDistance(pD, pA));
    let stickAC = new Stick(pC, pA, getDistance(pC, pA));
    let stickBD = new Stick(pD, pB, getDistance(pD, pB));
    sticks.push(stickAB, 
        stickBC, 
        stickCD, 
        // stickDA, 
        // stickAC, 
        // stickBD
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
// если можно первую точку двигать
// function updateSticks() {
//     for (const stick of sticks) {
//         // Вычисляем текущее расстояние между точками в звене
//         let dx = stick.p2.x - stick.p1.x;
//         let dy = stick.p2.y - stick.p1.y;
//         let currentDistance = Math.sqrt(dx * dx + dy * dy);
//         let difference = stick.length - currentDistance;
//         let directionX = dx / currentDistance;
//         let directionY = dy / currentDistance;

//         // Обновляем позиции точек в звенах, чтобы расстояние между ними оставалось неизменным
//         stick.p1.x -= difference * directionX /  2;
//         stick.p1.y -= difference * directionY /  2;
//         stick.p2.x += difference * directionX /  2;
//         stick.p2.y += difference * directionY /  2;
//     }
//     // for (const stick of sticks) {
//     //     if (stick.p1 === pA || stick.p2 === pA) continue; // Пропускаем sticks, связанные с pA

//     //     let dx = stick.p1.x - stick.p2.x;
//     //     let dy = stick.p1.y - stick.p2.y;
//     //     let distance = Math.sqrt(dx * dx + dy * dy);
//     //     let difference = stick.length - distance;
//     //     let percent = difference / distance / 2;
//     //     let offsetX = dx * percent;
//     //     let offsetY = dy * percent;
// // ------------------------------or

//     //     stick.p1.x += offsetX;
//     //     stick.p1.y += offsetY;
//     //     stick.p2.x -= offsetX;
//     //     stick.p2.y -= offsetY;
// // ------------------------------or
//     //     //   // Расчитываем новое положение точек, чтобы расстояние между ними оставалось неизменным
//     //     //   let newX1 = stick.p1.x + offsetX;
//     //     //   let newY1 = stick.p1.y + offsetY;
//     //     //   let newX2 = stick.p2.x - offsetX;
//     //     //   let newY2 = stick.p2.y - offsetY;
  
//     //     //   // Обновляем позиции точек, сохраняя расстояние между ними
//     //     //   stick.p1.x = newX1;
//     //     //   stick.p1.y = newY1;
//     //     //   stick.p2.x = newX2;
//     //     //   stick.p2.y = newY2;
//     // }
// }
// если первая точка как гвоздь:
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
    background(0);

    update();

    for (const element of particles) {
        let particle = element;
        if (particle.dragging) {
            particle.x = mouseX;
            particle.y = mouseY;
        }
        circle(particle.x, particle.y, 10);
    }

    updateSticks();

    for (const element of sticks) {
        let stick = element;
        stroke("white");
        line(stick.p1.x, stick.p1.y, stick.p2.x, stick.p2.y);
    }
}

function mousePressed() {
    for (const element of particles) {
        let particle = element;
        if (particle === pA) continue; // Игнорируем pA при обработке события мыши
        let d = dist(mouseX, mouseY, particle.x, particle.y);
        if (d < 10) {
            particle.dragging = true;
        }
    }
}

function mouseReleased() {
    for (const element of particles) {
        let particle = element;
        if (particle === pA) continue; // Игнорируем pA при обработке события мыши
        particle.dragging = false;
    }
}
