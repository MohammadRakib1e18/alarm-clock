const allSelects = document.querySelectorAll("select");
const timeSlot = document.getElementById("time");
const upcomingAlarms = document.getElementById("upcoming-alarms");
let selectedTime;
let isAlarmSet = false;
let audio = new Audio("./ringtone.mp3");
let upcomingAlarmList=[];

for (let i = 1; i <= 12; i++) {
  let h = i < 10 ? (i = "0" + i) : i;
  let option = `<option value="${h}">${h}</option>`;
  allSelects[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 0; i < 60; i++) {
  let m = i < 10 ? (i = "0" + i) : i;
  let option = `<option value="${m}">${m}</option>`;
  allSelects[1].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 0; i < 2; i++) {
  let ampm = i === 1 ? "PM" : "AM";
  let option = `<option value="${ampm}">${ampm}</option>`;
  allSelects[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

const greet = (id) =>{
  const deleteList = id.parentNode;
  const ul = deleteList.parentNode;
  ul.removeChild(deleteList);
}

const addToList = (selectedTime) => {
    let newAlarm = `<li>
      <span>${selectedTime}</span> <button onclick='greet(this)' class="delete">Delete</button>
    </li>`;
    upcomingAlarms.firstElementChild.insertAdjacentHTML("afterend", newAlarm);
}


setInterval(() => {
  const time = new Date();
  let hours = time.getHours();
  let mins = time.getMinutes();
  let seconds = time.getSeconds();

  let ampm = "AM";
  if (hours >= 12) {
    hours -= 12;
    ampm = "PM";
  }
  if (!hours) hours = 12;
  hours = hours < 10 ? (hours = "0" + hours) : hours;
  mins = mins < 10 ? (mins = "0" + mins) : mins;
  seconds = seconds < 10 ? (seconds = "0" + seconds) : seconds;

  timeSlot.innerText = `${hours}:${mins}:${seconds} ${ampm}`;

  if (selectedTime == `${hours}:${mins} ${ampm}`) {
    audio.play();
    audio.loop = true;
    console.log("yes");
  }
}, 1000);

document.querySelector("#set-alarm").addEventListener("click", () => {
  if (isAlarmSet) {
    isAlarmSet = false;
  }
  selectedTime = `${allSelects[0].value}:${allSelects[1].value} ${allSelects[2].value}`;
  upcomingAlarmList.push(selectedTime);
  addToList(selectedTime);

  isAlarmSet = true;
});

document.querySelector("#stop-alarm").addEventListener("click", () => {
  selectedTime = "";
});
