/**
 * JOY.DEV — Portfolio Interactive Behaviors
 * Includes: Ambient Particle Network, Typewriter Engine, Interactive CLI Terminal,
 * Architecture Inspection Modal, Copy to Clipboard, and Accessible Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypewriter();
  initStackFilters();
  initProjectModals();
  initTerminal();
  initCopyEmail();
  initNavigation();
});

/* ==========================================================================
   1. Ambient Interactive Canvas (Constellation / Network Particles)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Respect reduced-motion preferences
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    // Number of particles responsive to screen size
    const count = Math.floor((width * height) / 18000);
    const particleCount = Math.min(Math.max(count, 35), 75);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ',
        baseAlpha: Math.random() * 0.35 + 0.15
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Bounce on edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse magnetism
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.baseAlpha})`;
      ctx.fill();

      // Connect adjacent particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   2. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrases = [
    'Distributed Systems & High Concurrency',
    'Resilient Cloud Microservices & gRPC',
    'High-Throughput Event Meshes (Kafka & Redis)',
    'Reactive & Performant Full-Stack Architecture',
    'Automated CI/CD & Zero-Downtime Deployments'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeCycle() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full sentence
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(typeCycle, typingSpeed);
  }

  typeCycle();
}

/* ==========================================================================
   3. Tech Stack Matrix Filtering
   ========================================================================== */
function initStackFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Architecture Deep-Dive Dialog / Modal
   ========================================================================== */
