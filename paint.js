const container = document.querySelector('.problem-container');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// 선 스타일 설정 (검은색 펜, 두께 2px)

function initCanvasSize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

window.addEventListener('load', () => {
    setTimeout(initCanvasSize, 100);
});

window.addEventListener('resize', initCanvasSize);

// 마우스 누를 때 (그리기 시작)
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

// 마우스 움직일 때 (선 그리기)
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

// 마우스 뗬을 때 / 캔버스 밖으로 나갔을 때 (그리기 중단)
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

// 지우기 기능
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}