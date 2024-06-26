// /pages/api/transcript_chat.js

/*import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { YoutubeTranscript } from "youtube-transcript";
import ResearchAgent from "../../agents/ResearchAgent";
import extractVideoId from "../../utils/extractVideoId";
import getVideoMetaData from "../../utils/getVideoMetaData";

let chain;
let chatHistory = [];
let transcript = "";
let metadataString = "";
let research;

// Initialize Chain with Data
const initChain = async (transcript, metadataString, research, topic) => {
  try {
    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    const llm = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",
    });

    console.log(`Initializing Chat Prompt`);

    // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
    // This allows us to set the template that the bot sees every time
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful social media assistant that provides research, new content, and advice to me. \n You are given the transcript of the video: {transcript} \n and video metadata: {metadata} as well as additional research: {research}"
      ),
      HumanMessagePromptTemplate.fromTemplate(
        "{input}. Remember to use the video transcript and research as reference."
      ),
    ]);

    const question = `Write me a script for a new video that provides commentary on this video in a lighthearted, joking manner. It should compliment ${topic} with puns.`;
    console.log(question);

    chain = new LLMChain({
      prompt: chatPrompt,
      llm: llm,
      // memory,
    });

    const response = await chain.call({
      transcript,
      metadata: metadataString,
      research,
      input: question,
    });

    console.log({ response });

    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    return response;
  } catch (error) {
    console.error(
      `An error occurred during the initialization of the Chat Prompt: ${error.message}`
    );
    throw error; // rethrow the error to let the calling function know that an error occurred
  }
};

export default async function handler(req, res) {
  const { prompt, topic, firstMsg } = req.body;
  console.log(`Prompt: ${prompt} Topic: ${topic}`);

  if (
    chain === undefined &&
    !prompt.includes("https://www.youtube.com/watch?v=")
  ) {
    return res.status(400).json({
      error:
        "Chain not initialized. Please send a YouTube URL to initialize the chain.",
    });
  }

  chatHistory.push({
    role: "user",
    content: prompt,
  });

  // Just like in the previous section, if we have a firstMsg set to true, we need to initialize with chain with the context
  if (firstMsg) {
    console.log("Received URL");
    console.log(prompt);
    try {
      const videoId = extractVideoId(prompt);
      console.log(videoId);
      // API call for video transcript (same as last video, but we just grab the array and flatten it into a variable)[{text:" "},{ text: ""}]
      const transcriptResponse = await YoutubeTranscript.fetchTranscript(
        videoId
      );
      transcriptResponse.forEach((line) => {
        transcript += line.text;
      });
      console.log(transcript);
      // Some error handling
      if (!transcriptResponse) {
        return res.status(400).json({ error: "Failed to get transcript" });
      }

      // API call for video metadata –– go to VideoMetaData and explain this
      const metadata = await getVideoMetaData(videoId);

      // JSON object { [], [], [] } , null (no characters between), and use 2 spaces for indentation
      metadataString = JSON.stringify(metadata, null, 2);
      console.log({ metadataString });

      // ResearchAgent
      research = await ResearchAgent(topic);

      console.log({ research });

      // Alright, finally we have all the context and we can initialize the chain!
      const response = await initChain(
        transcript,
        metadataString,
        research,
        topic
      );

      // return res.status(200).json({ output: research });
      return res.status(200).json({
        output: response,
        chatHistory,
        transcript,
        metadata,
        research,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching transcript" });
    }
  } else {
    // Very similar to previous section, don't worry too much about this just copy and paste it from the previous section!
    console.log("Received question");
    try {
      const question = prompt;

      console.log("Asking:", question);
      console.log("Using old chain:", chain);
      // Everytime we call the chain we need to pass all the context back so that it can fill in the prompt template appropriately
      const response = await chain.call({
        transcript,
        metadata: metadataString,
        research,
        input: question,
      });

      // update chat history
      chatHistory.push({
        role: "assistant",
        content: response.text,
      });
      // just make sure to modify this response as necessary.
      return res.status(200).json({
        output: response,
        metadata: metadataString,
        transcript,
        chatHistory,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred during the conversation." });
    }
  }
}
*/
//WORKING TRANSCRIPT
/*
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { getSubtitles } from 'youtube-captions-scraper';
import ResearchAgent from "../../agents/ResearchAgent";
import extractVideoId from "../../utils/extractVideoId";
import getVideoMetaData from "../../utils/getVideoMetaData";

// Global Variables
let chain;
let chatHistory = [];
let transcript = "";
let metadataString = "";
let research;

// Initialize Chain with Data
const initChain = async (transcript, metadataString, research, topic) => {
  const llm = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful social media assistant that provides research, new content, and advice to me. You are given the transcript of the video: {transcript} and video metadata: {metadata} as well as additional research: {research}"
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "{input}. Remember to use the video transcript and research as reference."
    ),
  ]);

  const question = `Write me a script for a new video that provides commentary on this video in a lighthearted, joking manner. It should compliment ${topic} with puns.`;

  chain = new LLMChain({
    prompt: chatPrompt,
    llm: llm,
  });

  const response = await chain.call({
    transcript,
    metadata: metadataString,
    research,
    input: question,
  });

  chatHistory.push({
    role: "assistant",
    content: response.text,
  });

  return response;
};

export default async function handler(req, res) {
  const { prompt, topic, firstMsg } = req.body;

  if (
    chain === undefined &&
    !prompt.includes("https://www.youtube.com/watch?v=")
  ) {
    return res.status(400).json({
      error: "Chain not initialized. Please send a YouTube URL to initialize the chain.",
    });
  }

  chatHistory.push({
    role: "user",
    content: prompt,
  });

  if (firstMsg) {
    const videoId = extractVideoId(prompt);

    try {
      await getSubtitles({
        videoID: videoId,
        lang: 'en'
      }).then(captions => {
        transcript = captions.map(line => line.text).join(' ');
      });
    console.log(transcript);
      if (!transcript) {
        return res.status(400).json({ error: "Failed to get transcript" });
      }

      const metadata = await getVideoMetaData(videoId);
      metadataString = JSON.stringify(metadata, null, 2);

      research = await ResearchAgent(topic);

      const response = await initChain(transcript, metadataString, research, topic);
      return res.status(200).json({
        output: response,
        chatHistory,
        transcript,
        metadata,
        research,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while fetching transcript" });
    }
  } else {
    const question = prompt;
    const response = await chain.call({
      transcript,
      metadata: metadataString,
      research,
      input: question,
    });

    chatHistory.push({
      role: "assistant",
      content: response.text,
    });

    return res.status(200).json({
      output: response,
      metadata: metadataString,
      transcript,
      chatHistory,
    });
  }
}
*/

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { getSubtitles } from 'youtube-captions-scraper';
import ResearchAgent from "../../agents/ResearchAgent.js";
import extractVideoId from "../../utils/extractVideoId.js";
import getVideoMetaData from "../../utils/getVideoMetaData.js";

