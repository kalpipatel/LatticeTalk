import { useState, useRef } from "react";

const useTranscribe = () => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Start recording
    const startRecording = async () => {
        setTranscript(""); 
        setRecording(true);
    
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(d => d.kind === "audioinput");
    
            if (audioDevices.length === 0) {
                console.error("No microphones");
                return;
            }
    
            //Force using the first detected microphone
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { deviceId: audioDevices[0].deviceId } 
            });
    
            console.log("Using Microphone:", audioDevices[0].label);
    
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            mediaRecorderRef.current = mediaRecorder;
    
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
    
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
    
            mediaRecorder.ondataavailable = (event) => {
                console.log("Recorded Audio Chunk Type:", event.data.type);
                console.log("Recorded Audio Chunk Size:", event.data.size, "bytes");
                audioChunksRef.current.push(event.data);
            };
    
            mediaRecorder.onstop = async () => {
                analyser.getByteFrequencyData(dataArray);
                console.log("Audio Levels:", dataArray);
    
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                console.log("Final Recorded Audio Size:", audioBlob.size, "bytes");
    
                if (audioBlob.size === 0) {
                    console.error("Recorded audio is empty! Microphone may not be working.");
                    return;
                }
    
                const formData = new FormData();
                formData.append("audio_file", audioBlob, "recording.webm");
    
                try {
                    const response = await fetch("http://localhost:3001/transcribe", {
                        method: "POST",
                        body: formData,
                    });
    
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
    
                    const data = await response.json();
                    setTranscript(data.transcription || "No transcription available.");
                } catch (error) {
                    console.error("Error transcribing audio:", error);
                    setTranscript("Transcription failed.");
                }
    
                audioChunksRef.current = []; 
            };
    
            mediaRecorder.start();
        } catch (error) {
            console.error("Error getting microphone:", error);
            setRecording(false);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return { recording, transcript, startRecording, stopRecording };
};

export default useTranscribe;
