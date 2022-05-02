const con = require('./conexao');

const obterAssuntos = async (req, res) => {
    const resultado = await con.query('select * from assunto');
    return resultado;
}

module.exports = {obterAssuntos}