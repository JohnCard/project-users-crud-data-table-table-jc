import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {CssBaseline} from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SnackbarProvider } from 'notistack';
import { DataTableExample } from './components/DataTableExample.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        >
          <CssBaseline/>
          <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/data-table' element={<DataTableExample/>} />
          </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
)
