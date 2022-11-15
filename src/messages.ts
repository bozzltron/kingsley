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
          p.innerHTML = response.text;
          wrap.appendChild(p);
        }

        if(response.text.includes("Response")) {
          let thumbs_up = document.createElement('a');
          thumbs_up.innerHTML = "👍";
          thumbs_up.className = "thumbs_up";
          let thumbs_down = document.createElement('a');
          thumbs_down.innerHTML = "👎";
          thumbs_down.className = "thumbs_down";
          let button_wrap = document.createElement('div');
          button_wrap.className = "button_wrap";
          button_wrap.append(thumbs_up);
          button_wrap.append(thumbs_down);
          el.append(button_wrap);
        }

        if(response.url) {
          let iframe = document.createElement('iframe');
          iframe.src = response.url;
          let link = document.createElement('a');
          link.href = response.url;
          link.target = "_blank";
          link.textContent = response.url;
          wrap.appendChild(link);
          wrap.appendChild(iframe);
        }
      
        el.appendChild(wrap);
        document.querySelector('.messages').appendChild(el);
    }
}