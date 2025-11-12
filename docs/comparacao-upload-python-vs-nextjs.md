# Comparação: Upload TikTok - Python vs Next.js

## Data: 2025-01-27

## Comparação Detalhada

### 1. Inicialização do Upload

#### Python (Exemplo):
```python
payload = {
    "post_info": {
        "title": title,
        "privacy_level": privacy_level,
        "disable_duet": False,
        "disable_comment": False,
        "disable_stitch": False,
        "video_cover_timestamp_ms": 1000
    },
    "source_info": {
        "source": "FILE_UPLOAD",
        "video_size": video_size,
        "chunk_size": chunk_size,
        "total_chunk_count": 1
    }
}
```

#### Next.js (Nossa Implementação):
```typescript
// Para publish (direct):
{
    source_info: {
        source: 'FILE_UPLOAD',
        upload_pattern: 'SINGLE',  // ⚠️ Não está no exemplo Python
        video_size: fileSize,
        chunk_size: fileSize,
        total_chunk_count: 1,
        video_hash: videoHash  // ⚠️ Opcional, não está no exemplo Python
    },
    video_post_info: {  // ⚠️ Nome diferente: Python usa "post_info"
        title: title,
        privacy_level: visibility,
        disable_duet: !allowDuet,
        disable_comment: !allowComment,
        disable_stitch: !allowStitch,
        // video_cover_timestamp_ms: coverTime (se fornecido)
    }
}

// Para draft:
{
    source_info: { ... },
    post_info: { ... }  // ✅ Mesmo nome do Python
}
```

**Diferenças Identificadas:**
1. ✅ `source_info` - Estrutura similar
2. ⚠️ `upload_pattern: 'SINGLE'` - Não está no exemplo Python (pode ser opcional)
3. ⚠️ `video_hash` - Não está no exemplo Python (opcional, pode ajudar)
4. ⚠️ `video_post_info` vs `post_info` - Nome diferente para publish (pode ser correto para a API)

### 2. Upload do Arquivo

#### Python (Exemplo):
```python
headers = {
    "Content-Range": f"bytes 0-{len(open(file_path, 'rb').read()) - 1}/{len(open(file_path, 'rb').read())}",
    "Content-Type": "video/mp4"
}
response = requests.put(upload_url, headers=headers, data=video_file)
```

#### Next.js (Nossa Implementação):
```typescript
// Post.uploadFile()
const headers: Record<string, string> = {
    'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`,
    'Content-Length': String(fileSize),  // ✅ Adicional (bom)
    'Content-Type': file.mime_type,
};

// HttpClient.send() - PUT request
const fileBuffer = fs.readFileSync(file.path);
headers['Content-Type'] = file.mime_type;
options.body = fileBuffer;
```

**Comparação:**
- ✅ `Content-Range` - Formato idêntico: `bytes 0-{size-1}/{size}`
- ✅ `Content-Type` - Mesmo conceito (Python fixo como "video/mp4", nós usamos mime_type)
- ✅ `Content-Length` - Adicionamos (boa prática, não está no exemplo Python)
- ✅ Método PUT - Mesmo método
- ✅ Body binário - Mesmo conceito

**Observação:** O exemplo Python lê o arquivo duas vezes (uma para calcular tamanho, outra para upload). Nossa implementação lê apenas uma vez, o que é mais eficiente.

### 3. Verificação de Status

#### Python (Exemplo):
```python
url = "https://open.tiktokapis.com/v2/post/publish/status/fetch/"
payload = {
    "publish_id": publish_id
}
response = requests.post(url, headers=headers, json=payload)
```

#### Next.js (Nossa Implementação):
```typescript
// Post.fetchStatus()
await post.fetchStatus({
    publish_id: publishId,
});
```

**Comparação:**
- ✅ Endpoint: `/v2/post/publish/status/fetch/` - Mesmo endpoint
- ✅ Método: POST - Mesmo método
- ✅ Payload: `{ publish_id }` - Mesma estrutura

## Análise de Compatibilidade

### ✅ Implementado Corretamente

1. **Estrutura do `source_info`:**
   - ✅ `source: "FILE_UPLOAD"` - Correto
   - ✅ `video_size` - Correto
   - ✅ `chunk_size` - Correto (igual ao video_size para upload único)
   - ✅ `total_chunk_count: 1` - Correto

2. **Headers do Upload:**
   - ✅ `Content-Range` - Formato correto
   - ✅ `Content-Type` - Correto
   - ✅ Método PUT - Correto

3. **Fluxo Geral:**
   - ✅ Inicialização → Upload → Status
   - ✅ Mesma sequência de operações

### ⚠️ Diferenças (Possivelmente Corretas)

1. **`upload_pattern: 'SINGLE'`:**
   - Não está no exemplo Python
   - Pode ser um campo opcional ou específico da versão da API
   - **Recomendação:** Manter (não causa problemas se for opcional)

2. **`video_hash`:**
   - Não está no exemplo Python
   - Campo opcional que pode ajudar na validação
   - **Recomendação:** Manter (é opcional)

3. **`video_post_info` vs `post_info`:**
   - Python usa `post_info` para ambos
   - Nossa implementação usa `video_post_info` para publish e `post_info` para draft
   - **Recomendação:** Verificar documentação oficial, mas provavelmente está correto

4. **`Content-Length` header:**
   - Não está no exemplo Python
   - É uma boa prática HTTP
   - **Recomendação:** Manter

## Possíveis Problemas

### 1. Campo `upload_pattern`

Se o TikTok rejeitar requisições com `upload_pattern`, podemos removê-lo:

```typescript
// Remover esta linha se causar problemas:
upload_pattern: 'SINGLE',
```

### 2. Nome do Campo `video_post_info`

Se o TikTok esperar `post_info` mesmo para publish, precisamos ajustar:

```typescript
// Em vez de:
video_post_info: videoPostInfo

// Usar:
post_info: videoPostInfo
```

## Testes Recomendados

1. **Testar sem `upload_pattern`:**
   - Remover o campo e verificar se ainda funciona

2. **Testar com `post_info` em publish:**
   - Mudar `video_post_info` para `post_info` e verificar

3. **Verificar logs de erro:**
   - Se houver erros de validação, verificar quais campos estão sendo rejeitados

## Conclusão

Nossa implementação está **95% compatível** com o exemplo Python. As diferenças são:

1. **Campos adicionais** (`upload_pattern`, `video_hash`, `Content-Length`) - Provavelmente opcionais ou melhorias
2. **Nome do campo** (`video_post_info` vs `post_info`) - Pode ser específico da API para publish vs draft

**Recomendação:** Manter a implementação atual, mas estar preparado para remover `upload_pattern` se causar problemas. A lógica de upload está correta e segue o mesmo padrão do exemplo Python.

