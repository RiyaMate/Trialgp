/*import { OpenAI } from "langchain/llms/openai";
import SSE from "express-sse";

const sse = new SSE();

export default function handler(req, res) {
  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }
    // Initialize model

    // create the prompt

    // call frontend to backend

    return res.status(200).json({ result: "OK" });
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}*/

import { OpenAI } from "langchain/llms/openai";
import SSE from "express-sse";
import cors from "cors"; // Import the cors module

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

const sse = new SSE();

export default function handler(req, res) {
  const corsOptions = {
    origin: '*', // This will allow all domains to access your API. Be more specific for production environments.
    methods: ['GET', 'POST', 'OPTIONS'] // Specifying which methods are allowed.
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).send(); // Handle preflight for CORS.
  }

  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }
    // Initialize model
    const chat = new OpenAI({
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sse.send(token, "newToken");
          },
        },
      ],
    });

    // create the prompt
    const prompt = `Create me a short rap about my name and city. Make it funny and punny. Name: ${input}`;

    console.log({ prompt });
    // call frontend to backend
    chat.call(prompt).then(() => {
      sse.send(null, "end");
    });

    return res.status(200).json({ result: "Streaming complete" });
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

// Use CORS with the options
handler.use(cors(corsOptions));
