import { OllamaEmbeddings } from '@langchain/ollama'
import { QdrantVectorStore } from '@langchain/qdrant'
import { QdrantClient } from '@qdrant/qdrant-js'

const embeddings = new OllamaEmbeddings()

export const qdrantClientLangchain = new QdrantVectorStore(embeddings, {
  url: 'http://127.0.0.1:6333',
  collectionName: 'test-collection-qdrant',
})

export const qdrantClient = new QdrantClient({
  url: 'http://127.0.0.1:6333',
})
