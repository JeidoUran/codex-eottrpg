const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w, h, particles = [];

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
        radius: Math.random() * 2,
        speedY: Math.random() * 0.5 + 0.2
    });
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    particles.forEach(p => {
        p.y += p.speedY;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();
