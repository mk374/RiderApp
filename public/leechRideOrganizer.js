
const locationList = document.querySelector('#student-location-list');

function renderLocation(doc) {
  let li = document.createElement('li');
  let location = document.createElement('span');
  let time = document.createElement('span');
  let number = document.createElement('span');
  let listOfStudents = document.createElement('span');
  let add = document.createElement('div');

  function toArray() {
      var returnArrLength = 0;
      var asa = doc.data().students;
      asa.forEach(function(childSnapshot) {
          returnArrLength = returnArrLength + 1;
      });
      return returnArrLength;
  };
  var currentNumber = toArray();

  li.setAttribute('data-id', doc.id)
  location.textContent = doc.data().location;
  time.textContent = doc.data().time;
  number.textContent = "number of students: " + currentNumber;
  listOfStudents.textContent = doc.data().students;
  add.textContent = '+';

  li.appendChild(location);
  li.appendChild(time);
  li.appendChild(number);
  li.appendChild(listOfStudents);
  li.appendChild(add);

  add.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    var studentArray = db.collection('group&location').doc(id);
    var asa = doc.data().students;
    
    studentArray.update({
      students: firebase.firestore.FieldValue.arrayUnion(sessionStorage.getItem('tempUser'))
    })
  })

  db.collection('group&location').doc(li.getAttribute('data-id')).onSnapshot(snapshot => {

  });

  locationList.appendChild(li);
}

//getting data(real-time) from firestore
db.collection('group&location').where("groupName", "==", sessionStorage.getItem('leechTempName')).onSnapshot( snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added'){
      renderLocation(change.doc);
    }
    else if(change.type == 'removed'){
      let li = locationList.querySelector('[data-id=' + change.doc.id + ']');
      locationList.removeChild(li);
    }
  })
});
