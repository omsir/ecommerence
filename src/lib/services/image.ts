import { supabase } from '@/lib/supabase';
import { generateImagePath } from '@/lib/utils';

export async function uploadImageAppForm(image: File[]): Promise<string[]> {
  const uploadedImagePaths: string[] = [];

  const { imageName, imagePath } = generateImagePath(image[0], 'store-images');

  if (imageName && imagePath) {
    try {
      const { error } = await supabase.storage
        .from('store-images')
        .upload(imageName, image[0]);

      if (error) {
        console.error('[v0] Supabase upload error:', error);
        throw new Error('An error occurred while uploading an image.');
      }
    } catch (err) {
      console.error('[v0] Upload failed:', err);
      throw new Error('An error occurred while uploading an image. Please ensure Supabase is configured.');
    }
  }

  uploadedImagePaths.push(imagePath);

  return uploadedImagePaths;
}

export async function uploadImageProductForm(images: File[]): Promise<string[]> {
  const uploadedImagePaths: string[] = [];

  for (const image of images) {
    const { imageName, imagePath } = generateImagePath(image, 'product-images');

    if (imageName && imagePath) {
      try {
        const { error } = await supabase.storage
          .from('product-images')
          .upload(imageName, image);

        if (error) {
          console.error('[v0] Supabase upload error:', error);
          throw new Error('An error occurred while uploading an image.');
        }

        uploadedImagePaths.push(imagePath);
      } catch (err) {
        console.error('[v0] Upload failed for image:', image.name, err);
        throw new Error('An error occurred while uploading an image. Please ensure Supabase is configured.');
      }
    }
  }

  return uploadedImagePaths;
}
