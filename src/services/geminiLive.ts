import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export interface CallCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: LiveServerMessage) => void;
  onError?: (error: any) => void;
  onVolumeChange?: (volume: number) => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: any; // Using any because the SDK types for Live session are still evolving
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async connect(callbacks: CallCallbacks) {
    try {
      this.session = await this.ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are Aura, a professional and warm front desk receptionist for a high-end corporate office or luxury hotel. Your goal is to assist callers with inquiries, take messages, and provide information about the facility. Be polite, efficient, and always maintain a helpful demeanor. If someone asks for a specific person, offer to take a message or check if they are available (simulated).",
        },
        callbacks: {
          onopen: () => {
            console.log("Live connection opened");
            this.startAudioCapture();
            callbacks.onOpen?.();
          },
          onclose: () => {
            console.log("Live connection closed");
            this.stopAudioCapture();
            callbacks.onClose?.();
          },
          onmessage: (message: LiveServerMessage) => {
            callbacks.onMessage?.(message);
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              this.playAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
            }
          },
          onerror: (error) => {
            console.error("Live connection error:", error);
            callbacks.onError?.(error);
          },
        },
      });
    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
      throw error;
    }
  }

  private async startAudioCapture() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      
      // Simple script processor for PCM 16bit 16kHz
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        // Send to Gemini
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        if (this.session) {
          this.session.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error("Error capturing audio:", error);
    }
  }

  private stopAudioCapture() {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach(track => track.stop());
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
    }
    this.audioContext = null;
    this.processor = null;
    this.source = null;
    this.stream = null;
  }

  private async playAudio(base64Data: string) {
    if (!this.audioContext) return;
    
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Gemini returns PCM 24kHz usually for TTS, but Live might be different.
      // The docs say 24000 for TTS. Let's assume 24000 for now or handle it.
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  disconnect() {
    this.session?.close();
    this.stopAudioCapture();
  }
}
