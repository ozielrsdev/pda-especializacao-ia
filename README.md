# pda-especializacao-ia

Material da **Especialização em Desenvolvimento com IA** — Programadores do Amanhã.

Um repo, uma pasta por aula. Cada pasta é autocontida (tem o próprio README, guia do
aluno e entregável) — clone o repo inteiro, mas trabalhe aula por aula.

A numeração é **por aula**, não por semana: cada semana tem duas aulas de 2h.
Semana N = aulas 2N-1 e 2N. A pasta leva o número da primeira aula da semana.

## Aulas

| pasta | semana | aula 1 (conceito + demo) | aula 2 (laboratório) |
|---|---|---|---|
| [`aula1-fundamentos/`](./aula1-fundamentos) | 1 | Fundamentos: o que é isso que a gente chama de IA | — |
| [`aula3-prompts-contexto-projeto/`](./aula3-prompts-contexto-projeto) | 2 | Prompt, contexto e o nascimento do projeto | lab guiado paralelo |
| [`aula5-agents-md-skills/`](./aula5-agents-md-skills) | 3 | AGENTS.md e skills | lab guiado paralelo |
| [`aula7-mcp-server/`](./aula7-mcp-server) | 4 | MCP na prática: seu próprio server | red team em duplas |
| [`aula9-engenharia-para-ia/`](./aula9-engenharia-para-ia) | 5 | Engenharia de software para desenvolvimento com IA | modelagem coletiva no Excalidraw |
| [`aula11-diagnostico-documentos-rpi/`](./aula11-diagnostico-documentos-rpi) | 6 | Diagnóstico, documentos e RPI | modelagem coletiva no Excalidraw |
| [`aula13-spec-driven-development/`](./aula13-spec-driven-development) | 7 | Spec-Driven Development | clínica rotativa |
| [`aula15-verificadores/`](./aula15-verificadores) | 8 | Verificadores | clínica rotativa |
| [`aula17-code-review-subagentes/`](./aula17-code-review-subagentes) | 9 | Code review e subagentes de revisão | red team em duplas |
| [`aula19-orquestracao-mcp-client/`](./aula19-orquestracao-mcp-client) | 10 | Orquestração, paralelismo e o MCP client próprio | speedrun cronometrado |
| [`aula21-software-com-llm-dentro/`](./aula21-software-com-llm-dentro) | 11 | Software com LLM dentro + AIOps | clínica + demo relâmpago |
| [`aula23-agentes-automacao/`](./aula23-agentes-automacao) | 12 | Agentes e automação: n8n e Google ADK | clínica + demo relâmpago |
| [`aula25-rag/`](./aula25-rag) | 13 | RAG | lab guiado paralelo |
| [`aula27-buffer-demo-day/`](./aula27-buffer-demo-day) | 14 | Buffer, finalização e Demo Day | Demo Day |

As 14 semanas estão completas. O estado consolidado, as decisões fixadas e as pendências
estão em [`_orquestracao/_ESTADO.md`](./_orquestracao/_ESTADO.md).

## Como usar

1. **Fork** este repositório na sua conta.
2. Clone o seu fork:

   ```bash
   git clone https://github.com/<seu-usuario>/pda-especializacao-ia.git
   cd pda-especializacao-ia
   ```
3. Entre na pasta da aula do dia e siga o `README.md` dela.

A partir da semana 2 você também tem um **repositório próprio**, fora deste fork: é onde
o seu projeto vive e cresce até o Demo Day. Este repo aqui guarda o material das aulas;
o seu guarda o que você constrói.

## Entregas

Formulário único, todas as semanas: <https://forms.gle/PSd6i65g44GwBMgq6>
Prazo: antes da aula 1 da semana seguinte.

## Regra da casa

> **Você é responsável por cada linha que commita.**
> O agente executa. Você especifica, lê o diff, roda os testes e decide.
