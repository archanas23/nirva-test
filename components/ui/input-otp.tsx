"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

export function OTPField({ length = 6 }: { length?: number }) {
  const inputOTPContext = React.useContext(OTPInputContext) as {
    slots: { char: string; hasFakeCaret: boolean; isActive: boolean }[];
  } | null;

  return (
    <OTPInput maxLength={length} className="flex gap-1">
      {inputOTPContext?.slots.map((slot, index) => (
        <div
          key={index}
          className={`w-10 h-12 border rounded flex items-center justify-center text-lg ${
            slot.isActive ? "border-blue-500" : "border-gray-300"
          }`}
        >
          {slot.char || (slot.hasFakeCaret ? "|" : "")}
        </div>
      ))}
    </OTPInput>
  );
}