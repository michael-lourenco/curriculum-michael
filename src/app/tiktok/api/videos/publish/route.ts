import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/lib/tiktok';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

function parseBoolean(value: string | null | undefined): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  const normalized = value.toString().toLowerCase();
  if (['true', '1', 'on', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'off', 'no'].includes(normalized)) return false;
  return undefined;
}

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

    const contentTypeHeader = request.headers.get('content-type') || '';
    const isMultipart = contentTypeHeader.includes('multipart/form-data');

    let videoUrl = '';
    let title: string | undefined;
    let description: string | undefined;
    let visibility: string | undefined = 'PUBLIC';
    let disableDuet: boolean | undefined;
    let disableComment: boolean | undefined;
    let allowStitch: boolean | undefined;
    let scheduleTime: number | undefined;
    let coverTime: number | undefined;
    let contentType = 'video/mp4';
    let fileSize = 0;
    let mode: 'draft' | 'direct' = 'draft';

    if (isMultipart) {
      const formData = await request.formData();
      const file = formData.get('video') as File | null;
      videoUrl = (formData.get('video_url') as string | null)?.toString().trim() || '';
      title = (formData.get('title') as string | null)?.toString();
      description = (formData.get('description') as string | null)?.toString();
      visibility = (formData.get('visibility') as string | null)?.toString() || 'PUBLIC';
      disableDuet = parseBoolean((formData.get('disable_duet') as string | null) ?? undefined);
      disableComment = parseBoolean((formData.get('disable_comment') as string | null) ?? undefined);
      allowStitch = parseBoolean((formData.get('allow_stitch') as string | null) ?? undefined);
      const modeField = (formData.get('mode') as string | null)?.toString().toLowerCase();
      if (modeField === 'direct') {
        mode = 'direct';
      }

      const scheduleRaw = (formData.get('schedule_time') as string | null)?.toString() ?? '';
      if (scheduleRaw) {
        const parsedSchedule = Number(scheduleRaw);
        if (!Number.isNaN(parsedSchedule)) {
          scheduleTime = parsedSchedule;
        }
      }

      const coverRaw = (formData.get('cover_time') as string | null)?.toString() ?? '';
      if (coverRaw !== '') {
        const parsedCover = Number(coverRaw);
        if (!Number.isNaN(parsedCover)) {
          coverTime = parsedCover;
        }
      }

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        contentType = file.type || contentType;
        fileSize = buffer.length;
        const extension = file.name.split('.').pop() || 'mp4';
        tempFilePath = path.join(os.tmpdir(), `tiktok-upload-${Date.now()}.${extension}`);
        await fs.writeFile(tempFilePath, buffer);
      } else if (videoUrl) {
        const download = await downloadVideoToTemp(videoUrl);
        tempFilePath = download.tempFilePath;
        contentType = download.contentType;
        fileSize = download.fileSize;
      } else {
        return NextResponse.json(
          {
            error: 'Invalid request',
            message: 'Envie um arquivo de vídeo (campo "video") ou informe "video_url".',
          },
          { status: 400 }
        );
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body || !body.video_url) {
        return NextResponse.json(
          {
            error: 'Invalid request',
            message: 'Informe "video_url" no corpo da requisição ou envie um arquivo via multipart/form-data.',
          },
          { status: 400 }
        );
      }

      videoUrl = body.video_url;
      title = body.title;
      description = body.description;
      visibility = body.visibility || 'PUBLIC';
      disableDuet = typeof body.disable_duet === 'boolean' ? body.disable_duet : undefined;
      disableComment = typeof body.disable_comment === 'boolean' ? body.disable_comment : undefined;
      allowStitch = typeof body.allow_stitch === 'boolean' ? body.allow_stitch : undefined;
      scheduleTime = typeof body.schedule_time === 'number' ? body.schedule_time : undefined;
      coverTime = typeof body.cover_time === 'number' ? body.cover_time : undefined;
      if (typeof body.mode === 'string' && body.mode.toLowerCase() === 'direct') {
        mode = 'direct';
      }

      const download = await downloadVideoToTemp(videoUrl);
      tempFilePath = download.tempFilePath;
      contentType = download.contentType;
      fileSize = download.fileSize;
    }

    const post = new Post({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const videoPostInfo: Record<string, any> = {};
    if (title?.trim()) videoPostInfo.title = title.trim();
    if (description?.trim()) videoPostInfo.description = description.trim();
    if (visibility) videoPostInfo.privacy_level = visibility;
    if (typeof disableDuet === 'boolean') videoPostInfo.disable_duet = disableDuet;
    if (typeof disableComment === 'boolean') videoPostInfo.disable_comment = disableComment;
    if (typeof allowStitch === 'boolean') videoPostInfo.allow_stitch = allowStitch;
    if (typeof scheduleTime === 'number') videoPostInfo.schedule_time = scheduleTime;
    if (typeof coverTime === 'number') videoPostInfo.cover_time = coverTime;

    const sourceInfo = {
      source: 'FILE_UPLOAD',
      video_size: fileSize,
      video_type: contentType,
      chunk_size: fileSize,
      total_chunk_count: 1,
    };

    let initResponse;
    if (mode === 'direct') {
      initResponse = await post.publish({
        source_info: sourceInfo,
        video_post_info: videoPostInfo,
      });
    } else {
      const draftPayload: Record<string, any> = {
        source_info: sourceInfo,
      };
      if (Object.keys(videoPostInfo).length > 0) {
        draftPayload.post_info = videoPostInfo;
      }
      initResponse = await post.draft(draftPayload);
    }

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

    let statusResponse: Record<string, any> | null = null;
    try {
      statusResponse = await post.fetchStatus({
        publish_id: publishId,
      });
    } catch (statusError) {
      console.warn('Não foi possível obter status da publicação:', statusError);
    }

    return NextResponse.json({
      success: true,
      mode,
      publish_id: publishId,
      init_response: initResponse,
      upload_response: uploadResponse,
      status_response: statusResponse,
      message:
        mode === 'draft'
          ? 'Vídeo enviado como rascunho. O criador deve finalizar a publicação no TikTok.'
          : 'Vídeo enviado para publicação direta. Aguarde processamento do TikTok.',
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
