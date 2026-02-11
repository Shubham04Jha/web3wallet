import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { Onboard } from './components/Onboard';
import { WalletEntryGate } from './components/WalletEntryGate';

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/wallet' element={<WalletEntryGate/>}/>
            <Route path='/get-started' element={<Onboard/>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App;
