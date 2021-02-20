import { Response } from './interfaces'

export default {

    clear: () => {
        document.querySelector('.messages').innerHTML = '';
    },

      
    create: (response: Response) =>{
        let el = document.createElement('div');
        el.className = 'message';
      
        let wrap = document.createElement('div');
        wrap.className = 'wrap';
      
        if (response.image) {
          let img = document.createElement('img');
          img.src = response.image;
          wrap.appendChild(img);
        }
      
        if (response.text) {
          let p = document.createElement('p');
          p.textContent = response.text;
          wrap.appendChild(p);
        }

        if(response.url) {
          let iframe = document.createElement('iframe');
          iframe.src = response.url;
          wrap.appendChild(iframe);
        }
      
        el.appendChild(wrap);
        document.querySelector('.messages').appendChild(el);
    }
}