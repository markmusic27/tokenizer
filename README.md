<p align="center">
  <h1 align="center"><b>Byte Pair Encoding Tokenizer</b></h1>
  <p align="center">
  ✶ A minimal implementation of the Byte Pair Encoding (BPE) algorithm for LLM tokenization ✶
    <br />
    <a href="https://visual-tokenizer.vercel.app/">Open Demo »</a>
    <br />
  </p>
</p>

Byte Pair Encoding is the backbone of most modern LLM tokenization. It was popularized by the GPT-2 paper "Language Models are Unsupervised Multitask Learners", where OpenAI used it, in combination with Regex splitting, to create GPT-2's 50,257 token vocabulary.

> **Radford et al., 2019**
> This input representation allows us to combine the empirical benefits of word-level LMs with the generality of byte-level approaches. Since our approach can assign a probability to any Unicode string, this allows us to evaluate our LMs on any dataset regardless of pre-processing, tokenization, or vocab size.

![Demo of Ethics in Psychiatric Genomics](https://github.com/markmusic27/ethical-genomics/blob/main/public/images/readme.png?raw=true)