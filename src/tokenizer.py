from .utils import get_frequency, merge


class Tokenizer:
    def __init__(self, vocab_size: int):
        if (vocab_size <= 256):
            raise ValueError(f"vocab_size hyperparameter must be greater than 256. You inputted {vocab_size}")
        
        self.vocab_size = vocab_size
            
        # Initialize vocabulary to be base characters in UTF-8
        self.vocab: dict[int, int] = {}
        
        for i in range(256):
            self.vocab[i] = i
            
        # Create empty merge rules
        self.merge: list[int] = []

        
    
    def train(self, text: str) -> list[int]:
        tokens = [ord(char) for char in text]
        
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
            self.vocab[new_id]=highest_pair
            self.merge.append(highest_pair)
            
        return tokens
        
    def encode():
        print("encode")
    
    def decode():
        print("")
    
    