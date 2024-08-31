import { parentPort, workerData } from 'worker_threads'

// import { chromaClient } from '@/lib/chroma'
import { qdrantClientLangchain } from '@/lib/qdrant'
// import { OllamaEmbedding } from '@/utils/embed-text'

async function processBatch() {
  const { batches } = workerData
  // const ollamaEmbedding = new OllamaEmbedding()
  // const collection = await chromaClient.getOrCreateCollection({
  //   name: 'test-collection',
  //   embeddingFunction: ollamaEmbedding,
  // })

  let completedBatches = 0
  const totalBatches = batches.length

  const promisses = batches.map(async (batch, index) => {
    // const documents = batch.map((chunk) => chunk.pageContent)
    // const metadatas = batch.map((chunk) => chunk.metadata)
    // const ids = batch.map((_, index) => `chunk_${index}`)

    try {
      // await collection.upsert({
      //   ids,
      //   documents,
      //   metadatas,
      // })
      await qdrantClientLangchain.addDocuments(batch)

      // parentPort.postMessage(`Inserted batch ${index + 1} of ${arr.length}`)

      completedBatches++
      const progress = Math.round((completedBatches / totalBatches) * 100)
      parentPort.postMessage(progress)
    } catch (err) {
      parentPort.postMessage(`Error in batch ${index + 1}: ${err}`)
    }
  })

  await Promise.all(promisses)

  process.exit()
}

processBatch()
