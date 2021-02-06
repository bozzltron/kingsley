
interface Session {
    active :boolean,
    name :string,
    voice :number
}

let defaults = {
    active: false,
    name: 'Kingsley',
    voice: 51
};

let session = {

    activate: ()=>{
        session.set({active: true});
        setTimeout(()=>{
            session.set({active: false});
        }, 300000)
    },

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