document.addEventListener("DOMContentLoaded", function () {
    loadAlarms();
    checkAlarm();
    setInterval(checkAlarm, 1000); // Check every second
});

let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
let audio = new Audio("medicine_reminder.mp3");
audio.loop = true; // Ensure alarm rings continuously
let isAlarmActive = false; // Flag to track if alarm is ringing

function setAlarm() {
    let alarmTime = document.getElementById("alarmTime").value;
    if (!alarmTime) {
        alert("Please select a valid time!");
        return;
    }

    if (!alarms.includes(alarmTime)) {
        alarms.push(alarmTime);
        localStorage.setItem("alarms", JSON.stringify(alarms));
        displayAlarms();
    }
}

function cancelAlarm() {
    let alarmTime = document.getElementById("alarmTime").value;
    if (!alarmTime) {
        alert("Please select a time to cancel.");
        return;
    }

    alarms = alarms.filter(time => time !== alarmTime);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    displayAlarms();
}

function loadAlarms() {
    let alarmList = document.getElementById("alarmList");
    if (alarmList) {
        alarmList.innerHTML = "";
        alarms.forEach(alarm => {
            let listItem = document.createElement("li");
            listItem.textContent = Alarm Set for: ${alarm};
            alarmList.appendChild(listItem);
        });
    }
}

function checkAlarm() {
    let now = new Date();
    let currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // Format: HH:MM

    if (alarms.includes(currentTime) && !isAlarmActive) {
        showNotification();
        playAlarm();
        isAlarmActive = true; // Prevent multiple triggers
    }
}

function showNotification() {
    let notificationBox = document.getElementById("alarmNotification");
    if (notificationBox) {
        notificationBox.classList.remove("hidden");
        document.getElementById("alarmMessage").textContent = "Medicine Time!";
    }
}

function playAlarm() {
    audio.play();
}

function stopAlarm() {
    audio.pause();
    audio.currentTime = 0;
    isAlarmActive = false; // Reset flag so alarm can ring next time

    // Hide the notification box
    let notificationBox = document.getElementById("alarmNotification");
    if (notificationBox) notificationBox.classList.add("hidden");

    // Remove the triggered alarm from the list
    let now = new Date();
    let currentTime = now.toTimeString().split(" ")[0].slice(0, 5);
    alarms = alarms.filter(time => time !== currentTime);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    displayAlarms();
}
