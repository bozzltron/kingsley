import commands from './commands'
import session from './session'
import { Response } from './interfaces'

export default function (statement :string) :Promise<Response> {

    statement = statement.replace("kingsley", "").trim();

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

    else if (statement.includes("voice options")) {
        return commands.voices();
    }

    else if (statement.includes("set voice")) {
        return commands.setVoice(statement);
    }

    else if (statement.includes("wikipedia")) {
        return commands.wikipedia(statement);
    }

    else if (statement.includes("read that")) {
        return commands.read(statement);
    }

    else if (statement.split(' ').includes("news today")) {
        return commands.news("");
    }

    else if (statement.includes("the rundown")) {
        return commands.rundown();
    }

    else if (statement.includes("that's enough") || statement.includes("go to sleep") || statement.includes("good night") || statement.includes("goodbye")) {
        return commands.stop(statement);
    }

    // else if(statement.includes("+") || statement.includes("-") || statement.includes("/") || 
    //     statement.includes("*") || statement.includes("%") || statement.includes("distance") || 
    //     statement.includes("how long")) {
    //     return commands.wolfram(statement);
    // }

    else if (statement.split(' ').includes("leroy")) {
        return commands.leroy();
    }

    else if (statement.split(' ').includes("google")) {
        return commands.google(statement);
    }

    else if (statement.includes("change your face")) {
        return commands.face(statement);
    }

    else if (statement.includes("read me")) {
        return commands.findAndRead(statement);
    }

    else if (statement.includes("what can you do")) {
        return commands.capabilities();
    }

    // else if (statement.split(' ').includes("you")) {
    //     return commands.openai(statement);
    // }

    return commands.hypothesize(statement);

}