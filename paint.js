// 1. 요소 가져오기
const container = document.querySelector('.problem-container');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// 펜 기본 스타일 설정 함수
function setPenStyle() {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// 2. 캔버스 해상도 맞춤 및 기존 필기 백업/복원 함수
function initCanvasSize() {
    if (!container || !canvas) return;

    // A. 기존 필기 데이터가 있다면 임시 백업
    let tempImageData = null;
    if (canvas.width > 0 && canvas.height > 0) {
        try {
            tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.log("백업할 필기 데이터가 없습니다.");
        }
    }

    // B. 캔버스 해상도를 부모 박스 크기에 새로 맞춤 (크기 동기화)
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // C. 캔버스 크기가 바뀌면 펜 설정이 초기화되므로 재설정
    setPenStyle();

    // D. 백업해둔 필기 데이터가 있다면 다시 복원
    if (tempImageData) {
        ctx.putImageData(tempImageData, 0, 0);
    }
}

// 초기화 실행 및 화면 크기 변경 감지
initCanvasSize();
window.addEventListener('load', () => setTimeout(initCanvasSize, 100));

// 스크롤 시 사파리 주소창 유동 문제 대응 (가로 폭이 실제로 변할 때만 리사이즈)
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        initCanvasSize();
    }
});

// 3. 마우스 / 터치 통합 좌표 정밀 계산 함수
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

// 4. 그리기 동작 함수들
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

// 5. 마우스 이벤트 연결
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// 6. 태블릿/모바일 터치 이벤트 연결
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

// 7. 지우기 함수
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}