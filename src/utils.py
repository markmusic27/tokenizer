import regex as re
import time
from tqdm import tqdm

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

def create_progress_bar(total: int, desc: str = "Progress"):
    """
    Create a tqdm progress bar with percentage and timing information.
    
    Args:
        total: Total number of steps
        desc: Description for the progress bar
    
    Returns:
        tqdm progress bar object
    """
    return tqdm(
        total=total,
        desc=desc,
        bar_format='{desc}: {percentage:3.0f}%|{bar}| {n_fmt}/{total_fmt} [{elapsed}]',
        ncols=80
    )

def print_progress(current: int, total: int, start_time: float, prefix: str = "Progress"):
    """
    Print progress with elapsed time and percentage.
    
    Args:
        current: Current step number (1-based)
        total: Total number of steps
        start_time: Start time from time.time()
        prefix: Prefix for the progress line (default: "Progress")
    """
    elapsed_time = time.time() - start_time
    elapsed_formatted = time.strftime("%H:%M:%S", time.gmtime(elapsed_time))
    percentage = (current / total) * 100
    
    print(f"{prefix} {current:>3}/{total} ({percentage:5.1f}%): Time: {elapsed_formatted}", end='\r')        