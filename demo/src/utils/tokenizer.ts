// Tokenizer.ts - Minimal BPE Tokenizer (load/encode only)
// Loads merges.txt and vocab.json from /public/model/ and encodes text using BPE

export class Tokenizer {
  private vocab = new Map<number, Uint8Array>();
  private tokenToId = new Map<string, number>();
  private merge = new Map<string, number>();
  private pattern: RegExp;
  private loaded = false;

  constructor(
    pattern = "'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",
    flags = "gu",
  ) {
    // Default pattern is similar to GPT-4's
    this.pattern = new RegExp(pattern, flags);
  }

  async load(modelDir = "/model/") {
    // Loads merges.txt and vocab.json from public/model/
    const mergesUrl = modelDir + "merges.txt";
    const vocabUrl = modelDir + "vocab.json";

    // Load merges.txt
    const mergesResp = await fetch(mergesUrl);
    if (!mergesResp.ok) throw new Error("Could not load merges.txt");
    const mergesText = await mergesResp.text();
    let i = 0;
    for (const line of mergesText.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const tokens = trimmed.match(/\d+/g);
      if (!tokens || tokens.length !== 2) continue;
      const pair = `${tokens[0]},${tokens[1]}`;
      this.merge.set(pair, i++);
    }

    // Load vocab.json
    const vocabResp = await fetch(vocabUrl);
    if (!vocabResp.ok) throw new Error("Could not load vocab.json");
    const vocabData = (await vocabResp.json()) as Record<string, number>;
    for (const [key, value] of Object.entries(vocabData)) {
      // key is string, value is number
      const bytes = new TextEncoder().encode(key);
      this.vocab.set(value, bytes);
      this.tokenToId.set(this.uint8ToString(bytes), value);
    }
    this.loaded = true;
  }

  encode(text: string): number[] {
    if (!this.loaded) throw new Error("Tokenizer not loaded");
    // Split text using regex pattern
    const batches = Array.from(text.matchAll(this.pattern), (m) => m[0]);
    const allTokens: number[] = [];
    for (const batch of batches) {
      let tokens = Array.from(new TextEncoder().encode(batch));
      // BPE merge loop
      while (tokens.length >= 2) {
        const pairs = [];
        for (let i = 0; i < tokens.length - 1; i++) {
          pairs.push([tokens[i], tokens[i + 1]]);
        }
        // Find mergeable pairs and their ranks
        const ranked = pairs
          .map((pair) => {
            const key = `${pair[0]},${pair[1]}`;
            return this.merge.has(key)
              ? { pair, rank: this.merge.get(key)! }
              : null;
          })
          .filter(Boolean) as { pair: [number, number]; rank: number }[];
        if (ranked.length === 0) break;
        // Find best pair (lowest rank)
        const best = ranked.reduce((a, b) => (a.rank < b.rank ? a : b));
        // Merge all occurrences of best pair
        tokens = this.mergePair(tokens, best.pair, this.tokenToId);
      }
      allTokens.push(...tokens);
    }
    return allTokens;
  }

  decode(tokens: number[]): string[] {
    if (!this.loaded) throw new Error("Tokenizer not loaded");
    // For each token, decode its byte array to a string
    return tokens.map((token) => {
      const arr = this.vocab.get(token);
      if (!arr) throw new Error(`No vocab entry for token id: ${token}`);
      return new TextDecoder().decode(arr);
    });
  }

  // Helper: merge all occurrences of a pair in a token array
  private mergePair(
    tokens: number[],
    pair: [number, number],
    tokenToId: Map<string, number>,
  ): number[] {
    const merged: number[] = [];
    let i = 0;
    while (i < tokens.length) {
      if (
        i < tokens.length - 1 &&
        tokens[i] === pair[0] &&
        tokens[i + 1] === pair[1]
      ) {
        // Merge
        const leftBytes = this.vocab.get(pair[0]);
        const rightBytes = this.vocab.get(pair[1]);
        if (!leftBytes || !rightBytes) {
          throw new Error(`Vocab missing for pair: ${pair[0]}, ${pair[1]}`);
        }
        const mergedBytes = new Uint8Array([...leftBytes, ...rightBytes]);
        const mergedStr = this.uint8ToString(mergedBytes);
        const newId = tokenToId.get(mergedStr);
        if (newId === undefined) {
          // Should not happen if vocab is correct
          throw new Error(`No token id for merged bytes: ${mergedStr}`);
        }
        merged.push(newId);
        i += 2;
      } else {
        merged.push(tokens[i]!);
        i += 1;
      }
    }
    return merged;
  }

  // Helper: convert Uint8Array to string for Map key
  private uint8ToString(arr: Uint8Array): string {
    // Use base64 for uniqueness
    if (arr.length === 0) return "";
    return btoa(String.fromCharCode(...Array.from(arr)));
  }
}

// Test/demo usage (only runs if executed directly, not when imported)
if (typeof window !== "undefined") {
  void (async () => {
    const tokenizer = new Tokenizer();
    try {
      await tokenizer.load("/model/");
      const tokens = tokenizer.encode("The quick brown fox.");
      console.log("Encoded tokens:", tokens);
    } catch (e) {
      console.error("Tokenizer test error:", e);
    }
  })();
}
