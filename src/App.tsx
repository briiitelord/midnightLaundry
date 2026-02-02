import { useState } from 'react';
import HomePage from './pages/HomePage';

export type Section = 'music' | 'video' | 'writing' | 'research' | 'social' | 'about' | 'commission';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('about');

  return <HomePage activeSection={activeSection} onSectionChange={setActiveSection} />;
}

export default App;
