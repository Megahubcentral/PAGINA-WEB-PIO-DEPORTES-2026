"use client";

import { useEffect } from "react";
import type { GptSlotConfig } from "../../lib/gpt";

type GoogletagSlot = {
  addService: (service: unknown) => GoogletagSlot;
  defineSizeMapping: (mapping: unknown) => GoogletagSlot;
};

type SizeMappingBuilder = {
  addSize: (viewport: readonly number[], sizes: readonly (readonly number[])[]) => SizeMappingBuilder;
  build: () => unknown;
};

type Googletag = {
  cmd: Array<() => void>;
  display: (id: string) => void;
  enableServices: () => void;
  destroySlots: (slots?: GoogletagSlot[]) => void;
  defineSlot: (adUnitPath: string, sizes: readonly (readonly number[])[], elementId: string) => GoogletagSlot | null;
  sizeMapping: () => SizeMappingBuilder;
  pubads: () => unknown;
};

declare global {
  interface Window {
    googletag?: Googletag;
  }
}

function getGoogletag(): Googletag {
  const existing = window.googletag;
  if (existing?.cmd) return existing;
  const googletag = { cmd: [] } as Googletag;
  window.googletag = googletag;
  return googletag;
}

export function GptAdSlot({ slot }: { slot: GptSlotConfig }) {
  useEffect(() => {
    const googletag = getGoogletag();
    let definedSlot: GoogletagSlot | null = null;

    googletag.cmd.push(() => {
      const mapping = googletag.sizeMapping();
      for (const entry of slot.sizeMapping) {
        mapping.addSize(entry.viewport, entry.sizes);
      }

      definedSlot = googletag
        .defineSlot(slot.adUnitPath, slot.sizes, slot.elementId)
        ?.defineSizeMapping(mapping.build())
        .addService(googletag.pubads()) ?? null;

      googletag.enableServices();
      googletag.display(slot.elementId);
    });

    return () => {
      googletag.cmd.push(() => {
        if (definedSlot) googletag.destroySlots([definedSlot]);
      });
    };
  }, [slot]);

  return (
    <div
      id={slot.elementId}
      className="gpt-ad"
      style={{ minWidth: 300, minHeight: 50 }}
      aria-label="Publicidad"
    />
  );
}
