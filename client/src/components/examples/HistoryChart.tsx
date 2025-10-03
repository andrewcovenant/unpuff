import HistoryChart from '../HistoryChart';

export default function HistoryChartExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <HistoryChart dailyLimit={10} />
    </div>
  );
}