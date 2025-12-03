import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const db = await getDb()
    const admin = db.admin?.()
    let ping
    try {
      ping = await db.command({ ping: 1 })
    } catch (e) {
      ping = { ok: 0, error: e instanceof Error ? e.message : String(e) }
    }

    // Try a quick write-read-delete in a temp collection to validate write access
    let writeCheck = { ok: false }
    try {
      const col = db.collection('_health_checks')
      const doc = { ts: new Date(), rand: Math.random() }
      const ins = await col.insertOne(doc)
      const got = await col.findOne({ _id: ins.insertedId })
      await col.deleteOne({ _id: ins.insertedId })
      writeCheck = { ok: true, insertedId: ins.insertedId, readBack: !!got }
    } catch (e) {
      writeCheck = { ok: false, error: e instanceof Error ? e.message : String(e) }
    }

    return NextResponse.json({
      success: true,
      db: db.databaseName,
      ping,
      writeCheck,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
