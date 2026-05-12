let pieChart;
let lineChart;
let historyChart;

const appliances = [
  "AC",
  "Fan",
  "TV4",
  "Computer",
  "Lights",
  "Miscellaneous"
];

/* LOGIN */

function loginUser(){

  const username =
  document.getElementById("username").value.trim();

  const password =
  document.getElementById("password").value.trim();

  if(username === "" || password === ""){

    alert("Please enter username and password");

    return;
  }

  let users =
  JSON.parse(localStorage.getItem("wattwiseUsers"))
  || {};

  /* CHECK ACCOUNT */

  if(!users[username]){

    alert("Account does not exist. Please Sign Up.");

    return;
  }

  /* CHECK PASSWORD */

  if(users[username].password !== password){

    alert("Wrong password");

    return;
  }

  localStorage.setItem(
    "currentUser",
    username
  );

  openApp(username);

}

/* SIGNUP */

function signupUser(){

  const username =
  document.getElementById("username").value.trim();

  const password =
  document.getElementById("password").value.trim();

  if(username === "" || password === ""){

    alert("Please enter username and password");

    return;
  }

  let users =
  JSON.parse(localStorage.getItem("wattwiseUsers"))
  || {};

  /* USER EXISTS */

  if(users[username]){

    alert("Username already exists. Please Login.");

    return;
  }

  /* CREATE USER */

  users[username] = {

    password:password,

    bills:[]

  };

  localStorage.setItem(
    "wattwiseUsers",
    JSON.stringify(users)
  );

  localStorage.setItem(
    "currentUser",
    username
  );

  openApp(username);

}

/* OPEN APP */

function openApp(username){

  document.getElementById("authContainer")
  .style.display = "none";

  document.getElementById("mainApp")
  .style.display = "block";

  document.getElementById("profileName")
  .innerText = username;

  /* PROFILE INITIALS */

  const initials =
  username
  .split(" ")
  .map(word => word[0])
  .join("")
  .toUpperCase();

  document.getElementById("profileInitials")
  .innerText = initials;

}

/* STAY LOGGED IN */

window.onload = function(){

  const currentUser =
  localStorage.getItem("currentUser");

  if(currentUser){

    openApp(currentUser);

  }

}

/* LOGOUT */

function logoutUser(){

  localStorage.removeItem("currentUser");

  document.getElementById("mainApp")
  .style.display = "none";

  document.getElementById("profilePage")
  .style.display = "none";

  document.getElementById("authContainer")
  .style.display = "flex";

}

/* PROFILE */

function toggleProfile(){

  document.getElementById("profileDropdown")
  .classList.toggle("hidden");

}

function openProfilePage(){

  document.getElementById("mainApp")
  .style.display = "none";

  document.getElementById("profilePage")
  .style.display = "block";

  const user =
  localStorage.getItem("currentUser");

  document.getElementById("profileUserName")
  .innerText = user;

  loadHistory();

}

function backToMain(){

  document.getElementById("profilePage")
  .style.display = "none";

  document.getElementById("mainApp")
  .style.display = "block";

}

/* CLOSE HISTORY */

function closeHistory(){

  document.getElementById("historySection")
  .classList.add("hidden");

}

/* GET APPLIANCE DATA */

function getData(){

  return [

    Number(document.getElementById("ac").value || 0),

    Number(document.getElementById("fan").value || 0),

    Number(document.getElementById("refrigerator").value || 0),

    Number(document.getElementById("computer").value || 0),

    Number(document.getElementById("lights").value || 0),

    Number(document.getElementById("misc").value || 0)

  ];

}

/* GENERATE REPORT */

function generateReport(){

  const data = getData();

  const totalUsage =
  data.reduce((a,b)=>a+b,0);

  /* CHECK EMPTY VALUES */

  if(totalUsage === 0){

    alert(
      "⚠ Please enter at least one appliance runtime value."
    );

    return;
  }

  document.getElementById("results")
  .classList.remove("hidden");

  /* PIE CHART */

  const pieCtx =
  document.getElementById("pieChart");

  if(pieChart){
    pieChart.destroy();
  }

  pieChart = new Chart(pieCtx, {

    type:'pie',

    data:{
      labels:appliances,

      datasets:[{
        data:data,
        borderWidth:2
      }]
    }

  });

  /* MULTIPLE HIGHEST VALUES */

  const highest =
  Math.max(...data);

  const highUsage =
  appliances.filter((item,index)=>
    data[index] === highest
  );

  document.getElementById("analysisText")
  .innerHTML = `

    <h3>Electricity Usage Summary</h3>

    <p>
      <strong>${highUsage.join(", ")}</strong>
      has the highest electricity usage.
    </p>

    <p>
      Reducing their runtime can help lower
      your electricity bill.
    </p>

    <p>
      <strong>Conclusion:</strong>
      Smart optimization can significantly
      reduce monthly electricity usage.
    </p>

  `;

  generateAISuggestions(highUsage);

  saveBill();

}

/* AI SUGGESTIONS */

