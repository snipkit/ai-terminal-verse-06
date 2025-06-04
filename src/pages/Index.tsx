
import { Terminal } from '@/components/Terminal';
import { FeaturesShowcase } from '@/components/FeaturesShowcase';
import { TerminalHandlerDemo } from '@/components/TerminalHandlerDemo';

const Index = () => {
  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      <Terminal />
      <TerminalHandlerDemo />
      <FeaturesShowcase />
    </div>
  );
};

export default Index;
