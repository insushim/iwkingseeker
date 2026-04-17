'use client';

import React from 'react';

interface Props {
  text: string;
  className?: string;
}

function Fraction({ num, den }: { num: string; den: string }) {
  return (
    <span
      className="inline-flex flex-col items-center align-middle mx-1 leading-none"
      style={{ fontSize: '0.85em', verticalAlign: '-0.25em' }}
    >
      <span className="border-b-2 border-current px-1.5 pb-0.5">{num}</span>
      <span className="px-1.5 pt-0.5">{den}</span>
    </span>
  );
}

export default function SmartText({ text, className }: Props) {
  // 숫자/숫자 패턴을 분수 UI로 렌더 (앞뒤 단어 경계 — 날짜 2026/04 는 제외)
  const parts = text.split(/(\b\d+\/\d+\b)/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        const m = p.match(/^(\d+)\/(\d+)$/);
        if (m) return <Fraction key={i} num={m[1]!} den={m[2]!} />;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </span>
  );
}
