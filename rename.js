
// перетянуть и остается на месте
class Particle {
    constructor(x, y, mass) {
      this.x = x;
      this.y = y;
      this.prevx = x;
      this.prevy = y;
      this.mass = mass;
      this.dragging = false; // флаг для отслеживания перетаскивания точки
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
  
  let particleRadius = 10; // радиус точки
  let selectedParticle = null; // переменная для хранения выбранной точки
  
  function setup() {
    createCanvas(500, 400);
  
    // Add four particles
    let pA = new Particle(220, 20, 10000);
    let pB = new Particle(250, 20, 10000);
    let pC = new Particle(250, 60, 10000);
    let pD = new Particle(220, 60, 10000);
    particles.push(pA, pB, pC, pD);
    
    // Add four stick constraints between particles
    let stickAB = new Stick(pA, pB, getDistance(pA, pB));
    let stickBC = new Stick(pB, pC, getDistance(pB, pC));
    let stickCD = new Stick(pC, pD, getDistance(pC, pD));
    let stickDA = new Stick(pD, pA, getDistance(pD, pA));
    sticks.push(stickAB, stickBC, stickCD, stickDA);
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
      circle(particle.x, particle.y, particleRadius * 2);
    }
    
    for (const element of sticks) {
      let stick = element;
      stroke("white");
      line(stick.p1.x, stick.p1.y, stick.p2.x, stick.p2.y);
    }
  }
  
  function update() {
    // Apply stick constraint to particles
    for (const element of sticks) {
      let stick = element;
      let diff = getDifference(stick.p1, stick.p2);
      let diffFactor = (stick.length - getLength(diff)) / getLength(diff) * 0.5;
      let offset = {x: diff.x * diffFactor, y: diff.y * diffFactor};
      
      stick.p1.x += offset.x;
      stick.p1.y += offset.y;
      stick.p2.x -= offset.x;
      stick.p2.y -= offset.y;
    }
  }
  
  function mousePressed() {
    // Проверяем, находится ли курсор мыши над какой-либо точкой
    for (const element of particles) {
      let particle = element;
      let d = dist(mouseX, mouseY, particle.x, particle.y);
      if (d < particleRadius) {
        particle.dragging = true;
        selectedParticle = particle;
        break; // прерываем цикл, если точка найдена
      }
    }
  }
  
  function mouseReleased() {
    // Отпускаем точку, когда кнопка мыши отпущена
    if (selectedParticle) {
      selectedParticle.dragging = false;
      selectedParticle = null;
    }
  }
  
  function getDistance(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function getLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }
  
  function getDifference(p1, p2) {
    return {
      x: p1.x - p2.x,
      y: p1.y - p2.y
    };
  }
  