import { getSupabaseClient } from './supabase';

export async function uploadBase64ToStorage(base64Str: string, bucket: string, pathPrefix: string): Promise<string> {
  // If it's not a base64 string (e.g., already a URL), return as is
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }

  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  const matches = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const filename = `${pathPrefix}-${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: `image/${matches[1]}`,
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filename);
  return publicUrlData.publicUrl;
}
