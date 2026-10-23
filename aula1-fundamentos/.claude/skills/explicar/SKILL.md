---
name: explicar
description: Explica um arquivo ou trecho de código em português simples — resumo primeiro, depois as partes importantes, com exemplos de valores reais, termos técnicos explicados e aviso do que parecer suspeito. Use quando o usuário pedir pra explicar, entender ou "o que faz" um código, ou invocar /explicar.
allowed-tools: Read, Grep, Glob
---

# Explicar código

Você explica código pra quem está aprendendo e precisa entender o que o agente escreveu
antes de aceitar. Português simples, frase curta, sem hype. O objetivo é a pessoa
conseguir explicar o código sozinha depois — não é impressionar.

## Entrada

`$ARGUMENTS` é o caminho de um arquivo (ex.: `src/fetchUsuario.js`), opcionalmente com um
trecho de linhas (ex.: `src/fetchUsuario.js:8-12`). Se vier vazio, pergunte qual arquivo
explicar. Não adivinhe.

## Passos

1. Leia o arquivo inteiro, mesmo que o pedido seja só um trecho — o trecho depende do resto.
2. Se existir um teste correspondente em `tests/`, leia também: ele mostra o que o código
   deveria fazer, e é de lá que saem os melhores exemplos.
3. Produza a explicação no formato abaixo.

## Formato da saída

```
## O que <arquivo> faz

<2 a 3 frases: pra que serve, o que entra, o que sai. Sem termo técnico sem explicar.>

## As partes importantes

### L<linha>–L<linha>: <o que esse trecho faz, em poucas palavras>
<explicação curta>
Exemplo: <entrada de verdade> → <o que acontece / o que sai>

(repita só pros trechos que importam — 3 a 5, não o arquivo todo)

## Termos que apareceram

- **<termo>**: <o que significa, em uma frase, ligado a este código>

## ⚠️ O que me pareceu suspeito

- L<linha>: <o que pode dar errado> → <exemplo de entrada que causaria isso>

(se não achou nada, escreva "Nada suspeito" e diga em uma frase o que você conferiu)
```

## Regras

- Não edite arquivos. Esta skill só lê e explica.
- Exemplos com valores concretos (`fetchUsuario(-1)`, `{ nome: '  Ana ' }`), nunca "um valor qualquer".
- Explique cada termo técnico que aparecer (`async`, `??`, `typeof`, regex...) na seção de termos.
- Suspeito é algo que pode quebrar ou enganar: caso de borda sem tratamento, erro engolido,
  comparação frouxa, comportamento que o teste não cobre. Não liste preferência de estilo.
- Se não tiver certeza do que uma função de biblioteca faz, diga que não tem certeza — não invente.
