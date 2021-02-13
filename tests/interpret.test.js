import '../src/interpret'
import interpret from '../src/interpret'
import commands from '../src/commands'
import {
    API
} from 'aws-amplify'

describe('interpret.js', () => {

    it('should understand "what time is it"', async () => {
        let time = await commands.getTheTime();
        expect(await interpret('what time is it?')).toEqual(time)
    })

    it('should understand "do you have the time?"', async () => {
        let time = await commands.getTheTime();
        expect(await interpret('do you have the time')).toEqual(time)
    })

    it('should understand "who are you?"', async () => {
        expect(await interpret("who are you")).toEqual({
            text: "I'm Kingsley."
        })
    })

    it('should understand "what\'s your name?"', async () => {
        expect(await interpret("what's your name")).toEqual({
            text: "I'm Kingsley."
        })
    })

    it('should understand "what are cats according to wikipedia?"', async () => {

        API.get = jest.fn(() =>
            Promise.resolve({
                "extract": "The cat (Felis catus).",
                "thumbnail": {
                    "source": "some.url"
                }
            })
        );
        expect(await interpret("what are cats according to wikipedia")).toEqual({
            text: "The cat (Felis catus).",
            image: "some.url"
        })

    })

    it('should understand "What is the weather like?"', async () => {

        API.get = jest.fn(() =>
            Promise.resolve({
                coord: {
                    lon: -93.8852,
                    lat: 41.6117
                },
                weather: [{
                    id: 600,
                    main: 'Snow',
                    description: 'light snow',
                    icon: '13d'
                }],
                base: 'stations',
                main: {
                    temp: 8.37,
                    feels_like: -3.95,
                    temp_min: 7,
                    temp_max: 10,
                    pressure: 1022,
                    humidity: 82
                },
                visibility: 6295,
                wind: {
                    speed: 11.01,
                    deg: 321,
                    gust: 14
                },
                snow: {
                    '1h': 0.37
                },
                clouds: {
                    all: 100
                },
                dt: 1612645568,
                sys: {
                    type: 3,
                    id: 2007744,
                    country: 'US',
                    sunrise: 1612617711,
                    sunset: 1612654649
                },
                timezone: -21600,
                id: 4880981,
                name: 'Waukee',
                cod: 200
            })
        )

        expect(await interpret("what's the weather like?")).toEqual({text: "It's light snow. The temperature is 8.37 degrees Farenhiet, but feels like -3.95. The humidity is 82 percent."})

    });

    it('should understand "hello" and "hi"', async () => {
        expect(await interpret('hello kingsley')).toEqual({text: 'Hello.'})
        expect(await interpret('hi kingsley')).toEqual({text: 'Hello.'})
    })

})