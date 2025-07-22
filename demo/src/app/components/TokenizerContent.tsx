import InputBox from "./InputBox";
import { BaseBox } from "./BaseBox";
import WhitespaceToggle from "./WhitespaceToggle";
import HighlightedSegments from "./HighlightedSegments";
import TokenizedSegments from "./TokenizedSegments";
import Indicator from "./Indicator";
import { useState, useEffect } from "react";
import { Tokenizer } from "@/utils/tokenizer";

const TokenizerContent = () => {
  const [encoded, setEncoded] = useState<number[]>([]);
  const [decoded, setDecoded] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);
  const [inputText, setInputText] = useState<string>(
    "Type here... The quick brown fox jumps over the lazy dog, or something.",
  );

  // Constants for compression calculation
  const VOCAB_SIZE = 50118;
  const BITS_PER_TOKEN = Math.ceil(Math.log2(VOCAB_SIZE));

  useEffect(() => {
    const loadTokenizer = async () => {
      const t = new Tokenizer();
      await t.load("/model/");
      setTokenizer(t);
    };
    void loadTokenizer();
  }, []);

  useEffect(() => {
    if (tokenizer) {
      handleTextChange(inputText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenizer]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (!tokenizer) return;
    try {
      const tokens = tokenizer.encode(text);
      setEncoded(tokens);
      setDecoded(tokenizer.decode(tokens));
    } catch {
      setEncoded([]);
      setDecoded([]);
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-[15px] md:flex-row">
      <div className="flex flex-col gap-[15px] md:w-17/40">
        {/*  input */}
        <InputBox onChangeText={handleTextChange} value={inputText} />

        {/*  show whitespace button */}
        <WhitespaceToggle
          onClick={(e) => {
            setShowWhitespace(e);
          }}
        />
      </div>
      <div className="flex flex-col gap-[15px] md:w-23/40">
        {/* indicators */}
        <div className="flex flex-row gap-[15px]">
          <Indicator
            title="Token Count"
            data={encoded.length.toString()}
            className="w-2/5"
          />
          {/* Compression Ratio Calculation */}
          {(() => {
            // Bits in tokens
            const tokenBits = encoded.length * BITS_PER_TOKEN;
            // Bits in UTF-8
            const utf8Bytes = new TextEncoder().encode(inputText).length;
            const utf8Bits = utf8Bytes * 8;
            // Compression ratio: (utf8Bits / tokenBits)
            let ratioStr = "-";
            if (tokenBits > 0) {
              const ratio = utf8Bits / tokenBits;
              ratioStr = `${ratio.toFixed(2)}x`;
            }
            return (
              <Indicator
                title="Compression Ratio"
                data={ratioStr}
                className="w-3/5"
              />
            );
          })()}
        </div>
        {/* highlighted  */}
        <BaseBox className="flex h-auto min-h-[160] flex-col">
          <HighlightedSegments
            showWhitespace={showWhitespace}
            hoveredIndex={highlighted}
            texts={decoded}
            onHover={(index) => {
              setHighlighted(index === -1 ? null : index);
            }}
          />
        </BaseBox>

        {/*  tokenized */}
        <BaseBox className="flex h-auto min-h-[160] flex-col">
          <TokenizedSegments
            tokens={encoded}
            onHover={(index) => {
              setHighlighted(index === -1 ? null : index);
            }}
            hoveredIndex={highlighted}
          />
          <div className="flex" />
        </BaseBox>
      </div>
    </div>
  );
};

export default TokenizerContent;
