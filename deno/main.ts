import { config, serve, ws } from "./deps.ts";

console.log(config().OPENAI_API_KEY);

console.log("Waiting for clients ...");

interface Response {
    text: string;
    image?: string;
    url?: string;
}

interface Inquiry {
    statement: string;
    confidence: number;
    conversation: string;
    personality: string;
}

async function nlp(inquiry:Inquiry): Promise<Response>   {
  let response : Response= {text:""};

  try {
    const prompt = `${inquiry.personality} ${inquiry.conversation}\nAI:`
    console.log('prompt', prompt);
    // const completion = await openai.createCompletion({
    //    "model": "text-davinci-003",
    //     prompt: prompt,
    //     temperature: 0.9,
    //     max_tokens: 150,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.6,
    //     stop: [" Human:", " AI:"],
    // });
    const completion = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config().OPENAI_API_KEY || Deno.env.get("OPENAI_API_KEY")}`
        },
        body: JSON.stringify({    
            "model": "text-davinci-003",    
            prompt: prompt,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.6,
                stop: [" Human:", " AI:"]})
    }).then((response) => response.json());
    console.log('completion', completion);

    let text:string = completion.choices[0].text || "";

    const urlRegex: RegExp = /(https?:\/\/[^ ]*)/;
    const matches: Array<string> = text.match(urlRegex) || []
    const url:string = matches?.length > 0 ? matches[0] : "";
    
    response.text = text;
    if (
      url &&
      (url.includes(".jpg") ||
        url.includes(".png") ||
        url.includes(".gif") ||
        url.includes(".webp"))
    ) {
      response.image = url;
    } else {
      response.url = url;
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    //console.error(error.stack);
    response.text = "I encountered an error. Try again.";
  }

  return response;
}

for await (const req of serve(":8080")) {
  console.log("Incoming connection from client ...");
  const wdata = {
    conn: req.conn,
    bufReader: req.r,
    bufWriter: req.w,
    headers: req.headers,
  };
  try {
    const whdl = await ws.acceptWebSocket(wdata);
    console.log("Connection established with client ...");

    for await (const e of whdl) {
      if (ws.isWebSocketCloseEvent(e)) {
        console.log("Connection closed by client ...");
        break;
      } else if (typeof e === "string") {
        console.log("received << " + e);
        const message = await nlp(JSON.parse(e));
        whdl.send(JSON.stringify(message));
        console.log("sent >> " + JSON.stringify(message));
      }
    }
  } catch (err) {
    req.respond({ status: 400 });
  }
}
