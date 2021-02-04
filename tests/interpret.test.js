import '../src/interpret'
import interpret from '../src/interpret'
import commands from '../src/commands'

describe('interpret.js', ()=>{

    it('should understand "what time is it"', async ()=>{
        let time = commands.getTheTime();
        expect( await interpret('what time is it?')).toEqual(time)
    })

    it('should understand "do you have the time?"', async ()=>{
        let time = commands.getTheTime();
        expect( await interpret('do you have the time')).toEqual(time)
    })

    it('should understand "who are you?"', async ()=>{
        let time = commands.getTheTime();
        expect( await interpret("who are you")).toEqual("I'm Kingsley")
    })

    it('should understand "what\'s your name?"', async ()=>{
        let time = commands.getTheTime();
        expect( await interpret("what's your name")).toEqual("I'm Kingsley")
    })

    it('should understand "what are cats according to wikipedia?"', async ()=>{
    
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    "query": {
                        "pages": {
                            "6678": {
                                "extract": "The cat (Felis catus)."
                            }
                        }
                    }
                }),
            })
        );
        expect( await interpret("what are cats according to wikipedia")).toEqual("The cat (Felis catus).")
        fetch.mockClear();
    })

})