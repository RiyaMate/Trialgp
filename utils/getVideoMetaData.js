/*import axios from "axios";

export default async function getVideoMetaData(videoId) {
  // First, we need to make sure we have our GOOGLE_API_KEY set up
  // https://console.cloud.google.com/apis/
  // Look up the YouTube Data API V3
  // Enable API key
  // Copy into .env as GOOGLE_API_KEY
  // Configure Next.Config.JS
  /*const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // HTTP request { data: {items: [metadata ]}}
    const response = await axios.get(url);
    const data = response.data;
    const metadata = data.items[0];

    console.log("GetMetadata", { metadata });

    // Clean up the response
    const videoTitle = metadata.snippet.title;
    const videoDescription = metadata.snippet.description;
    const shortenedDescription = videoDescription.split(".")[0];

    const videoId = metadata.id;
    // Create a small metadata object to return
    const shortMetadata = {
      videoTitle,
      videoDescription: shortenedDescription,
      videoId,
    };
    return shortMetadata; // returns the first item, which should be the video if the id is valid
  } catch (error) {
    console.error(`Failed to fetch video metadata: ${error}`);
  }
}*/

import axios from "axios";

// Make sure to replace 'YOUR_GOOGLE_API_KEY' with your actual API key
const API_KEY = process.env.GOOGLE_API_KEY;

export default async function getVideoMetaData(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,contentDetails,statistics`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.items.length === 0) {
      console.error("No video metadata found for the provided video ID.");
      return null;
    }
    const metadata = data.items[0];

    console.log("GetMetadata", { metadata });

    // Extracting useful pieces of metadata
    const videoTitle = metadata.snippet.title;
    const videoDescription = metadata.snippet.description;
    const shortenedDescription = videoDescription.split(".")[0];  // Example of shortening the description

    const videoId = metadata.id;
    const viewCount = metadata.statistics.viewCount;

    // Create a small metadata object to return
    const shortMetadata = {
      videoTitle,
      videoDescription: shortenedDescription,
      videoId,
      viewCount
    };

    return shortMetadata;  // returns relevant metadata
  } catch (error) {
    console.error(`Failed to fetch video metadata: ${error}`);
    return null;  // Return null if there is an error
  }
}
