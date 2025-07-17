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

def merge(tokens: list[int], pair: tuple[int, int], new_id: int):
    i = 0
    
    while i < len(tokens) - 1:
        p = (tokens[i], tokens[i+1])
        
        if p == pair:
            tokens[i] = new_id
            del tokens[i+1]
        else:
            i+=1
        