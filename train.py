from src.tokenizer import Tokenizer

encoder = Tokenizer(vocab_size=500)

e = encoder.train("Hello world")

print(e)