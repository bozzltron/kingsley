import commands from './commands'
import session from './session'
import { Response } from './interfaces'

export default function (statement :string) :Promise<Response> {

    if (statement.includes("what time is it") || 
        statement.includes("do you have the time") ||
        statement.includes("what is the date") ||
        statement.includes("todays date")) {
        return commands.getTheTime();
    }

    else if (statement.includes("weather")) {
        return commands.weather(statement);
    }    

    else if (statement.includes("what's your name") || statement.includes("who are you")) {
        return commands.getName();
    }

    else if(statement.includes("how are you")){
        return commands.status();
    }

    else if (statement.includes("kingsley")) {
        return commands.acknowledge(statement);
    }

    else if (statement.includes("good job") || statement.includes("nice work") ) {
        return commands.thanks();
    }

    else if (statement.includes("hello") || statement.includes("hi")) {
        return commands.hello();
    }

    else if (statement.includes("thanks") || statement.includes("thank you")) {
        return commands.youAreWelcome();
    }

    else if (statement.includes("voice options")) {
        return commands.voices();
    }

    else if (statement.includes("set voice")) {
        return commands.setVoice(statement);
    }

    else if (statement.includes("tell me about") || 
        statement.includes("what is") || 
        statement.includes("what are") || 
        statement.includes("who is") ||
        statement.includes("who are")) {
        return commands.wikipedia(statement);
    }

    else {
        if(session.get().active) {
            return commands.tryAgain();
        }
    }

    return Promise.resolve({text:""});
}