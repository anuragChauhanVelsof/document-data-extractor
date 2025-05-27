import { MantineProvider, createTheme } from '@mantine/core';
import { DocumentProcessor } from './components/DocumentProcessor';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <DocumentProcessor />
      </div>
    </MantineProvider>
  );
}

export default App; 