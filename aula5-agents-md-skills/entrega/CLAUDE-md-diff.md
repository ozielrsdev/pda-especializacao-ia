# Regra nova no CLAUDE.md — teste antes/depois

Projeto: [RepairHub](https://github.com/ozielrsdev/repairhub)

## O erro real

O agente criou a regra "só pode marcar Concluído com o serviço realizado preenchido", com
testes, e disse que tinha terminado. Os testes passavam. Mas a tela não tinha onde escrever
o serviço realizado depois do cadastro: todo serviço cadastrado sem ele ficava travado e
nunca podia ser concluído. Eu só descobri usando o sistema no navegador.

Os testes passavam porque testavam cada regra sozinha, não o caminho que o técnico faz.

## A regra

```diff
+ - Antes de dizer que terminou, teste o fluxo completo do usuário, não só cada regra
+   sozinha: cadastrar → avançar o status → registrar o serviço realizado → concluir. Se
+   mudar uma regra, confira se a tela ainda deixa fazer esse caminho inteiro.
```

## O teste

Mesma tarefa, duas sessões novas do Claude Code (`claude -p`), cada uma numa cópia do
projeto. A única diferença entre as cópias era essa regra no `CLAUDE.md`.

Tarefa (a mesma armadilha do erro real — hoje não existe campo de diagnóstico na tela):

```
Crie uma regra: um serviço só pode ir para "Em manutenção" se tiver um diagnóstico
preenchido. Escreva os testes.
```

## Resultado

| | sem a regra | com a regra |
|---|---|---|
| Percebeu que falta o campo na tela | sim | sim |
| Ofereceu fazer "só a regra e os testes, a tela depois" | sim (opção B) | não — disse que o fluxo trava sem a tela |
| Citou o fluxo completo (cadastrar → avançar → registrar → concluir) | não | sim |
| Planejou um teste do fluxo completo | não | sim |
| Incluiu testar o fluxo na tela na verificação final | não (só test, build e lint) | sim |

**O que mudou:** a regra não mudou o comportamento principal — as duas sessões perceberam
que a tela precisava de um campo novo. Mudou o secundário: com a regra, o agente não oferece
deixar a tela pra depois, planeja um teste do caminho inteiro e confere na tela antes de
dizer que terminou.

**Por que o erro principal não se repetiu sem a regra:** o projeto mudou desde o erro. Hoje o
card já tem o campo "serviço realizado", que serve de exemplo, e o `CLAUDE.md` tem outra
regra ("se um pedido entrar em conflito com uma regra existente, avise e dê opções"). Nenhuma
das duas coisas existia quando o erro aconteceu.

**Limite do teste:** uma rodada de cada versão. Por causa do não-determinismo, a sessão sem a
regra poderia esquecer a tela em outra tentativa.

## Decisão

Mantive a regra. Ela mudou o comportamento do agente — não no ponto principal, mas em três
coisas que evitam o mesmo tipo de erro: não deixar a tela pra depois, testar o caminho
inteiro e conferir na tela antes de dizer que terminou.

---

<details>
<summary><b>Resposta completa — sem a regra</b></summary>

Li o código e os testes. Pelas regras do projeto, mostro o plano antes de mexer em qualquer arquivo. Antes, há dois pontos que você precisa decidir.

## O que precisa de decisão

**1. Não existe campo "diagnóstico" hoje.** O `Service` em `src/types.ts` só tem `client`, `equipment`, `problem`, `serviceDone` e `status`. Hoje o diagnóstico acaba indo no "serviço realizado": um teste existente usa `'Diagnóstico: fonte queimada'` como `serviceDone` (`tests/services.test.ts:114`). As opções são:

- **A) Criar um campo novo `diagnosis` (recomendo).** Diagnóstico ("fonte queimada") e serviço realizado ("troca da fonte") são coisas diferentes.
- **B) Usar o `serviceDone` como diagnóstico.** Isso entra em conflito com a regra atual: salvar o serviço realizado em "Em manutenção" já conclui o serviço. O mesmo texto serviria para entrar em manutenção e para concluir, o que não faz sentido.

**2. A tela precisa de um lugar para preencher o diagnóstico.** Se só a regra for criada, o técnico tenta mudar para "Em manutenção" na tela, recebe o erro e não tem onde preencher o diagnóstico. Então:

- **A) Incluir também o campo na tela (recomendo).** Fica uma caixa "Diagnóstico" com botão de salvar no card do serviço, do mesmo jeito que o "Serviço realizado".
- **B) Fazer só a regra e os testes agora** e deixar a tela para outro pedido.

## Plano (com as opções que recomendo)

Vou seguir a skill `tdd`: primeiro o teste falhando, depois o código.

