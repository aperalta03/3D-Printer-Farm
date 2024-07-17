import './App.module.css'
import styles from './App.module.css';
import { PrinterProvider } from './components/Nested/Context/printercontext';
import { Header } from './components/Header/header';
import { PrinterList } from './components/PrinterList/printerList';
import { UploadBox } from './components/UploadBox/uploadbox';
import { Verification } from './components/Verification/verification';

import { Routes, Route } from 'react-router-dom';
import { SignIn } from './components/SignIn/signin';
import { ProtectedRoute } from './components/ProtectedRoute/protectedroute';

function App() {
  return (
    <PrinterProvider>
      <div className={styles.App}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className={styles.App}>
                  <Header />
                  <PrinterList />
                  <UploadBox />
                  <Verification />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </PrinterProvider>
  )
}

export default App
