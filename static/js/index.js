//const 정답 = "APPLE";
let attempts = 0;
let index = 0;
let timer;

function toPadStart(num) {
  return String(num).padStart(2, "0");
}

function appStart() {
  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 연도 = 현재_시간.getFullYear();
      const 월 = 현재_시간.getMonth() + 1;
      const 일 = 현재_시간.getDate();
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#time");
      timeDiv.innerText = `${연도}년${월}월${일}일,${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "정답!! 게임이 종료되었습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center;position:absolute; top:50vh; left:45%; background-color:white;width=50px;height=30px;border:1px solid gray;";
    div.animate(
      {
        backgroundColor: ["#FFFF", "#F7618C"],
        offset: [0, 0],
        easing: ["ease-out", "ease-in"],
      },
      2000
    );
    document.body.appendChild(div);

    clearInterval(timer);
  };

  const ddang = () => {
    const div = document.createElement("div");
    div.innerText = "땡!! 틀렸습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center;position:absolute; top:50vh; left:45%; background-color:white;width=50px;height=30px;border:1px solid gray;";
    div.animate(
      {
        backgroundColor: ["#FFFF", "#8B5CF6"],
        color: [["#0000", "#FFFF"]],
        offset: [0, 0],
        easing: ["ease-out", "ease-in"],
      },
      1500
    );
    document.body.appendChild(div);

    clearInterval(timer);
  };

  const nextLine = () => {
    if (attempts === 6) {
      return gameover();
      attempts += 1;
      index = 0;
    } else {
      ddang();
      attempts += 1;
      index = 0;
    }
  };

  const handleBackspacd = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.borard-bloc[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("click", handleClick);
    displayGameover();
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답_객체 = await 응답.json();
    const 정답 = 정답_객체.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.borard-bloc[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = block.innerText;
      const keyboard = document.querySelector(
        `.key-part[data-key=${입력한_글자}]`
      );
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        if (keyboard == "undefined") return;
        else {
          block.style.background = "#F7618C";
          keyboard.style.background = "#F7618C";
        }
      } else if (정답.includes(입력한_글자)) {
        if (keyboard == "undefined") return;
        else {
          block.style.background = "#8B5CF6";
          keyboard.style.background = "#8B5CF6";
        }
      } else {
        if (keyboard == "undefined") return;
        else {
          block.style.background = "#000000";
          keyboard.style.background = "#000000";
        }
      }

      block.style.color = "white";
      keyboard.style.color = "white";
    }
    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleKeydown = (event) => {
    console.log("키가 입력!", event);

    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.borard-bloc[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspacd();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const handleClick = (e) => {
    console.log("클릭됨!", e);
    const key = e.target.dataset.key;
    const thisBlock = document.querySelector(
      `.borard-bloc[data-index='${attempts}${index}']`
    );

    if (e.srcElement.alt === "Backspace") handleBackspacd();
    else if (index === 5) {
      if (key === "ENTER") handleEnterKey();
      else return;
    } else {
      if (key === "ENTER") return;
      else {
        thisBlock.innerText = key;
        index += 1;
      }
    }
  };

  startTimer();

  window.addEventListener("click", handleClick);
  window.addEventListener("keydown", handleKeydown);
}

appStart();
