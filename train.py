from src.tokenizer import Tokenizer
from src.utils import regex_tokenize, GPT4_PATTERN
import time

# HYPERPARAMETERS
DATASET = ["feynman.txt", "homo_deus.txt", "little_women.txt", "the_love_hypothesis.txt"]
VOCAB_SIZE = 50256
REGEX_PATTERN = GPT4_PATTERN
SAVED_TO = "homodeus"

# Load the dataset
print("Loading dataset...")
start_time = time.time()
dataset = ""
for filename in DATASET:
    filepath = f"dataset/{filename}"
    print(f"Loading {filename}...")
    with open(filepath, "r", encoding="utf-8") as f:
        file_content = f.read()
        dataset += file_content
        print(f"  {filename}: {len(file_content):,} characters")

load_time = time.time() - start_time
print(f"Dataset loaded: {len(dataset):,} characters total ({load_time:.2f}s)")

# Initialize tokenizer
print("Initializing tokenizer...")
init_start = time.time()
encoder = Tokenizer(vocab_size=VOCAB_SIZE, pattern=REGEX_PATTERN)
init_time = time.time() - init_start
print(f"Tokenizer initialized ({init_time:.3f}s)")

# Train on the dataset
print("Training tokenizer...")
train_start = time.time()
encoded_tokens = encoder.train(dataset)
train_time = time.time() - train_start

print(f"Training complete. Generated {len(encoded_tokens)} tokens ({train_time:.2f}s)")
print(f"Vocabulary size: {len(encoder.vocab)}")
print(f"Tokens per second: {len(encoded_tokens) / train_time:.0f}")

# Test encoding and decoding
print("\nTesting encoding/decoding...")
test_start = time.time()
test_text = "Hello world! This is a test."
encoded = encoder.encode(test_text)
decoded = encoder.decode(encoded)
test_time = time.time() - test_start

print(f"Original: '{test_text}'")
print(f"Encoded: {encoded}")
print(f"Decoded: '{decoded}'")
print(f"Match: {test_text == decoded} ({test_time:.3f}s)")

# Test with the full dataset
print("\nTesting full dataset encoding/decoding...")
dataset_test_start = time.time()

# Encoding
encode_start = time.time()
dataset_encoded = encoder.encode(dataset)
encode_time = time.time() - encode_start
print(f"Dataset encoding completed ({encode_time:.2f}s)")

# Decoding
decode_start = time.time()
dataset_decoded = encoder.decode(dataset_encoded)
decode_time = time.time() - decode_start
print(f"Dataset decoding completed ({decode_time:.2f}s)")

# Compare lengths first (faster than full string comparison)
print(f"Original dataset length: {len(dataset)}")
print(f"Decoded dataset length: {len(dataset_decoded)}")
print(f"Length match: {len(dataset) == len(dataset_decoded)}")

# Full comparison (this might take a moment)
comparison_start = time.time()
full_match = dataset == dataset_decoded
comparison_time = time.time() - comparison_start
print(f"Full dataset match: {full_match} ({comparison_time:.2f}s)")

dataset_test_time = time.time() - dataset_test_start

if not full_match:
    # Find where they differ
    for i, (orig, dec) in enumerate(zip(dataset, dataset_decoded)):
        if orig != dec:
            print(f"First difference at position {i}: '{orig}' vs '{dec}'")
            break
else:
    print("✅ Success! Encoding and decoding preserves the original text perfectly.")

print(f"Total dataset testing time: {dataset_test_time:.2f}s")

# Save the trained model
print("\nSaving model...")
save_start = time.time()
save_path = encoder.save(SAVED_TO)
save_time = time.time() - save_start
print(f"Model saved to: {save_path} ({save_time:.2f}s)")

# Summary
total_time = time.time() - start_time
print(f"\n{'='*50}")
print(f"TRAINING SUMMARY")
print(f"{'='*50}")
print(f"Dataset size: {len(dataset):,} characters")
print(f"Generated tokens: {len(encoded_tokens):,}")
print(f"Vocabulary size: {len(encoder.vocab)}")
print(f"Compression ratio: {len(dataset) / len(encoded_tokens):.2f}x")
print(f"")
print(f"Timing breakdown:")
print(f"  Loading dataset: {load_time:.2f}s")
print(f"  Training BPE: {train_time:.2f}s")
print(f"  Testing: {dataset_test_time:.2f}s")
print(f"  Saving model: {save_time:.2f}s")
print(f"  Total time: {total_time:.2f}s")