test('GET /alunos', async () => {
    const axios = require('axios');
    const response = await axios.get('http://localhost:3000/bd/alunos');
  
    expect(response.data).toBeTruthy();
    expect(response.data.length).toBeTruthy();
  });