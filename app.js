var socket;
var bol=false
var foo = true;
var userId;
// console.log("UNIQUE ID", uuidv4());

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function Name() {
  var name = document.getElementById("name");
  return name.value;
}
function Email() {
  var email = document.getElementById("email");
  return email.value;
}
function cNumber() {
  var number = document.getElementById("number");
  // var countryCode = document.getElementById("countryCode");
  // var completeNumber= "+"+countryCode.value+number.value
  return number.value;
}
function completeNumber(number){
  var countryCode = document.getElementById("countryCode");
  var completeNumber= "+"+countryCode.value+number
  return completeNumber;
}
function chatBtn() {
  var name = Name();
  var email = Email();
  var number = cNumber();
  var chat = document.getElementById("chatBox");
  var info = document.getElementById("info");

  if (localStorage.getItem('sessionID')){
  // (name !== "" && email !== "" && number !== "" && localStorage.getItem('sessionID')!=="") {
    chat.style.display = "block";
    document.getElementById("msg").style.display = "block";
    document.getElementById("chat").style.display = "block";
    info.style.display = "none";
  } else {
    chat.style.display = "block";
    document.getElementById("info").style.display = "block";
  }
}

function min() {
  document.getElementById("chatBox").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("msg").style.display = "none";
  document.getElementById("chat").style.display = "none";
  bol=true
}
function cross() {
  var name = Name();
  var email = Email();
  var number = cNumber();
  // if (name !== "" && email !== "" && number !== "")
  if(localStorage.getItem('sessionID'))
   {
    document.getElementById("popUp").style.display = "block";
  } else {
    document.getElementById("chatBox").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("msg").style.display = "none";
    document.getElementById("chat").style.display = "none";
  }
}
function cancel(){
  document.getElementById("popUp").style.display = "none";
}
function endChat(){
  document.getElementById("name").value="";
  document.getElementById("email").value="";
  document.getElementById("number").value="";
  // socket.emit('endChat',JSON.stringify({customerId: }))
;
localStorage.getItem("sessionID") && socket.emit('endChat',{customerId : localStorage.getItem("sessionID")})
  localStorage.clear()
  socket.disconnect()
  $("#chat").html('');
  bol=false
  document.getElementById("chatBox").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("msg").style.display = "none";
    document.getElementById("chat").style.display = "none";
    document.getElementById("popUp").style.display = "none";
}

function submitBtn() {
  $('#chat').html('')
  var name = Name();
  var email = Email();
  var number = completeNumber(cNumber());
  localStorage.setItem('Phone',number)
  localStorage.setItem('Name',name)
  var msg = document.getElementById("msg");
  var chat = document.getElementById("chat");

  if (name !== "" && email !== "" && number !== "") {
    if (validateEmail(email) == false) {
      alert("Enter correct email");
    } else {
      document.getElementById("info").style.display = "none";
      msg.style.display = "block";
      chat.style.display = "block";
      bol=true
      
      socket = io(`http://localhost:5000/`,{
        query: {
            'phone': number
        }
        });

        socket.on('connect_error',res => {
          console.log('error',res)
          // var chat = document.getElementById("chat"); 
          // var div = document.createElement('div');
          //  div.textContent = res;
          //  div.setAttribute('class', 'errorNotification');
          //  chat.innerHTML=div
          $('#chat').html('')
          document.getElementById("msg").style.display = "none";
          if(res == 'Error: session for this user already exist'){
            $('#chat').append(`<p class="errorNotification"><strong>Error!</strong> Session for this user already exist </p>`)
            socket.disconnect()
          }
          // <h1 >${res}</h1> #F8D7DA
          //  document.chat.appendChild(div);
        })

        socket.on("session", ({ sessionID,userID,payload }) => {
          console.log("CREDDDDDDDDDDDDDDDDDDD",userID,payload)
          localStorage.setItem("sessionID", sessionID);
          userId = userID
          socket.emit('joinRoom',userID)
  
          if(payload){
            payload.map(msg => appendMessage(msg.from, BOT_IMG, msg.from === name ? 'right' : 'left', msg.text))
          }
        });

        socket.on('private message', function ({from,text,end}) {
          console.log("listen", from,text);
          appendMessage(from, BOT_IMG, "left", text);
          if(end){
            socket.disconnect()
            localStorage.clear()
          }
        });
      

    }
  } else {
    alert("Enter values");
  }
}



function listenSocket() {
  socket.on('private message', function ({from,text,end}) {
    console.log("listen", from,text);
    appendMessage(from, BOT_IMG, "left", text);
    if(end){
      socket.disconnect()
      localStorage.clear()
    }
  });

  
}

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  // "Hi, how are you?",
  // "Ohh... I can't understand what you trying to say. Sorry!",
  // "I like to play games... But I don't know how to play!",
  // "Sorry if my answers are not relevant. :))",
  // "I feel sleepy! :(",
];

const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Agent";
// const PERSON_NAME = "Customer";

$(".msger-send-btn").click(function (event) {
  
  // console.log("clicked");
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;
  console.log('phone',completeNumber(cNumber()))
  socket.emit(
    "webChat-Customer",
    JSON.stringify({
      phone: localStorage.getItem('Phone'),
      userId: userId,
      customerName: Name() || localStorage.getItem('Name'),
      message: msgText,
    })
  );
  appendMessage(Name() || localStorage.getItem('Name'), PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  // customerResponse()
  // botResponse();
});

function appendMessage(name, img, side, text) {
  const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

$(document).ready(function () {

  if(localStorage.getItem('sessionID')){
    let name  = localStorage.getItem('Name')
    console.log('name exits',name)
    chatBtn()
    var msg = document.getElementById("msg");
    var chat = document.getElementById("chat");
    document.getElementById("info").style.display = "none";
    msg.style.display = "block";
    chat.style.display = "block";
    bol=true
    socket = io(`http://localhost:5000/`,{
      query: {
          "sessionID": `${localStorage.getItem('sessionID')}`,
      }
      });

      socket.on("session", ({ sessionID,userID,payload }) => {
        console.log("CREDDDDDDDDDDDDDDDDDDD",userID,payload)
        localStorage.setItem("sessionID", sessionID);
        userId = userID
        socket.emit('joinRoom',userID)

        if(payload){
          payload.map(msg => appendMessage(msg.from, BOT_IMG, msg.from === name ? 'right' : 'left', msg.text))
        }
      });

      if (foo) {
        listenSocket();
        foo = false;
      }

  }


 
});
