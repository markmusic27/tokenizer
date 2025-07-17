from src.tokenizer import Tokenizer

encoder = Tokenizer(vocab_size=270)

e = encoder.train("Hello world my name is mark music")

print(encoder.merge)