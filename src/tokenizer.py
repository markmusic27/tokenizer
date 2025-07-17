from .utils import get_frequency, merge


class Tokenizer:
    def __init__(self, vocab_size: int):
        if (vocab_size <= 256):
            raise ValueError(f"vocab_size hyperparameter must be greater than 256. You inputted {vocab_size}")
        
        self.vocab_size = vocab_size
            
        # Initialize vocabulary to be base characters in UTF-8
        self.vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
        
        # Create empty merge rules
        self.merge: dict[tuple[int, int], int] = {}
        
        self.trained = False

        
    
    def train(self, text: str) -> list[int]:
        tokens = list(text.encode("utf-8"))
        
        for i in range(self.vocab_size - 256):
            freq = get_frequency(tokens)
            
            if freq == None:
                break
            
            highest_pair = None
            highest_count = 0
            
            for pair in freq:
                count = freq[pair]
                
                if highest_pair is None or count > highest_count:
                    highest_pair = pair
                    highest_count = count

            # Add this check:
            if highest_pair is None:
                break
                
            
            new_id = i + 256
            merge(tokens, highest_pair, new_id)
            
            # Update vocab and merge rules
            self.vocab[new_id] = self.vocab[highest_pair[0]] + self.vocab[highest_pair[1]]
            self.merge[highest_pair] = i
            
        
        self.trained = True
        self.token_to_id = {v: k for k, v in self.vocab.items()}
        
        return tokens
        
    def encode(self, text: str) -> list[int]:
        if not self.trained:
            raise ValueError("The tokenizer has not yet been trained")
        
        tokens = list(text.encode("utf-8"))
        
        # Try to merge as much as possible. Will break when no merges are left
        while True:
            
            if len(tokens) < 2:
                break
            
            pairs = [(tokens[i], tokens[i+1]) for i in range(len(tokens) - 1)]
            
            # Create tuple of (pair, rank)
            ranked = [(pair, self.merge[pair]) for pair in pairs if pair in self.merge]
            
            # No more mergeable pairs
            if not ranked:
                break  
            
            best_pair, _ = min(ranked, key=lambda x: x[1])
            
            merged_bytes = self.vocab[best_pair[0]] + self.vocab[best_pair[1]]
            new_id = self.token_to_id[merged_bytes]
            
            merge(tokens, best_pair, new_id)
    
        return tokens
        
    
    def decode(self, tokens: list[int]) -> str:
        if not self.trained:
            raise ValueError("The tokenizer has not yet been trained")
            
        raw = b""
        
        for token in tokens:
            raw += self.vocab[token]

        return raw.decode("utf-8", errors="replace")
    
    