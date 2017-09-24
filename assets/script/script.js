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

//get data from firebase on value change
database.ref().on('value', snapShot, errorLog);

function snapShot(snap) {
  var snapData = snap.val();
  var trainData = Object.values(snapData.trains);
  //empty schedule element before loading the train schedule 
  $('.schedule').empty();
  trainData.forEach(function(train){
    //call function to calculate wait time and next train arrival time

    var nextTrainInfo = trainScheduler.timeCal(train.frequency, train.firstTrainTime);
    // build elements to lead the train information 
    var rowDiv = $('<div class="row">');
    rowDiv.append($('<div class="col-md-2">').text(train.trainName));
    rowDiv.append($('<div class="col-md-2">').text(train.destination));
    rowDiv.append($('<div class="col-md-2">').text(train.frequency));
    rowDiv.append($('<div class="col-md-2">').text(nextTrainInfo[1]));
    rowDiv.append($('<div class="col-md-2">').text(nextTrainInfo[0]));
    $('.schedule').append(rowDiv);
    $('.schedule').append("<hr>");

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
    var currenTimeinMin = h * 60 + m;

    //get the first train time and have it as an array then get hr and min
    var hm = firstTrain.split(":");
    var firstTrainTimeinMin = parseInt(hm[0])*60 + parseInt(hm[1]);
    
    if(firstTrainTimeinMin > currenTimeinMin) {
      var waitTime = firstTrainTimeinMin - currenTimeinMin;
    } else if(firstTrainTimeinMin <= currenTimeinMin) {
      var waitTime = frequency - (currenTimeinMin - firstTrainTimeinMin) % frequency;
    }
    // from wait time, calculate next train Hour and Min 
    var nextTrainHr = Math.floor((waitTime + currenTimeinMin)/60);
    var nextTrainMin = (m + waitTime) % 60;

    if(nextTrainMin<10){
      var nextTrainMin = "0" + nextTrainMin;
    }

    if(nextTrainHr>24){
      var nextTrainHr = nextTrainHr-24;
    }

    // send back the wait time and next train time
    var nextTrainTime = nextTrainHr + ":" + nextTrainMin;
    return [waitTime, nextTrainTime]; 

  },


}; // closing trainSchedule


//get array into the firebase 

  $("#submit-button").on("click", function() {
    event.preventDefault();
    trainScheduler.getInfo();
    
  
  });  



