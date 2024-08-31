import { Chroma } from '@langchain/community/vectorstores/chroma'
import { OllamaEmbeddings } from '@langchain/ollama'
import { ChromaClient } from 'chromadb'
// import { WeaviateStore } from '@langchain/weaviate'
// import weavite from 'weaviate-client'

const embeddings = new OllamaEmbeddings()

export const chromaClientLangchain = new Chroma(embeddings, {
  url: 'http://localhost:8000',
  collectionName: 'test-collection',
})

export const chromaClient = new ChromaClient({
  path: 'http://localhost:8000',
})
