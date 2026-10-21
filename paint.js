// 1. 요소 가져오기
const container = document.querySelector('.problem-container');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// 펜 기본 스타일 설정 함수
function setPenStyle() {
    ctx.strokeStyle = '#000000'; // 펜 색상
    ctx.lineWidth = 2;           // 펜 두께
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// 2. 캔버스 해상도 맞춰주기 및 필기 데이터 복원 함수 (핵심)
function initCanvasSize() {
    if (!container || !canvas) return;

    // A. 기존 필기 데이터가 있다면 메모리에 백업
    let tempImageData = null;
    if (canvas.width > 0 && canvas.height > 0) {
        try {
            tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.log("백업할 필기 데이터가 없습니다.");
        }
    }

    // B. 캔버스 해상도를 부모 박스 크기에 맞춰 새로 설정 (이 시점에 도화지가 리셋됨)
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // C. 리셋된 펜 스타일 재설정
    setPenStyle();

    // D. 백업해둔 필기 데이터가 있다면 새 도화지 위에 다시 찍어 복원
    if (tempImageData) {
        ctx.putImageData(tempImageData, 0, 0);
    }
}

// 초기화 실행 및 렌더링 시차 대응
initCanvasSize();
window.addEventListener('load', () => setTimeout(initCanvasSize, 100));

// 3. 스크롤/상단바 유동 시 지워짐 방지 (가로 폭이 30px 이상 확실히 변했을 때만 실행)
let lastWidth = window.innerWidth;
let resizeTimer = null;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        // 미세한 스크롤바 생성이나 주소창 변동은 무시하고, 실제 브라우저 가로 폭이 변했을 때만 동작
        if (Math.abs(window.innerWidth - lastWidth) > 30) {
            lastWidth = window.innerWidth;
            initCanvasSize();
        }
    }, 200);
});

// 4. 마우스 / 터치 통합 좌표 정밀 계산 함수
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// 5. 그리기 동작 함수들
function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// 6. 마우스 이벤트 연결 (PC)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// 7. 터치 이벤트 연결 (태블릿 / 모바일)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
}, { passive: false });

// 8. 필기 전체 지우기 함수
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}