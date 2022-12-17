const firebaseConfig = {
  apiKey: "AIzaSyAu6jKZvceg3OmPPGNw9QpYWBwKPMwodZQ",
  databaseURL: "https://travel-more-25-default-rtdb.firebaseio.com",
  authDomain: "travel-more-25.firebaseapp.com",
  projectId: "travel-more-25",
  storageBucket: "travel-more-25.appspot.com",
  messagingSenderId: "1076731524741",
  appId: "1:1076731524741:web:8e866074742dbc3466dbec",
  measurementId: "G-3JVVBG379R",
};

// firebase-თან დაკავშირება ზემოთ არსებული კონფიგით;
firebase.initializeApp(firebaseConfig);

function generateFirebaseItem(ID, value) {
  return {
    id: ID,
    data: value,
  };
}

/**
 * დავამატოთ ბაზაში მონაცემები
 * @param REF -  დასახელება მონაცემთა ბაზის განშტოების
 * @param data - ინფორმაცია რასაც ვამატებთ
 */
function addElementInFirebase(REF, data) {
  firebase.database().ref(`${REF}/${randomID()}`).set(data);
}

/**
 * მთლიანი განშოების წამოღება firebase-იდან
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @returns აბრუნებს განშტოებაზე არსებულ ინფორმაციას
 */

function getRefFromFirebase(REF) {
  const result = [];
  firebase
    .database()
    .ref(REF)
    .on("value", (response) => {
      response.forEach((element) => {
        result.push(generateFirebaseItem(element.key, element.val()));
      });
    });
  return result;
}
/**
 * კონკრეტული ელემენტის დაბრუნება განშტოებიდან
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @param id - განშტოებაზე არსებული ელემენტის უნიკალური id
 * @returns აბრუნებს Promise კარგ შემთხვევაში მონაცემს, ცუდ შემთხვევაში  "404"
 */

function getElementFromFirebase(REF, id) {
  return new Promise((resolve, reject) => {
    const array = getRefFromFirebase(REF);
    setTimeout(() => {
      array.forEach((element) => {
        if (element.id === id) {
          resolve(element);
        }
      });
      reject("404");
    }, 1000);
  });
}

// იმავე ფუნქციის კოდი
// function getElementFromFirebase(REF, id) {
//   let result = null;
//   fisebase.database.ref(`${REF}/${id}`).on("value", (response) => {
//     result = generateFirebaseItem(response.key, response.val());
//   });
//   return result;
// }

/**
 * განშტოების ელემენტის ამოშლა
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @param id -
 */

function removeElementFromFirebase(REF, id) {
  firebase.database().ref(`${REF}/${id}`).remove();
}

/**
 * მთლიანი განშტოების წაშლა
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 */
function removeRefFromFirebase(REF) {
  firebase.database().ref(REF).remove();
}
