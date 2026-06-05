import { getQuiz } from '@/lib/api';
import QuizCard from '@/components/shared/QuizCard';
export default async function MobileQuiz() {
  const today = new Date().toISOString().split('T')[0];
  const quiz = await getQuiz(today);
  return (
    <div className="pt-2">
      <h2 className="text-[17px] font-bold mb-1">📝 每日一题</h2>
      <p className="text-xs text-[#6B7194] mb-4">{today}</p>
      {quiz ? <QuizCard quiz={quiz} /> : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-black/5">
          <div className="text-5xl mb-3">📝</div><div className="font-semibold">今日题目即将上线</div>
        </div>
      )}
    </div>
  );
}
