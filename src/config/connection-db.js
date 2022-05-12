const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://ufwbvarinwizsi:089accc806d8be67acd80a3f1386fdf8484f9476f1346f7f0694dd13617ca48c@ec2-52-54-212-232.compute-1.amazonaws.com:5432/dbhb75amiprlnh',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("ERRO!!! NAO FOI POSSIVEL CONECTAR NO BANCO");
        console.log( { err });
    } else {
        console.log("BANCO CONECTADO COM SUCESSO");
    }
});

module.exports = {
    dbcon
}