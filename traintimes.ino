// This #include statement was automatically added by the Particle IDE.
#include <LiquidCrystal.h>

// This #include statement was automatically added by the Particle IDE.
#include <HttpClient.h>
#include "LiquidCrystal/LiquidCrystal.h"
LiquidCrystal *lcd;

unsigned int nextTime = 0;
HttpClient http;

http_header_t headers[] = {
  { "Accept" , "*/*"},
  { NULL, NULL }
};

http_request_t request;
http_response_t response;

int switchPin = D1;

void setup() {
 Serial.begin(9600);
//  pinMode(switchPin, INPUT_PULLUP);
 
 lcd = new LiquidCrystal(D0, D1, D2, D3, D4, D5); //Make sure to update these to match how you've wired your pins
  // set up the LCD's number of columns and rows: 
 lcd->begin(16, 2);
 Time.zone(+1); //set timezone for bst
 getTrainTime(); //display nextTrainTime on startup to make sure its working correctly, then clear the display
}

void loop() {
  if(Time.weekday() >= 1 && Time.weekday() <= 7) { //check to make sure it is a weekday
    if(Time.hour() == 12) { // check if the hour is 8:XX AM
      if (nextTime > millis()) {
        return;
      } else {
        getTrainTime();
        nextTime = millis() + 60000;
       }
     }
   }

  if(digitalRead(switchPin) == LOW) {
     getTrainTime();
   }
   
   lcd->setCursor(0,0);
   lcd->print(Time.format(Time.now(), "%T"));
    delay(1000);
}

void getTrainTime() {
    // GET request
    request.hostname = "train-times-particle-app.herokuapp.com";
    request.port = 80;
    request.path = "/232/outbound";
    http.get(request, response, headers);

    // Response Status
    // Serial.print("Application>\tResponse status: ");
    // Serial.println(response.status);

    // Response Body
    // Serial.print("Application>\tHTTP Response Body: ");
    // Serial.println(response.body);

    //Print result on the OLED screen
    printText(response.body);
}

void printText(String text) {
    lcd->clear();
    lcd->setCursor(0, 1);
    lcd->println(text);
}