const ARCH_DATA = {
  aegis: {
    title: 'Aegis Architecture: High-Throughput Distributed Gateway',
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
    summary: 'Aegis was designed to solve noisy-neighbor concurrency starvation across multi-tenant enterprise APIs. By offloading rate-limiting decisions to optimized atomic Lua scripts on an in-memory Redis cluster, per-request gateway overhead was throttled down to sub-1.5ms.',
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
    summary: 'OmniSync powers bidirectional telemetry updates across globally distributed nodes. Built with Go and Kafka consumer groups to guarantee at-least-once message delivery with strict client-side idempotency.',
    highlights: [
      'Multi-consumer clustering with automated rebalance handling.',
      'Zero message loss with persistent Write-Ahead Logging (WAL).',
      'Scalable to 100k+ concurrent active socket connections.'
    ]
  },
  nexus: {
    title: 'Nexus Architecture: Real-Time APM Trace Visualizer',
    diagram: `[ Distributed Traces ] ──► [ OpenTelemetry Collector ]
                                     │
                                     ▼
                          [ ClickHouse Columnar DB ]
                                     │ (Sub-second vector query)
                                     ▼
                           [ Nexus React UI ]
                    - Direct HTML5 Canvas Rendering
                    - Zero-lag 60 FPS Flame Graphs`,
    summary: 'Legacy APM dashboards frequently freeze when rendering 500k+ telemetry points over time. Nexus bypasses the standard DOM reconciliation engine by rendering trace trees and waterfall flame graphs directly via an optimized 2D canvas pipeline.',
    highlights: [
      'Direct GPU-accelerated canvas rendering at 60 FPS.',
      'Aggregated microsecond trace queries via ClickHouse.',
      'Custom trace waterfall viewer with search & query syntax.'
    ]
  },
  hyperflow: {
    title: 'HyperFlow Architecture: DAG Distributed Job Engine',
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
    summary: 'HyperFlow evaluates complex dependency graphs for asynchronous jobs with variable execution times. It maintains distributed consensus and resumes execution automatically upon node failure without rerunning idempotently completed nodes.',
    highlights: [
      'Topological DAG task scheduling with retry policies.',
      'State checkpointing ensuring zero lost progress during redeployments.',
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
        <pre class="modal-arch-diagram">${data.diagram}</pre>
        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.95rem; line-height: 1.6;">${data.summary}</p>
        <h4 style="color: var(--accent-cyan); font-size: 0.9rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Key Architectural Decisions</h4>
        <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px;">
          ${data.highlights.map(h => `<li style="position: relative; padding-left: 18px; color: var(--text-main); font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--accent-cyan);">▹</span>${h}</li>`).join('')}
        </ul>
      `;

      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });
}

/* ==========================================================================
   5. Interactive CLI Terminal
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const terminalBody = document.getElementById('terminal-body');

  if (!input || !history) return;

  const commands = {
    help: () => `
Available commands:
  <span class="cmd-highlight">about</span>       - Print bio and architectural philosophy
  <span class="cmd-highlight">skills</span>      - List core engineering capabilities
  <span class="cmd-highlight">projects</span>    - Summary of flagship software architectures
  <span class="cmd-highlight">experience</span>  - Career timeline & senior engineering impact
  <span class="cmd-highlight">contact</span>     - Reach out via email or GitHub
  <span class="cmd-highlight">clear</span>       - Clear terminal window
  <span class="cmd-highlight">whoami</span>      - Current user role
  <span class="cmd-highlight">echo &lt;msg&gt;</span>  - Echo custom argument
`,
    about: () => `
<span class="cmd-output-title">Joy | Senior Software Engineer & Full Stack Architect</span>
Specializing in distributed systems, high concurrency backends (Go/TypeScript),
and reactive web platforms. Obsessed with high uptime, type-safety, and latency reduction.
`,
    skills: () => `
<span class="cmd-output-title">Core Technical Capabilities:</span>
  • Languages: TypeScript, JavaScript, Go (Golang), Python, SQL
  • Backend: Node.js, Express, NestJS, gRPC, REST, Kafka, Redis
  • Frontend: React, Next.js, HTML5/CSS3, Modern Design Systems
  • DevOps & Cloud: Docker, Kubernetes, AWS, GCP, CI/CD, Terraform
  • Storage: PostgreSQL, Redis, ClickHouse, MongoDB
`,
    projects: () => `
<span class="cmd-output-title">Flagship Architectures:</span>
  1. <span class="cmd-highlight">Aegis</span>      - Distributed API Gateway & Token Bucket Rate Limiter (50k+ req/sec)
  2. <span class="cmd-highlight">OmniSync</span>   - Real-time Multi-Region Event Mesh (Kafka + WebSockets)
  3. <span class="cmd-highlight">Nexus</span>      - Distributed Telemetry & Trace Visualizer (Canvas 60 FPS)
  4. <span class="cmd-highlight">HyperFlow</span>  - DAG Distributed Task Orchestrator (Consensus & Failover)
`,
    experience: () => `
<span class="cmd-output-title">Track Record:</span>
  • 2023-Present: Senior Full Stack & Systems Engineer (Platforms & Cloud)
  • 2021-2023:    Full Stack Software Engineer (Scale & Real-Time Sync)
  • 2019-2021:    Software Engineer (Web Services & Developer Tooling)
`,
    contact: () => `
<span class="cmd-output-title">Direct Connection:</span>
  • Email:  <span class="cmd-highlight">joyashwin1998@gmail.com</span>
  • GitHub: <a href="https://github.com/joy-1998" target="_blank" style="color: var(--accent-cyan);">github.com/joy-1998</a>
`,
    whoami: () => `guest@portfolio (Permissions: Read-Only System Inspector)`,
    sudo: () => `<span style="color: #ff5f56;">Permission denied: Nice try! You are already a guest of honor.</span>`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = input.value.trim();
      if (!rawInput) return;

      const args = rawInput.split(' ');
      const cmd = args[0].toLowerCase();
      const param = args.slice(1).join(' ');

      // Add executed command line
      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line';
      cmdLine.innerHTML = `<span class="prompt-user">joy@dev</span><span class="prompt-sep">:</span><span class="prompt-path">~</span><span class="prompt-char">$</span> ${escapeHTML(rawInput)}`;
      history.appendChild(cmdLine);

      // Handle output
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
        outLine.innerHTML = `zsh: command not found: <span style="color: #ff5f56;">${escapeHTML(cmd)}</span>. Type <span class="cmd-highlight">help</span> for valid commands.`;
        history.appendChild(outLine);
      }

      input.value = '';
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  // Clicking anywhere in terminal body focuses the input
  terminalBody.addEventListener('click', () => {
    input.focus();
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   6. Copy to Clipboard & Toast
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
      setTimeout(() => {
        if (tooltip) tooltip.textContent = 'Copy';
      }, 2000);
    } catch {
      // Fallback
      showToast(`Email: ${email}`);
    }
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ==========================================================================
   7. Navigation & Mobile Toggle
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));
}
