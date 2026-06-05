'use client';
import { useState } from 'react';

export default function QuizCard({quiz}:{quiz:any}) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState('');

  const check = (label:string) => {
    if (answered) return;
    setSelected(label);
    setAnswered(true);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
      <div className="text-[17px] font-bold mb-4 leading-snug">{quiz.question}</div>
      <div className="space-y-2">
        {quiz.options.map((o:any) => {
          let cls = 'border border-black/5';
          if (answered) {
            if (o.label === quiz.correct_answer) cls = 'border-green-500 bg-green-50 text-green-700';
            else if (o.label === selected) cls = 'border-red-500 bg-red-50 text-red-700';
          }
          return (
            <div key={o.label} onClick={()=>check(o.label)}
              className={`px-4 py-3 rounded-xl text-sm cursor-pointer transition-all hover:border-[#1D4ED8] ${cls}`}>
              <strong>{o.label}.</strong> {o.text}
            </div>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 p-4 bg-[#F0F4FA] rounded-xl text-sm leading-relaxed">
          <strong>📖 解析：</strong>{quiz.explanation}
        </div>
      )}
    </div>
  );
}
