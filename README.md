<p align="center">
  <h1 align="center"><b>Byte Pair Encoding Tokenizer</b></h1>
  <p align="center">
  ✶ A minimal implementation of the Byte Pair Encoding<br/>(BPE) algorithm for LLM tokenization ✶
    <br />
    <br />
    <a href="https://visual-tokenizer.vercel.app/">Open Demo »</a>
    <br />
  </p>
</p>

The BPE was written in Python (`src/tokenizer.py`) and implements GPT-4's Regex splitting technique. The tokenizer was trained on four documents with a combined 7,562,836 characters (see `/dataset`); this resulted in a vocabulary size of 50,256 tokens (`saved_models/v_corpus`). The [demo](https://visual-tokenizer.vercel.app/) was built using `create-t3-app` with React, Typescript, and Tailwind (see `/demo`).


![Visual Tokenizer](https://github.com/markmusic27/tokenizer/blob/main/docs/thumbnail_gh.png?raw=true)

_Note: UX Inspiration from [diabrowser.com](https://diabrowser.com) and [tiktokenizer.vercel.app](https://tiktokenizer.vercel.app/)_

## Intro to BPEs

Byte Pair Encoding is the backbone of most modern LLM tokenization. It was popularized by the GPT-2 paper ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf), where OpenAI used it, in combination with Regex splitting, to create GPT-2's 50,257 token vocabulary.

> **Radford et al., 2019**
> This input representation allows us to combine the empirical benefits of word-level LMs with the generality of byte-level approaches. Since our approach can assign a probability to any Unicode string, this allows us to evaluate our LMs on any dataset regardless of pre-processing, tokenization, or vocab size.

Other models like Llama use `sentencepiece` which has a different approach to encoding. Tl;dr, `sentencepiece` runs BPE on codepoints and falls back to UTF-8 for unknown tokens. `tiktoken` (OpenAI's tokenizer) encodes using UTF-8 and then runs BPE on the bytes.


### Why BPEs

The big picture for why we use BPEs comes down to how LLMs represent text. LLMs use self-attention mechanisms to "bake-in" the semantic meaning of text, among other things. For instance, consider the following two sentences:

1. My boat got stuck in the river **bank**.
2. I need to go withdraw money from the **bank**.

In these two sentences, the word **bank** has a completely different meaning. Self-attention enables the model to distinguish between the two. This is a very crude explanation of attention, but its beyond the scope of this explanation so I'll leave it to the reader to look into it further. I recommend [3Blue1Brown's explanation](https://www.youtube.com/watch?v=eMlx5fFNoYc&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&index=7).

Self-attention boils down to computing the dot-product of two vectors where each vector corresponds to a token in the input sequence. You can think of the dot-product as a measurement of how aligned the two vectors are (how similar they are).

The issue is that we are limited by how many of these dot-products we can compute. Hence, if we decide that tokens represent characters, then our self-attention mechanism can only process short passages. Conversely, we can let tokens be words and attend to longer passages. But then we have to determine which words to have in our vocabulary without making that too large. So here are the trade-offs listed:

- We decide that tokens represent characters:
  - Pros: we can represent any input sequence and our vocabulary size is small
  - Cons: we can't attend to long passages (reduces model's capabilities)
- We decide that tokens are words:
  - Pros: we can attend to longer passages (improving model's capabilities)
  - Cons: we have to pick which words to include, which often results in a massive vocabulary which is computationally impractical

BPEs offer an in-between where tokens are neither characters or words. BPEs start with a base of the 256 character vocabulary from UTF-8 and procedurally mint new tokens by identifying which pair of characters occurs the most in its training set. It repeats this process until a desired vocabulary size is reached.

In my training data, the most frequent pair was " t". This makes sense. Think of the number of words that begin with "t" and how often they're used. In fact, try `cmd+f` and type " t" on this README; you'll find that pair occurs 120 times.

There is one important thing that I won't cover here which is Regex splitting of words. Andrej Karpathy covers this, and pretty much everything else you need to know about tokenization, in his [video on the topic](https://www.youtube.com/watch?v=zduSFxRajkE&t=4s). That's the resource I used to learn all of this.

## My implementation

My implementation of the BPE algorithm defines a class with five important methods:

1. `train`: generates a vocabulary with a predeterimed size given a training text (passed as a string)
2. `encode`: generates a list of tokens for a given text
3. `decode`: generates a text from a given list of tokens
4. `load`: loads a vocabulary from a merges.txt and a vocab.json file
5. `save`: saves the vocabulary and merges to merges.txt and vocab.json files given an output path

Note that either `train` or `load` must be run before you can encode or decode. I provided an example model (found in `saved_models/v_corpus`) that was trained on four documents comprised of 7,562,836 characters. This is the model that is running on the demo website. The training resulted in a vocabulary size of 50,256 tokens.

### Training

For my dataset, I chose to train the tokenizer on [The Feynmann Lectures](https://www.feynmanlectures.caltech.edu/), [Homo Deus by Yuval Noah Harari](https://www.ynharari.com/book/homo-deus/), [Little Women by Luisa May Alcott](https://www.gutenberg.org/ebooks/514), and [The Love Hypothesis by Ali Hazelwood](https://alihazelwood.com/the-love-hypothesis/).

I thought this dataset would provide a relatively complete picture of the English language including STEM / academic writing, classic literature, and more coloquial text.

**Things this tokenizer was not trained on:** Code of any kind (besides maybe some LATEX), non-english languages, specialized jargon from other fields, Social Media vernacular (brainrot), emojis and other unicode symbols, and unique dialects.

### Time to train
Something I found interesting was the time it took process each merge. As more pairs were minted into new tokens and the process was repeated, the time it took to complete one cycle became shorter. In fact, the merges (generating frequencies, minting token, and replacing it in the text) seemed to take exponentially less time. I recorded the time that it took my MacBook to process each merge in `saved_models/v_corpus/training_data.csv`. Here's the data:

![Training Time Graph](https://github.com/markmusic27/tokenizer/blob/main/docs/graph.png?raw=true)

The data seems to represent a logarithmic relationship where the time to process each merge asymptotically tends to $\approx 0.23$. This makes sense, in theory, since when the training process first begins, the workable dataset length is the highest (more content to make frequency table from). Additionally, the most common character pairs are likely very common such that they represent a significant number of merges. After a certain theshold, however, it seems that two things produce very little change in time from merge to merge:

1. The workable dataset has reached a low enough length such that generating a frequency table takes a trivial amount of time.
2. At first, the frequency graph of all words has very little variance (some pairs, like " t" likely dominate the distribution). However, once the "common" words are merged (at around index 20,000), the frequency distribution has greater variance (where no one pair dominates the rest). Hence, merging one pair takes around the same time as it takes to merge the next or the one before.

Note that due to Regex splitting, two words cannot be merged together. Hence, frequent phrases that you'd image would be merged (eg. "due to the fact"). Hence, we reach a constant time-complexity.