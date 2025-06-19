import stringSimilarity from 'string-similarity';

/**
 * Finds the best match for the target description within the match array.
 * @param {string} targetDescription - The target description to be matched.
 * @param {Array<string>} matchDescArray - The array of descriptions to match against.
 * @returns {Object} The best match result.
 */
interface BestMatch {
  target: string;
  rating: number;
}

interface BestMatchResult {
  ratings: BestMatch[];
  bestMatch: BestMatch;
  bestMatchIndex: number;
}

const MatchDescription = (
  targetDescription: string,
  matchDescArray: string[]
): BestMatchResult => {
  const matches = stringSimilarity.findBestMatch(
    targetDescription,
    matchDescArray
  );
  return matches;
};

export{
    MatchDescription
}
