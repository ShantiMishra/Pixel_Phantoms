const REPO_OWNER = 'sayeeg-11';
const REPO_NAME = 'Pixel_Phantoms';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    init3DInteraction();
    initVisualizers();
});

/* ================================
   1. DATA & DASHBOARD LOGIC
   ================================ */
async function initDashboard() {
    try {
        const [contributors, repo] = await Promise.all([
            fetch(`${API_BASE}/contributors?per_page=100`).then(res => res.json()),
            fetch(API_BASE).then(res => res.json())
        ]);

        if (Array.isArray(contributors)) {
            updateGlobalStats(contributors, repo);
            renderLeaderboard(contributors);
        }
    } catch (error) {
        console.warn("Using mock data due to API limit.");
        loadMockData();
    }
}

function updateGlobalStats(contributors, repo) {
    animateCount("total-contributors", contributors.length);
    animateCount("total-stars", repo.stargazers_count);
    
    // Calculate pseudo-PR count
    const totalContribs = contributors.reduce((acc, c) => acc + c.contributions, 0);
    animateCount("total-prs", totalContribs);
}

function renderLeaderboard(data) {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    // Sort by contributions
    data.sort((a, b) => b.contributions - a.contributions);

    data.slice(0, 10).forEach((user, index) => {
        const xp = user.contributions * 125; // Gamified Multiplier
        
        // Physics Logic: Calculate "Velocity" based on rank
        const velocity = Math.max(100 - (index * 5), 10) + "%";
        
        let league = "ROOKIE";
        let colorClass = "";
        
        if(xp > 5000) { league = "GOLD"; colorClass = "color: #ffd700"; }
        else if(xp > 2000) { league = "SILVER"; colorClass = "color: #c0c0c0"; }
        else { league = "BRONZE"; colorClass = "color: #cd7f32"; }

        const row = `
            <tr>
                <td style="color:var(--text-dim)">#${String(index+1).padStart(2,'0')}</td>
                <td style="display:flex; align-items:center; gap:10px; font-weight:bold;">
                    <img src="${user.avatar_url}" style="width:24px; height:24px; border-radius:50%; border:1px solid var(--neon-cyan)">
                    ${user.login}
                </td>
                <td style="${colorClass}; font-weight:800; letter-spacing:1px;">${league}</td>
                <td>
                    <div style="width:100px; height:4px; background:rgba(255,255,255,0.1); border-radius:2px;">
                        <div style="width:${velocity}; height:100%; background:var(--neon-green); box-shadow:0 0 5px var(--neon-green);"></div>
                    </div>
                </td>
                <td style="font-family:var(--font-mono); color:var(--neon-cyan)">${xp.toLocaleString()} XP</td>
                <td><span style="font-size:0.7rem; border:1px solid var(--neon-green); color:var(--neon-green); padding:2px 6px; border-radius:4px;">ONLINE</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/* ================================
   2. 3D INTERACTION LOGIC
   ================================ */
function init3DInteraction() {
    const container = document.querySelector('.stage-3d-panel');
    const cube = document.getElementById('cube');

    if (!container || !cube) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X within element
        const y = e.clientY - rect.top;  // Mouse Y within element
        
        // Calculate rotation based on center of panel
        // Center is 0,0. Left/Top is negative, Right/Bottom is positive.
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 45; // Max 45deg rotation
        const rotateX = -((y - centerY) / centerY) * 45; // Invert Y axis for natural feel

        // Apply transform
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Reset on leave
    container.addEventListener('mouseleave', () => {
        cube.style.transform = `rotateX(-20deg) rotateY(-30deg)`; // Back to default
    });
}

/* ================================
   3. VISUALIZERS & UTILS
   ================================ */
function initVisualizers() {
    const barContainer = document.getElementById('chart-bars');
    const barCount = 15;

    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'mini-bar';
        // Random height for visual effect
        const h = Math.floor(Math.random() * 80) + 20; 
        bar.style.height = `${h}%`;
        // Stagger animation
        bar.style.animation = `pulse-bar 1s infinite alternate ${i * 0.1}s`;
        barContainer.appendChild(bar);
    }
}

function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let start = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    
    // Safety for large numbers
    const safeStep = stepTime < 10 ? 10 : stepTime; 
    const increment = target > 100 ? Math.ceil(target / 50) : 1;

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.innerText = start.toLocaleString();
    }, safeStep);
}

function loadMockData() {
    const mock = [
        { login: "Neo_The_One", avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=neo", contributions: 150 },
        { login: "Trinity_Core", avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=tri", contributions: 120 },
        { login: "Morpheus_Dev", avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=mor", contributions: 95 },
        { login: "Cipher_Ops", avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=cip", contributions: 80 }
    ];
    updateGlobalStats(mock, { stargazers_count: 1024 });
    renderLeaderboard(mock);
}