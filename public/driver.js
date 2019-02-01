
const groupList = document.querySelector('#group-list');
const form = document.querySelector('#add-group-form');


window.token = "hello";
var mySharedData = {
                    someGroupName : '',
                    somePassword: '',
                  };


function renderLocation(doc) {
  let li = document.createElement('li');
  let groupName = document.createElement('span');
  let signIn = document.createElement('span');
  let deleteGroup = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  li.setAttribute('password', doc.data().password);
  li.setAttribute('groupName', doc.data().groupName);

  groupName.textContent = doc.data().groupName;
  signIn.textContent = 'Sign In';
  deleteGroup.textContent = 'x';

  li.appendChild(groupName);
  li.appendChild(signIn);
  li.appendChild(deleteGroup);

  deleteGroup.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('group-passwords').doc(id).delete();
    var tempRef = db.collection('group&location').where("documentID", "==", id);
    //db.collection('group&location').doc(id);
  })

  signIn.addEventListener('click', (e) => {
    let gP = e.target.parentElement.getAttribute('groupName');
    let pass = e.target.parentElement.getAttribute('password');
    var signInPassword = prompt("Please enter the password to " + gP);
// get access to individual groups
    if (signInPassword == pass){
      window.location.href = 'LocalRideOrganizer.html';
      var tempName;
      sessionStorage.setItem('tempName', e.target.parentElement.getAttribute('groupName'));
      var tempPass;
      sessionStorage.setItem('tempPass', e.target.parentElement.getAttribute('data-id'));

      // db.collection('globalData').doc('current').set({
      //   groupName: gP,
      //   password: pass
      // })

    }
    else{
      alert("Wrong Password. Try Again!");
    }
  })
  groupList.appendChild(li);
}
//getting data(real-time) from firestore
db.collection('group-passwords').onSnapshot( snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added'){
      console.log("location: added" + change.doc.id);
      renderLocation(change.doc);
    }
    else if(change.type == 'removed'){
      console.log("location: removed" + change.doc.id);
      let li = groupList.querySelector('[data-id=' + change.doc.id + ']');
      groupList.removeChild(li);
    }
  })
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('group-passwords').add({
    groupName: form.groupName.value,
    password: form.password.value
  })
  form.groupName.value = '';
  form.password.value = '';



})
