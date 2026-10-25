// Utilidades de Cloudinary para subida y optimización de imágenes (100% Unsigned)

/**
 * Obtiene y valida las variables de entorno de Cloudinary.
 * No contiene valores escritos directamente en el código (fallbacks).
 */
export const getCloudinaryConfig = () => {
  const rawCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const rawUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const missing = [];
  if (!rawCloudName || !rawCloudName.trim()) {
    missing.push('VITE_CLOUDINARY_CLOUD_NAME');
  }
  if (!rawUploadPreset || !rawUploadPreset.trim()) {
    missing.push('VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  if (missing.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno en tu archivo .env.local: ${missing.join(', ')}. Por favor configúralas para poder subir imágenes.`
    );
  }

  // Sanitización estricta: sin espacios iniciales/finales ni comillas accidentales
  const cloudName = rawCloudName.trim().replace(/^["']|["']$/g, '');
  const uploadPreset = rawUploadPreset.trim().replace(/^["']|["']$/g, '');

  return { cloudName, uploadPreset };
};

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
 * Sube una imagen a Cloudinary usando estrictamente un upload preset 'unsigned'.
 * FormData contiene ÚNICAMENTE "file" y "upload_preset".
 * NO envía api_key, signature, timestamp ni parámetros de firma.
 */
export const uploadToCloudinary = async (file, onProgress = null) => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const compressed = await compressImageBeforeUpload(file);
  
  const formData = new FormData();
  formData.append('file', compressed);
  formData.append('upload_preset', uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let response = null;
      try {
        response = JSON.parse(xhr.responseText);
      } catch {
        // Respuesta no es JSON
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (response && response.secure_url) {
          resolve(response.secure_url);
        } else {
          reject(new Error('Cloudinary no devolvió la URL de la imagen (secure_url).'));
        }
      } else {
        const errorMsg = response?.error?.message || `Error ${xhr.status}`;
        
        // Manejo y diagnóstico detallado de errores comunes de Cloudinary
        if (errorMsg.toLowerCase().includes('unknown api key')) {
          reject(new Error(
            `Cloudinary respondió: "${errorMsg}". Esto ocurre cuando el Cloud name ("${cloudName}") no existe o el Upload preset ("${uploadPreset}") no está configurado como "Unsigned" en Cloudinary. Por favor verifica que el preset sea "Unsigned" en tu consola de Cloudinary.`
          ));
        } else if (errorMsg.toLowerCase().includes('upload preset') && errorMsg.toLowerCase().includes('not found')) {
          reject(new Error(
            `Cloudinary respondió: "${errorMsg}". El preset "${uploadPreset}" no fue encontrado en la cuenta "${cloudName}".`
          ));
        } else {
          reject(new Error(`Error de Cloudinary (${xhr.status}): ${errorMsg}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Error de conexión o red al comunicarse con el servidor de Cloudinary.'));
    };

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
