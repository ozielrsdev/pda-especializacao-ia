# Progressive disclosure — medição com /context

Skill: `nova-regra` ([repairhub/.claude/skills/nova-regra](https://github.com/ozielrsdev/repairhub/tree/main/.claude/skills/nova-regra))

## Os números

| momento | total da sessão | categoria **Skills** |
|---|---|---|
| antes de invocar | 34,7k / 1M (3%) | 9,9k |
| depois de invocar `/nova-regra` (no plano) | 77,5k / 1M (8%) | 9,9k |

Tamanho dos arquivos da skill: `SKILL.md` ~665 tokens + `reference.md` ~975 tokens = ~1.600.

## O que os números mostram

- **A categoria Skills não mudou (9,9k → 9,9k).** Ela é o que fica carregado em toda
  sessão: só o nome e a `description` de cada skill. Invocar a skill não aumenta essa parte.
- **O conteúdo da skill (~1.600 tokens) entrou na conversa só nesta sessão**, porque ela foi
  usada. Se esse conteúdo estivesse no `CLAUDE.md`, custaria ~1.600 tokens em toda sessão.
- **O total subiu 42,8k, mas quase tudo é o agente lendo o projeto** (`services.ts`, testes,
  componentes) e escrevendo o plano. Só ~1.600 disso é a skill — o total não isola o efeito
  da progressive disclosure; a linha Skills isola.

## Por que o reference.md é separado

O `SKILL.md` tem o roteiro curto (quando dispara e os 7 passos). O `reference.md` tem o que
só importa no meio do trabalho: padrão das mensagens de erro, onde fica cada coisa, os 5
testes que toda regra precisa, o checklist da tela e um exemplo completo.

## A skill numa tarefa real

Invocada com `/nova-regra um serviço só pode ir para "Em manutenção" se tiver um diagnóstico
preenchido`. Resultado no repairhub (commit `ab2d60a`): campo "Diagnóstico" no card, 9 testes
novos (incluindo o fluxo completo), nenhum teste existente alterado, 27/27 passando, build e
lint ok.

## Achado extra

Os 9,9k da categoria Skills não são só do RepairHub: a maior parte vem de skills instaladas
no Claude Code de forma global (plugins), que entram em toda sessão de qualquer projeto. Foi
por isso que, das 20 skills do repositório Desafio_NFT, instalei só as 2 que o projeto usa.
