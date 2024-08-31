import { OllamaEmbeddings } from '@langchain/ollama'

export class OllamaEmbedding {
  public async generate(texts: string[]): Promise<number[][]> {
    const embeddings = new OllamaEmbeddings()
    const embededDocuments = await embeddings.embedDocuments(texts)

    return embededDocuments
  }
}
