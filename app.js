const allSelects = document.querySelectorAll("select");
const timeSlot = document.getElementById("time");
let upcomingAlarms = document.getElementById("upcoming-alarms");
let selectedTime;
let found = false;
let currentTime = "";
let pausedTime = "";
let audio = new Audio("./ringtone.mp3");
let upcomingAlarmList = [];

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

const deleteAlarm = (id, selectedTime) => {
  const deleteList = id.parentNode;
  const deletedTime = deleteList.querySelector("span").innerText;

  const ul = deleteList.parentNode;
  ul.removeChild(deleteList);
  let index =i= -1;
  for (let alarm of upcomingAlarmList) {
    i++;
    if (alarm.selectedTime == deletedTime) {
      index=i;
      break;
    }
  }
  if (index > -1) {
    upcomingAlarmList.splice(index, index + 1);
  }
};

const showAlarm = () => {
  document.getElementById("upcoming-alarms").innerHTML = `<span> </span>`;
  upcomingAlarms = document.getElementById("upcoming-alarms");
  console.log(upcomingAlarms);
  for (let slot of upcomingAlarmList) {
    let newAlarm = `<li>
      <span>${slot.selectedTime}</span> <button onclick='deleteAlarm(this, selectedTime)' class="delete">Delete</button>
    </li>`;
    upcomingAlarms.firstElementChild.insertAdjacentHTML("afterend", newAlarm);
  }
};

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
  currentTime = `${hours}:${mins} ${ampm}`;

  found = false;
  for (let alarm of upcomingAlarmList) {
    if (currentTime == pausedTime) continue;
    if (alarm.selectedTime == currentTime) {
      audio.play();
      audio.loop = true;
      found = true;
    }
  }
  if (!found) audio.pause();
}, 1000);

document.querySelector("#set-alarm").addEventListener("click", () => {
  selectedTime = `${allSelects[0].value}:${allSelects[1].value} ${allSelects[2].value}`;
  if (
    selectedTime.includes("Hour") ||
    selectedTime.includes("Minute") ||
    selectedTime.includes("AM/PM")
  ) {
    return alert("Please, select correct time!");
  }

  let index = -1;
  for (let alarm of upcomingAlarmList) {
    if (alarm.selectedTime == selectedTime) {
      index = 0;
      break;
    }
  }
  if (index > -1) {
    return alert("Already selected.\nPlease, select another time-slot");
  }
  const object = {
    selectedTime,
    snoozeCnt: 0,
  };
  upcomingAlarmList.push(object);
  showAlarm();
});

document.querySelector("#stop-alarm").addEventListener("click", () => {
  if (!found) {
    return alert("Alarm isn't ringing!!!");
  }
  pausedTime = currentTime;
});

document.querySelector("#snooze-alarm").addEventListener("click", () => {
  let index =i= -1;
  for (let alarm of upcomingAlarmList) {
    i++;
    if (alarm.selectedTime == currentTime) {
      index=i;
      break;
    }
  }
  if (index > -1) {
    if(upcomingAlarmList[index].snoozeCnt==3){
      return alert('Maximum Snooze counter (3) has been reached!');
    }
    upcomingAlarmList[index].snoozeCnt++;

    const time = new Date();
    let hours = time.getHours();
    let mins = time.getMinutes() + 3;
    if (mins >= 60) {
      mins -= 60;
      hours++;
    }
    if (hours > 24) {
      hours = 24;
    }

    let ampm = "AM";
    if (hours >= 12 && hours < 24) ampm = "PM";
    if (hours >= 12) {
      hours -= 12;
    }
    if (!hours) hours = 12;
    hours = hours < 10 ? (hours = "0" + hours) : hours;
    mins = mins < 10 ? (mins = "0" + mins) : mins;
    upcomingAlarmList[index].selectedTime = `${hours}:${mins} ${ampm}`;
    showAlarm();
  }
  else{
    return alert("No Alarm is ringing right now!!!");
  }
});
