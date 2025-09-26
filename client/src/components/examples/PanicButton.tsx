import PanicButton from '../PanicButton';

export default function PanicButtonExample() {
  return (
    <div className="p-4 flex justify-center">
      <PanicButton onClick={() => console.log('Support modal should open')} />
    </div>
  );
}