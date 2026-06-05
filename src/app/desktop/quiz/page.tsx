import { getQuiz } from '@/lib/api';
import QuizCard from '@/components/shared/QuizCard';
export default async function DesktopQuiz() {
  const today = new Date().toISOString().split('T')[0];
  const quiz = await getQuiz(today);
  return (
    <>
      <h1 className="text-2xl font-bold mb-1">📝 每日一题</h1>
      <p className="text-sm text-[#6B7194] mb-6">{today}</p>
      {quiz ? <div className="max-w-2xl"><QuizCard quiz={quiz} /></div> : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-black/5">
          <div className="text-6xl mb-4">📝</div><div className="font-semibold text-xl">今日题目即将上线</div>
        </div>
      )}
    </>
  );
}
