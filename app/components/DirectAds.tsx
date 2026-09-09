"use client";

import { useSyncExternalStore } from "react";
import { arsFuturoSidebarAd, dominosSidebarAd } from "../../lib/direct-ads";
import { AdSlot } from "./LiveWidgets";

const ROTATION_MS = 5 * 60 * 1000;
const HOME_SIDEBAR_ADS = [arsFuturoSidebarAd, dominosSidebarAd];

function subscribeToAdRotation(onStoreChange: () => void) {
  let intervalId = 0;
  const delay = ROTATION_MS - (Date.now() % ROTATION_MS);
  const timeoutId = window.setTimeout(() => {
    onStoreChange();
    intervalId = window.setInterval(onStoreChange, ROTATION_MS);
  }, delay);
  return () => {
    window.clearTimeout(timeoutId);
    window.clearInterval(intervalId);
  };
}

function getAdRotationTick() {
  return Math.floor(Date.now() / ROTATION_MS);
}

function getServerAdRotationTick() {
  return 0;
}

export function RotatingHomeSidebarAd({
  lane,
}: {
  lane: "primary" | "secondary";
}) {
  const tick = useSyncExternalStore(
    subscribeToAdRotation,
    getAdRotationTick,
    getServerAdRotationTick,
  );
  const offset = lane === "primary" ? 0 : 1;
  const creative = HOME_SIDEBAR_ADS[(tick + offset) % HOME_SIDEBAR_ADS.length];

  return <AdSlot key={creative.alt} size="300 × 600" creative={creative} />;
}
