// Utilidades de Cloudinary para subida y optimización de imágenes

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'compras-usa';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'compras_usa_preset';

/**
 * Comprime y redimensiona una imagen en el navegador usando HTML5 Canvas antes de subirla.
 * Limita el ancho/alto máximo a 1600px y optimiza la calidad a ~85%.
 */
export const compressImageBeforeUpload = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        // Mantener relación de aspecto
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback al archivo original si falla canvas
            }
          },
          'image/webp',
          quality
        );
      };
      image.onerror = (err) => reject(err);
      image.src = readerEvent.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Sube una imagen a Cloudinary usando un upload preset 'unsigned'.
 */
export const uploadToCloudinary = async (file, onProgress = null) => {
  const compressed = await compressImageBeforeUpload(file);
  
  const formData = new FormData();
  formData.append('file', compressed);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (e) {
          reject(new Error('Respuesta inválida del servidor de Cloudinary'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || `Error ${xhr.status} al subir imagen a Cloudinary`));
        } catch {
          reject(new Error(`Error ${xhr.status} al subir a Cloudinary. Verifica tu Cloud Name y Upload Preset.`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Fallo de red al conectar con Cloudinary'));
    xhr.send(formData);
  });
};

/**
 * Aplica transformaciones de Cloudinary para que la imagen cargue rápido en celulares.
 * Inyecta f_auto,q_auto,w_${width} en la URL de Cloudinary.
 */
export const getOptimizedImageUrl = (url, width = 800) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto,w_${width},c_limit/${parts[1]}`;
  }
  return url;
};
