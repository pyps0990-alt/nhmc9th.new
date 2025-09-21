const auth = firebase.auth();
const db = firebase.firestore();
const table = document.getElementById("admin-table");
const select = document.getElementById("activity");
let members = [];
let chartInstance = null;

// 登入保護
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "../login.html";
  } else {
    const uid = user.uid;
    db.collection("users").doc(uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const welcome = document.getElementById("welcome");
        welcome.textContent = `👤 ${data.name}（${data.role}），歡迎回來！`;
      }
    });
  }
});

// 登出
function logout() {
  auth.signOut().then(() => window.location.href = "../login.html");
}

// 載入活動選單
function loadActivities() {
  db.collection("activities").orderBy("date").get().then(snapshot => {
    select.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.date} ${data.name}`;
      select.appendChild(option);
    });
    loadAttendance(); // 載入第一個活動的出席紀錄
  });
}

// 取得目前選取的活動 ID
function getActivityId() {
  return select.value;
}

// 載入出席紀錄
function loadAttendance() {
  const activityId = getActivityId();
  db.collection("attendance").doc(activityId).collection("members").get().then(snapshot => {
    members = [];
    snapshot.forEach(doc => {
      members.push({ name: doc.id, present: doc.data().present });
    });
    renderTable();
  });
}

// 儲存出席狀態
function saveAttendance(name, present) {
  const activityId = getActivityId();
  db.collection("attendance").doc(activityId).collection("members").doc(name).set({
    present,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// 新增社員
function addMember() {
  const name = document.getElementById("newName").value.trim();
  if (name) {
    members.push({ name, present: false });
    saveAttendance(name, false);
    document.getElementById("newName").value = "";
    renderTable();
  }
}

// 刪除社員
function removeMember(index) {
  const activityId = getActivityId();
  const name = members[index].name;
  db.collection("attendance").doc(activityId).collection("members").doc(name).delete();
  members.splice(index, 1);
  renderTable();
}

// 切換出席狀態
function toggleAttendance(index) {
  members[index].present = !members[index].present;
  saveAttendance(members[index].name, members[index].present);
  renderTable();
}

// 渲染表格
function renderTable() {
  table.innerHTML = "";
  members.forEach((m, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${m.name}</td>
      <td class="p-2 text-center">
        <input type="checkbox" ${m.present ? "checked" : ""} onchange="toggleAttendance(${i})" />
      </td>
      <td class="p-2 text-center">
        <button onclick="removeMember(${i})" class="bg-red-600 px-2 py-1 rounded hover:bg-red-500">刪除</button>
      </td>
    `;
    table.appendChild(row);
  });
  updateChart();
}

// 更新出席率圖表
function updateChart() {
  const presentCount = members.filter(m => m.present).length;
  const absentCount = members.length - presentCount;
  const ctx = document.getElementById("attendanceChart").getContext("2d");

  if (window.attendanceChart) window.attendanceChart.destroy();

  window.attendanceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["出席", "缺席"],
      datasets: [{
        data: [presentCount, absentCount],
        backgroundColor: ["#C0A96A", "#FF4C4C"],
        borderColor: "#1C1C1C",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#000" }
        }
      }
    }
  });
}


// 初始化
window.onload = loadActivities;

