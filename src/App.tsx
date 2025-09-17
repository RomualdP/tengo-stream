import { AppShell } from '@mantine/core';
import { Header } from './shared/components/Header';
import { StreamsPage } from './features/streams/components/StreamsPage';
import { PipelinePage } from './features/pipeline/components/PipelinePage';
import { TenderDetailPage } from './features/streams/components/TenderDetailPage';
import { useNavigation } from './shared/hooks/useNavigation';

function App() {
  const navigation = useNavigation();

  const getCurrentActiveTab = (): string => {
    if (navigation.currentPage.type === 'tender-detail') {
      return navigation.currentPage.returnTo || 'streams';
    }
    return navigation.currentPage.type;
  };

  const handleTabChange = (value: string) => {
    if (value === 'streams') {
      navigation.navigateToStreams();
    } else if (value === 'pipeline') {
      navigation.navigateToPipeline();
    }
  };

  const renderCurrentPage = () => {
    switch (navigation.currentPage.type) {
      case 'streams':
        return <StreamsPage onNavigateToDetail={navigation.navigateToTenderDetail} />;
      case 'pipeline':
        return <PipelinePage onNavigateToDetail={navigation.navigateToTenderDetail} />;
      case 'tender-detail':
        return (
          <TenderDetailPage 
            tenderId={navigation.currentPage.tenderId} 
          />
        );
      default:
        return <StreamsPage onNavigateToDetail={navigation.navigateToTenderDetail} />;
    }
  };

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header 
          activeTab={getCurrentActiveTab()} 
          onTabChange={handleTabChange}
          currentPage={navigation.currentPage}
          canGoBack={navigation.canGoBack}
          onNavigateBack={navigation.navigateBack}
        />
      </AppShell.Header>
      
      <AppShell.Main>
        {renderCurrentPage()}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
