import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

const VENV_PYTHON = '/Users/mr.k/Projects/and-ai-brain/venv/bin/python3'
const FINDER_SCRIPT = '/Users/mr.k/Projects/bk-influencer-finder/finder.py'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { /* デフォルト使用 */ }

  const {
    keywords = [],
    followerMin = 1000,
    followerMax = 50000,
    language = 'ja',
    limit = 20,
    minEngagement = 3.0,
    postFrequency = 2,
    lastPostDays = 90,
    unmonetizedOnly = false,
    genres = [],
  } = body as {
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
  }

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
  if ((keywords as string[]).length > 0) args.push('--keywords', (keywords as string[]).join(','))
  if ((genres as string[]).length > 0) args.push('--genres', (genres as string[]).join(','))
  if (unmonetizedOnly) args.push('--unmonetized-only')

  // ★ バックグラウンドで実行（即座にレスポンスを返す）
  const runAll = async () => {
    const run = (cmd: string, cmdArgs: string[]) => new Promise<void>((res) => {
      const p = spawn(cmd, cmdArgs, { cwd: '/Users/mr.k/Projects/bk-influencer-finder', detached: true })
      p.on('close', () => res())
      p.on('error', () => res())
    })

    await run(VENV_PYTHON, args)
    await run(VENV_PYTHON, ['/Users/mr.k/Projects/bk-influencer-finder/scorer.py'])
    await run(VENV_PYTHON, ['/Users/mr.k/Projects/bk-influencer-finder/dm_generator.py'])
    await run(VENV_PYTHON, ['/Users/mr.k/Projects/bk-influencer-finder/reporter.py'])
  }

  // fire and forget — レスポンスを待たずにバックグラウンド実行
  runAll().catch(() => {})

  // すぐに200を返す
  return NextResponse.json({
    success: true,
    message: '✅ スキャン開始！完了後にTelegramへレポートが届きます（約2〜3分）',
    params: { keywords, followerMin, followerMax, language, limit }
  })
}
