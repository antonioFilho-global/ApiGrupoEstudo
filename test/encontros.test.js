test('GET /encontros', async () => {
    const axios = require('axios');
    const response = await axios.get('http://localhost:3000/bd/encontros');
  
    expect(response.data).toBeTruthy();
    expect(response.data.length).toBeTruthy();
  });