# REVIEW — Aula 1

Revisão do que o agente (Claude Code) fez nos desafios 2 e 3. Branch `entrega-aula1`.

## O que eu pedi

Prompt do desafio 3, exato:

```
Corrija src/fetchUsuario.js, quero que quando a API responda 404 a função tem que dar um erro
que mencione o 404. Quando faltar nome e email na resposta, ela tem q devolver texto vazio e
não quebrar. Quando o ID for inválido tipo -1, ela tem q recusar antes de chamar a api
```

O prompt não dizia "não edite `tests/`" nem "`npm test` tem que passar". O agente seguiu as
duas regras mesmo assim, porque elas estão no `CLAUDE.md`.

Pedidos que vieram depois, um por rodada:

| rodada | o que eu pedi | de onde veio |
|---|---|---|
| 2 | "pode mudar nesses pontos" | o agente apontou 2 decisões em aberto: id em texto e nome que chega como número |
| 3 | "ID não pode ser em texto" | eu rejeitei a interpretação do agente na rodada 2 |
| 4 | "que a pessoa veja q "7" não é um número" | o agente apontou que a mensagem de erro escondia o tipo |
| 5 | "pode corrigir o primeiro e o segundo" | a skill `/explicar` achou corpo vazio e resposta não-JSON |
| 6 | "primeiro arrume o problema" | o agente apontou que uma resposta em lista (`[]`) passava pela checagem |
| 7 | "pode corrigir o trim do email" | a 2ª execução da `/explicar` achou o email sem `.trim()` |

## O que o agente fez

**Ferramentas:** Read (arquivo + teste), Edit, Bash (`npm test`, `node -e` pra testar casos
à mão, `git status`/`git diff`/`git commit`), Write (a skill).

**Voltas do loop:** 1 por rodada — em todas, o `npm test` passou na primeira execução depois
da edição. Nenhuma volta de "falhou → corrige de novo".

**Testes:** 13/13 passando ao final. `tests/` intocado.

**O que mudou em `src/fetchUsuario.js`:**

- valida o `id` antes de chamar a API: só inteiro maior que zero; se vier texto, a mensagem
  mostra `"7" (texto, não número)`
- status fora de 200–299 → erro com o número do status
- resposta que não é JSON → erro em português em vez do `SyntaxError` em inglês
- corpo `null`, texto ou lista → erro em vez de quebrar no `dados.id`
- `nome`/`email` que faltam ou não são texto → `''` (função `textoOuVazio`)
- `email` agora também passa por `.trim()` (bug que já existia no código original)

**Commits:**

- `63e43f4` fix: fetchUsuario trata 404, campos faltando e id inválido (revisado)
- `cb04abb` feat: skill /explicar e fetchUsuario trata corpo vazio e não-JSON (revisado)
- `14b8eed` fix: fetchUsuario tira espaços do email (revisado)

## O que eu aceitei e por quê

Aceitei as mudanças porque faziam sentido para o que eu queria que a função fizesse. Algumas eu entendi olhando o código, e outras precisei ver os exemplos para entender melhor. Também vi que ainda tinham alguns problemas que não apareciam nos testes.

O `textoOuVazio` eu só entendi pelo exemplo da `/explicar`: `textoOuVazio(undefined)` → `''`
mostrou que ele existe pra o `.trim()` não quebrar quando o campo não vem.

## O que eu rejeitei ou mudei e por quê

Não quis aceitar o ID como texto porque a ideia era receber um número mesmo. O "7" entre aspas é um texto, diferente do número 7. Por isso, pedi para a mensagem de erro mostrar essa diferença, para ficar mais fácil entender o motivo de o ID ser inválido.

## Onde ele chutou / alucinou / fez mais do que pedi

Fatos desta sessão:

- **Disse que estava pronto quando não estava.** Depois da rodada 1, os 13 testes passavam e
  o agente reportou a tarefa como feita. A skill `/explicar` achou depois 3 problemas reais
  que nenhum teste cobre: corpo vazio, resposta não-JSON e email sem `.trim()`.
