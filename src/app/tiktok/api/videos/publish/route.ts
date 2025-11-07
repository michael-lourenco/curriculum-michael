import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/lib/tiktok';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

async function downloadVideoToTemp(videoUrl: string) {
  const response = await fetch(videoUrl);
  if (!response.ok) {
    throw new Error(`Falha ao baixar o vídeo: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'video/mp4';
  const extension = contentType.includes('mp4') ? 'mp4' : contentType.includes('quicktime') ? 'mov' : 'mp4';
  const tempFilePath = path.join(os.tmpdir(), `tiktok-upload-${Date.now()}.${extension}`);

  await fs.writeFile(tempFilePath, buffer);

  return { tempFilePath, contentType, fileSize: buffer.length };
}

function resolveAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const searchParams = request.nextUrl.searchParams;
  const tokenFromQuery = searchParams.get('access_token');
  if (tokenFromQuery) {
    return tokenFromQuery;
  }

  const tokenFromCookie = request.cookies.get('tiktok_access_token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const accessToken = resolveAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Access token required',
          message: 'Você precisa autenticar primeiro. Acesse /tiktok/api/auth/authorize com os escopos necessários.',
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.video_url) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Informe "video_url" no corpo da requisição.',
        },
        { status: 400 }
      );
    }

    const {
      video_url: videoUrl,
      title,
      description,
      visibility = 'PUBLIC',
      disable_duet,
      disable_comment,
      allow_stitch,
      schedule_time,
      cover_time,
    } = body;

    const { tempFilePath: downloadedPath, contentType, fileSize } = await downloadVideoToTemp(videoUrl);
    tempFilePath = downloadedPath;

    const post = new Post({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const videoPostInfo: Record<string, any> = {};
    if (title) videoPostInfo.title = title;
    if (description) videoPostInfo.description = description;
    if (visibility) videoPostInfo.privacy_level = visibility;
    if (disable_duet !== undefined) videoPostInfo.disable_duet = disable_duet;
    if (disable_comment !== undefined) videoPostInfo.disable_comment = disable_comment;
    if (allow_stitch !== undefined) videoPostInfo.allow_stitch = allow_stitch;
    if (schedule_time) videoPostInfo.schedule_time = schedule_time;
    if (cover_time !== undefined && cover_time !== '') videoPostInfo.cover_time = cover_time;

    const videoFormat = contentType.split('/')[1]?.split(';')[0] || 'mp4';

    const initResponse = await post.publish({
      source_info: {
        source: 'FILE_UPLOAD',
        upload_pattern: 'SINGLE',
        video_format: videoFormat.toUpperCase(),
        video_size: fileSize,
        chunk_size: fileSize,
        total_chunk_count: 1,
      },
      video_post_info: videoPostInfo,
    });

    if (initResponse.error && initResponse.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'init_failed',
          message: initResponse.error.message || 'Falha ao iniciar publicação.',
          details: initResponse,
        },
        { status: 400 }
      );
    }

    const publishId = initResponse.data?.publish_id || initResponse.data?.publishIds?.[0];
    const uploadUrl = initResponse.data?.upload_url;

    if (!publishId || !uploadUrl) {
      return NextResponse.json(
        {
          error: 'missing_upload_info',
          message: 'A resposta não retornou publish_id ou upload_url.',
          details: initResponse,
        },
        { status: 400 }
      );
    }

    const uploadResponse = await post.uploadFile(uploadUrl, {
      path: tempFilePath,
      mime_type: contentType,
    });

    if (uploadResponse.error && uploadResponse.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'upload_failed',
          message: uploadResponse.error.message || 'Falha ao enviar o vídeo.',
          details: uploadResponse,
        },
        { status: 400 }
      );
    }

    const statusResponse = await post.fetchStatus({
      publish_id: publishId,
    });

    return NextResponse.json({
      success: true,
      publish_id: publishId,
      init_response: initResponse,
      upload_response: uploadResponse,
      status_response: statusResponse,
    });
  } catch (error: any) {
    console.error('Error publishing video:', error);
    return NextResponse.json(
      {
        error: 'publish_error',
        message: error.message || 'Erro ao publicar vídeo.',
      },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkError) {
        console.warn('Não foi possível remover arquivo temporário:', unlinkError);
      }
    }
  }
}
