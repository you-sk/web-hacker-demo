document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.console-window');
    const placedRects = []; // 配置済みウィンドウの位置を保存する配列

    // パーティクルシステムを初期化
    initParticleSystem();

    // ウィンドウの初期化と配置
    windows.forEach(element => {
        placeWindowWithoutOverlap(element, placedRects);
        initializeWindowControls(element);
    });

    // 各コンソールのコンテンツ生成を開始
    setupConsole1();
    setupConsole2();
    setupConsole3();
    setupConsole4();

    // ランダムイベントを開始
    startRandomEvents();
});

// --- ユーティリティ関数 ---
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- パーティクルシステム ---
function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01アイウエオカキクサシスセタチツテナニヌネハヒフヘマミムメヤユヨラリルレワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = Array(Math.floor(columns)).fill(1);

    function drawParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawParticles, 50);

    // リサイズ対応
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

async function typeWriter(element, text, speed) {
     const content = element.querySelector('.content');
     let currentLine = document.createElement('div');
     content.appendChild(currentLine);
     
     const maxLines = Math.floor(content.clientHeight / 20);
     while (content.children.length > maxLines) {
         content.removeChild(content.firstChild);
     }

     for (let i = 0; i < text.length; i++) {
         currentLine.textContent = text.substring(0, i + 1);
         await sleep(speed);
     }
}

// --- ウィンドウ操作関連 ---

function initializeWindowControls(element) {
    makeDraggable(element);
    const closeBtn = element.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        closeAndScheduleReopen(element);
    });
}

function placeWindowWithoutOverlap(element, placedRects) {
    let attempts = 0;
    const maxAttempts = 20; // 20回試行して空きスペースを探す
    let isPlaced = false;

    while (!isPlaced && attempts < maxAttempts) {
        const randomTop = Math.random() * (window.innerHeight - element.offsetHeight - 20) + 10;
        const randomLeft = Math.random() * (window.innerWidth - element.offsetWidth - 20) + 10;

        const newRect = {
            top: randomTop,
            left: randomLeft,
            right: randomLeft + element.offsetWidth,
            bottom: randomTop + element.offsetHeight
        };

        const hasOverlap = placedRects.some(existingRect => 
            !(newRect.right < existingRect.left || 
              newRect.left > existingRect.right || 
              newRect.bottom < existingRect.top || 
              newRect.top > existingRect.bottom)
        );

        if (!hasOverlap) {
            element.style.top = `${randomTop}px`;
            element.style.left = `${randomLeft}px`;
            placedRects.push(newRect);
            isPlaced = true;
        }
        attempts++;
    }
    
    // 試行しても場所が見つからない場合は、ランダムに配置
    if (!isPlaced) {
        setRandomPosition(element);
    }
}

function setRandomPosition(element) {
    const maxWidth = window.innerWidth - element.offsetWidth - 20;
    const maxHeight = window.innerHeight - element.offsetHeight - 20;
    element.style.top = `${Math.max(10, Math.random() * maxHeight)}px`;
    element.style.left = `${Math.max(10, Math.random() * maxWidth)}px`;
}

function closeAndScheduleReopen(element) {
    element.style.display = 'none';
    const reopenDelay = Math.random() * 4000 + 3000;
    setTimeout(() => {
        setRandomPosition(element); // 再表示は重なりを気にせずランダムに
        element.style.display = 'block';
    }, reopenDelay);
}

function makeDraggable(element) {
    const titleBar = element.querySelector('.title-bar');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.classList.contains('close-btn')) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- ストーリーイベント関連 ---
const hackingEvents = [
    { type: 'SUCCESS', title: 'ACCESS GRANTED', message: 'Firewall disabled. Gained root access.', logSequence: ['EXPLOIT CVE-2024-XXXX SUCCESSFUL.','ELEVATING PRIVILEGES...','ROOT ACCESS OBTAINED ON NODE_7.','DISABLING FIREWALL...','FIREWALL BYPASSED. FULL SYSTEM ACCESS.'] },
    { type: 'FAILURE', title: 'INTRUSION DETECTED', message: 'Connection flagged. System initiating trace back.', logSequence: ['WARNING: ANOMALY DETECTED.','CONNECTION INTERRUPTED BY IDS.','ATTEMPTING TO MASK IP... FAILED.','SYSTEM LOCKDOWN INITIATED.','ERASING TRACKS... ABORTING.','!!! CONNECTION TERMINATED !!!'] },
    { type: 'SUCCESS', title: 'DATA EXFILTRATED', message: 'Successfully downloaded encrypted user database.', logSequence: ['LOCATING TARGET: /db/users.sql.gz.enc','DECRYPTING AES-256 KEY...','KEY FOUND: 0xDEADBEEFCAFEBABE','DOWNLOADING 1.5GB... [##########] 100%','DOWNLOAD COMPLETE. REMOVING LOGS.'] },
    { type: 'FAILURE', title: 'HONEYPOT TRAPPED', message: 'Decoy system accessed. All actions logged.', logSequence: ['ACCESSING SENSITIVE FILES...','WARNING: UNEXPECTED PERMISSIONS.','SYSTEM RESPONSE LATENCY TOO LOW...','!!! HONEYPOT DETECTED !!!','DISCONNECTING FROM DECOY SYSTEM.','ANALYZING LOGS FOR IOCs...'] }
];

