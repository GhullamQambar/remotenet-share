
import React, { useState, useEffect, useCallback } from 'react';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { CredentialsSetupScreen } from './components/CredentialsSetupScreen';
import { CredentialsEntryScreen } from './components/CredentialsEntryScreen';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ReceiverDashboard } from './components/ReceiverDashboard';
import { Notification } from './components/Notification';
import { LogoutIcon, GlobeIcon } from './components/icons';
import { UserRole, ConnectionStatus, UsageControl, ConnectionState, DataPoint, ConnectionCredentials } from './types';

type View = 'ROLE_SELECTION' | 'CREDENTIALS_SETUP' | 'CREDENTIALS_ENTRY' | 'DASHBOARD';

const App: React.FC = () => {
  const [view, setView] = useState<View>('ROLE_SELECTION');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [sessionCredentials, setSessionCredentials] = useState<ConnectionCredentials | null>(null);

  const [usageControl, setUsageControl] = useState<UsageControl>({
    dataCap: 5,
    duration: 2,
    allowedWebsites: '',
  });

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: ConnectionStatus.DISCONNECTED,
    dataUsed: 0,
    timeElapsed: 0,
  });
  
  const [dataHistory, setDataHistory] = useState<DataPoint[]>([{ time: 0, usage: 0 }]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification(message);
    setNotificationType(type);
  };
  
  const resetConnectionState = useCallback(() => {
    setConnectionState({
      status: ConnectionStatus.DISCONNECTED,
      dataUsed: 0,
      timeElapsed: 0,
    });
    setDataHistory([{ time: 0, usage: 0 }]);
  }, []);
  
  const stopSharing = useCallback(() => {
    if (connectionState.status !== ConnectionStatus.DISCONNECTED) {
      resetConnectionState();
      showNotification('Sharing has been stopped.', 'info');
    }
  }, [connectionState.status, resetConnectionState]);

  const resetSession = useCallback(() => {
    stopSharing();
    setView('ROLE_SELECTION');
    setUserRole(null);
    setSessionCredentials(null);
    setLoginError(null);
  }, [stopSharing]);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.PROVIDER) {
      setView('CREDENTIALS_SETUP');
    } else {
      setView('CREDENTIALS_ENTRY');
    }
  };

  const handleSetCredentials = (creds: ConnectionCredentials) => {
    setSessionCredentials(creds);
    setView('DASHBOARD');
    showNotification('Session created. Start sharing when you are ready.', 'success');
  };

  const handleVerifyCredentials = (creds: ConnectionCredentials) => {
    setLoginError(null);
    if (
      sessionCredentials &&
      creds.userId === sessionCredentials.userId &&
      creds.pass === sessionCredentials.pass
    ) {
       if (connectionState.status === ConnectionStatus.CONNECTING) {
          setConnectionState(prev => ({...prev, status: ConnectionStatus.CONNECTED }));
          showNotification('Connection successful!', 'success');
          setView('DASHBOARD');
       } else {
          setLoginError('Provider has not started the sharing session yet. Please wait.');
          showNotification('Provider is not ready.', 'error');
       }
    } else {
      setLoginError('Invalid credentials. Please check and try again.');
    }
  };

  const startSharing = () => {
    if (usageControl.dataCap <= 0 || usageControl.duration <= 0) {
      showNotification('Data Cap and Duration must be greater than 0.', 'error');
      return;
    }
    setConnectionState(prev => ({ ...prev, status: ConnectionStatus.CONNECTING }));
    showNotification('Waiting for receiver to connect...', 'info');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (connectionState.status === ConnectionStatus.CONNECTED) {
      interval = setInterval(() => {
        setConnectionState(prevState => {
          const newDataUsed = prevState.dataUsed + (Math.random() * 5 + 1); // 1-6 MB per tick
          const newTimeElapsed = prevState.timeElapsed + 1;

          if (newDataUsed >= usageControl.dataCap * 1024) {
            stopSharing();
            showNotification('Data limit reached. Connection terminated.', 'error');
            return { ...prevState, status: ConnectionStatus.DISCONNECTED };
          }
          if (newTimeElapsed >= usageControl.duration * 60) {
            stopSharing();
            showNotification('Time limit reached. Connection terminated.', 'error');
            return { ...prevState, status: ConnectionStatus.DISCONNECTED };
          }

          setDataHistory(prevHistory => [...prevHistory, { time: newTimeElapsed, usage: newDataUsed }]);
          
          return { ...prevState, dataUsed: newDataUsed, timeElapsed: newTimeElapsed };
        });
      }, 5000); // Update every 5 seconds for simulation
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState.status, usageControl.dataCap, usageControl.duration, stopSharing]);

  const renderContent = () => {
    switch (view) {
      case 'ROLE_SELECTION':
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
      case 'CREDENTIALS_SETUP':
        return <CredentialsSetupScreen onSetCredentials={handleSetCredentials} />;
      case 'CREDENTIALS_ENTRY':
        return <CredentialsEntryScreen onVerify={handleVerifyCredentials} error={loginError} />;
      case 'DASHBOARD':
        return (
          <div className="w-full max-w-md mx-auto">
            {userRole === UserRole.PROVIDER ? (
              <ProviderDashboard
                usageControl={usageControl}
                setUsageControl={setUsageControl}
                connectionState={connectionState}
                startSharing={startSharing}
                stopSharing={stopSharing}
                dataHistory={dataHistory}
              />
            ) : (
              <ReceiverDashboard
                connectionState={connectionState}
                usageControl={usageControl}
                onDisconnect={stopSharing}
              />
            )}
          </div>
        );
      default:
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }
  };
  
  const getHeaderButtonText = () => {
      if (view === 'DASHBOARD') return 'Logout';
      if (view === 'CREDENTIALS_SETUP' || view === 'CREDENTIALS_ENTRY') return 'Back';
      return null;
  }
  
  const headerButtonText = getHeaderButtonText();

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
       {notification && <Notification message={notification} type={notificationType} onClose={() => setNotification(null)} />}
      <header className="p-4 flex justify-between items-center bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
            <GlobeIcon className="w-7 h-7 text-brand-accent" />
            <h1 className="text-xl font-bold text-white">RemoteNet Share</h1>
        </div>
        {userRole && headerButtonText && (
          <button onClick={resetSession} className="flex items-center space-x-2 text-brand-text-secondary hover:text-white transition-colors">
            <LogoutIcon className="w-6 h-6" />
            <span className="hidden sm:inline">{headerButtonText}</span>
          </button>
        )}
      </header>
      <main className="p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
