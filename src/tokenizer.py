from .utils import get_frequency, merge
import os
import json
import re


class Tokenizer:
    def __init__(self, vocab_size: int):
        if (vocab_size <= 256):
            raise ValueError(f"vocab_size hyperparameter must be greater than 256. You inputted {vocab_size}")
        
        self.vocab_size = vocab_size
            
        # Initialize vocabulary to be base characters in UTF-8
        self.vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
        self.token_to_id: dict[bytes, int] = {}
        
        # Create empty merge rules
        self.merge: dict[tuple[int, int], int] = {}
        
        self.loaded = False

        
    
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
            
        
        self.loaded = True
        self.token_to_id = {v: k for k, v in self.vocab.items()}
        
        return tokens
        
    def encode(self, text: str) -> list[int]:
        if not self.loaded:
            raise ValueError("The tokenizer has not yet been loaded (try loading or training)")
        
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
        if not self.loaded:
            raise ValueError("The tokenizer has not yet been loaded (try loading or training)")
            
        raw = b""
        
        for token in tokens:
            raw += self.vocab[token]

        return raw.decode("utf-8", errors="replace")
    
    def load(self, filepath):
        merge_path = os.path.join(filepath, "merges.txt")
        vocab_path = os.path.join(filepath, "vocab.json")
        
        if not (os.path.exists(merge_path) and os.path.exists(vocab_path)):
            raise FileNotFoundError("Both merges.txt and vocab.json must be present in the specified filepath.")
        
        # Read and load merges.txt
        with open(merge_path, "r", encoding="utf-8") as f:
            i = 0
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                
                tokens = re.findall(r'\d+', line)
                
                if len(tokens) != 2:
                    raise IndexError(f"Expected 2 tokens, but got {len(tokens)} in merge: \n{line}")
                
                if len(tokens) != 2:
                    raise IndexError(f"Expected 2 tokens, but got {len(tokens)} in merge: \n{line}")
                
                tokens = list(map(int, tokens))
                pair: tuple[int, int] = (tokens[0], tokens[1])
                
                self.merge[pair] = i
                i += 1
        
        # Read and load vocab.json
        with open(vocab_path, "r", encoding="utf-8") as f:
            vocab_data = json.load(f)
            
        for i, (key, value) in enumerate(vocab_data.items()):
            token = key.encode("utf-8")
            self.vocab[value] = token
            self.token_to_id[token] = value
        
        self.loaded = True
    
    
    def save(self, id) -> str:
        if not self.loaded:
            raise ValueError("Cannot save the model because it has not been loaded (try loading or training)")
        
        save_dir = f"saved_models/v_{id}"
        os.makedirs(save_dir, exist_ok=True)

        # Save merges.txt
        merges_path = os.path.join(save_dir, "merges.txt")
        pipe_column = 20 
        with open(merges_path, "w", encoding="utf-8") as f:
            f.write(f"#version: {id}\n")
            for pair in self.merge:
                if isinstance(pair, tuple):
                    left = pair[0]
                    left_text = self.vocab[left].decode("utf-8", errors="replace")
                    right = pair[1]
                    right_text = self.vocab[right].decode("utf-8", errors="replace")
                    merge_str = f"{left} {right}"
                    line = merge_str.ljust(pipe_column) + f"-> '{left_text}' '{right_text}'"
                    f.write(line + "\n")
        
        # Save vocab.json
        vocab_path = os.path.join(save_dir, "vocab.json")
        def serialize_value(v):
            if isinstance(v, bytes):
                return v.decode("utf-8", errors="replace")
            elif isinstance(v, tuple):
                return list(v)
            else:
                return v
        
        vocab_str = {}
        for k, v in self.vocab.items():
            key_str = self.vocab[k].decode("utf-8", errors="replace")
            vocab_str[key_str] = k
        
        with open(vocab_path, "w", encoding="utf-8") as f:
            json.dump(vocab_str, f, ensure_ascii=False, indent=2)
        
        return save_dir
    
    