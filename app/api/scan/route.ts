export const maxDuration = 300

import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

const VENV_PYTHON = '/Users/mr.k/Projects/and-ai-brain/venv/bin/python3'
const FINDER_SCRIPT = '/Users/mr.k/Projects/bk-influencer-finder/finder.py'

interface ScanBody {
  keywords?: string[]
  followerMin?: number
  followerMax?: number
  language?: string
  limit?: number
  minEngagement?: number
  postFrequency?: number
  lastPostDays?: number
  unmonetizedOnly?: boolean
  genres?: string[]
  dmTone?: string
  dmLanguage?: string
  topDisplay?: number
  scoreWeights?: {
    engagement?: number
    growth?: number
    frequency?: number
  }
}

export async function POST(req: NextRequest) {
  let body: ScanBody = {}
  try {
    body = await req.json()
  } catch {
    // bodyなし → デフォルト値で実行
  }

  const {
    keywords = [],
    followerMin = 1000,
    followerMax = 50000,
    language = 'ja',
    limit = 20,
    minEngagement = 3.0,
    postFrequency = 2,
    lastPostDays = 30,
    unmonetizedOnly = false,
    genres = [],
  } = body

  // finder.py に渡す引数を組み立て
  const args: string[] = [
    FINDER_SCRIPT,
    '--limit', String(limit),
    '--follower-min', String(followerMin),
    '--follower-max', String(followerMax),
    '--language', language,
    '--min-engagement', String(minEngagement),
    '--post-frequency', String(postFrequency),
    '--last-post-days', String(lastPostDays),
  ]

  if (keywords.length > 0) {
    args.push('--keywords', keywords.join(','))
  }
  if (genres.length > 0) {
    args.push('--genres', genres.join(','))
  }
  if (unmonetizedOnly) {
    args.push('--unmonetized-only')
  }

  return new Promise<NextResponse>((resolve) => {
    const proc = spawn(VENV_PYTHON, args, {
      cwd: '/Users/mr.k/Projects/bk-influencer-finder',
      timeout: 300000,
    })

    let output = ''
    proc.stdout.on('data', (d: Buffer) => { output += d.toString() })
    proc.stderr.on('data', (d: Buffer) => { output += d.toString() })

    proc.on('close', async (code: number) => {
      if (code === 0) {
        // スキャン完了後にスコアリングとレポート送信
        const { spawn: spawn2 } = require('child_process')
        const scorer = spawn2(VENV_PYTHON, [
          '/Users/mr.k/Projects/bk-influencer-finder/scorer.py'
        ], { cwd: '/Users/mr.k/Projects/bk-influencer-finder' })
        await new Promise((r) => scorer.on('close', r))
        
        const reporter = spawn2(VENV_PYTHON, [
          '/Users/mr.k/Projects/bk-influencer-finder/dm_generator.py'
        ], { cwd: '/Users/mr.k/Projects/bk-influencer-finder' })
        await new Promise((r) => reporter.on('close', r))
        
        const report = spawn2(VENV_PYTHON, [
          '/Users/mr.k/Projects/bk-influencer-finder/reporter.py'
        ], { cwd: '/Users/mr.k/Projects/bk-influencer-finder' })
        await new Promise((r) => report.on('close', r))
      }
      resolve(NextResponse.json({
        success: code === 0,
        output: output.slice(-500),
        code,
        message: code === 0 ? 'スキャン完了！Telegramにレポートを送信しました' : 'スキャン失敗'
      }))
    })

    // タイムアウト
    setTimeout(() => {
      proc.kill()
      resolve(NextResponse.json({ success: false, message: 'タイムアウト' }, { status: 408 }))
    }, 280000)
  })
}
