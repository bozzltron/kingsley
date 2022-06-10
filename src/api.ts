var fetch = require('node-fetch')
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

interface Payload {
  statement: string,
  confidence: number,
  conversation: string
}

function api(payload:Payload) {
  console.log("api", process.env.NODE_ENV);
  console.log("payload", payload);
  if(process.env.NODE_ENV == 'production') {
    return API.post('kingsley', '/inquire', {
      body: payload
    });
  } else {
    return fetch(`http://localhost:3011/inquire`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    }).then((res:any)=> res.json());
  }
}

export default api;