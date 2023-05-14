const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const conectarBancoDados = require('../middlewares/conectarBD');
const EsquemaTarefa = require('../models/tarefa');
const authUser = require('../middlewares/authUser');
const router = express.Router();


router.post('/criar', authUser, conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Tarefa']
        let { posicao, título, descricao, status, dataEntrega } = req.body;
        const usuarioCriador = req.usuarioJwt.id;
        const respostaBD = await EsquemaTarefa.create({ posicao, título, descricao, status, dataEntrega, usuarioCriador });

        res.status(200).json({
            status: "OK",
            statusMensagem: "Tarefa criado com sucesso.",
            resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.put('/editar/:id', authUser, conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Tarefa']
        let idTarefa = req.params.id;
        let { posicao, título, descricao, status, dataEntrega } = req.body;
        const usuarioLogado = req.usuarioJwt.id;

        const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
        if (!checkTarefa) {
            throw new Error("Tarefa não encontrada ou pertence a outro usuário");
        }

        const respostaBD = await EsquemaTarefa.updateOne({ _id: idTarefa }, { posicao, titulo, descricao, status, dataEntrega });

        res.status(200).json({
            status: "OK",
            statusMensagem: "Tarefa atualizada com sucesso.",
            resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});




module.exports = router;

