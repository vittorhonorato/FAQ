const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
const  where  = require('sequelize');

connection
    .authenticate()
    .then(() => {
        console.log('Banco de dados conectados com sucesso');
    })
    .catch((erro) => {
        console.log(erro);
    })


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render('index', {
            perguntas,
        })

    });

});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
})

app.post('/salvarpergunta', (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;

    Pergunta.create({
        titulo,
        descricao,
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/pergunta/:id', (req, res) => {
    const id = req.params.id;

    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta,
                    respostas,
                });
            })



        } else {
            res.redirect('/')
        }
    })

});

app.post('/responder', (req, res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;

    Resposta.create({
        corpo,
        perguntaId,
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId);
    })
});


app.listen(8080, () => {
    console.log('Servidor rodando');
});

