import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verification - TikTok API Learning App',
  description: 'Verification page for TikTok for Developers domain verification',
  robots: 'noindex, nofollow', // Não indexar página de verificação
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Verificação de Domínio
          </h1>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              Esta página é utilizada para verificação de domínio do TikTok for Developers.
            </p>
            
            <p className="text-sm text-gray-600">
              O arquivo de verificação deve ser colocado no diretório <code className="bg-gray-100 px-2 py-1 rounded">/public/verify/</code>
            </p>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Instruções para Verificação
              </h2>
              <ol className="text-left text-blue-800 space-y-2">
                <li>1. Baixe o arquivo de verificação fornecido pelo TikTok</li>
                <li>2. Coloque o arquivo no diretório: <code>/public/verify/</code></li>
                <li>3. O arquivo deve estar acessível via: <code>https://michaellourenco.com/verify/[nome-do-arquivo]</code></li>
                <li>4. Complete a verificação no painel do TikTok for Developers</li>
              </ol>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                Esta página será removida após a verificação ser concluída.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
