
// без обмеження
// class Particle {
//     constructor(x, y, mass) {
//         this.x = x;
//         this.y = y;
//         this.prevx = x;
//         this.prevy = y;
//         this.mass = mass;
//     }
// }

// let particles = [];

// function setup() {
//     createCanvas(500, 400);
//     let pA = new Particle(250, 20, 10000);
//     let pB = new Particle(280, 50, 10000);
//     let pC = new Particle(280, 60, 15000);
//     let pD = new Particle(220, 60, 12000);
//     particles.push(pA, pB, pC, pD);
// }

// function update() {
//     for (const element of particles) {
//         let particle = element;

//         let force = { x: 0.0, y: 0.5 };

//         let acceleration = {
//             x: force.x / particle.mass,
//             y: force.y / particle.mass,
//         };

//         let prevPosition = { x: particle.x, y: particle.y };

//         particle.x =
//             2 * particle.x -
//             particle.prevx +
//             acceleration.x * (deltaTime * deltaTime);
//         particle.y =
//             2 * particle.y -
//             particle.prevy +
//             acceleration.y * (deltaTime * deltaTime);

//         particle.prevx = prevPosition.x;
//         particle.prevy = prevPosition.y;
//     }
// }

// function draw() {
//     background(0);

//     update();

//     //code before (const element of particles)
//     // for (let i = 0; i < particles.length; i++) {
//     //     circle(particles[i].x, particles[i].y, 10);
//     // }

//     for (const element of particles) {
//         circle(element.x, element.y, 10);
//     }
// }
// // функ чтоб шары не пропадали
// function keepInsideView(particle) {
//     if (particle.y >= height) particle.y = height;
//     if (particle.x >= width) particle.x = width;
//     if (particle.y < 0) particle.y = 0;
//     if (particle.x < 0) particle.x = 0;
// }

// function update() {
//     for (let i = 0; i < particles.length; i++) {
//         let particle = particles[i];

//         let force = { x: 0.0, y: 0.5 };

//         let acceleration = {
//             x: force.x / particle.mass,
//             y: force.y / particle.mass,
//         };

//         let prevPosition = { x: particle.x, y: particle.y };

//         particle.x =
//             2 * particle.x -
//             particle.prevx +
//             acceleration.x * (deltaTime * deltaTime);
//         particle.y =
//             2 * particle.y -
//             particle.prevy +
//             acceleration.y * (deltaTime * deltaTime);

//         particle.prevx = prevPosition.x;
//         particle.prevy = prevPosition.y;

//         keepInsideView(particle);
//     }
// }
// з обмеженням
class Particle {
    constructor(x, y, mass) {
      this.x = x;
      this.y = y;
      this.prevx = x;
      this.prevy = y;
      this.mass = mass;
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
  
  function getLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }
  
  function getDifference(p1, p2) {
    return {
      x: p1.x - p2.x,
      y: p1.y - p2.y
    };
  }
  
  function keepInsideView(particle) {
    if (particle.y >= height)
      particle.y = height;
    if (particle.x >= width)
      particle.x = width;
    if (particle.y < 0)
      particle.y = 0;
    if (particle.x < 0)
      particle.x = 0;
  }
  
  function setup() {
    createCanvas(500, 400);
    
    // Add four particles
    let pA = new Particle(220, 20, 10000);
    let pB = new Particle(250, 20, 10000);
    let pC = new Particle(250, 60, 10000);
    let pD = new Particle(220, 60, 10000);
    // let pE = new Particle(290, 60, 19000);
    particles.push(pA, pB, pC, pD);
    
    // Add four stick constraints between particles
    let stickAB = new Stick(pA, pB, getDistance(pA, pB));
    let stickBC = new Stick(pB, pC, getDistance(pB, pC));
    let stickCD = new Stick(pC, pD, getDistance(pC, pD));
    let stickDA = new Stick(pD, pA, getDistance(pD, pA));
    let stickAC = new Stick(pC, pA, getDistance(pC, pA));
    let stickBD = new Stick(pD, pB, getDistance(pD, pB));
    // let stickDE = new Stick(pD, pE, getDistance(pD, pE));
    sticks.push(stickAB, stickBC, stickCD, stickDA,stickAC,stickBD);
  }
  
  function update() {
    // Update particle position using Verlet integration
    for (const element of particles) {
      let particle = element
  
      let force = {x: 0.0, y: 0.5};
  
      let acceleration = {x: force.x / particle.mass, y: force.y / particle.mass};
  
      let prevPosition = {x: particle.x, y: particle.y};
  
      particle.x = 2 * particle.x - particle.prevx + acceleration.x * (deltaTime * deltaTime);
      particle.y = 2 * particle.y - particle.prevy + acceleration.y * (deltaTime * deltaTime);
  
      particle.prevx = prevPosition.x;
      particle.prevy = prevPosition.y;
  
      keepInsideView(particle);
    }
  
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
  
  function draw() {
    background(0);
    
    update();
    
    for (const element of particles) {
      circle(element.x, element.y, 10);
    }
  
    for (const element of sticks) {
      stroke("white");
      line(element.p1.x, element.p1.y, element.p2.x, element.p2.y);
    }
  }

//   логика перетягивания мыши
