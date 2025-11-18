/**
 * Jaccard Similarity Service
 * Calculates similarity between two strings using Jaccard Index
 */

// Normalize and tokenize text
function tokenize(text) {
  if (!text) return new Set();
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
  );
}

// Calculate Jaccard similarity coefficient
function jaccardIndex(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

// Standardize address by removing common prefixes
function standardizeAddress(address) {
  if (!address) return '';

  return address
    .toLowerCase()
    // Remove common address prefixes
    .replace(/\b(flat|plot|shop|house|building|block|h\.?|f\.?|p\.?|no\.?|number|ward)\b/gi, '')
    // Remove extra punctuation
    .replace(/[,.-]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between two addresses
function calculateSimilarity(address1, address2) {
  const standardized1 = standardizeAddress(address1);
  const standardized2 = standardizeAddress(address2);

  const tokens1 = tokenize(standardized1);
  const tokens2 = tokenize(standardized2);

  return jaccardIndex(tokens1, tokens2);
}

// Find best matches from a list of reference addresses
function findBestMatches(inputAddress, referenceAddresses, threshold = 0.6, topN = 5) {
  const matches = referenceAddresses.map(refAddr => ({
    address: refAddr,
    similarity: calculateSimilarity(inputAddress, refAddr)
  }));

  // Filter by threshold and sort by similarity
  const filtered = matches
    .filter(match => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return filtered.slice(0, topN);
}

module.exports = {
  tokenize,
  jaccardIndex,
  standardizeAddress,
  calculateSimilarity,
  findBestMatches
};
