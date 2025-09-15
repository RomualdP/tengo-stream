import { AppShell } from '@mantine/core';
import { useState } from 'react';
import { Header } from './shared/components/Header';
import { StreamsPage } from './features/streams/components/StreamsPage';
import { PipelinePage } from './features/pipeline/components/PipelinePage';

function App() {
  const [activeTab, setActiveTab] = useState<string>('streams');

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
      </AppShell.Header>
      
      <AppShell.Main>
        {activeTab === 'streams' && <StreamsPage />}
        {activeTab === 'pipeline' && <PipelinePage />}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
