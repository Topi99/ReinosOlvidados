window.addEventListener('keydown', this.checkKey);
const c = document.getElementById("c");
const database = firebase.database();
const ctx = c.getContext("2d");
let myCir, otherCir;
const tiny_r = document.getElementById("tiny_r");
const bg = document.getElementById("bg");

// firebase refs and providers
const cirRef = database.ref('circles/');
const provider = new firebase.auth.GoogleAuthProvider();
let user;

let redCir;
let blueCir;

function checkKey(e) {
  let code = e.keyCode;
  switch (code) {
    case 37: myCir.left(); break; //Left key
    case 38: myCir.up(); break; //Up key
    case 39: myCir.right(); break; //Right key
    case 40: myCir.down(); break; //Down key
    default: console.log(code); //Everything else
  }
} // checkKey()

const updateFromFB = (ref) => {
  ref.on('value', data => {
    if (ref == "red/") {
      redCir.setX(data.val().x);
      redCir.setY(data.val().y);
    } else {
      blueCir.setX(data.val().x);
      blueCir.setY(data.val().y);
    }
  });
} // updateFromFB()

const startGame = (mine, ref) => {
  let redRef = database.ref('partidas/'+ref).child('red/');
  let blueRef = database.ref('partidas/'+ref).child('blue/');

  redRef.set({
    'x':0,
    'y':0
  });

  blueRef.set({
    'x':500 - 20,
    'y':500 - 20
  });

  redCir = new Circle(0, 0, ctx, redRef, tiny_r);
  blueCir = new Circle(500 - 20, 500 - 20, ctx, blueRef, tiny_r);

  if (mine) {
    myCir = redCir;
    otherCir = blueCir;
  } else {
    otherCir = redCir;
    myCir = blueCir;
  }

  setInterval(() => {
    ctx.drawImage(bg, 0, 0, 500, 500);
    updateFromFB(redRef);
    updateFromFB(blueRef);
    myCir.dibujar();
    otherCir.dibujar();
  }, 30);
} // startGame()

let ul = document.getElementById('user-list');
let li;
let img;

// Obtenemos los usuarios y los agregamos a la lista de posibles contrincantes
database.ref('users/').once('value', users => {
  users.forEach(user => {
    li = document.createElement('li');
    img = document.createElement('img');
    img.setAttribute('src', user.val().photoURL);
    li.appendChild(img);
    li.dataset.uid = user.val().uid;
    li.setAttribute('class', 'counter');
    li.appendChild(document.createTextNode(user.val().displayName));
    ul.appendChild(li);
  });
});

// Inicio de sesión con Google
document.getElementById("google").addEventListener('click', e => {
  firebase.auth().signInWithPopup(provider).then(result => {
    user = result.user;
    // Actualizamos al usuario en la base de datos de firebase
    database.ref('users/'+user.uid+'/').set({
      'displayName': user.displayName,
      'email': user.email,
      'photoURL': user.photoURL,
      'uid': user.uid
    });

    // Mostramos la lista de usuarios
    document.getElementById("login").style.display = "none";
    document.getElementById("matchmaking").style.display = "block";

    // Asignamos eventos de click
    let counters = document.getElementsByClassName("counter");
    for(let i = 0; i < counters.length; i++) {
      counters[i].addEventListener("click", e => {
        // sendRequest(e.target.dataset.uid);
        sendRequest(e.target.dataset.uid);
      });
    }
  }).catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + ": " + errorMessage);
  });
});

const sendRequest = uid => {
  const ref = user.uid+"-to-"+uid+"/";
  database.ref('requests/').child(ref).set({
    'from':user.uid,
    'to': uid
  });

  document.getElementById("matchmaking").style.display = 'none';
  document.getElementById("game").style.display = 'block';
  startGame(1, ref);
}

document.addEventListener("DOMContentLoaded", function () {
  if(user == null) {
    document.getElementById("login").style.display = "block";
    document.getElementById("matchmaking").style.display = "none";
  }
});
