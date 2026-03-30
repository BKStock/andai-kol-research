import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

const FINDER_PATH = '/Users/mr.k/Projects/bk-influencer-finder'
const RESULTS_PATH = path.join(FINDER_PATH, 'weekly_top10.json')
const CANDIDATES_PATH = path.join(FINDER_PATH, 'candidates.json')

export async function GET() {
  try {
    // candidates.jsonが存在すればそれを返す
    if (fs.existsSync(CANDIDATES_PATH)) {
      const data = JSON.parse(fs.readFileSync(CANDIDATES_PATH, 'utf-8'))
      return NextResponse.json({ success: true, data, source: 'file' })
    }
    // weekly_top10.jsonが存在すればそれを返す
    if (fs.existsSync(RESULTS_PATH)) {
      const data = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'))
      return NextResponse.json({ success: true, data, source: 'weekly' })
    }
    // データなし（まだスキャン未実行）
    return NextResponse.json({ 
      success: false, 
      message: 'スキャン未実行。/api/scanを呼び出してください',
      data: []
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
