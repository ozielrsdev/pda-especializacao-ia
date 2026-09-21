# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este repositório

Material didático da **Especialização em Desenvolvimento com IA** da Programadores do
Amanhã (PDA) — curso de 14 semanas, em português. Não é um único software com build/test
unificado: é uma coleção de pastas de aula, cada uma autocontida, e dentro de algumas
delas há mini-projetos de código que servem de laboratório para os alunos.

Ponto de entrada para navegação: `README.md`. Estado consolidado da produção das semanas
2–14 e decisões fixadas: `_orquestracao/_ESTADO.md`.

## Estrutura

- `aulaN-<slug>/` — uma pasta por **semana** (não por aula individual). A numeração usa o
  número da primeira aula da semana (semana N = aulas 2N-1 e 2N), então as pastas pulam de
  2 em 2: `aula1-`, `aula3-`, `aula5-`, ... `aula27-`.
- Dentro de cada pasta de semana, arquivos para o **aluno**: `README.md` (roteiro público),
  `GUIA-DO-ALUNO.md` (passo a passo do lab), `ENTREGAVEL.md` (o que precisa ser entregue).
- Arquivos para a **facilitadora** (Iasmim): `SLIDES-OUTLINE.md`, `REFERENCIAS.md`,
  `PACOTE.md` (mapeamento Alura, cortes, cobertura de domínios). `ROTEIRO-FACILITADORA.md`
  também existe nessas pastas mas é ignorado pelo git (`.gitignore`) — não vai para o fork
  dos alunos.
- `starter/` dentro de cada semana — o código-base do laboratório daquela semana, quando
  houver. Cada `starter/` (ou subpasta dele) é um **projeto independente**, com seu próprio
  `package.json`/`requirements.txt`, stack e comandos. Não há build/lint/test na raiz do
  repositório — entre na pasta do laboratório específico e use os comandos do `README.md`
  ou `package.json` dali.
- `excalidraw/` — boards `.excalidraw` (JSON) usados nas semanas com modelagem coletiva
  (semanas 5, 6 e 10). Formato descrito em `_orquestracao/_EXCALIDRAW.md`; valide um board
  com `python3 -c "import json;json.load(open('caminho.excalidraw'))"`.
- `_orquestracao/` — os briefs usados para gerar o conteúdo das semanas 2–14
  (`_BRIEF.md`, `_ESTADO.md`, `_GANCHOS.md`, `_AULA1-REFERENCIA.md`, `_EXCALIDRAW.md`).
  Consulte esses arquivos ao editar ou regenerar o conteúdo de uma aula — eles fixam a voz,
  o formato exigido e as decisões já tomadas (não renegociáveis) sobre cada semana.

## Stacks dos laboratórios (por pasta, não global)

Não assuma Node em todo lugar — confira o `package.json`/`requirements.txt` da pasta antes
de rodar algo:

- `aula1-fundamentos/` — Node 18+, ESM (`"type": "module"`), testes com `node:test` nativo
  (`npm test`, `npm run test:watch`). Tem seu próprio `CLAUDE.md` e uma skill
  (`.claude/skills/revisar-codigo`) que só se aplica dentro dela.
- `aula7-mcp-server/starter/mcp-server-template/` e
  `aula19-orquestracao-mcp-client/starter/mcp-client-starter/` — TypeScript + SDK do MCP
  (`npm run build`, `npm run dev`).
- `aula15-verificadores/starter/demo-sem-verificador/` — TypeScript, `npm run typecheck`,
  `npm run build`, `npm test` (roda o build compilado, não os `.ts` diretamente).
- `aula21-software-com-llm-dentro/starter/` — Node 20+, `@anthropic-ai/sdk`. `npm test`,
  `npm run evals`, `npm run checar-chave` (valida `ANTHROPIC_API_KEY` antes de gastar
  tokens). Primeira pasta do curso que usa API key de verdade — sempre tem
  `CHECKLIST-SEGREDOS.md` e `.env.example`.
- `aula25-rag/starter/` — Node 20+, zero dependências de npm (usa `fetch` nativo).
  `npm test`, `npm run ingerir`, `npm run perguntar`, `npm run comparar-chunking`,
  `npm run eval-retrieval`.
- `aula23-agentes-automacao/starter/adk/` — Python 3.10+, `google-adk` (`pip install -r
  requirements.txt`). Único ponto do curso que sai de Node.

## Convenções ao editar conteúdo de aula

- Tudo é em **português do Brasil**, voz direta e anti-hype (ver `_orquestracao/_BRIEF.md`
  seção 4) — sem "é importante notar", sem entusiasmo performático, frase curta, e sempre
  que uma técnica tem custo ou limite, diga o custo.
- Links em `REFERENCIAS.md` precisam ser reais e verificados (abertos com WebFetch, não
  compostos por analogia). Link inventado é motivo de rejeição do pacote inteiro — ver
  `_orquestracao/_BRIEF.md` seção 3.
- Não crie `ATIVIDADE.md`. Não versione `package-lock.json` nos `starter/` (ver `.gitignore`
  e os exemplos existentes).
- Datas nunca são absolutas dentro do material do aluno: prazos são sempre "antes da aula 1
  da semana N+1". O formulário de entrega é único para todas as semanas (link em
  `README.md` e em cada `ENTREGAVEL.md`).

## Regra da casa (vale para qualquer trabalho neste repo)

> Você é responsável por cada linha que commita. O agente executa. Você especifica, lê o
> diff, roda os testes e decide.
