'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface PublishResult {
  success?: boolean;
  publish_id?: string;
  init_response?: any;
  upload_response?: any;
  status_response?: any;
  error?: string;
  message?: string;
  mode?: 'draft' | 'direct';
}

interface StatusResult {
  publish_id?: string;
  status?: any;
  error?: string;
  message?: string;
}

interface PrivacyOption {
  value: string;
  label: string;
}

interface CreatorInteractionSettings {
  allow_comment?: boolean;
  allow_duet?: boolean;
  allow_stitch?: boolean;
}

interface CreatorInfo {
  nickname?: string;
  display_name?: string;
  privacy_level_options?: Array<string | { value?: string; code?: string; label?: string }>;
  max_video_post_duration_sec?: number;
  video_upload_limit?: { max_video_post_duration_sec?: number };
  interaction_settings?: CreatorInteractionSettings;
  interaction_ability?: CreatorInteractionSettings;
  can_post?: boolean;
  can_publish?: boolean;
  post_capabilities?: {
    can_post?: boolean;
    max_video_post_duration_sec?: number;
    privacy_level_options?: PrivacyOption[];
    interaction_settings?: CreatorInteractionSettings;
  };
}

const defaultVideoUrl =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export default function PublishPage() {
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('Vídeo de teste via API');
  const [description, setDescription] = useState('Publicado diretamente pela API TikTok');
  const [privacyLevel, setPrivacyLevel] = useState('');
  const [allowComment, setAllowComment] = useState(false);
  const [allowDuet, setAllowDuet] = useState(false);
  const [allowStitch, setAllowStitch] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [coverTime, setCoverTime] = useState<number | ''>('');
  const [consent, setConsent] = useState(false);
  const [commercialToggle, setCommercialToggle] = useState(false);
  const [commercialYourBrand, setCommercialYourBrand] = useState(false);
  const [commercialBranded, setCommercialBranded] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState<CreatorInfo | null>(null);
  const [privacyOptions, setPrivacyOptions] = useState<string[]>([]);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState<string | null>(null);
  const [creatorCanPost, setCreatorCanPost] = useState(true);
  const [interactionAllowComment, setInteractionAllowComment] = useState(true);
  const [interactionAllowDuet, setInteractionAllowDuet] = useState(true);
  const [interactionAllowStitch, setInteractionAllowStitch] = useState(true);
  const [creatorName, setCreatorName] = useState('');

  const [loading, setLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [autoStatusMessage, setAutoStatusMessage] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleVideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    } else {
      setVideoFile(null);
    }
  };

  const maxDuration = useMemo(() => {
    if (!creatorInfo) return null;
    return (
      creatorInfo.max_video_post_duration_sec ||
      creatorInfo.video_upload_limit?.max_video_post_duration_sec ||
      creatorInfo.post_capabilities?.max_video_post_duration_sec ||
      null
    );
  }, [creatorInfo]);

  useEffect(() => {
    async function fetchCreatorInfo() {
      try {
        setCreatorLoading(true);
        setCreatorError(null);
        const response = await fetch('/tiktok/api/creator/info', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: 'Erro ao obter creator info' }));
          throw new Error(data.message || data.error || 'Erro ao buscar informações do criador');
        }

        const data = await response.json();
        const info: CreatorInfo = data.creator_info || {};
        setCreatorInfo(info);

        const name = info.nickname || info.display_name || '';
        setCreatorName(name);

        const allowedPrivacyRaw =
          info.privacy_level_options || info.post_capabilities?.privacy_level_options || [];
        const allowedPrivacy = Array.isArray(allowedPrivacyRaw)
          ? allowedPrivacyRaw
              .map((option: any) => {
                if (!option) return null;
                if (typeof option === 'string') return option;
                if (typeof option?.value === 'string') return option.value;
                if (typeof option?.code === 'string') return option.code;
                return null;
              })
              .filter((value: string | null): value is string => Boolean(value))
          : [];
        setPrivacyOptions(allowedPrivacy);

        const interactionSettings =
          info.interaction_settings ||
          info.interaction_ability ||
          info.post_capabilities?.interaction_settings ||
          {};
        setInteractionAllowComment(interactionSettings.allow_comment ?? true);
        setInteractionAllowDuet(interactionSettings.allow_duet ?? true);
        setInteractionAllowStitch(interactionSettings.allow_stitch ?? true);

        const canPost =
          info.can_post ?? info.can_publish ?? info.post_capabilities?.can_post ?? true;
        setCreatorCanPost(Boolean(canPost));
      } catch (err: any) {
        console.error('Error fetching creator info:', err);
        setCreatorError(err.message || 'Erro ao buscar informações do criador');
      } finally {
        setCreatorLoading(false);
      }
    }

    fetchCreatorInfo();
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (videoFile) {
      objectUrl = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(objectUrl);
      setVideoUrl((prev) => prev); // manter valor para fallback
    } else if (videoUrl) {
      setVideoPreviewUrl(videoUrl);
    } else {
      setVideoPreviewUrl('');
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoFile, videoUrl]);

  useEffect(() => {
    if (!videoPreviewUrl) {
      setVideoDuration(null);
      setDurationError(null);
      return;
    }

    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    const handleLoadedMetadata = () => {
      const duration = videoElement.duration;
      if (!Number.isNaN(duration)) {
        setVideoDuration(duration);
        if (maxDuration && duration > maxDuration) {
          setDurationError(
            `O vídeo possui ${Math.round(duration)}s e excede o máximo permitido de ${maxDuration}s.`
          );
        } else {
          setDurationError(null);
        }
      }
    };
    const handleError = () => {
      setDurationError('Não foi possível determinar a duração do vídeo.');
      setVideoDuration(null);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);
    videoElement.src = videoPreviewUrl;

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoPreviewUrl, maxDuration]);

  useEffect(() => {
    if (!publishResult?.publish_id) {
      return;
    }

    setAutoStatusMessage('Consultando status automaticamente...');
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/tiktok/api/videos/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ publish_id: publishResult.publish_id }),
        });
        const data = await response.json();
        setStatusResult(data);
        const statusValue =
          data?.data?.status ||
          data?.status?.status ||
          data?.data?.task_status ||
          data?.data?.stage;
        if (statusValue && ['SUCCESS', 'PUBLISHED', 'FINISHED', 'DONE'].includes(statusValue)) {
          setAutoStatusMessage('Publicação processada com sucesso.');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Auto status polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [publishResult?.publish_id]);

  async function handlePublish() {
    try {
      setLoading(true);
      setError(null);
      setPublishResult(null);
      setStatusResult(null);
      setSuccessMessage(null);
      setAutoStatusMessage(null);
      if (!videoFile && !videoUrl.trim()) {
        throw new Error('Selecione um arquivo de vídeo ou informe uma URL.');
      }

      if (!privacyLevel) {
        throw new Error('Selecione o nível de privacidade.');
      }

      if (!consent) {
        throw new Error('Você precisa aceitar a declaração antes de publicar.');
      }

      if (commercialToggle && !commercialYourBrand && !commercialBranded) {
        throw new Error('Selecione ao menos uma opção de conteúdo comercial.');
      }

      if (durationError) {
        throw new Error(durationError);
      }

      const formData = new FormData();
      if (videoFile) {
        formData.append('video', videoFile);
      }
      if (videoUrl.trim()) {
        formData.append('video_url', videoUrl.trim());
      }
      formData.append('title', title);
      formData.append('description', description);
      formData.append('privacy_level', privacyLevel);
      formData.append('allow_comment', String(allowComment));
      formData.append('allow_duet', String(allowDuet));
      formData.append('allow_stitch', String(allowStitch));

      if (scheduleTime) {
        formData.append('schedule_time', scheduleTime);
      }

      if (coverTime !== '') {
        formData.append('cover_time', String(coverTime));
      }

      formData.append('mode', 'draft');
      if (videoDuration) {
        formData.append('video_duration', String(videoDuration));
      }

      formData.append('commercial_toggle', String(commercialToggle));
      formData.append('commercial_your_brand', String(commercialYourBrand));
      formData.append('commercial_branded_content', String(commercialBranded));

      const response = await fetch('/tiktok/api/videos/publish', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = (await response.json()) as PublishResult;
      setPublishResult(data);

      if (!response.ok || !data.success) {
        const message = data.message || 'Falha ao publicar o vídeo.';
        throw new Error(message);
      }

      setSuccessMessage(
        data.message ||
          'Rascunho criado com sucesso. Abra o TikTok para revisar e concluir a publicação.'
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao publicar o vídeo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusCheck() {
    try {
      if (!publishResult?.publish_id) {
        setError('Nenhum publish_id disponível. Publique um vídeo primeiro.');
        return;
      }

      setError(null);
      setStatusResult(null);

      const response = await fetch('/tiktok/api/videos/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ publish_id: publishResult.publish_id }),
      });

      const data = (await response.json()) as StatusResult;
      setStatusResult(data);

      if (!response.ok) {
        const message = data.message || 'Erro ao consultar status.';
        throw new Error(message);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao consultar status.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Publicar Vídeo</h1>
              <p className="text-sm text-gray-500 mt-1">
                Requer escopos: <code className="bg-gray-100 px-1 rounded">video.upload</code>{' '}
                e <code className="bg-gray-100 px-1 rounded">video.publish</code>
              </p>
              {creatorName && (
                <p className="text-sm text-gray-600 mt-1">
                  Publicando como: <span className="font-medium text-gray-800">{creatorName}</span>
                </p>
              )}
            </div>
            <Link href="/tiktok/home" className="text-purple-600 hover:underline">
              Voltar
            </Link>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-800">
                Você pode enviar um arquivo <strong>diretamente do computador</strong> ou informar uma URL pública.
                Este fluxo cria um <strong>rascunho</strong>; após o upload, abra o TikTok e finalize a publicação.
              </p>
            </div>

            {creatorLoading && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">Carregando informações do criador...</p>
              </div>
            )}

            {creatorError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  Não foi possível obter as informações do criador: {creatorError}
                </p>
              </div>
            )}

            {!creatorCanPost && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  O criador atingiu o limite de publicações nas últimas 24 horas. Tente novamente mais tarde.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo de Vídeo (opcional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selecionado: <strong>{videoFile.name}</strong> ({Math.round(videoFile.size / 1024)} KB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Vídeo
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://...mp4"
              />
              <p className="mt-1 text-xs text-gray-500">
                Se enviar um arquivo local, esta URL é opcional e usada apenas como fallback.
              </p>
            </div>

            {videoPreviewUrl && (
              <div className="border rounded-lg overflow-hidden">
                <video src={videoPreviewUrl} controls className="w-full max-h-64 bg-black" />
                <div className="p-2 text-xs text-gray-600">
                  {videoDuration !== null
                    ? `Duração estimada: ${Math.round(videoDuration)} segundos`
                    : 'Duração não disponível'}
                </div>
              </div>
            )}

            {durationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">{durationError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Título do vídeo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilidade
                </label>
                <select
                  value={privacyLevel}
                  onChange={(e) => setPrivacyLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Selecione um nível de privacidade</option>
                  {(privacyOptions.length > 0 ? privacyOptions : ['PUBLIC', 'FRIENDS', 'SELF_ONLY']).map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Descrição do vídeo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={allowDuet}
                  onChange={(e) => setAllowDuet(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={!interactionAllowDuet}
                />
                Permitir duet
                {!interactionAllowDuet && (
                  <span className="text-xs text-gray-500">Desativado nas configurações do criador</span>
                )}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={allowComment}
                  onChange={(e) => setAllowComment(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={!interactionAllowComment}
                />
                Permitir comentários
                {!interactionAllowComment && (
                  <span className="text-xs text-gray-500">Desativado nas configurações do criador</span>
                )}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={allowStitch}
                  onChange={(e) => setAllowStitch(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={!interactionAllowStitch}
                />
                Permitir stitch
                {!interactionAllowStitch && (
                  <span className="text-xs text-gray-500">Desativado nas configurações do criador</span>
                )}
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover time (segundos)
                </label>
                <input
                  type="number"
                  min={0}
                  value={coverTime}
                  onChange={(e) => setCoverTime(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule time (epoch segundos)
              </label>
              <input
                type="number"
                min={0}
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Opcional"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe vazio para publicar imediatamente.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  id="commercialToggle"
                  type="checkbox"
                  checked={commercialToggle}
                  onChange={(e) => {
                    setCommercialToggle(e.target.checked);
                    if (!e.target.checked) {
                      setCommercialYourBrand(false);
                      setCommercialBranded(false);
                    }
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="commercialToggle" className="text-sm text-gray-700">
                  Este conteúdo promove uma marca ou produto?
                </label>
              </div>
              {commercialToggle && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={commercialYourBrand}
                      onChange={(e) => setCommercialYourBrand(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Seu próprio negócio/marca
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={commercialBranded}
                      onChange={(e) => setCommercialBranded(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Marca de terceiros (conteúdo pago)
                  </label>
                  <p className="text-xs text-gray-500">
                    Se selecionar conteúdo patrocinado, certifique-se de usar visibilidade pública ou amigos.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded bg-gray-50">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span>
                  Ao publicar, você concorda com a Music Usage Confirmation do TikTok (e, se aplicável,
                  com a Branded Content Policy).
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePublish}
                disabled={
                  loading ||
                  !creatorCanPost ||
                  creatorLoading ||
                  !privacyLevel ||
                  !consent ||
                  (!!commercialToggle && !commercialYourBrand && !commercialBranded) ||
                  Boolean(durationError)
                }
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded shadow hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Rascunho'}
              </button>
              <button
                onClick={handleStatusCheck}
                disabled={!publishResult?.publish_id}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500"
              >
                Consultar Status
              </button>
              {publishResult?.publish_id && (
                <div className="text-sm text-gray-600 flex items-center">
                  <span className="font-medium text-gray-700 mr-2">publish_id:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {publishResult.publish_id}
                  </code>
                </div>
              )}
              {videoFile && (
                <button
                  onClick={() => setVideoFile(null)}
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition"
                >
                  Remover arquivo
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">{successMessage}</p>
                <p className="text-xs text-green-700 mt-2">
                  Dica: peça ao criador para abrir o TikTok, acessar a notificação de upload e finalizar a postagem.
                </p>
              </div>
            )}

            {autoStatusMessage && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">{autoStatusMessage}</p>
              </div>
            )}

            {publishResult && (
              <details open className="p-4 bg-gray-50 border border-gray-200 rounded">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Resultado da publicação
                </summary>
                <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                  {JSON.stringify(publishResult, null, 2)}
                </pre>
              </details>
            )}

            {statusResult && (
              <details open className="p-4 bg-gray-50 border border-gray-200 rounded">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Status atual
                </summary>
                <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                  {JSON.stringify(statusResult, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
