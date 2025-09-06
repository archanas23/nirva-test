"use client";
import * as React from "react";

// define the payload shape Recharts passes to tooltips/legends
type ChartPayload = {
  color: string;
  value: string | number;
  name?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border p-2 rounded shadow">
      {label && <p className="font-medium">{label}</p>}
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

export function ChartLegendContent({
  payload,
  verticalAlign,
}: {
  payload?: ChartPayload[];
  verticalAlign?: "top" | "bottom" | "middle";
}) {
  if (!payload?.length) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        verticalAlign === "middle" ? "justify-center" : "justify-start"
      }`}
    >
      {payload.map((item, index) => (
        <span
          key={index}
          className="px-2 py-1 rounded text-sm"
          style={{ backgroundColor: item.color, color: "#fff" }}
        >
          {item.value}
        </span>
      ))}
    </div>
  );
}