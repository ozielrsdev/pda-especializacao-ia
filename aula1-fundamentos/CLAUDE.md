# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Campo de treino da Aula 1 (Fundamentos) da Especialização em IA da PDA.
Projeto Node pequeno com funções utilitárias em `src/` e testes em `tests/`.

## Stack

- Node.js 18+ (`package.json` exige `>=18`; confirme com `node -v`)
- ESM: `package.json` tem `"type": "module"` — use `import`/`export`, nunca `require`
- Test runner: `node:test`, o runner nativo do Node (sem Jest/Mocha)

## Comandos

- `npm test` — roda todos os testes uma vez
- `npm run test:watch` — roda os testes em modo watch

## Regras

- Os arquivos em `tests/` são a especificação. **Nunca edite testes** pra fazê-los passar.
- Sempre rode `npm test` antes de dizer que uma tarefa terminou. Reporte o resultado real dos
  testes, não assuma que o código está certo só porque parece certo.
- `const` em vez de `let`; nunca `==`/`!=` (sempre `===`/`!==`); mensagens de erro voltadas ao
  usuário em português.

## Como eu quero trabalhar com você

- Antes de editar, explique em 1–2 frases o que vai mudar e por quê.
- Mudanças pequenas e focadas. Uma tarefa por vez.
- Se não tiver certeza sobre uma API ou lib, consulte a documentação (MCP context7) em vez de chutar.
- Ao terminar, diga só o que mudou e o que falta — sem resumos longos.