function generateAISuggestions(highUsage){

  const suggestions = [

    "Switch to LED lights for lower energy usage.",

    "Install rooftop solar panels for long-term savings.",

    "Turn off unused appliances completely.",

    "Use energy efficient inverter appliances.",

    "Reduce unnecessary runtime during peak hours.",

    "Maintain appliances regularly for better performance.",

    "Use smart timers and smart plugs.",

    "Avoid standby mode electricity wastage.",

    "Upgrade old appliances to 5-star rated models."

  ];

  const shuffled =
  suggestions.sort(()=>0.5 - Math.random());

  document.getElementById("aiSuggestions")
  .innerHTML = `

    <p>
      
      <strong>${highUsage.join(", ")}</strong>
      consumes the most electricity.
    </p>

    <ul>

      <li>${shuffled[0]}</li>

      <li>${shuffled[1]}</li>

      <li>${shuffled[2]}</li>

    </ul>

    <p>
      <strong>Conclusion:</strong>
      Optimizing these appliances can
      reduce future electricity bills.
    </p>

  `;

}

/* TARGET CONTROLS */

window.addEventListener("DOMContentLoaded", ()=>{

  const slider =
  document.getElementById("targetSlider");

  const input =
  document.getElementById("targetInput");

  if(slider && input){

    slider.addEventListener("input", ()=>{

      input.value = slider.value;

      document.getElementById("targetAmount")
      .innerText = slider.value;

    });

    input.addEventListener("input", ()=>{

      slider.value = input.value;

      document.getElementById("targetAmount")
      .innerText = input.value;

    });

  }

});

/* TARGET PLAN */

function generateTargetPlan(){

  const currentBill =
  Number(document.getElementById("bill").value);

  const targetBill =
  Number(document.getElementById("targetInput").value);

  if(currentBill <= 0){

    alert("Please enter current bill amount.");

    return;
  }

  const reductionRatio =
  targetBill / currentBill;

  const currentData =
  getData();

  const reducedData =
  currentData.map(item =>
    (item * reductionRatio).toFixed(1)
  );

  const lineCtx =
  document.getElementById("lineChart");

  if(lineChart){
    lineChart.destroy();
  }

  lineChart = new Chart(lineCtx, {

    type:'line',

    data:{
      labels:appliances,

      datasets:[{
        label:'Recommended Runtime',
        data:reducedData,
        borderWidth:3,
        tension:0.4
      }]
    }

  });

  let recommendation = "";

  appliances.forEach((item,index)=>{

    recommendation += `

      <p>
        ${item} should run for
        <strong>${reducedData[index]} hrs/day</strong>
      </p>

    `;

  });

  recommendation += `

    <p>
      <strong>Conclusion:</strong>
      Following this optimized runtime
      can help achieve your target bill.
    </p>

  `;

  document.getElementById("targetAnalysis")
  .innerHTML = recommendation;

}

/* SAVE BILL */

function saveBill(){

  const currentUser =
  localStorage.getItem("currentUser");

  let users =
  JSON.parse(localStorage.getItem("wattwiseUsers"));

  const billData = {

    date:new Date().toLocaleDateString(),

    bill:
    document.getElementById("bill").value,

    appliances:getData()

  };

  users[currentUser].bills.push(billData);

  localStorage.setItem(
    "wattwiseUsers",
    JSON.stringify(users)
  );

}

/* LOAD HISTORY */

function loadHistory(){

  const currentUser =
  localStorage.getItem("currentUser");

  let users =
  JSON.parse(localStorage.getItem("wattwiseUsers"));

  let history =
  users[currentUser].bills;

  const container =
  document.getElementById("profileBills");

  container.innerHTML = "";

  if(history.length === 0){

    container.innerHTML = `
      <p>No past bills available.</p>
    `;

    return;
  }

  history.forEach((item,index)=>{

    container.innerHTML += `

      <div class="bill-item"
      onclick="openHistory(${index})">

        <strong>${item.date}</strong><br>

        Monthly Bill: ₹${item.bill}

      </div>

    `;

  });

}

/* OPEN HISTORY */

function openHistory(index){

  document.getElementById("historySection")
  .classList.remove("hidden");

  const currentUser =
  localStorage.getItem("currentUser");

  let users =
  JSON.parse(localStorage.getItem("wattwiseUsers"));

  let history =
  users[currentUser].bills;

  const selected =
  history[index];

  const historyCtx =
  document.getElementById("historyChart");

  if(historyChart){
    historyChart.destroy();
  }

  historyChart = new Chart(historyCtx, {

    type:'bar',

    data:{
      labels:appliances,

      datasets:[{
        label:'Past Appliance Usage',
        data:selected.appliances,
        borderWidth:2
      }]
    }

  });

  let details = "";

  appliances.forEach((item,i)=>{

    details += `

      <p>
        <strong>${item}</strong>
        usage was
        <strong>${selected.appliances[i]} hrs/day</strong>
      </p>

    `;

  });

  document.getElementById("historyDetails")
  .innerHTML = details;

}