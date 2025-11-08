import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/lib/tiktok';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

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

  const hash = crypto.createHash('md5').update(buffer).digest('hex');

  return { tempFilePath, contentType, fileSize: buffer.length, md5: hash };
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
    let visibility: string | undefined;
    let allowComment: boolean | undefined;
    let allowDuet: boolean | undefined;
    let allowStitch: boolean | undefined;
    let scheduleTime: number | undefined;
    let coverTime: number | undefined;
    let contentType = 'video/mp4';
    let fileSize = 0;
    let mode: 'draft' | 'direct' = 'draft';
    let videoHash: string | null = null;
    let videoDuration: number | undefined;
    let commercialToggle = false;
    let commercialYourBrand = false;
    let commercialBrandedContent = false;

    if (isMultipart) {
      const formData = await request.formData();
      const file = formData.get('video') as File | null;
      videoUrl = (formData.get('video_url') as string | null)?.toString().trim() || '';
      title = (formData.get('title') as string | null)?.toString();
      description = (formData.get('description') as string | null)?.toString();
      visibility =
        (formData.get('privacy_level') as string | null)?.toString() ||
        (formData.get('visibility') as string | null)?.toString() ||
        undefined;
      allowComment = parseBoolean((formData.get('allow_comment') as string | null) ?? undefined);
      allowDuet = parseBoolean((formData.get('allow_duet') as string | null) ?? undefined);
      allowStitch = parseBoolean((formData.get('allow_stitch') as string | null) ?? undefined);
      const modeField = (formData.get('mode') as string | null)?.toString().toLowerCase();
      if (modeField === 'direct') {
        mode = 'direct';
      }
      const durationRaw = (formData.get('video_duration') as string | null)?.toString() ?? '';
      if (durationRaw) {
        const parsedDuration = Number(durationRaw);
        if (!Number.isNaN(parsedDuration)) {
          videoDuration = parsedDuration;
        }
      }
      commercialToggle = parseBoolean((formData.get('commercial_toggle') as string | null) ?? undefined) ?? false;
      commercialYourBrand = parseBoolean((formData.get('commercial_your_brand') as string | null) ?? undefined) ?? false;
      commercialBrandedContent = parseBoolean((formData.get('commercial_branded_content') as string | null) ?? undefined) ?? false;

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
        videoHash = crypto.createHash('md5').update(buffer).digest('hex');
      } else if (videoUrl) {
        const download = await downloadVideoToTemp(videoUrl);
        tempFilePath = download.tempFilePath;
        contentType = download.contentType;
        fileSize = download.fileSize;
        videoHash = download.md5;
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
      visibility = body.privacy_level || body.visibility;
      if (typeof body.allow_comment === 'boolean') allowComment = body.allow_comment;
      if (typeof body.allow_duet === 'boolean') allowDuet = body.allow_duet;
      if (typeof body.allow_stitch === 'boolean') allowStitch = body.allow_stitch;
      if (typeof body.disable_duet === 'boolean') allowDuet = !body.disable_duet;
      if (typeof body.disable_comment === 'boolean') allowComment = !body.disable_comment;
      if (typeof body.disable_stitch === 'boolean') allowStitch = !body.disable_stitch;
      scheduleTime = typeof body.schedule_time === 'number' ? body.schedule_time : undefined;
      coverTime = typeof body.cover_time === 'number' ? body.cover_time : undefined;
      if (typeof body.mode === 'string' && body.mode.toLowerCase() === 'direct') {
        mode = 'direct';
      }
      if (typeof body.video_duration === 'number') {
        videoDuration = body.video_duration;
      }
      commercialToggle = Boolean(body.commercial_toggle);
      commercialYourBrand = Boolean(body.commercial_your_brand);
      commercialBrandedContent = Boolean(body.commercial_branded_content);

      const download = await downloadVideoToTemp(videoUrl);
      tempFilePath = download.tempFilePath;
      contentType = download.contentType;
      fileSize = download.fileSize;
      videoHash = download.md5;
    }

    const post = new Post({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const creatorInfoResponse = await post.queryCreatorInfo({});
    if (creatorInfoResponse.error && creatorInfoResponse.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'creator_info_error',
          message: creatorInfoResponse.error.message || 'Não foi possível validar limites de publicação.',
          details: creatorInfoResponse,
        },
        { status: 400 }
      );
    }

    const creatorData = creatorInfoResponse.data?.creator_info || creatorInfoResponse.data || {};
    const canPost = creatorData.can_post ?? creatorData.can_publish ?? creatorData?.post_capabilities?.can_post ?? true;
    if (!canPost) {
      return NextResponse.json(
        {
          error: 'creator_cap_reached',
          message: 'O criador atingiu o limite de publicações. Tente novamente mais tarde.',
          creator_info: creatorData,
        },
        { status: 403 }
      );
    }

    if (!visibility) {
      return NextResponse.json(
        {
          error: 'privacy_required',
          message: 'Selecione um nível de privacidade antes de enviar o vídeo.',
        },
        { status: 400 }
      );
    }

    const privacyOptionsSource =
      creatorData.privacy_level_options ||
      creatorData.privacy_options ||
      creatorData.post_capabilities?.privacy_level_options ||
      [];

    const normalizedPrivacyOptions = Array.isArray(privacyOptionsSource)
      ? privacyOptionsSource
          .map((option: any) => {
            if (!option) return null;
            if (typeof option === 'string') return option;
            if (typeof option?.value === 'string') return option.value;
            if (typeof option?.code === 'string') return option.code;
            return null;
          })
          .filter((value: string | null): value is string => Boolean(value))
      : [];

    if (normalizedPrivacyOptions.length > 0 && !normalizedPrivacyOptions.includes(visibility)) {
      return NextResponse.json(
        {
          error: 'privacy_not_allowed',
          message: `O nível de privacidade selecionado (${visibility}) não está disponível para este criador.`,
          allowed_privacy_levels: normalizedPrivacyOptions,
        },
        { status: 400 }
      );
    }

    const maxDuration =
      creatorData.max_video_post_duration_sec ||
      creatorData.video_upload_limit?.max_video_post_duration_sec ||
      creatorData.post_capabilities?.max_video_post_duration_sec;

    if (typeof maxDuration === 'number' && typeof videoDuration === 'number' && videoDuration > maxDuration) {
      return NextResponse.json(
        {
          error: 'duration_exceeded',
          message: `O vídeo excede a duração máxima permitida de ${maxDuration} segundos.`,
          max_duration: maxDuration,
          video_duration: videoDuration,
        },
        { status: 400 }
      );
    }

    const interactionAbility =
      creatorData.interaction_settings ||
      creatorData.interaction_ability ||
      creatorData.post_capabilities?.interaction_settings ||
      {};

    const duetAllowed = interactionAbility.allow_duet ?? interactionAbility.duet ?? true;
    const stitchAllowed = interactionAbility.allow_stitch ?? interactionAbility.stitch ?? true;
    const commentAllowed = interactionAbility.allow_comment ?? interactionAbility.comment ?? true;

    if (allowDuet && duetAllowed === false) {
      return NextResponse.json(
        {
          error: 'duet_not_allowed',
          message: 'O criador desativou duet para publicações.',
        },
        { status: 400 }
      );
    }

    if (allowStitch && stitchAllowed === false) {
      return NextResponse.json(
        {
          error: 'stitch_not_allowed',
          message: 'O criador desativou stitch para publicações.',
        },
        { status: 400 }
      );
    }

    if (allowComment && commentAllowed === false) {
      return NextResponse.json(
        {
          error: 'comment_not_allowed',
          message: 'O criador desativou comentários para publicações.',
        },
        { status: 400 }
      );
    }

    const videoPostInfo: Record<string, any> = {};
    if (title?.trim()) videoPostInfo.title = title.trim();
    if (description?.trim()) videoPostInfo.description = description.trim();
    videoPostInfo.privacy_level = visibility;
    if (typeof allowDuet === 'boolean') videoPostInfo.disable_duet = !allowDuet;
    if (typeof allowComment === 'boolean') videoPostInfo.disable_comment = !allowComment;
    if (typeof allowStitch === 'boolean') videoPostInfo.disable_stitch = !allowStitch;
    if (typeof scheduleTime === 'number') videoPostInfo.schedule_time = scheduleTime;
    if (typeof coverTime === 'number') videoPostInfo.cover_time = coverTime;
    if (typeof videoDuration === 'number') videoPostInfo.video_duration = videoDuration;

    if (commercialToggle) {
      videoPostInfo.commercial_content_toggle = true;
      videoPostInfo.commercial_content_self = commercialYourBrand;
      videoPostInfo.commercial_content_branded = commercialBrandedContent;
    }

    const sourceInfo: Record<string, any> = {
      source: 'FILE_UPLOAD',
      upload_pattern: 'SINGLE',
      video_size: fileSize,
      chunk_size: fileSize,
      total_chunk_count: 1,
    };

    if (videoHash) {
      sourceInfo.video_hash = videoHash;
    }

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
      creator_info: creatorData,
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
