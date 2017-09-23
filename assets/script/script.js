//initiate firebase

  var config = {
    apiKey: "AIzaSyDMAsjn2TxynhUW9PziJy_zrMJVUXrlURg",
    authDomain: "trainscheduler-c8d11.firebaseapp.com",
    databaseURL: "https://trainscheduler-c8d11.firebaseio.com",
    projectId: "trainscheduler-c8d11",
    storageBucket: "trainscheduler-c8d11.appspot.com",
    messagingSenderId: "826227330164"
  };
  firebase.initializeApp(config);

var database = firebase.database();
console.log(database)
//get info from firebase 

//database.ref("/trains").on('value', snapShot, errorLog);
database.ref().on('value', snapShot, errorLog);

function snapShot(snap) {
  var snapData = snap.val();
  var trainData = Object.values(snapData.trains)

  trainData.forEach(function(train){
   console.log(train.trainName)
    var waitTime = trainScheduler.timeCal(train.frequency, train.firstTrainTime);  
    var rowDiv = $('<div class="row">');
    rowDiv.append($('<div class="col-md-2">').text(train.trainName));
    rowDiv.append($('<div class="col-md-2">').text(train.destination));
    rowDiv.append($('<div class="col-md-2">').text(train.frequency));
    rowDiv.append($('<div class="col-md-2">').text(train.frequency));
    rowDiv.append($('<div class="col-md-2">').text(waitTime));
    $('.schedule').append(rowDiv);
  });
};

function errorLog(errorObject) {
  console.log("The read failed: " + errorObject);
};

var trainScheduler = {
//get info from user input and put it in the information array
  getInfo: function() {
    var trainName = $("#train-name").val();
    var destination = $("#destination").val();
    var firstTrainTime = $("#first-train-time").val();
    var frequency = $("#frequency").val();
    trainScheduler.pushTrainData(trainName, destination, firstTrainTime,frequency);
    $("#train-name").val('');
    $("#destination").val('');
    $("#first-train-time").val('');
    $("#frequency").val('');
  },
//push info into the database 
  pushTrainData: function(name, destination, firstTrain, frequency) {
  firebase.database().ref('/trains').push({      
    "trainName": name,
    "destination": destination,
    "firstTrainTime": firstTrain,      
    "frequency": frequency
      });
  },


//let's do some math
  timeCal: function(frequency, firstTrain){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var currentinMin = h * 60;
    console.log(h+":"+m);
    console.log(currentinMin);

    //get the first train time and have it as an array then get hr and min
    var hm = firstTrain.split(":");
    var firstTrainTimeinMin = parseInt(hm[0])*60 + parseInt(hm[1]);
    
    if(firstTrainTimeinMin > currentinMin) {
      var waitTime = firstTrainTimeinMin - currentinMin;
    } else if(firstTrainTimeinMin <= currentinMin) {
      var waitTime = frequency - ((currentinMin - firstTrainTimeinMin) % frequency);
    }
    return waitTime;
  },


}; // closing trainSchedule


//get array into the firebase 

  $("#submit-button").on("click", function() {
    event.preventDefault();
    trainScheduler.getInfo();
    //trainScheduler.time();
  
  });  



