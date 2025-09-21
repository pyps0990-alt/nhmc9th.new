// 儲存出席狀態
function saveAttendance(memberName, isPresent) {
  const activityId = document.getElementById("activity").value;
  db.collection("attendance")
    .doc(activityId)
    .collection("members")
    .doc(memberName)
    .set({
      present: isPresent,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// 讀取所有紀錄
function loadAttendance(activityId, callback) {
  db.collection("attendance")
    .doc(activityId)
    .collection("members")
    .get()
    .then(snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ name: doc.id, present: doc.data().present });
      });
      callback(data);
    });
}


