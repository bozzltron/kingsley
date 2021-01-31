import speech_recognition as sr
import pyttsx3
import datetime
import wikipedia
import webbrowser
import os
import time
import subprocess
from ecapture import ecapture as ec
import wolframalpha
import json
import requests
import credentials
import string

print("Hi, I'm Kingsley")

def speak(text):
    os.system("say " + text)

def wishMe():
    hour=datetime.datetime.now().hour
    if hour>=0 and hour<12:
        speak("Hello,Good Morning")
        print("Hello,Good Morning")
    elif hour>=12 and hour<18:
        speak("Hello,Good Afternoon")
        print("Hello,Good Afternoon")
    else:
        speak("Hello,Good Evening")
        print("Hello,Good Evening")

def takeCommand():
    r=sr.Recognizer()
    mics = sr.Microphone.list_microphone_names()
    index = 0

    with sr.Microphone(device_index=0) as source:
        r.adjust_for_ambient_noise(source)
        audio=r.listen(source)

        try:
            statement=r.recognize_google(audio,language='en-us')
            print(f"I heard:{statement}\n")

        except Exception as e:
            return "None"

        return statement

speak("Hi, I am Kingsley")
wishMe()


if __name__=='__main__':


    while True:
        ##speak("Tell me how can I help you now?")
        statement = takeCommand().lower()
        if statement==0:
            continue

        if "good bye" in statement or "ok bye" in statement or "stop" in statement:
            speak('your personal assistant Kingsley is shutting down,Good bye')
            print('your personal assistant Kingsley is shutting down,Good bye')
            break

        if 'wikipedia' in statement:
            speak('Searching Wikipedia...')
            statement =statement.replace("wikipedia", "")
            results = wikipedia.summary(statement, sentences=3)
            results = results.translate(str.maketrans('','',string.punctuation))
            speak("According to Wikipedia")
            print(results)
            speak(results)

        elif 'leroy' in statement:
            webbrowser.open_new_tab("http://10.0.4.79")
            speak("Here are the birds Leroy has observered today.")
            time.sleep(5)

        elif "weather" in statement:
            print('api', credentials.openweathermap_key)
            api_key=credentials.openweathermap_key
            base_url="https://api.openweathermap.org/data/2.5/weather?"
            city_name="Waukee, Iowa"
            if "in" in statement:
                city_name = statement.split("in")[1]
            complete_url=base_url+"appid="+api_key+"&q="+city_name+"&units=imperial"
            response = requests.get(complete_url)
            x=response.json()
            if x["cod"]!="404":
                y=x["main"]
                current_temperature = y["temp"]
                current_humidity = y["humidity"]
                z = x["weather"]
                weather_description = z[0]["description"]
                weather_report = "Its {} in {}. The temperature is {} degrees farenheit. Humidity is {} percent.".format(weather_description, city_name, current_temperature, current_humidity)
                print(weather_report)
                speak(weather_report)

            else:
                speak(" City Not Found ")



        elif any(key in statement for key in ['what time is it', 'the time', 'today\s date']):
            strTime=datetime.datetime.now().strftime("%I:%M %p")
            dateTime=datetime.datetime.now().strftime("%B %d, %Y")
            answer = "the time is {} on {}".format(strTime, dateTime)
            print(answer)
            speak(answer)

        elif 'who are you' in statement or 'what can you do' in statement:
            speak('I am Kingsley version 1 point O your persoanl assistant. I do things.')


        elif "who made you" in statement or "who created you" in statement or "who discovered you" in statement:
            speak("I was built by bozzltron")
            print("I was built by bozzltron")

        elif "camera" in statement or "take a photo" in statement:
            ec.capture(0,"robo camera","img.jpg")

        elif any(key in statement for key in ['+', '-', 'x', '/', 'how far', 'capital of', 'distance']):
            client = wolframalpha.Client(credentials.wolfram_alpha_app_id)
            res = client.query(statement)
            answer = next(res.results).text
            speak(answer)
            print(answer)

time.sleep(3)












