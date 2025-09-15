import { AppShell } from '@mantine/core';
import { Header } from './shared/components/Header';
import { StreamsPage } from './features/streams/components/StreamsPage';

function App() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Main>
        <StreamsPage />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
