import path, { dirname } from "node:path"
import { existsSync, mkdirSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const __FILENAME = fileURLToPath(import.meta.url)
const __DIRNAME = dirname(__FILENAME)

const DATA_DIR = path.join(__DIRNAME, "data")
console.log("DATA_DIR", DATA_DIR)
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}
const DB_PATH = path.join(DATA_DIR, "todos.json")

export const todoRepository = {
  getAllTodos: async () => {
    const todos = existsSync(DB_PATH)
      ? JSON.parse(await readFile(DB_PATH, { encoding: "utf-8" }))
      : []
    return todos
  },
  addTodo: async (text) => {
    const todos = await todoRepository.getAllTodos()
    todos.push({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    })
    await writeFile(DB_PATH, JSON.stringify(todos, null, 2))
  },
  deleteTodo: async (id) => {
    const todos = await todoRepository.getAllTodos()
    const matches = (todos ?? []).filter(
      (t) => t.id === id || t.id.startsWith(id)
    )
    if (matches.length === 0) {
      return 0
    }
    const newTodos = (todos ?? []).filter(
      (t) => t.id !== id && !t.id.startsWith(id)
    )
    await writeFile(DB_PATH, JSON.stringify(newTodos, null, 2))
    return matches.length
  },
}