1. **`tests/services.test.ts`**: só acrescento testes, nenhum existente muda:
   - dá erro ao ir de "Em análise" para "Em manutenção" sem diagnóstico;
   - diagnóstico só com espaços conta como vazio;
   - vai para "Em manutenção" quando o diagnóstico está preenchido;
   - o cadastro começa com diagnóstico vazio, sem ser obrigatório;
   - `updateDiagnosis` salva o diagnóstico sem mudar o status;
   - dá erro ao apagar o diagnóstico de um serviço que já está "Em manutenção" ou "Concluído", para a regra não ser contornada.
2. **`src/types.ts`**: adiciono `diagnosis: string` ao `Service`.
3. **`src/services.ts`**:
   - `diagnosis` no cadastro, opcional, com valor padrão `''`;
   - em `changeStatus`, ao ir para "Em manutenção" sem diagnóstico, o erro será **"Preencha o diagnóstico antes de colocar o serviço Em manutenção"**;
   - nova função `updateDiagnosis`.
4. **Tela**: campo "Diagnóstico" em `ServiceList.tsx`, ligado no `App.tsx`.
5. Rodo `npm test`, `npm run build` e `npm run lint` e mostro o resultado.

Não preciso instalar nenhuma dependência.

Posso seguir com **1A + 2A**? Se preferir outra combinação, ou se quiser outro texto para a mensagem de erro, me diga.

</details>

<details>
<summary><b>Resposta completa — com a regra</b></summary>

Li o código e os testes. Pelo CLAUDE.md, preciso mostrar o plano e esperar sua confirmação antes de mexer em arquivos. Antes do plano, há dois pontos a decidir.

## O que encontrei

1. **Não existe campo de diagnóstico.** O `Service` em `src/types.ts:3` tem só `client`, `equipment`, `problem`, `serviceDone` e `status`. Hoje o diagnóstico acaba sendo escrito no "serviço realizado". Um teste já faz isso: `updateServiceDone(servicoEm('Em análise'), 'Diagnóstico: fonte queimada')` em `tests/services.test.ts:114`.
2. **Usar o "serviço realizado" como diagnóstico entra em conflito com uma regra que já existe.** Quando o serviço está Em manutenção, salvar o serviço realizado já conclui o serviço (`src/services.ts:58`). Se o mesmo campo fosse o diagnóstico, todo serviço chegaria em Em manutenção já com o texto preenchido e não daria mais para registrar o que foi feito de fato. Por isso proponho um **campo novo, `diagnosis`**.
3. **Sem campo na tela, o fluxo trava.** Se eu só criar a regra, não dá mais para passar de Em análise para Em manutenção, e o caminho cadastrar → avançar → registrar → concluir para de funcionar. Então a tela precisa de um campo de diagnóstico.
4. Nenhum teste atual quebra: os que usam "Em manutenção" já criam o serviço direto nesse status, sem chamar `changeStatus` para chegar lá.

## Plano (TDD: primeiro os testes, depois o código)

**Testes novos** em `tests/services.test.ts`, num bloco `d) Em manutenção exige diagnóstico`. Não altero nenhum teste existente.
- Em análise → Em manutenção sem diagnóstico dá erro "Preencha o diagnóstico antes de passar para Em manutenção".
- Diagnóstico só com espaços conta como vazio.
- Com diagnóstico preenchido, avança para Em manutenção.
- O cadastro cria o serviço com diagnóstico vazio.
- `updateDiagnosis` registra o diagnóstico sem mudar o status.
- Apagar o diagnóstico de um serviço Em manutenção ou Concluído dá erro (segue a mesma lógica do serviço realizado).
- O fluxo completo nas regras: cadastrar → Em análise → registrar diagnóstico → Em manutenção → salvar serviço realizado → Concluído.

**Código:**
- `src/types.ts`: incluir `diagnosis: string` no `Service`.
- `src/services.ts`:
  - `createService` passa a começar com `diagnosis: ''`.
  - `changeStatus` passa a recusar a entrada em Em manutenção sem diagnóstico.
  - Nova função `updateDiagnosis`.
- `src/App.tsx`: novo handler `handleDiagnosisChange`.
- `src/components/ServiceList.tsx`: campo "Diagnóstico" com botão Salvar no card, no mesmo modelo do campo de serviço realizado.

**Verificação:** `npm test`, `npm run build`, `npm run lint` e o fluxo completo testado na tela. Nenhuma dependência nova.

## Preciso que você decida

- **A.** Posso seguir com o campo novo `diagnosis`? A alternativa seria reaproveitar o "serviço realizado", mas por causa do conflito do item 2 eu não recomendo.
- **B.** Bloquear que o diagnóstico seja apagado quando o serviço está Em manutenção ou Concluído? Eu recomendo que sim.
- **C.** O diagnóstico fica só no card, ou também entra como campo opcional no formulário de cadastro? Eu recomendo só no card, porque o diagnóstico vem depois da análise.

Se concordar com as recomendações, é só responder "ok" e eu começo pelos testes.

</details>
