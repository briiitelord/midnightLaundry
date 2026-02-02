import { uploadFile } from './storage';

export type VideoPreviewResult = {
  previewUrl: string;
  previewTimestamp: number;
};

const createVideoElement = (url: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.onloadedmetadata = null;
      video.onerror = null;
    };

    video.onloadedmetadata = () => {
      cleanup();
      resolve(video);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Unable to load video metadata for preview.'));
    };
  });

const seekVideo = (video: HTMLVideoElement, time: number) =>
  new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.onseeked = null;
      video.onerror = null;
    };

    video.onseeked = () => {
      cleanup();
      resolve();
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Unable to seek video for preview.'));
    };

    video.currentTime = time;
  });

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Unable to create preview image.'));
        }
      },
      'image/jpeg',
      0.82
    );
  });

const drawPreviewFrame = (video: HTMLVideoElement, pixelate: boolean) => {
  const width = Math.min(640, video.videoWidth || 640);
  const height = Math.round(width * ((video.videoHeight || 360) / (video.videoWidth || 640)));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create preview canvas.');
  }

  if (!pixelate) {
    ctx.drawImage(video, 0, 0, width, height);
    return canvas;
  }

  const pixelSize = Math.max(8, Math.floor(width / 64));
  const smallWidth = Math.max(1, Math.floor(width / pixelSize));
  const smallHeight = Math.max(1, Math.floor(height / pixelSize));

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = smallWidth;
  tempCanvas.height = smallHeight;

  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    throw new Error('Unable to create pixelation canvas.');
  }

  tempCtx.drawImage(video, 0, 0, smallWidth, smallHeight);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight, 0, 0, width, height);

  return canvas;
};

export const generateAndUploadVideoPreview = async (params: {
  videoUrl: string;
  contentRating: 'sfw' | 'nsfw';
  videoId: string;
}): Promise<VideoPreviewResult> => {
  const { videoUrl, contentRating, videoId } = params;
  const video = await createVideoElement(videoUrl);
  const duration = Number.isFinite(video.duration) ? video.duration : 0;

  const safeStart = Math.min(2, duration * 0.1);
  const safeEnd = Math.max(safeStart + 0.1, duration * 0.9);
  const previewTimestamp = duration > 0
    ? safeStart + Math.random() * (safeEnd - safeStart)
    : 0;

  await seekVideo(video, previewTimestamp);

  const canvas = drawPreviewFrame(video, contentRating === 'nsfw');
  const blob = await canvasToBlob(canvas);
  const fileName = `${videoId}-${Math.floor(previewTimestamp * 1000)}.jpg`;
  const file = new File([blob], fileName, { type: 'image/jpeg' });
  const path = `${contentRating}/${fileName}`;

  const previewUrl = await uploadFile('video_previews', path, file);
  if (!previewUrl) {
    throw new Error('Preview upload failed.');
  }

  return { previewUrl, previewTimestamp };
};
