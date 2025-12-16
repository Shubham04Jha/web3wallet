import './App.css'
import { Layout } from './components/Layout'
import { DropDownMenu } from './components/ui/DropDown'
import { WalletsDashBoard } from './components/WalletsDashBoard';

function App() {
  const mnemonics = "hen army message club pipe believe keep marble legal market maximum hidden";
  const items = mnemonics.split(" ");
  return (
    <>
      <Layout>
        <DropDownMenu items={items} text={"Secret Mnemonics"}/>
        <WalletsDashBoard text='Solana Wallet'/>
      </Layout>
    </>
  )
}

export default App
