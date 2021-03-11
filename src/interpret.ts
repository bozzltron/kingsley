import commands from './commands'
import session from './session'
import { Response } from './interfaces'
import { includesAny } from './string';

export default function (statement :string) :Promise<Response> {

    statement = statement.replace("kingsley", "").trim();

    if(statement.split(' ').length <= 2 && !includesAny(statement, ['goodbye', 'good morning', 'hello', 'hi', 'thank you'])){
        return commands.tryAgain();
    }

    else if (includesAny( statement, ["what time is it", "what's the time", "do you have the time", "what is the date", "what's is the date", "todays date"])) {
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

    else if (statement.split(' ').includes("leroy") || statement.split(' ').includes("leroy's")) {
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

    else {
        return commands.hypothesize(statement);
    }

}