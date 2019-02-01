const locationList = document.querySelector('#group-list');



function renderLocation(doc) {
  let li = document.createElement('li');
  let groupName = document.createElement('span');
  let signIn = document.createElement('span');

  li.setAttribute('data-id', doc.id);
  li.setAttribute('password', doc.data().password);
  li.setAttribute('groupName', doc.data().groupName);

  groupName.textContent = doc.data().groupName;
  signIn.textContent = 'Sign In To Your Group';

  li.appendChild(groupName);
  li.appendChild(signIn);

  signIn.addEventListener('click', (e) => {
    let gP = e.target.parentElement.getAttribute('groupName');
    let pass = e.target.parentElement.getAttribute('password');
    var signInPassword = prompt("Please enter the password to " + gP);
// get access to individual groups
    if (signInPassword == pass){
      window.location.href = 'leechRideOrganizer.html';
      var leechTempName;
      sessionStorage.setItem('leechTempName', e.target.parentElement.getAttribute('groupName'));

      // db.collection('globalData').doc('current').set({
      //   groupName: gP,
      //   password: pass
      // })

    }
    else{
      alert("Wrong Password. Try Again!");
    }
  })

  locationList.appendChild(li);
}
//getting data(real-time) from firestore
db.collection('group-passwords').onSnapshot( snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    // if (tempU == null){
    //   let li = document.createElement('li');
    //   let text = document.createElement('span');
    //   text.textContent = 'Please Sign in First in the Index Page!';
    //
    //   li.append(text);
    //
    //   locationList.appendChild(li);
    //
    // }else{
    //   if (change.type == 'added'){
    //     renderLocation(change.doc);
    //   }
    //   else if(change.type == 'removed'){
    //     let li = locationList.querySelector('[data-id=' + change.doc.id + ']');
    //     locationList.removeChild(li);
    //   }
    // }
    if (change.type == 'added'){
      renderLocation(change.doc);
    }
    else if(change.type == 'removed'){
      let li = locationList.querySelector('[data-id=' + change.doc.id + ']');
      locationList.removeChild(li);
    }

  })
});
