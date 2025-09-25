// -------------------------
// Firebase 初始化
// -------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBLsMAvPcpKBoeIfAA-hF2UGrrU5RRS7t4",
  authDomain: "nhmc9th-672f6.firebaseapp.com",
  databaseURL: "https://nhmc9th-672f6-default-rtdb.firebaseio.com",
  projectId: "nhmc9th-672f6",
  appId: "1:470057381540:web:d5e0881cb540a7a58a0031"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// -------------------------
// 幹部登入 / 登出
// -------------------------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.querySelector("#loginPanel #logoutBtn");
const menuLogoutBtn = document.getElementById("menuLogoutBtn");
const adminStatus = document.getElementById("adminStatus");
const loginPanel = document.getElementById("loginPanel");
const adminLink = document.getElementById("adminLink");

// 登入
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      adminStatus.textContent = "✅ 幹部已登入";
      loginPanel.classList.add("hidden");
      adminLink.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      menuLogoutBtn.classList.remove("hidden");
    })
    .catch(err => alert("登入失敗：" + err.message));
});

// 登出
logoutBtn?.addEventListener("click", () => {
  auth.signOut().then(() => {
    adminStatus.textContent = "🔒 幹部尚未登入";
    loginPanel.classList.remove("hidden");
    adminLink.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    menuLogoutBtn.classList.add("hidden");
  });
});
menuLogoutBtn?.addEventListener("click", () => auth.signOut());

// 自動檢查登入狀態
auth.onAuthStateChanged(user => {
  if(user){
    adminStatus.textContent = "✅ 幹部已登入";
    loginPanel.classList.add("hidden");
    adminLink.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    menuLogoutBtn.classList.remove("hidden");
  } else {
    adminStatus.textContent = "🔒 幹部尚未登入";
    loginPanel.classList.remove("hidden");
    adminLink.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    menuLogoutBtn.classList.add("hidden");
  }
});

// -------------------------
// 最新公告
// -------------------------
const announcementList = document.getElementById("announcementList");
const announceRef = db.ref("announcements");
announceRef.on("value", snapshot => {
  const data = snapshot.val() || {};
  const now = Date.now();
  announcementList.innerHTML = "";
  Object.entries(data).forEach(([key, item]) => {
    const time = item.timestamp ? new Date(item.timestamp).toLocaleDateString("zh-TW") : "";
    const expire = item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("zh-TW") : "";
    const li = document.createElement("li");
    if(!item.expiresAt || item.expiresAt >= now){
      li.innerHTML = `<span class="cursor-pointer announcement-item" data-event-id="${key}">${item.text || ""}<br><span class="text-xs text-gray-400">🕒 發布：${time}｜失效：${expire || "無期限"}</span></span>`;
    } else {
      li.innerHTML = `<span class="text-gray-500 line-through">${item.text || ""}<br><span class="text-xs text-gray-400">🕒 發布：${time}｜失效：${expire}</span></span>`;
    }
    announcementList.appendChild(li);
  });
  if(announcementList.innerHTML===""){
    announcementList.innerHTML = `<li class="text-gray-400">目前沒有公告</li>`;
  }

  // 點擊公告跳 schedule.html
  document.querySelectorAll(".announcement-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      const id = el.dataset.eventId;
      window.location.href = `pages/schedule.html?eventId=${id}`;
    });
  });
});

// -------------------------
// 選單開關（精美動畫版）
// -------------------------
const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");

// 展開 / 收合選單
menuBtn.addEventListener("click", e => {
  e.stopPropagation(); // 阻止事件冒泡到 document
  if (menuList.classList.contains("hidden")) {
    menuList.classList.remove("hidden");
    setTimeout(() => menuList.classList.add("show"), 10);
  } else {
    menuList.classList.remove("show");
    setTimeout(() => menuList.classList.add("hidden"), 350);
  }
});

// 點擊頁面其他區域時收合選單
document.addEventListener("click", e => {
  const clickedOutside = !menuBtn.contains(e.target) && !menuList.contains(e.target);
  if (clickedOutside && menuList.classList.contains("show")) {
    menuList.classList.remove("show");
    setTimeout(() => menuList.classList.add("hidden"), 350);
  }
});



// -------------------------
// AOS 初始化
// -------------------------
AOS.init({
  offset: 120, // 提前觸發距離
  duration: 600, // 動畫持續時間
  easing: 'ease-out-cubic',
  delay: 100,
  once: true // 滾動一次後不再重複
});


// -------------------------
// 頁面內部導航淡出效果
// -------------------------
document.querySelectorAll("a[href]").forEach(link=>{
  link.addEventListener("click", function(e){
    const href=this.getAttribute("href");
    const isInternal=href && !href.startsWith("http") && !href.startsWith("#") && !href.endsWith(".jpg");
    const isMenuLink=this.closest("#menuList");
    if(isInternal && !isMenuLink){
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(()=>window.location.href=href,400);
    }
  });
});
