// services/compressImage.ts
// ضغط الصورة بالمتصفح قبل الرفع: أقصى بُعد 1600px وجودة JPEG 0.82.
// أي فشل (HEIC، متصفح قديم...) بيرجّع الملف الأصلي بدون ما يكسر الرفع.

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const MAX_SIDE = 1600;
const QUALITY = 0.82;
const SKIP_UNDER = 300 * 1024;

export async function compressImage(file: File): Promise<File> {
    if (
        !file.type.startsWith('image/') ||
        file.type === 'image/gif' ||
        file.type === 'image/svg+xml' ||
        file.size < SKIP_UNDER
    ) {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file, {
            imageOrientation: 'from-image',
        });

        const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            bitmap.close();
            return file;
        }

        // خلفية بيضاء عشان PNG الشفاف ما يطلع أسود بعد التحويل لـ JPEG
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', QUALITY),
        );

        if (!blob || blob.size >= file.size) return file;

        return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });
    } catch {
        return file;
    }
}