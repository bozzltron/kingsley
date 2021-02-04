import commands from './commands'
const name = 'Kingsley'

export default function (statement :string) :Promise<string> {

    if (statement.includes("what time is it") || statement.includes("do you have the time")) {
        return Promise.resolve(commands.getTheTime());
    }

    else if (statement.includes("what's your name") || statement.includes("who are you")) {
        return Promise.resolve("I'm " + name);
    }

    else if (statement.includes("wikipedia")) {
        return commands.wikipedia(statement);
    }

    else if (statement.includes("kingsley")) {
        return commands.acknowledge(statement);
    }

    else {
        // return Promise.resolve("I'm afraid I don't understand.")
    }
}