test('GET /assuntos', async () => {
    const axios = require('axios');
    const response = await axios.get('http://localhost:3000/bd/assuntos');
  
    expect(response.data).toBeTruthy();
    expect(response.data.length).toBeTruthy();
  });