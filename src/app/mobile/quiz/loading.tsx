export default function Loading(){return <div className='space-y-3 animate-pulse'>{[...Array(3)].map((_,i)=><div key={i} className='h-16 bg-black/5 rounded-2xl'/>)}</div>}
