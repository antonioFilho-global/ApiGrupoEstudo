const con = require('./conexao');

const obterEncontros = async (req, res) => {
    const resultado = await con.query('select * from encontros');
    return resultado;
}

module.exports = {obterEncontros}