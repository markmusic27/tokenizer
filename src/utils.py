import regex as re
import time

GPT4_PATTERN = r"""'(?i:[sdmt]|ll|ve|re)|[^\r\n\p{L}\p{N}]?+\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]++[\r\n]*|\s*[\r\n]|\s+(?!\S)|\s+"""

def get_frequency(tokens: list[int]) -> dict[tuple[int, int], int] | None:
    
    if len(tokens) < 2:
        return None
    
    freq = {}
    
    for i in range(len(tokens) - 1):
        pair = (tokens[i], tokens[i+1])
        
        if freq.get(pair) == None:
            freq[pair] = 1
        else:
            freq[pair] += 1
    
    return freq

def regex_tokenize(text: str, pattern: str) -> list[str]:
    tokens = re.findall(pattern, text)
    return tokens

def merge(tokens: list[int], pair: tuple[int, int], new_id: int):
    i = 0
    
    while i < len(tokens) - 1:
        p = (tokens[i], tokens[i+1])
        
        if p == pair:
            tokens[i] = new_id
            del tokens[i+1]
        else:
            i+=1

def print_progress(current: int, total: int, start_time: float, prefix: str = "Progress"):
    """
    Print progress with elapsed time.
    
    Args:
        current: Current step number (1-based)
        total: Total number of steps
        start_time: Start time from time.time()
        prefix: Prefix for the progress line (default: "Progress")
    """
    elapsed_time = time.time() - start_time
    elapsed_formatted = time.strftime("%H:%M:%S", time.gmtime(elapsed_time))
    
    print(f"{prefix} {current:>3}/{total}:                    Time: {elapsed_formatted}", end='\r')        