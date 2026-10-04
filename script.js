/**
 * JOY.DEV — Executive Portfolio Interactive Logic
 * Features: Lightweight ambient canvas, typewriter, CLI terminal,
 * architecture modal inspector, mobile drawer, and clipboard copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypewriter();
  initStackFilters();
  initProjectModals();
  initTerminal();
  initCopyEmail();
  initMobileDrawer();
  initScrollSpy();
});

/* ==========================================================================
   1. Subtle Ambient Particle Canvas
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let pointer = { x: null, y: null, radius: 90 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const isMobile = width < 768;
    const factor = isMobile ? 36000 : 20000;
    const count = Math.floor((width * height) / factor);
    const particleCount = isMobile ? Math.min(Math.max(count, 15), 30) : Math.min(Math.max(count, 30), 55);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.3 + 0.7,
        alpha: Math.random() * 0.25 + 0.12
      });
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    pointer.x = null;
    pointer.y = null;
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Pointer interaction
      if (pointer.x !== null && pointer.y !== null) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pointer.radius) {
          const force = (pointer.radius - dist) / pointer.radius;
          p.x += dx * force * 0.015;
          p.y += dy * force * 0.015;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();

      // Connections
      const maxDist = width < 768 ? 90 : 120;
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.14;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   2. Dynamic Typewriter
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrases = [
    'Distributed Systems & High Concurrency',
    'Resilient Cloud Microservices (Go & Node.js)',
    'Event Streaming & Message Queues (Kafka / Redis)',
    'Type-Safe Full-Stack Architecture (TypeScript / Next.js)',
    'Automated CI/CD & Kubernetes Deployments'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeCycle() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 55;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 450;
    }

    setTimeout(typeCycle, typingSpeed);
  }

  typeCycle();
}

/* ==========================================================================
   3. Tech Stack Matrix Filtering
   ========================================================================== */
function initStackFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillTiles = document.querySelectorAll('.skill-tile');

  filterPills.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillTiles.forEach(tile => {
        const category = tile.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          tile.style.display = 'flex';
          tile.style.opacity = '0';
          setTimeout(() => { tile.style.opacity = '1'; }, 30);
        } else {
          tile.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Architecture Inspection Modal
   ========================================================================== */
const ARCH_DATA = {
  aegis: {
    title: 'Aegis Architecture: Distributed Edge Gateway',
    diagram: `[ Client Traffic ] ---> [ Cloudflare / L4 Load Balancer ]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ Aegis Gateway Node 1 ]       [ Aegis Gateway Node 2 ]
                 │                               │
        ┌────────┴───────────────────────────────┴────────┐
        ▼                                                 ▼
[ Redis Cluster (Sliding Windows) ]         [ Target Microservices (gRPC) ]
   - Rate Limit Quotas                          - Core Payment / Auth / Data
   - Token Bucket Atomic Eval                   - Circuit Breakers Active`,
    summary: 'Aegis is an edge gateway engineered to prevent noisy-neighbor starvation across multi-tenant microservices. Leverages Redis sliding-window clusters and atomic Lua scripts for sub-millisecond route resolution.',
    highlights: [
      'Token Bucket & Sliding-Window rate limiting with sub-millisecond evaluation.',
      'Active circuit breaking with adaptive fallback routes.',
      'Prometheus telemetry exporter with p99/p95 latency histograms.'
    ]
  },
  omnisync: {
    title: 'OmniSync Architecture: Multi-Region Event Mesh',
    diagram: `[ Ingress Events ] ──► [ Kafka Partition Broker ]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ Node Consumer Cluster ]         [ WebSocket State Mesh ]
   - Deduplication Engine            - Sub-20ms Pushes
   - Dead Letter Queue (DLQ)         - Regional Edge Relays
            │
            ▼
    [ PostgreSQL Store ]`,
    summary: 'OmniSync handles bi-directional state synchronization between distributed client nodes and backend services, leveraging Kafka consumer groups and self-healing WebSocket clusters.',
    highlights: [
      'Multi-consumer clustering with automated rebalance handling.',
      'Guaranteed message ordering with persistent Write-Ahead Logging (WAL).',
      'Supports high concurrent active socket connections.'
    ]
  },
  nexus: {
    title: 'Nexus Architecture: Distributed APM Trace Visualizer',
    diagram: `[ Distributed Traces ] ──► [ OpenTelemetry Collector ]
                                     │
                                     ▼
                          [ ClickHouse Columnar DB ]
                                     │ (Sub-second vector query)
                                     ▼
                           [ Nexus React UI ]
                    - Direct HTML5 Canvas Rendering
                    - Zero-lag 60 FPS Flame Graphs`,
    summary: 'Nexus is an observability dashboard engineered to render heavy trace trees and waterfalls over millions of points without DOM lag using an optimized 2D canvas pipeline.',
    highlights: [
      'Direct GPU-accelerated canvas rendering at 60 FPS.',
      'Aggregated microsecond trace queries via ClickHouse.',
      'Custom trace waterfall viewer with search & query syntax.'
    ]
  },
  hyperflow: {
    title: 'HyperFlow Architecture: DAG Distributed Workflow Engine',
    diagram: `[ Workflow Definition ] ──► [ DAG Compiler & Validator ]
                                    │
                                    ▼
                         [ Master Scheduler (Raft) ]
                        ┌───────────┼───────────┐
                        ▼           ▼           ▼
                   [ Worker 1 ] [ Worker 2 ] [ Worker 3 ]
                        └───────────┼───────────┘
                                    ▼
                        [ PostgreSQL State Log ]`,
    summary: 'HyperFlow evaluates dependency graphs for asynchronous computational pipelines, maintaining state checkpoints for zero-loss recovery during worker redeployments.',
    highlights: [
      'Topological DAG task scheduling with retry policies.',
      'State checkpointing ensuring zero lost progress during failover.',
      'Pluggable worker runners for containerized tasks.'
    ]
  }
};

function initProjectModals() {
  const modal = document.getElementById('arch-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('close-modal-btn');
  const viewBtns = document.querySelectorAll('.view-arch-btn');

  if (!modal || !closeBtn) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = ARCH_DATA[projKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalContent.innerHTML = `
        <pre class="modal-pre-box">${data.diagram}</pre>
        <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.91rem; line-height: 1.6;">${data.summary}</p>
        <h4 style="color: var(--accent-cyan); font-size: 0.82rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Key Architectural Decisions</h4>
        <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 7px;">
          ${data.highlights.map(h => `<li style="position: relative; padding-left: 16px; color: var(--text-primary); font-size: 0.88rem;"><span style="position: absolute; left: 0; color: var(--accent-cyan);">▹</span>${h}</li>`).join('')}
        </ul>
      `;

      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => { modal.close(); });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}

/* ==========================================================================
   5. Interactive CLI Terminal
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const terminalBody = document.getElementById('terminal-body');
  const buttons = document.querySelectorAll('.term-btn');

  if (!input || !history) return;

  const commands = {
    help: () => `
Available commands:
  <span class="term-highlight">about</span>       - Bio & engineering philosophy
  <span class="term-highlight">skills</span>      - Technical ecosystem & proficiencies
  <span class="term-highlight">projects</span>    - Flagship software architectures
  <span class="term-highlight">experience</span>  - Career milestones & leadership
  <span class="term-highlight">contact</span>     - Direct contact & links
  <span class="term-highlight">clear</span>       - Clear screen
  <span class="term-highlight">whoami</span>      - Current user role
  <span class="term-highlight">echo &lt;msg&gt;</span>  - Echo input
`,
    about: () => `
<span class="term-block-title">Joy — Senior Software Engineer</span>
Specializing in distributed systems, high concurrency backends (Go/TypeScript),
and modern web applications. Focused on fault tolerance, clean contracts, and latency reduction.
`,
    skills: () => `
<span class="term-block-title">Technical Capabilities:</span>
  • Languages: TypeScript, JavaScript, Go, Python, SQL
  • Backend: Node.js, NestJS, gRPC, REST, Kafka, Redis
  • Frontend: React, Next.js, Modern CSS, Web Vitals
  • Cloud & DevOps: Docker, Kubernetes, AWS, GCP, CI/CD, Terraform
  • Storage: PostgreSQL, Redis, ClickHouse
`,
    projects: () => `
<span class="term-block-title">Flagship Architectures:</span>
  1. <span class="term-highlight">Aegis</span>      - Distributed API Gateway & Token Bucket Rate Limiter
  2. <span class="term-highlight">OmniSync</span>   - Real-time Multi-Region Event Mesh (Kafka + WebSockets)
  3. <span class="term-highlight">Nexus</span>      - Distributed Telemetry Visualizer (Canvas rendering)
  4. <span class="term-highlight">HyperFlow</span>  - DAG Distributed Task Orchestrator
`,
    experience: () => `
<span class="term-block-title">Career Milestones:</span>
  • 2023-Present: Senior Full Stack & Systems Engineer
  • 2021-2023:    Full Stack Software Engineer
  • 2019-2021:    Software Engineer
`,
    contact: () => `
<span class="term-block-title">Direct Connection:</span>
  • Email:  <span class="term-highlight">joyashwin1998@gmail.com</span>
  • GitHub: <a href="https://github.com/joy-1998" target="_blank" style="color: var(--accent-cyan);">github.com/joy-1998</a>
`,
    whoami: () => `guest@portfolio (Permissions: Read-Only Inspector)`
  };

  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();
    const param = args.slice(1).join(' ');

    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="prompt-user">joy@dev</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span> ${escapeHTML(trimmed)}`;
    history.appendChild(cmdLine);

    if (cmd === 'clear') {
      history.innerHTML = '';
    } else if (cmd === 'echo') {
      const outLine = document.createElement('div');
      outLine.className = 'terminal-line';
      outLine.textContent = param;
      history.appendChild(outLine);
    } else if (commands[cmd]) {
      const outLine = document.createElement('div');
      outLine.className = 'terminal-line';
      outLine.innerHTML = commands[cmd]();
      history.appendChild(outLine);
    } else {
      const outLine = document.createElement('div');
      outLine.className = 'terminal-line';
      outLine.innerHTML = `zsh: command not found: <span style="color: #ff5f56;">${escapeHTML(cmd)}</span>. Type <span class="term-highlight">help</span> for commands.`;
      history.appendChild(outLine);
    }

    input.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeCommand(input.value);
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });

  terminalBody.addEventListener('click', () => { input.focus(); });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

/* ==========================================================================
   6. Copy Email & Toast
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const tooltip = document.getElementById('copy-tooltip');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'joyashwin1998@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      if (tooltip) tooltip.textContent = 'Copied!';
      showToast(`Copied ${email} to clipboard!`);
      setTimeout(() => { if (tooltip) tooltip.textContent = 'Copy'; }, 2000);
    } catch {
      showToast(`Email: ${email}`);
    }
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2600);
  }
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!mobileToggle || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', () => {
    if (drawer.classList.contains('active')) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => { link.addEventListener('click', closeDrawer); });
}

/* ==========================================================================
   8. Scroll Spy for Desktop
   ========================================================================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
          else link.classList.remove('active');
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));
}
