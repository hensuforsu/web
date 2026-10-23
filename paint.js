// 1. 요소 가져오기
const container = document.querySelector('.problem-container');
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// 그려진 모든 선(획) 데이터를 저장하는 배열
// 구조: [ { points: [{x, y}, ...], color: '#000000', width: 2 }, ... ]
let strokes = [];
let currentStroke = null;

// 펜 스타일 적용 함수
function setPenStyle(color = '#000000', width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

// 2. 전체 필기 다시 그리기 함수
function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokes.forEach(stroke => {
    if (stroke.points.length < 1) return;

    setPenStyle(stroke.color, stroke.width);
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  });
}

// 3. 캔버스 크기 맞춤 (크기 변경 시 좌표 데이터로 다시 그림)
function initCanvasSize() {
  if (!container || !canvas) return;

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // 크기 변경 후 데이터 기반 재그리기 (뭉개짐 원천 차단)
  redrawAll();
}

// 부모 요소 크기 변화 감지
const resizeObserver = new ResizeObserver(() => initCanvasSize());
if (container) resizeObserver.observe(container);

// 4. 좌표 계산 함수
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

// 5. 그리기 동작 (선 좌표 수집)
function startDrawing(e) {
  isDrawing = true;
  canvas.setPointerCapture(e.pointerId);

  const pos = getPos(e);
  
  // 새로운 획 생성
  currentStroke = {
    color: '#000000',
    width: 2,
    points: [pos]
  };
  strokes.push(currentStroke);

  setPenStyle(currentStroke.color, currentStroke.width);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing || !currentStroke) return;

  const pos = getPos(e);
  currentStroke.points.push(pos); // 좌표 저장

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing(e) {
  if (!isDrawing) return;
  isDrawing = false;
  currentStroke = null;
  canvas.releasePointerCapture(e.pointerId);
}

// 6. 포인터 이벤트 연결
canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);

// 7. 지우기 함수 (데이터 배열 초기화 후 다시 그리기)
function clearCanvas() {
  strokes = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}