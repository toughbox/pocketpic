import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Gallery } from './pages/Gallery';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Gallery />
    </ThemeProvider>
  );
}

export default App;
