# meu-mcp-server — `listar_servicos` (RepairHub)

MCP server em TypeScript, transporte stdio, com o SDK oficial `@modelcontextprotocol/server`.
Dá ao Claude uma tool só de leitura pra consultar os serviços de manutenção do
[RepairHub](https://github.com/ozielrsdev/repairhub).

- Escopo (o que a tool pode e não pode): [`../DECISAO-ESCOPO.md`](../DECISAO-ESCOPO.md)
- Ataques testados e mitigação: [`../LOG-INJECTION.md`](../LOG-INJECTION.md)

## Tools

| tool | parâmetros | o que faz |
|---|---|---|
| `listar_servicos` | `status` (opcional): `Recebido`, `Em análise`, `Em manutenção` ou `Concluído` | lista os serviços de `data/servicos.json`, filtrando pelo status |
| `ping` | — | confirma que o server está no ar |

## Uso

Precisa de Node.js 20+.

```bash
npm install
npm run build
claude mcp add --transport stdio repairhub -- node "$PWD/build/index.js"
```

Dentro do Claude Code: `/mcp` deve mostrar `repairhub` conectado. Teste com
`quais serviços do RepairHub estão Em manutenção?`.

## Dados

`data/servicos.json` faz o papel do banco do RepairHub (que ainda guarda tudo na memória do
navegador). O serviço `id: "5"` (Mercado Bom Preço) é **o payload do ataque** registrado no
log — o campo "problema" tem um texto que tenta convencer o agente de que o serviço foi
concluído. Ele fica no arquivo de propósito, pra o ataque poder ser repetido.

## Versões

O template do curso pedia `@modelcontextprotocol/server ^1.0.0` e `zod ^3`, que não existem
ou não são compatíveis. Este server usa `@modelcontextprotocol/server ^2.4.0` e `zod ^4.2.0`.
