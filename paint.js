// 1. 요소 가져오기
const container = document.querySelector('.problem-container');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// 2. 캔버스 해상도 맞춰주기
function initCanvasSize() {
    if (!container || !canvas) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // 펜 스타일 설정 (크기 변경 시 리셋되므로 다시 적용)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// 스크립트 로드 시 즉시 및 이벤트 연결
initCanvasSize();
window.addEventListener('load', () => setTimeout(initCanvasSize, 100));
window.addEventListener('resize', initCanvasSize);

// 3. 마우스 / 터치 통합 좌표 계산 함수
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 터치 이벤트인 경우 첫 번째 손가락(e.touches[0])의 좌표를 가져옴
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// 4. 그리기 시작 (마우스 누름 / 터치 시작)
function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// 5. 그리는 중 (마우스 이동 / 터치 이동)
function draw(e) {
    if (!isDrawing) return;
    
    // 터치 시 화면 스크롤 현상 방지
    if (e.touches) e.preventDefault();

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

// 6. 그리기 종료 (마우스 뗌 / 터치 끝)
function stopDrawing() {
    isDrawing = false;
}

// 7. 마우스 이벤트 연결
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// 8. 터치 이벤트 연결 (태블릿/모바일 지원)
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);

// 9. 필기 지우기 함수
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}