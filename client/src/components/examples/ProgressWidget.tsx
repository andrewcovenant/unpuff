import ProgressWidget from '../ProgressWidget';

export default function ProgressWidgetExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <ProgressWidget
        currentCount={3}
        dailyLimit={10}
        streak={7}
        moneySaved={45.50}
        costPerUnit={0.75}
      />
    </div>
  );
}