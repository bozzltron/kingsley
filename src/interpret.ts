import commands from './commands'
import session from './session'
import { Response } from './interfaces'

export default function (statement :string) :Promise<Response> {

    if (statement.includes("what time is it") || 
    statement.includes("what's the time") || 
        statement.includes("do you have the time") ||
        statement.includes("what is the date") ||
        statement.includes("what's is the date") ||
        statement.includes("todays date")) {
        return commands.getTheTime();
    }

    else if (statement.includes("weather")) {
        return commands.weather(statement);
    }    

    else if (statement.includes("what's your name") || statement.includes("who are you")) {
        return commands.getName();
    }

    // else if(statement.includes("how are you")){
    //     return commands.status();
    // }

    // else if (statement.split(' ').includes("hello") || statement.split(' ').includes("hi")) {
    //     return commands.hello();
    // }

    else if (statement.split(' ').includes("kingsley")) {
        return commands.acknowledge(statement);
    }

    // else if (statement.includes("good job") || statement.includes("nice work") || statement.includes("awesome") ) {
    //     return commands.thanks();
    // }

    // else if (statement.includes("thanks") || statement.includes("thank you")) {
    //     return commands.youAreWelcome();
    // }

    else if (statement.includes("voice options")) {
        return commands.voices();
    }

    else if (statement.includes("set voice")) {
        return commands.setVoice(statement);
    }

    else if (statement.includes("tell me about") || statement.includes("wikipedia")) {
        return commands.wikipedia(statement);
    }

    else if (statement.includes("read that")) {
        return commands.read(statement);
    }

    else if (statement.split(' ').includes("news")) {
        return commands.news(statement);
    }

    else if (statement.includes("the rundown")) {
        return commands.rundown();
    }

    else if (statement.includes("that's enough") || statement.includes("go to sleep") || statement.includes("go to sleep")) {
        return commands.stop();
    }

    else if(statement.includes("+") || statement.includes("-") || statement.includes("/") || 
        statement.includes("*") || statement.includes("%") || statement.includes("distance") || 
        statement.includes("how long")) {
        return commands.wolfram(statement);
    }

    return commands.openai(statement);

}