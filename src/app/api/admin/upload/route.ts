import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
      'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${type || 'upload'}-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
