import commands from './commands'
const name = 'Kingsley'

export default function (statement :string) :Promise<string> {

    if (statement.includes("what time is it") || statement.includes("do you have the time")) {
        return commands.getTheTime();
    }

    else if (statement.includes("what's your name") || statement.includes("who are you")) {
        return commands.getName();
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
        return commands.tryAgain();
    }
}