import { NextRequest, NextResponse } from "next/server"
import { todoRepository } from "@repo/db"

export const GET = async () => {
  const todos = await todoRepository.getAllTodos()
  return NextResponse.json(todos, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export const POST = async (req: NextRequest) => {
  const data = await req.json()
  try {
    await todoRepository.addTodo(data?.text || "")
    return NextResponse.json(data, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
