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
        var batteryElement = parentElement.querySelector('.battery');

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
              alert("data: " + JSON.stringify(result))
        }

        var read_failure =  function(result){
              alert("error data: " + JSON.stringify(result))
        }
        var write_success =  function(result){
              alert("write data: " + JSON.stringify(result))
        }

        var write_failure =  function(result){
              alert("write error data: " + JSON.stringify(result))
        }

        var _cb =  function(result){
              alert("data: " + JSON.stringify(result))
        }

        var dataBlock = document.getElementById("data_block");
        var readButton = document.getElementById("read_data");
        readButton.addEventListener('click', function() {
            ACR.readData(parseInt(dataBlock.value,10), passwordInput.value, read_success, read_failure);
        });

        var displayButton = document.getElementById("display");
        var displayInput = document.getElementById("input_display");
        var clearButton = document.getElementById("clear");

        displayButton.addEventListener('click', function() {
          ACR.display(displayInput.value,{bold: true , font:1,x:0},function(r){},function(r){});
          ACR.display(displayInput.value,{bold: false, font:3,x:2, y:4},function(r){},function(r){});
          ACR.display(displayInput.value,{bold: false, font:3,x:3, y:6},function(r){},function(r){});
        });

        clearButton.addEventListener('click', function() {
          ACR.clearLCD(function(r){},function(r){});
        });

        var isReadyButton = document.getElementById("is_ready");
        var writeButton = document.getElementById("write_data");
        var writeInput = document.getElementById("write_data_input");
        var passwordInput = document.getElementById("password_input");
        var oldPasswordInput = document.getElementById("old_password_input");
        var initNtagButton = document.getElementById("init_ntag");
        var getVersion = document.getElementById("get_version");
        var getReceivedData = document.getElementById("get_received_data");
        var getFirmwareVersion = document.getElementById("get_firmware_version");
        var getLedStatus = document.getElementById("get_led_status");
				var connectReader = document.getElementById("connectReader");
        var getBatteryLevel = document.getElementById("get_battery_level");
        var disconnectReader = document.getElementById("disconnectReader");
        var startScan = document.getElementById("startScan");
        var stopScan = document.getElementById("stopScan");

        isReadyButton.addEventListener('click', function(){
          ACR.isReady(
            function(){alert('is Ready')},
            function(){alert('is not Ready')}
            );
        });

        getVersion.addEventListener('click', function(){
          ACR.getVersion(_cb, _cb);
        });

        getFirmwareVersion.addEventListener('click', function(){
          ACR.getFirmwareVersion(_cb, _cb);
        });

        getReceivedData.addEventListener('click', function(){
          ACR.getReceivedData(_cb, _cb);
        });

        initNtagButton.addEventListener('click', function(){
          ACR.initNTAG213(oldPasswordInput.value, passwordInput.value, _cb, _cb);
        });

        getLedStatus.addEventListener('click', function() {
          ACR.getLedStatus(_cb, _cb);
        });

				connectReader.addEventListener('click', function() {
		      ACR.connectReader("68:C9:0B:0D:8A:70", _cb, _cb);
			 	})

        getBatteryLevel.addEventListener('click', function() {
          ACR.getBatteryLevel(_cb, _cb);
        });

        disconnectReader.addEventListener('click', function() {
          ACR.disconnectReader(_cb, _cb);
        });

        startScan.addEventListener('click', function() {
          ACR.startScan(_cb, _cb);
        });

        stopScan.addEventListener('click', function() {
          ACR.stopScan();
        });

        writeButton.addEventListener('click', function() {
            ACR.writeData(parseInt(dataBlock.value, 10), writeInput.value, passwordInput.value, write_success, write_failure);
        });

        var disableButtons = function(){
          //readButton.disabled = true;
          //writeButton.disabled = true;
          //getVersion.disabled = true;
          //initNtagButton.disabled = true;
        }

        var enableButtons = function(){
          //readButton.disabled = false;
          //writeButton.disabled = false;
          //getVersion.disabled = false;
          //initNtagButton.disabled = false;
        }

        var success = function(result) {
            //alert("ATR: " + JSON.stringify(result))
            //ACR.readData(4, passwordInput.value, read_uid_success, read_uid_failure);
            ACR.readData(4, passwordInput.value, read_success, read_failure);
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
        ACR.addTagListener(success, failure);
        ACR.onReady = function (reader) {
          pluginElement.innerHTML = "ready " + reader;
        };
        ACR.onAttach = function (device) {
          pluginElement.innerHTML = "attched " + device;
        };
        ACR.onDetach = function (device) {
          pluginElement.innerHTML = "detached " + device;
        };
        ACR.onBatteryLevelChange = function (level) {
          batteryElement.innerHTML = "battery level " + level;
        };
        ACR.onBatteryLevelResult = function (level) {
          alert("Current Battery Level:" + JSON.stringify(level));
        };
        ACR.onScan = function(device) {
          console.log(JSON.stringify(device));
        }
        console.log("Called plugin");
        console.log('Received Event: ' + id);
    }
};
