document.addEventListener('DOMContentLoaded', () => {
    generateCircuitLines();
    renderDominationLogic();
    
    // Sync with global theme indicator if present
    console.log("Protocol Sync: Online");
});

function generateCircuitLines() {
    const container = document.getElementById('circuit-bg');
    for (let i = 0; i < 12; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        
        // Random placement
        line.style.top = Math.random() * 100 + '%';
        line.style.left = Math.random() * 100 + '%';
        line.style.width = Math.random() * 200 + 50 + 'px';
        line.style.height = '2px';
        line.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(line);
    }
}

function renderDominationLogic() {
    // Transparency Data for Leaderboard Logic
    const matrix = [
        { label: "Code Complexity ($Weight_i$)", val: "60%", status: "CORE" },
        { label: "Community Support", val: "25%", status: "STABLE" },
        { label: "R&D Archive Bonus", val: "15%", status: "BONUS" }
    ];

    const matrixContainer = document.getElementById('logic-matrix');
    matrixContainer.innerHTML = matrix.map(item => `
        <div class="logic-row">
            <span class="logic-label">${item.label}</span>
            <span class="logic-value">${item.val}</span>
            <span class="logic-status badge-${item.status.toLowerCase()}">${item.status}</span>
        </div>
    `).join('');
}