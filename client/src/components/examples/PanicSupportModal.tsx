import { useState } from 'react';
import PanicSupportModal from '../PanicSupportModal';
import { Button } from '@/components/ui/button';

export default function PanicSupportModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Support Modal</Button>
      <PanicSupportModal open={open} onOpenChange={setOpen} />
    </div>
  );
}