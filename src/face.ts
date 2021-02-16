var emoji = require('node-emoji')

const face = {

    update: (name :string)=>{
        let el = document.querySelector('.face');
        el.textContent = emoji.get(name);
    }

}

export default face;