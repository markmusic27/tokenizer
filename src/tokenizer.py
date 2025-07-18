from .utils import get_frequency, merge, regex_tokenize, GPT4_PATTERN, print_progress
import os
import json
import regex as re
import time
import csv


class Tokenizer:
    def __init__(self, vocab_size: int, pattern: str = GPT4_PATTERN):
        if (vocab_size <= 256):
            raise ValueError(f"vocab_size hyperparameter must be greater than 256. You inputted {vocab_size}")
        
        self.vocab_size = vocab_size
            
        # Initialize vocabulary to be base characters in UTF-8
        self.vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
        self.token_to_id: dict[bytes, int] = {}
        
        # Create empty merge rules
        self.merge: dict[tuple[int, int], int] = {}
        
        self.pattern = pattern
        
        # Training data for analysis
        self.timing_data = []
        
        self.loaded = False
        
    def train(self, text: str) -> list[int]:
        # Use the actual text parameter and pattern
        batches = regex_tokenize(text, self.pattern)

        # Convert each batch to bytes
        byte_batches = [list(batch.encode("utf-8")) for batch in batches]
        
        # Training progress tracking
        total_merges = self.vocab_size - 256
        start_time = time.time()
        
        # Clear previous timing data
        self.timing_data = []
        
        # Train BPE while maintaining split boundaries
        for i in range(total_merges):
            merge_start_time = time.time()
            
            # Collect frequency statistics across ALL splits
            global_freq = {}
            
            for tokens in byte_batches:
                freq = get_frequency(tokens)
                if freq:
                    for pair, count in freq.items():
                        global_freq[pair] = global_freq.get(pair, 0) + count
            
            # Find the most frequent pair globally
            if not global_freq:
                break
                
            highest_pair = max(global_freq, key=global_freq.get)
            
            # Apply merge to ALL splits (but only within each split)
            new_id = i + 256
            
            for tokens in byte_batches:
                merge(tokens, highest_pair, new_id)
            
            # Update vocab and merge rules
            self.vocab[new_id] = self.vocab[highest_pair[0]] + self.vocab[highest_pair[1]]
            self.merge[highest_pair] = i
            
            # Record timing data
            merge_time = time.time() - merge_start_time
            self.timing_data.append({
                'merge_number': i + 1,
                'time_seconds': merge_time,
                'cumulative_time': time.time() - start_time
            })
            
            # Progress indicator
            print_progress(i + 1, total_merges, start_time, "Merge")
        
        print()  # New line after progress is complete
        
        self.loaded = True
        self.token_to_id = {v: k for k, v in self.vocab.items()}
        
        # Return flattened result (like encode() does)
        result = []
        for tokens in byte_batches:
            result.extend(tokens)
        return result
        
    def encode(self, text: str) -> list[int]:
        if not self.loaded:
            raise ValueError("The tokenizer has not yet been loaded (try loading or training)")
        
        # Split text using regex pattern (same as in training)
        batches = regex_tokenize(text, self.pattern)
        
        all_tokens = []
        
        for batch in batches:
            # Convert batch to bytes
            tokens = list(batch.encode("utf-8"))
            
            # Apply BPE merges to this batch
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
            
            all_tokens.extend(tokens)
        
        return all_tokens
        
    
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
        
        # Save timing data to CSV
        if self.timing_data:
            csv_filename = os.path.join(save_dir, "training_data.csv")
            with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['merge_number', 'time_seconds', 'cumulative_time']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.timing_data)
            print(f"Training data saved to: {csv_filename}")
        
        return save_dir
    
    