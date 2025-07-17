from src.tokenizer import Tokenizer

encoder = Tokenizer(vocab_size=1070)

text = "Hello world my name is mark music"

e = encoder.train(text)

print(encoder.decode(e))