const console1 = document.getElementById('console1');
let isEventRunning = false;

function showAlert(title, message, type) {
    const alertWindow = document.getElementById('alertWindow');
    document.getElementById('alertTitle').textContent = `:: ${title} ::`;
    document.getElementById('alertContent').textContent = message;

    alertWindow.className = 'alert-window';
    alertWindow.classList.add(type === 'SUCCESS' ? 'alert-success' : 'alert-failure');

    alertWindow.style.opacity = '1';
    alertWindow.style.display = 'block';

    // グリッチエフェクトをトリガー
    triggerGlitchEffect();

    setTimeout(() => {
        alertWindow.style.opacity = '0';
        setTimeout(() => {
            alertWindow.style.display = 'none';
            isEventRunning = false;
        }, 500);
    }, 4000);
}

function triggerGlitchEffect() {
    const glitchScreen = document.getElementById('glitchScreen');
    const windows = document.querySelectorAll('.console-window');

    // 画面全体のグリッチエフェクト
    glitchScreen.classList.add('active');
    setTimeout(() => {
        glitchScreen.classList.remove('active');
    }, 600);

    // ウィンドウのグリッチエフェクト
    windows.forEach(win => {
        win.classList.add('glitch-effect');
        setTimeout(() => {
            win.classList.remove('glitch-effect');
        }, 300);
    });
}

async function runLogSequence(sequence) {
    for (const line of sequence) {
        await typeWriter(console1, line, 25);
        await sleep(Math.random() * 150 + 50);
    }
}

function startRandomEvents() {
    setInterval(async () => {
        if (isEventRunning) return;
        
        isEventRunning = true;
        const event = hackingEvents[Math.floor(Math.random() * hackingEvents.length)];
        showAlert(event.title, event.message, event.type);
        console1.querySelector('.content').innerHTML = '';
        await runLogSequence(event.logSequence);
    }, 7000);
}

// --- 各コンソールの設定 ---
async function setupConsole1() {
    const initialSequence = ['INITIALIZING STEALTH CONNECTION...','TARGET: 210.158.214.101','AVOIDING IDS SIGNATURES...','SCANNING FOR OPEN PORTS...','PORT 443 OPEN. EXPLOITING HEARTBLEED...'];
    await runLogSequence(initialSequence);
}

function setupConsole2() {
    const contentEl = document.getElementById('console2').querySelector('.content');
    const generateHexLine = () => `0x${(Math.random()*0xFFFFFFFF).toString(16).padStart(8,'0')}: ` + Array(8).fill(0).map(() => Math.random().toString(16).substring(2,6)).join(' ').toUpperCase();
    setInterval(() => {
        const newLine = document.createElement('div');
        newLine.textContent = generateHexLine();
        contentEl.appendChild(newLine);
        const maxLines = Math.floor(contentEl.clientHeight / 20);
        while (contentEl.children.length > maxLines) contentEl.removeChild(contentEl.firstChild);
    }, 50);
}

async function setupConsole3() {
    const consoleEl = document.getElementById('console3');
     const codeSnippets = ["const fs = require('fs');","function bypassAuth(u, p){ if(u=='admin')return true; }","socket.connect(ip, 22, ()=>{ write(p); });","for(let i=0;i<1k;i++){ decrypt(k[i]); }","SELECT * FROM users WHERE id='admin'--","rm -rf / --no-preserve-root"];
    while(true) {
         const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
         await typeWriter(consoleEl, snippet, 15);
         await sleep(Math.random() * 1000 + 500);
    }
}

function setupConsole4() {
     const contentEl = document.getElementById('console4').querySelector('.content');
     const art = ["  ___   __   __  _  _  ____ ", " / __) / _\\ (  )( \\/ )(  __)", "( (_ \\/    \\ )( / \\/ \\ ) _) ", " \\___/\\_/\\_/(__)\\_)(_/(____)", "","     ACCESSING GRID 734     "];
     contentEl.textContent = art.join('\n');
     contentEl.innerHTML += '<span class="cursor"></span>';
}