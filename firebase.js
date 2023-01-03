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
async function addElementInFirebase(REF, data) {
  await firebase.database().ref(`${REF}/${randomID()}`).set(data);
}

async function addElementInfirebaseWithId(REF, id, data) {
  await firebase.database().ref(`${REF}/${id}`).set(data);
}

/**
 * მთლიანი განშოების წამოღება firebase-იდან
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @returns აბრუნებს განშტოებაზე არსებულ ინფორმაციას
 */

async function getRefFromFirebase(REF) {
  const results = await firebase.database().ref(REF).get();
  if (results.toJSON() === null) {
    return [];
  }
  return Object.entries(results.toJSON()).map(([key, value]) =>
    generateFirebaseItem(key, value)
  );
}
/**
 * კონკრეტული ელემენტის დაბრუნება განშტოებიდან
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @param id - განშტოებაზე არსებული ელემენტის უნიკალური id
 * @returns აბრუნებს Promise კარგ შემთხვევაში მონაცემს, ცუდ შემთხვევაში  "404"
 */

async function getElementFromFirebase(REF, id) {
  const result = await firebase.database().ref(`${REF}/${id}`).get();
  return generateFirebaseItem(result.key, result.val());
}

/**
 * განშტოების ელემენტის ამოშლა
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @param id -
 */

async function removeElementFromFirebase(REF, id) {
  await firebase.database().ref(`${REF}/${id}`).remove();
}

/**
 * მთლიანი განშტოების წაშლა
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 */
async function removeRefFromFirebase(REF) {
  await firebase.database().ref(REF).remove();
}

/**
 * ელემენტის ნაწილის განახლება
 * @param REF - დასახელება მონაცემთა ბაზის განშტოების
 * @param element - ელემენტი
 */

async function updateFirebase(REF, id, element) {
  await firebase.database().ref(`${REF}/${id}`).update(element);
}
