export type GptSize = readonly [number, number];

export type GptSizeMapping = {
  viewport: GptSize;
  sizes: readonly GptSize[];
};

export type GptSlotConfig = {
  adUnitPath: string;
  elementId: string;
  sizes: readonly GptSize[];
  sizeMapping: readonly GptSizeMapping[];
};

/** Header masthead unit generated in Google Ad Manager as PIO-H1. */
export const GPT_HEADER_SLOT: GptSlotConfig = {
  adUnitPath: "/23373962570/PIO-H1",
  elementId: "div-gpt-ad-1790812590707-0",
  sizes: [
    [728, 90],
    [468, 60],
    [320, 50],
    [300, 50],
  ],
  sizeMapping: [
    { viewport: [993, 0], sizes: [[728, 90]] },
    { viewport: [761, 0], sizes: [[468, 60]] },
    { viewport: [431, 0], sizes: [[320, 50]] },
    { viewport: [0, 0], sizes: [[300, 50]] },
  ],
};
