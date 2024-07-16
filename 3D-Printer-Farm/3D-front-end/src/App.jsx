import './App.module.css'
import styles from './App.module.css';
import { PrinterProvider } from './components/Nested/Context/printercontext';
import { Header } from './components/Header/header';
import { PrinterList } from './components/PrinterList/printerList';
import { UploadBox } from './components/UploadBox/uploadbox';
import { Verification } from './components/Verification/verification';

function App() {
  return (
    <PrinterProvider>
      <div className={styles.App}>
        {/*<Navbar />*/}
        <Header />
        <PrinterList />
        <UploadBox />
        {/*<PrinterStatus />*/}
        <Verification />
      </div>
    </PrinterProvider>
    
  )
}

export default App
