import PuffCounter from '../PuffCounter';

export default function PuffCounterExample() {
  return (
    <div className="max-w-md mx-auto p-4">
      <PuffCounter 
        dailyLimit={8}
        onCountChange={(count) => console.log('Count changed to:', count)}
      />
    </div>
  );
}