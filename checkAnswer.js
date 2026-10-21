function checkAnswer(correctAnswer) {
    const input = document.getElementById("input").value;
    const output = document.getElementById("output");
    
    if (parseInt(input) === correctAnswer) {
        output.textContent = "정답입니다!";
    } else {
        output.textContent = "오답입니다!";
    }
}