
import { Session } from './interfaces'

let defaults = {
    active: false,
    name: 'Kingsley',
    voice: 51,
    city: 'Waukee,Iowa',
    newsSources: 'axios,associated-press,npr,bbc-news,reuters',
    face: 'slightly_smiling_face',
    conversation: '',
    id:''
};

let session = {

    set: (changes :any) => {
        let data = session.get();
        if (window.sessionStorage) {
            try {
                data = Object.assign(data, changes);
                window.sessionStorage.setItem('session', JSON.stringify(data));
            } catch (e) {
                console.log("failed to parse session")
            }
        }
    },

    get: () :Session => {
        let data;
        if (window.sessionStorage) {
            try {
                data = JSON.parse(window.sessionStorage.getItem('session'));
            } catch (e) {
                console.log("failed to parse session")
            }
        }
        data = Object.assign(defaults, data);
        return data;
    }

}

export default session