- **Decidiu uma regra que eu não pedi.** Eu dei só `-1` como exemplo de id inválido; o
  agente definiu "inteiro maior que zero" sozinho. Ele avisou, e eu aceitei.
- **Interpretou um pedido vago do jeito dele.** "Pode mudar nesses pontos" virou "aceitar
  id em texto" — e eu não queria isso.
- **Deixou passar um caso na própria correção.** A checagem de corpo vazio (rodada 5) não
  pegava lista (`[]`). O agente mesmo apontou depois, na rodada seguinte.

Isso me mostrou que não dá para confiar só nos testes passando. Eles podem não verificar todos os casos, e alguns problemas acabam passando despercebidos. Por isso, é importante olhar o código e testar outras situações antes de considerar tudo pronto.

## O que eu colocaria no CLAUDE.md pra isso não acontecer de novo

```
- Depois que o `npm test` passar, teste à mão (com `node -e`) os casos que os testes não
  cobrem: campo faltando ou `null`, tipo errado (texto no lugar de número) e resposta
  inesperada da API (corpo vazio, não-JSON, lista). Mostre o resultado de cada um antes de
  dizer que terminou.
```

Foram exatamente esses casos que passaram com os testes verdes nesta sessão e só apareceram
depois, pela `/explicar` ou porque o agente mesmo apontou depois.

## Limitações conhecidas (vistas e deixadas de propósito)

- **Sem testes pros casos novos.** Corpo vazio, não-JSON, lista, id em texto e email com
  espaços estão tratados no código, mas não em `tests/` — que não pode ser editado neste
  exercício. Se alguém mexer no código, o `npm test` não avisa.
- **Sem timeout.** Se a API travar, a função espera pra sempre. Resolver isso muda a forma
  de chamar a função, e nada pediu isso.
- **Falha de rede não é tratada.** Sem internet, o erro do `fetch` sobe em inglês.
- **O `id` devolvido vem da API e não é conferido** com o `id` pedido. O teste exige esse
  comportamento (`{ id: 8 }` vindo da API).

---

## Desafio 2 — skill `/explicar`

Arquivo: `.claude/skills/explicar/SKILL.md`. Explica um arquivo em português simples:
resumo primeiro, depois as partes importantes, com exemplos de valores reais, termos técnicos
explicados e aviso do que parecer suspeito. `allowed-tools: Read, Grep, Glob` — só lê, não
edita e não roda comando.

Por que essa skill: preciso entender o código que o agente escreveu antes de commitar, toda
semana.

**Invocação:**

```bash
claude -p "/explicar src/fetchUsuario.js" > exemplo-explicar.md
```

Rodei antes das rodadas 5, 6 e 7 — por isso o resultado ainda aponta corpo vazio, não-JSON e o
email sem `.trim()`, que foram corrigidos depois por causa dele.

<details>
<summary><b>Resultado</b> (clique pra abrir)</summary>

#### O que `src/fetchUsuario.js` faz

Busca um usuário numa API pelo número dele (`id`) e devolve um objeto limpo com três campos: `{ id, nome, email }`. Antes de chamar a API, confere se o `id` faz sentido. Depois arruma os dados: tira espaços do nome e deixa o email em minúsculas.

#### As partes importantes

**L6: função auxiliar `textoOuVazio`**
Se o valor recebido é texto, devolve o próprio valor. Se não é, devolve `''`. Ela existe para o `.trim()` e o `.toLowerCase()` das linhas 24–25 não quebrarem quando o campo não vier.
Exemplo: `textoOuVazio('Ana')` → `'Ana'`; `textoOuVazio(undefined)` → `''`; `textoOuVazio(123)` → `''`

**L8: assinatura com `fetchFn = fetch`**
A função recebe quem vai fazer a requisição. Se ninguém passar nada, usa o `fetch` de verdade. Os testes passam um `fetch` falso, então nenhuma chamada sai para a internet.
Exemplo: `fetchUsuario(7, fakeFetch(200, {...}))` → usa a resposta fingida e não acessa `api.exemplo.com`