// Global Variables
let chain;
let chatHistory = [];
let transcript = "";
let metadataString = "";
let research;

// Initialize Chain with Data
const initChain = async (transcript, metadataString, research, topic) => {
  const llm = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful social media assistant that provides research, new content, and advice to me. You are given the transcript of the video: {transcript} and video metadata: {metadata} as well as additional research: {research}"
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "{input}. Remember to use the video transcript and research as reference."
    ),
  ]);

  chain = new LLMChain({
    prompt: chatPrompt,
    llm: llm,
  });

  return chain.call({
    transcript,
    metadata: metadataString,
    research,
    input: `Write me a script for a new video that provides commentary on this video in a lighthearted, joking manner. It should compliment ${topic} with puns.`
  });
};

export default async function handler(req, res) {
  const { prompt, topic, firstMsg } = req.body;

  if (!prompt.includes("https://www.youtube.com/watch?v=")) {
    return res.status(400).json({ error: "Invalid YouTube URL provided." });
  }

  if (firstMsg) {
    const videoId = extractVideoId(prompt);

    try {
      const captions = await getSubtitles({ videoID: videoId, lang: 'en' });
      transcript = captions.map(caption => caption.text).join(' ');
       console.log(transcript);
       console.log(videoId);
      const metadata = await getVideoMetaData(videoId);
      metadataString = JSON.stringify(metadata, null, 2);
      console.log('METADATA IS');
      console.log(metadataString);
      research = await ResearchAgent(topic);

      const response = await initChain(transcript, metadataString, research, topic);

      chatHistory.push({ role: "assistant", content: response.text });
      res.status(200).json({ output: response.text, chatHistory, transcript, metadata: metadataString, research });
    } catch (error) {
      console.error("Fetching error:", error);
      res.status(500).json({ error: "Failed to fetch data from YouTube." });
    }
  } else {
    const response = await chain.call({
      transcript,
      metadata: metadataString,
      research,
      input: prompt,
    });

    chatHistory.push({ role: "assistant", content: response.text });
    res.status(200).json({ output: response.text, chatHistory });
  }
}
