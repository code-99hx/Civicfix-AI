/**
 * CivicFix AI - Evidence file handling.
 *
 * Client-side only: validates MIME type, size and readability, creates local
 * object URLs for previews and revokes them on cleanup. No files are uploaded
 * to a server in this demo.
 */

export const IMAGE_ERROR_TYPES = {
  TYPE: 'type',
  SIZE: 'size',
  UNREADABLE: 'unreadable',
  CANCELLED: 'cancelled',
};

export function revokeObjectUrl(url) {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      // Ignore revocation failures
    }
  }
}

export function revokeAllPreviews(images = []) {
  images.forEach((img) => revokeObjectUrl(img.previewUrl));
}

export function validateFile(file, { maxFileSizeBytes, acceptedTypes } = {}) {
  const maxSize = maxFileSizeBytes || 10 * 1024 * 1024;
  const types = acceptedTypes || ['image/jpeg', 'image/png', 'image/webp'];

  // Do not trust the filename extension alone; validate the actual MIME type.
  const mime = file.type || '';
  if (!types.includes(mime.toLowerCase())) {
    return { ok: false, error: IMAGE_ERROR_TYPES.TYPE };
  }

  if (file.size > maxSize) {
    return { ok: false, error: IMAGE_ERROR_TYPES.SIZE };
  }

  if (file.size === 0) {
    return { ok: false, error: IMAGE_ERROR_TYPES.UNREADABLE };
  }

  return { ok: true };
}

/**
 * Read an image file and confirm it is decodable/readable by the browser.
 * Returns { ok, width, height } or { ok: false, error }.
 */
export function validateImageReadable(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ ok: true, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ ok: false, error: IMAGE_ERROR_TYPES.UNREADABLE });
    };
    img.src = url;
  });
}

export function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}

export function isDuplicateFile(images, file) {
  return images.some(
    (img) => img.file && img.file.name === file.name && img.file.size === file.size && img.file.lastModified === file.lastModified
  );
}
