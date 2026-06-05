export default function Loading() {
  return <div className="space-y-3 animate-pulse mt-4">{[...Array(4)].map((_,i)=><div key={i} className="h-16 bg-black/5 rounded-2xl" />)}</div>;
}
