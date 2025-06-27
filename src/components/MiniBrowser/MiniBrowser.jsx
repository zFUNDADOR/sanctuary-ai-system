import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';

export default function MiniBrowser() {
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    try {
      const res = await axios.get('/simulate', {
        params: { url }
      });
      setResult(res.data);
      // TODO: substituir por lógica real de exibição
    } catch (e) {
      console.error(e);
      setResult({ error: 'Falha na simulação' });
    }
  };

  return (
    <Box>
      <TextField
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <Box sx={{ my: 2 }}>
        <iframe
          title="Mini Browser"
          src={url}
          style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
        />
      </Box>
      <Button variant="contained" onClick={handleSimulate}>
        Simular análise
      </Button>
      <pre>
        {result && JSON.stringify(result, null, 2)}
        {/* TODO: estilizar resultado mock */}
      </pre>
    </Box>
  );
}