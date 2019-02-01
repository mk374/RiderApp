const locationList = document.querySelector('#location-list');
const locationForm = document.querySelector('#add-location-form');

// alert(sessionStorage.getItem('tempName'));
var temp = sessionStorage.getItem('tempName');

locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('group&location').add({
    groupName: sessionStorage.getItem('tempName'),
    documentID: sessionStorage.getItem('tempPass'),
    location: locationForm.location.value,
    time: locationForm.time.value
  })
  locationForm.location.value = '';
  locationForm.time.value = '';
})

function renderLocation(doc) {
  let li = document.createElement('li');
  let location = document.createElement('span');
  let time = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id)
  location.textContent = doc.data().location;
  time.textContent = doc.data().time;
  cross.textContent = 'x';

  li.appendChild(location);
  li.appendChild(time);
  li.appendChild(cross);

  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('group&location').doc(id).delete();
  })

  locationList.appendChild(li);
}
//getting data(real-time) from firestore
db.collection('group&location').where("groupName", "==", temp).onSnapshot( snapshot => {
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
// const usersRef = db.collection('users').doc('id')
//
// usersRef.get()
//   .then((docSnapshot) => {
//     if (docSnapshot.exists) {
//       usersRef.onSnapshot((doc) => {
//         // do stuff with the data
//       });
//     } else {
//       usersRef.set({...}) // create the document
//     }
// });
//
// locationForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   db.collection('')
//
// })
