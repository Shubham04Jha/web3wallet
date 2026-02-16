import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { Onboard } from './components/Onboard';
import { WalletEntryGate } from './components/WalletEntryGate';
import { ToastContainer } from 'react-toastify';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const hasWallet = !!localStorage.getItem('walletStore');
  return (
    <ThemeProvider>
      <WalletProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={hasWallet ? <Navigate to="/wallet" /> : <Navigate to="/get-started" />}
              />
              <Route path='/wallet' element={<WalletEntryGate />} />
              <Route path='/get-started' element={<Onboard />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App;
