import fs from "fs";
import path from "path";
import { SpeechClient } from "@google-cloud/speech";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Initialize Google Speech-to-Text Client
const client = new SpeechClient({
    keyFilename: path.join(process.cwd(), "BACKEND/Keys/latticetalk-54e9175b7f07.json")
});

// cheeck if the file is a webm file
const isWebmFile = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    const header = buffer.toString("hex", 0, 4); // Read first 4 bytes

    // WebM starts with "1a45dfa3" (Matroska format)
    return header === "1a45dfa3";
};

// convert webm to wav with 16000 sample rate for google speech to text
const convertWebmToWav = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .setFfmpegPath(ffmpegStatic) // Ensure ffmpeg is found
            .input(inputPath)
            .audioCodec("pcm_s16le") // 16-bit signed little-endian PCM
            .audioChannels(1)
            .audioFrequency(16000)
            .format("wav")
            .on("end", () => resolve(outputPath))
            .on("error", (err) => reject(err))
            .save(outputPath);
    });
};

//transcribe the audio file
export async function transcribeAudio(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("File does not exist!");
        }

        // Check if the file is a valid WebM file
        if (!isWebmFile(filePath)) {
            throw new Error("Uploaded file is not WebM");
        }

        const wavPath = filePath.replace(".webm", ".wav"); // Replace extension
        await convertWebmToWav(filePath, wavPath);//call the function to convert the file

        // Read WAV file
        const audioFile = fs.readFileSync(wavPath);
        if (audioFile.length === 0) {
            throw new Error("Audio file is empty");
        }

        // Speech-to-Text request config
        const request = {
            audio: { content: audioFile.toString("base64") },
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 16000,
                languageCode: "en-US"
            },
        };

        const [response] = await client.recognize(request);

        // Extract transcription
        const transcript = response.results
            .map(r => r.alternatives[0]?.transcript || "")
            .join("\n");

        // Cleanup files
        fs.unlinkSync(filePath);//delete the file
        fs.unlinkSync(wavPath);

        return transcript;
    } catch (error) {
        console.error("Error processing audio:", error);
        throw error;
    }
}
