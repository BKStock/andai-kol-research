import { NextResponse } from 'next/server'
import { spawn } from 'child_process'

const VENV_PYTHON = '/Users/mr.k/Projects/and-ai-brain/venv/bin/python3'
const FINDER_SCRIPT = '/Users/mr.k/Projects/bk-influencer-finder/finder.py'

export async function POST() {
  return new Promise((resolve) => {
    const proc = spawn(VENV_PYTHON, [FINDER_SCRIPT, '--limit', '20'], {
      cwd: '/Users/mr.k/Projects/bk-influencer-finder',
      timeout: 120000
    })
    
    let output = ''
    proc.stdout.on('data', (d: Buffer) => { output += d.toString() })
    proc.stderr.on('data', (d: Buffer) => { output += d.toString() })
    
    proc.on('close', (code: number) => {
      resolve(NextResponse.json({ 
        success: code === 0, 
        output: output.slice(-500),
        code 
      }))
    })
    
    // タイムアウト
    setTimeout(() => {
      proc.kill()
      resolve(NextResponse.json({ success: false, message: 'タイムアウト' }, { status: 408 }))
    }, 110000)
  })
}
