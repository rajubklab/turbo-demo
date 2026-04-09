import { todoRepository } from "@repo/db"
import { NextRequest, NextResponse } from "next/server"

export const DELETE = async (
  _: any,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) => {
  const { id } = await params
  try {
    await todoRepository.deleteTodo(id)
    return NextResponse.json(id, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
