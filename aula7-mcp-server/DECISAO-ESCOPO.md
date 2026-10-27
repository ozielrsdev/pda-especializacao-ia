# Decisão de escopo — `listar_servicos` (RepairHub)

## O projeto

- **Domínio do catálogo (semana 2):** 7 — domínio próprio. [RepairHub](https://github.com/ozielrsdev/repairhub):
  controle de serviços de manutenção de computadores para pequenos comércios.
- **Que dado ou sistema real esse tool vai tocar:** o arquivo `meu-mcp-server/data/servicos.json`,
  com serviços no mesmo formato do RepairHub (cliente, equipamento, problema, diagnóstico,
  serviço realizado, status). O RepairHub ainda guarda os dados só na memória do navegador,
  então esse arquivo faz o papel do banco de dados por enquanto.

## A tool

- **Nome da tool:** `listar_servicos`
- **O que ela recebe (parâmetros):** `status` (opcional) — um dos 4 status do RepairHub:
  `Recebido`, `Em análise`, `Em manutenção`, `Concluído`. Sem status, lista todos.
- **O que ela devolve:** a lista dos serviços (com o status pedido, ou todos), em texto.

## O que ela PRECISA poder fazer

1. Ler o arquivo `data/servicos.json`.
2. Filtrar os serviços por status.

## O que ela NÃO PODE poder fazer

1. Alterar, criar ou apagar serviços. Ela só lê.
2. Ler qualquer arquivo além do `data/servicos.json`.
3. Aceitar um status fora dos 4 que existem.
4. Fazer o agente obedecer instruções escritas dentro dos dados dos clientes (o campo
   "problema" é escrito pelo cliente no balcão — é texto de terceiro, não ordem).

## Como isso é garantido no código

1. **Só leitura:** o server só usa `readFile`. Não existe nenhuma função de escrita no
   código e nenhuma outra tool registrada além de `listar_servicos` (e o `ping`).
2. **Arquivo fixo:** o caminho do `servicos.json` é uma constante calculada a partir da
   pasta do próprio server. Nenhum parâmetro da tool recebe caminho de arquivo — não há
   como pedir outro arquivo.
3. **Status fechado:** o `inputSchema` usa `z.enum` com os 4 status. Qualquer outro valor é
   rejeitado pelo SDK antes de a função rodar.
4. **Instruções nos dados:** **ainda não há garantia no código.** A tool devolve o texto do
   cliente do jeito que está no arquivo. Este é o ponto fraco declarado — e a hipótese do
   ataque.

## Se alguém tentasse enganar o agente pra fazer o que está na lista de "NÃO PODE"

- **O que você acha que aconteceria hoje, antes de qualquer correção?** Os itens 1 a 3
  devem resistir, porque o código não tem como fazer o que eles proíbem. O item 4
  provavelmente falha: se um cliente escrever uma instrução no campo "problema", o agente
  lê esse texto junto com os dados e pode tratar como ordem.
- **Qual sinal mostraria que o ataque funcionou?** A resposta do agente fazer ou dizer algo
  que veio da instrução escondida e não do pedido do usuário — por exemplo, dizer que um
  serviço está concluído quando no arquivo ele está "Recebido", ou tentar chamar outra tool
  ou ler outro arquivo.
