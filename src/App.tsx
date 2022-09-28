import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/customScrollbar.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppLayout, AuthLayout } from './layouts';
import { Home, Board, Login, Register } from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="boards" element={<Home />} />
            <Route path="boards/:boardId" element={<Board />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
