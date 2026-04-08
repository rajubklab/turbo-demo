import { createMcpHandler } from "mcp-handler"
import { todoRepository } from "@repo/db"
import z from "zod"

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_todos",
      { description: "get all the todos", title: "Get todos" },
      async () => {
        let data = ""
        try {
          data = JSON.stringify(await todoRepository.getAllTodos())
        } catch (error) {}
        return {
          content: [{ text: data, type: "text" }],
        }
      }
    )

    server.registerTool(
      "add_todo",
      {
        title: "add a todo",
        description: "add a todo to todo list",
        inputSchema: z.object({ text: z.string() }),
      },
      async ({ text }) => {
        await todoRepository.addTodo(text)
        return {
          content: [{ text: "added new todo to list", type: "text" }],
        }
      }
    )

    server.registerTool(
      "delete_todo",
      {
        title: "delete todo",
        description: "delete a provided id from the todo list",
        inputSchema: z.object({ id: z.string() }),
      },
      async ({ id }) => {
        const deletedCount = await todoRepository.deleteTodo(id)
        return {
          content: [
            {
              text:
                deletedCount > 0
                  ? `deleted ${deletedCount} todo(s) with id: ${id}`
                  : `no todo found for id: ${id}`,
              type: "text",
            },
          ],
        }
      }
    )
  },
  { capabilities: { tools: {} } },
  { basePath: "/", redisUrl: "http://localhost:6379" }
)

export { handler as GET, handler as POST, handler as DELETE }
