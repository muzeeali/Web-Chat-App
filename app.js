var socket;
var bol=false
var foo = true;
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
  return number.value;
}
function chatBtn() {
  var name = Name();
  var email = Email();
  var number = cNumber();
  var chat = document.getElementById("chatBox");
  var info = document.getElementById("info");

  if (bol===false) {
  
  chat.style.display = "block";

    info.style.display = "block";
  } else {
    chat.style.display = "block";
    document.getElementById("msg").style.display = "block";
    document.getElementById("chat").style.display = "block";
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
  if (name !== "" && email !== "" && number !== "") {
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
  
  $("#chat").html('');
  bol=false
  document.getElementById("chatBox").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("msg").style.display = "none";
    document.getElementById("chat").style.display = "none";
    document.getElementById("popUp").style.display = "none";
}

function msgBtn() {
  var name = Name();
  var email = Email();
  var number = cNumber();
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
      let customerId;
      if(localStorage.getItem('customerId')){
        customerId = localStorage.getItem('customerId')
      }else {
        customerId = uuidv4();
        localStorage.setItem('customerId',customerId)
      }
      socket = io(`http://localhost:5000`);
    }
  } else {
    alert("Enter values");
  }
}

$(document).ready(function () {
  function listenSocket() {
    socket.on(localStorage.getItem('customerId'), function (msg) {
      console.log("listen", msg);
      appendMessage(BOT_NAME, BOT_IMG, "left", msg);
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
    if (foo) {
      listenSocket();
      foo = false;
    }

    // console.log("clicked");
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;
    socket.emit(
      "webChat-Customer",
      JSON.stringify({
        phone: cNumber(),
        userId: localStorage.getItem('customerId'),
        customerName: Name(),
        message: msgText,
      })
    );
    appendMessage(Name(), PERSON_IMG, "right", msgText);
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
});
