/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    var pluginElement = parentElement.querySelector('.plugin');
    var read_result = document.getElementById('read_result');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    var BLOCK = 4;

    var read_uid_success =  function(result){
      alert("UID: " + JSON.stringify(result))
    }

    var read_uid_failure =  function(result){
      alert("error UID: " + JSON.stringify(result))
    }
    var read_success =  function(result){
      var d = new Date();
      read_result.innerHTML = read_result.innerHTML  + d.toLocaleString() + "&nbsp" + JSON.stringify(result) + "<br>";
      //alert("data: " + JSON.stringify(result))
    }

    var read_failure =  function(result){
      //alert("error data: " + JSON.stringify(result))
      var d = new Date();
      read_result.innerHTML = read_result.innerHTML  + d.toLocaleString() + "&nbsp" + JSON.stringify(result) + "<br>";
    }
    var _cb =  function(result){
      alert("data: " + JSON.stringify(result))
    }

    var readButton = document.getElementById("read_data");
    readButton.addEventListener('click', function() {
      ACR.readData(4, passwordInput.value, read_success, read_failure);
    });

    var clearButton = document.getElementById("clear");

    clearButton.addEventListener('click', function() {
      read_result.innerHTML = "";
    });

    var passwordInput = document.getElementById("password_input");
    var connectReader = document.getElementById("connectReader");

    connectReader.addEventListener('click', function() {
      ACR.connectReader(function(result){}, function(result){});
    })

    var disableButtons = function(){
      readButton.disabled = true;
    }
    var enableButtons = function(){
      readButton.disabled = false;
    }
    var success = function(result) {
      //alert("ATR: " + JSON.stringify(result));
      //ACR.readData(4, passwordInput.value, read_success, read_failure);
      setTimeout(
        function() {
          ACR.readData(4, passwordInput.value, read_success, read_failure);
        }, 1000
      );
      enableButtons();
    };

    var failure = function(reason) {
      alert("Error " + JSON.stringify(reason))
    };

    ACR.onCardAbsent = function() {
      disableButtons();
    };
    console.log("Calling plugin");
    ACR.start();
    var acrStatus = 'DETACH';
    setInterval(
      function(){
        if(acrStatus == 'DETACH'){
          ACR.connectReader(function(result){}, function(result){})
        }
      },  1000 );
      ACR.addTagListener(success, failure);
      ACR.onReady = function (reader) {
        pluginElement.innerHTML = "ready " + reader;
        acrStatus = 'READY';
      };
      ACR.onAttach = function (device) {
        pluginElement.innerHTML = "attched " + device;
        acrStatus = 'ATTACH';
      };
      ACR.onDetach = function (device) {
        pluginElement.innerHTML = "detached " + device;
        //setTimeout(ACR.connectReader(function(result){}, function(result){}), 500);
        console.log("--------invoke-------");
        acrStatus = 'DETACH';
      };

      console.log("Called plugin");
      console.log('Received Event: ' + id);
  }
};
