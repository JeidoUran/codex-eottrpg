const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
let time = 0;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.3 + 0.1,
        offset: Math.random() * 1000,        // décalage unique par bulle
        amp: Math.random() * 10 + 5          // amplitude du mouvement horizontal
    });
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.01; // petite incrémentation continue

    ctx.fillStyle = 'rgba(99, 176, 196, 0.15)';

    particles.forEach(p => {
        p.y -= p.speedY;

        // Oscillation horizontale
        let xOffset = Math.sin(time + p.offset) * p.amp;
        let x = p.x + xOffset;

        if (p.y + p.radius < 0) {
            p.y = h + Math.random() * 20;
            p.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();