**L9–L12: valida o `id` antes de chamar a API**
Só aceita número inteiro maior que zero. Se o `id` for texto, a mensagem avisa isso explicitamente.
Exemplo: `fetchUsuario(-1)` → erro `id inválido: -1. Use um número inteiro maior que zero.`
Exemplo: `fetchUsuario('7')` → erro `id inválido: "7" (texto, não número). ...`
O teste da linha 29 confirma que, nesses casos, a API nem chega a ser chamada.

**L14–L18: chama a API e trata status de erro**
`resposta.ok` é `true` só para status de 200 a 299. Qualquer outro status lança um erro com o número do status na mensagem.
Exemplo: API responde 404 → erro `Falha ao buscar usuário 999: a API respondeu 404.`

**L20–L26: lê o JSON e normaliza**
Transforma o corpo da resposta em objeto e monta o retorno.
Exemplo: `{ id: 7, nome: '  Iasmim ', email: 'IASMIM@EXEMPLO.COM' }` → `{ id: 7, nome: 'Iasmim', email: 'iasmim@exemplo.com' }`
Exemplo: `{ id: 8 }` → `{ id: 8, nome: '', email: '' }`

#### Termos que apareceram

- **`async` / `await`**: `async` marca uma função que demora (aqui, por causa da rede). `await` espera o resultado antes de seguir para a próxima linha.
- **`typeof`**: devolve o tipo de um valor como texto. `typeof 'Ana'` → `'string'`.
- **Operador ternário (`cond ? a : b`)**: um "se/senão" em uma linha. Na L6: se for string, devolve o valor; se não, devolve `''`.
- **`Number.isInteger`**: diz se o valor é um número inteiro. `Number.isInteger(7)` → `true`; `Number.isInteger(7.5)` → `false`; `Number.isInteger('7')` → `false`.
- **Template string (`` `...${x}` ``)**: texto que aceita variáveis dentro de `${}`.
- **`resposta.ok` / `resposta.status`**: campos da resposta do `fetch`. `status` é o código HTTP (200, 404...). `ok` diz se esse código está entre 200 e 299.
- **`.json()`**: lê o corpo da resposta e o transforma em objeto JavaScript. Também é `async`.
- **`.trim()` / `.toLowerCase()`**: tiram os espaços das pontas / deixam o texto em minúsculas.
- **Injeção de dependência**: em vez de usar `fetch` direto, a função o recebe como parâmetro. É o que permite testar sem internet.

#### ⚠️ O que me pareceu suspeito

- **L25: o email não recebe `.trim()`, só o nome.** `{ email: ' ANA@X.COM ' }` → `' ana@x.com '`, com espaços. Provavelmente isso quebra uma comparação de email mais adiante. Nenhum teste cobre esse caso.
- **L23: o `id` que a API devolve não é conferido.** `fetchUsuario(8)` com a API respondendo `{ nome: 'Ana' }` → `{ id: undefined, nome: 'Ana', email: '' }`. Também passaria em silêncio se a API devolvesse outro id, como `{ id: 9 }`.
- **L20: corpo vazio ou que não é JSON não tem tratamento.** Se a API responder 200 com `null`, a L23 explode com `TypeError: Cannot read properties of null`. Se responder 200 com HTML (uma página de manutenção, por exemplo), o `.json()` lança `SyntaxError`. Os dois erros saem em inglês e não dizem qual usuário falhou. O `CLAUDE.md` pede mensagens de erro em português.
- **L14: falha de rede não tem tratamento.** Sem internet, o `fetch` lança `TypeError: fetch failed`, em inglês e sem contexto. Também não existe timeout: se a API travar, a função espera para sempre.
- **L24–L25: um valor que não é texto vira `''` sem aviso.** `{ nome: 123 }` → `nome: ''`. Ninguém fica sabendo que a API mandou algo estranho. Pode ser uma decisão de propósito, mas vale saber que ela existe.

Os 4 testes atuais cobrem o caminho feliz, o 404, os campos faltando e o id negativo. Nenhum dos itens acima é testado.

</details>

A skill rodou duas vezes no mesmo arquivo e achou coisas diferentes: a 1ª não viu o email
sem `.trim()`; a 2ª viu. Não-determinismo na prática.
