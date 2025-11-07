'use client';

import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

interface PublishResult {
  success?: boolean;
  publish_id?: string;
  init_response?: any;
  upload_response?: any;
  status_response?: any;
  error?: string;
  message?: string;
}

interface StatusResult {
  publish_id?: string;
  status?: any;
  error?: string;
  message?: string;
}

const defaultVideoUrl =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export default function PublishPage() {
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('Vídeo de teste via API');
  const [description, setDescription] = useState('Publicado diretamente pela API TikTok');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [disableDuet, setDisableDuet] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [allowStitch, setAllowStitch] = useState(true);
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [coverTime, setCoverTime] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    } else {
      setVideoFile(null);
    }
  };

  async function handlePublish() {
    try {
      setLoading(true);
      setError(null);
      setPublishResult(null);
      setStatusResult(null);
      if (!videoFile && !videoUrl.trim()) {
        throw new Error('Selecione um arquivo de vídeo ou informe uma URL.');
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
      formData.append('visibility', visibility);
      formData.append('disable_duet', String(disableDuet));
      formData.append('disable_comment', String(disableComment));
      formData.append('allow_stitch', String(allowStitch));

      if (scheduleTime) {
        formData.append('schedule_time', scheduleTime);
      }

      if (coverTime !== '') {
        formData.append('cover_time', String(coverTime));
      }

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
            </div>
            <Link href="/tiktok/home" className="text-purple-600 hover:underline">
              Voltar
            </Link>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-800">
                Você pode publicar enviando um arquivo <strong>diretamente do computador</strong> ou informando uma URL pública do vídeo.
                Se ambos forem fornecidos, o arquivo local terá prioridade.
              </p>
            </div>

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
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="FRIENDS">FRIENDS</option>
                  <option value="PRIVATE">PRIVATE</option>
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
                  checked={disableDuet}
                  onChange={(e) => setDisableDuet(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Desativar duet
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={disableComment}
                  onChange={(e) => setDisableComment(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Desativar comentários
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={allowStitch}
                  onChange={(e) => setAllowStitch(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Permitir stitch
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

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded shadow hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Publicar Vídeo'}
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
