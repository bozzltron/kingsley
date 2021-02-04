import commands from './commands'
const name = 'Kingsley'

export default function (statement :string) :Promise<string> {

    if (statement.includes("what time is it") || statement.includes("do you have the time")) {
        return commands.getTheTime();
    }

    else if (statement.includes("what's your name") || statement.includes("who are you")) {
        return commands.getName();
    }

    else if (statement.includes("wikipedia")) {
        return commands.wikipedia(statement);
    }

    else if (statement.includes("kingsley")) {
        return commands.acknowledge(statement);
    }

    else if (statement.includes("good job") || statement.includes("nice work") ) {
        return commands.thanks();
    }

    else if (statement.includes("hello") || statement.includes("hi")) {
        return commands.hi();
    }


    else {
        // return Promise.resolve("I'm afraid I don't understand.")
    }
}