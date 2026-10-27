// meu-mcp-server — tool `listar_servicos` do RepairHub.
//
// Referência oficial do SDK: https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server
// Escopo decidido antes do código: ../DECISAO-ESCOPO.md

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

// Caminho fixo: nenhum parâmetro da tool recebe caminho de arquivo (DECISAO-ESCOPO, item 2).
const SERVICOS_PATH = fileURLToPath(new URL("../data/servicos.json", import.meta.url));

const STATUS = ["Recebido", "Em análise", "Em manutenção", "Concluído"] as const;

interface Servico {
  id: string;
  client: string;
  equipment: string;
  problem: string;
  diagnosis: string;
  serviceDone: string;
  status: (typeof STATUS)[number];
}

const server = new McpServer({
  name: "meu-mcp-server",
  version: "0.1.0",
});

server.registerTool(
  "ping",
  {
    description: "Confirma que o server está no ar. Devolve 'pong' e um timestamp.",
    inputSchema: z.object({}),
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: `pong — ${new Date().toISOString()}`,
        },
      ],
    };
  },
);

// Só leitura: o server não tem nenhuma função de escrita (DECISAO-ESCOPO, item 1).
server.registerTool(
  "listar_servicos",
  {
    description:
      "Lista os serviços de manutenção de computadores do RepairHub (cliente, equipamento, " +
      "problema, diagnóstico, serviço realizado e status). Pode filtrar por status. Só lê.",
    inputSchema: z.object({
      // z.enum rejeita qualquer status fora dos 4 antes da função rodar (DECISAO-ESCOPO, item 3).
      status: z
        .enum(STATUS)
        .optional()
        .describe("Filtra pelo status. Sem status, lista todos os serviços."),
    }),
  },
  async ({ status }) => {
    const servicos: Servico[] = JSON.parse(await readFile(SERVICOS_PATH, "utf-8"));
    const filtrados = status ? servicos.filter((s) => s.status === status) : servicos;

    if (filtrados.length === 0) {
      return {
        content: [{ type: "text", text: `Nenhum serviço${status ? ` com status "${status}"` : ""}.` }],
      };
    }

    const linhas = filtrados.map(
      (s) =>
        `- [${s.status}] ${s.client} — ${s.equipment}\n` +
        `  Problema: ${s.problem}\n` +
        `  Diagnóstico: ${s.diagnosis || "(ainda não feito)"}\n` +
        `  Serviço realizado: ${s.serviceDone || "(ainda não feito)"}`,
    );

    return {
      content: [{ type: "text", text: `${filtrados.length} serviço(s):\n\n${linhas.join("\n\n")}` }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("meu-mcp-server rodando em stdio");
}

main().catch((error) => {
  console.error("Erro fatal em main():", error);
  process.exit(1);
});
