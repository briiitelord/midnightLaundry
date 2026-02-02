import { uploadFile } from './storage';

export type AudioPreviewResult = {
  previewUrl: string;
};

const loadAudioBuffer = (url: string): Promise<ArrayBuffer> =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error(`Failed to fetch audio: ${res.statusText}`);
    return res.arrayBuffer();
  });

const decodeAudioData = (audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> =>
  audioContext.decodeAudioData(arrayBuffer);

const extractPreviewSegment = (audioBuffer: AudioBuffer, durationSeconds: number = 22): AudioBuffer => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const previewSamples = Math.floor(sampleRate * durationSeconds);
  const actualSamples = Math.min(previewSamples, audioBuffer.length);
  
  console.log('Extracting preview segment:', {
    originalDuration: audioBuffer.duration,
    originalLength: audioBuffer.length,
    targetDuration: durationSeconds,
    targetSamples: previewSamples,
    actualSamples,
    actualDuration: actualSamples / sampleRate,
    sampleRate,
    numberOfChannels,
  });

  const previewBuffer = audioContext.createBuffer(numberOfChannels, actualSamples, sampleRate);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const sourceData = audioBuffer.getChannelData(channel);
    const previewData = previewBuffer.getChannelData(channel);
    previewData.set(sourceData.slice(0, actualSamples));
  }

  console.log('Preview buffer created:', {
    duration: previewBuffer.duration,
    length: previewBuffer.length,
  });

  return previewBuffer;
};

const audioBufferToWav = (audioBuffer: AudioBuffer): Blob => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const channelData = Array.from({ length: numberOfChannels }, (_, i) =>
    audioBuffer.getChannelData(i)
  );

  const interleaved = new Float32Array(audioBuffer.length * numberOfChannels);
  let offset = 0;

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      interleaved[offset++] = channelData[channel][i];
    }
  }

  const dataLength = interleaved.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const writeFloat32 = (offset: number, value: number) => {
    view.setFloat32(offset, value, true);
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let sampleIndex = 0;
  let offset_data = 44;

  while (sampleIndex < interleaved.length) {
    const sample = Math.max(-1, Math.min(1, interleaved[sampleIndex++]));
    view.setInt16(offset_data, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset_data += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

export const generateAndUploadAudioPreview = async (params: {
  musicUrl: string;
  category: string;
  musicId: string;
  previewDuration?: number;
}): Promise<AudioPreviewResult> => {
  const { musicUrl, category, musicId, previewDuration = 22 } = params;

  try {
    console.log('Starting audio preview generation:', { musicUrl, category, musicId, previewDuration });
    
    const arrayBuffer = await loadAudioBuffer(musicUrl);
    console.log('Audio buffer loaded:', { size: arrayBuffer.byteLength });
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await decodeAudioData(audioContext, arrayBuffer);
    console.log('Audio decoded:', { duration: audioBuffer.duration, sampleRate: audioBuffer.sampleRate });
    
    const previewBuffer = extractPreviewSegment(audioBuffer, previewDuration);
    console.log('Preview segment extracted:', { duration: previewBuffer.duration });
    
    const wavBlob = audioBufferToWav(previewBuffer);
    console.log('WAV blob created:', { size: wavBlob.size, type: wavBlob.type });

    const fileName = `${musicId}-preview-${previewDuration}s.wav`;
    const path = `${category}/${fileName}`;
    const file = new File([wavBlob], fileName, { type: 'audio/wav' });

    console.log('Uploading preview to storage:', { path, fileSize: file.size });
    const previewUrl = await uploadFile('music_previews', path, file);
    if (!previewUrl) {
      throw new Error('Preview upload failed.');
    }

    console.log('Preview generated and uploaded successfully:', { previewUrl });
    return { previewUrl };
  } catch (error) {
    console.error('Audio preview generation failed:', error);
    throw error;
  }
};
