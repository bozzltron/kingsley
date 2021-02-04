import commands from './commands'
const name = 'Kingsley'

export default function (statement :string) :Promise<string> {

    if (statement.includes("what time is it") || statement.includes("do you have the time")) {
        return Promise.resolve(commands.getTheTime());
    }

    if (statement.includes("what's your name") || statement.includes("who are you")) {
        return Promise.resolve("I'm " + name);
    }

    if (statement.includes("wikipedia")) {
        return commands.wikipedia(statement);
    }
}