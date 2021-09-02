const express = require("express");
const router = express.Router()
const { produto } = require('../models')
const ProdutoService = require('../services/produtos')
const { body, check, validationResult } = require('express-validator')

const produtoService = new ProdutoService(produto)

router.get('/', async (req, res) => {
  const produtos = await produtoService.get()
  res.status(200).json(produtos)
})

router.post('/', 
  body('nome').not().isEmpty().trim().escape(),
  check('preco')
    .not().isEmpty()
    .matches(/\d/)
    .withMessage('Deve ser um número válido!'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { nome, preco } = req.body
    try {
      await produtoService.adicionar({ nome, preco })
      res.status(201).send('Produto adicionado com sucesso!')
    } catch(erro) {
      res.status(400).send(erro.message)
    }
})

module.exports = router