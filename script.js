function initNetworkAnimation() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    canvas.style.pointerEvents = 'auto';

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 3 + 2;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = ['#00d4ff', '#00ff88', '#0099ff', '#00aaff'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            this.x = Math.max(0, Math.min(width, this.x));
            this.y = Math.max(0, Math.min(height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class DataPacket {
        constructor(start, end) {
            this.start = start;
            this.end = end;
            this.progress = 0;
            this.speed = 0.01 + Math.random() * 0.02;
            this.color = '#ffaa00';
            this.size = 3;
        }

        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.progress = 0;
                this.start = nodes[Math.floor(Math.random() * nodes.length)];
                this.end = nodes[Math.floor(Math.random() * nodes.length)];
            }
        }

        draw() {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const nodes = [];
    for (let i = 0; i < 80; i++) {
        nodes.push(new Node(Math.random() * width, Math.random() * height));
    }

    const dataPackets = [];
    for (let i = 0; i < 15; i++) {
        dataPackets.push(new DataPacket(
            nodes[Math.floor(Math.random() * nodes.length)],
            nodes[Math.floor(Math.random() * nodes.length)]
        ));
    }

    let mouse = { x: null, y: null, radius: 150 };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                const dx = nodes[i].x - mouse.x;
                const dy = nodes[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 136, ${1 - distance / mouse.radius})`;
                    ctx.lineWidth = 2;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        
        if (mouse.x !== null && mouse.y !== null) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ff88';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawCircuitTraces() {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawCircuitTraces();
        drawConnections();
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        dataPackets.forEach(packet => {
            packet.update();
            packet.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
}

function initFirewallAnimation() {
    const canvas = document.getElementById('firewall-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width = canvas.width = section.offsetWidth;
    let height = canvas.height = section.offsetHeight;

    class SimpleParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            this.color = '#00d4ff';
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push(new SimpleParticle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawConnections();
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    });

    animate();
}

function initDataTransferAnimation() {
    const canvas = document.getElementById('data-transfer-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width = canvas.width = section.offsetWidth;
    let height = canvas.height = section.offsetHeight;

    class DataStream {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.length = Math.random() * 100 + 50;
            this.speed = Math.random() * 3 + 2;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.color = ['#00d4ff', '#00ff88', '#ffaa00'][Math.floor(Math.random() * 3)];
        }

        update() {
            this.y += this.speed * this.direction;
            if (this.y > height + this.length) this.y = -this.length;
            if (this.y < -this.length) this.y = height + this.length;
        }

        draw() {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, this.color);
            gradient.addColorStop(1, 'transparent');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }
    }

    const streams = [];
    for (let i = 0; i < 30; i++) {
        streams.push(new DataStream());
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, width, height);
        streams.forEach(stream => {
            stream.update();
            stream.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    });

    animate();
}

function initSecurityAnimation() {
    const canvas = document.getElementById('security-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width = canvas.width = section.offsetWidth;
    let height = canvas.height = section.offsetHeight;

    class SecurityBadge {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 20 + 10;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.color = ['#00d4ff', '#00ff88', '#ffaa00'][Math.floor(Math.random() * 3)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }

    const badges = [];
    for (let i = 0; i < 20; i++) {
        badges.push(new SecurityBadge());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        badges.forEach(badge => {
            badge.update();
            badge.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    });

    animate();
}

function initSkillsAnimation() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width = canvas.width = section.offsetWidth;
    let height = canvas.height = section.offsetHeight;

    class SkillNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            this.color = '#00d4ff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const nodes = [];
    for (let i = 0; i < 60; i++) {
        nodes.push(new SkillNode());
    }

    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawConnections();
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    });

    animate();
}

function initCircuitAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let width = canvas.width = section.offsetWidth;
    let height = canvas.height = section.offsetHeight;

    class CircuitLine {
        constructor() {
            this.horizontal = Math.random() > 0.5;
            if (this.horizontal) {
                this.x1 = 0;
                this.x2 = width;
                this.y = Math.random() * height;
            } else {
                this.y1 = 0;
                this.y2 = height;
                this.x = Math.random() * width;
            }
            this.offset = Math.random() * 100;
            this.speed = 0.5 + Math.random() * 1;
        }

        update() {
            this.offset += this.speed;
            if (this.offset > 100) this.offset = 0;
        }

        draw() {
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 15]);
            ctx.lineDashOffset = -this.offset;
            ctx.beginPath();
            if (this.horizontal) {
                ctx.moveTo(this.x1, this.y);
                ctx.lineTo(this.x2, this.y);
            } else {
                ctx.moveTo(this.x, this.y1);
                ctx.lineTo(this.x, this.y2);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    const lines = [];
    for (let i = 0; i < 20; i++) {
        lines.push(new CircuitLine());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    });

    animate();
}

function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
}
