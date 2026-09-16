/**
 * Parallel batch processing utilities with concurrency control
 */

export interface ParallelOptions {
  /** Maximum concurrent operations (default: 5) */
  maxConcurrency?: number;
  /** Enable parallel processing (default: false for backward compatibility) */
  parallel?: boolean;
}

/**
 * Process items in batches with optional parallelization
 *
 * @param items Items to process
 * @param batchSize Number of items per batch
 * @param processor Function to process each batch
 * @param options Parallel processing options
 * @returns Combined results from all batches
 */
export async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[], batchIndex: number) => Promise<R[]>,
  options: ParallelOptions = {}
): Promise<R[]> {
  const { maxConcurrency = 5, parallel = false } = options;

  // Create batches
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  if (batches.length === 0) {
    return [];
  }

  if (!parallel) {
    // Sequential processing (original behavior)
    const results: R[] = [];
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await processor(batches[i], i);
      results.push(...batchResults);
    }
    return results;
  }

  // Parallel processing with concurrency limit
  const results: R[][] = new Array(batches.length);
  let currentIndex = 0;

  const processNext = async (): Promise<void> => {
    while (currentIndex < batches.length) {
      const index = currentIndex++;
      try {
        results[index] = await processor(batches[index], index);
      } catch (error) {
        console.error(`Error processing batch ${index}:`, error);
        results[index] = [];
      }
    }
  };

  // Start concurrent workers
  const workers = Math.min(maxConcurrency, batches.length);
  await Promise.all(Array.from({ length: workers }, () => processNext()));

  // Flatten results in order
  return results.flat();
}

/**
 * Run multiple async operations in parallel with concurrency limit
 *
 * @param tasks Array of async functions to execute
 * @param maxConcurrency Maximum concurrent operations
 * @returns Array of results in same order as input tasks
 */
export async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrency: number = 5
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let currentIndex = 0;

  const processNext = async (): Promise<void> => {
    while (currentIndex < tasks.length) {
      const index = currentIndex++;
      results[index] = await tasks[index]();
    }
  };

  const workers = Math.min(maxConcurrency, tasks.length);
  await Promise.all(Array.from({ length: workers }, () => processNext()));

  return results;
}
