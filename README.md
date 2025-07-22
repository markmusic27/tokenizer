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

The BPE was written in Python (`src/tokenizer.py`) and implements GPT-4's Regex splitting technique. The tokenizer was trained on four documents with a 7,562,836 characters (see `/dataset`), and resulted in a vocabulary size of 50,256 tokens (`saved_models/v_corpus`). The [demo](https://visual-tokenizer.vercel.app/) was built using `create-t3-app` with React, Typescript, and Tailwind (see `/demo`).


![Visual Tokenizer](https://github.com/markmusic27/tokenizer/blob/main/docs/thumbnail_gh.png?raw=true)

_Note: UX Inspiration from [diabrowser.com](https://diabrowser.com) and [tiktokenizer.vercel.app](https://tiktokenizer.vercel.app/)_

Byte Pair Encoding is the backbone of most modern LLM tokenization. It was popularized by the GPT-2 paper ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf), where OpenAI used it, in combination with Regex splitting, to create GPT-2's 50,257 token vocabulary.

> **Radford et al., 2019**
> This input representation allows us to combine the empirical benefits of word-level LMs with the generality of byte-level approaches. Since our approach can assign a probability to any Unicode string, this allows us to evaluate our LMs on any dataset regardless of pre-processing, tokenization, or vocab size.

