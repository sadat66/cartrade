"use client";

import { useState } from "react";

const COLLAPSED_LENGTH = 320;

interface AboutThisCarProps {
  title: string;
  description: string;
  showMoreLabel: string;
  showLessLabel: string;
}

export function AboutThisCar({ title, description, showMoreLabel, showLessLabel }: AboutThisCarProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > COLLAPSED_LENGTH;
  const displayText = isLong && !expanded
    ? `${description.slice(0, COLLAPSED_LENGTH).trim()}...`
    : description;

  return (
    <section className="bg-transparent">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-700 leading-relaxed text-base">
        <span className="whitespace-pre-wrap">{displayText}</span>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}
      </div>
    </section>
  );
}
