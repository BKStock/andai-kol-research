'use client'

import { ExternalLink, MessageSquare, Youtube, Twitter, TrendingUp, Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Candidate } from '@/lib/data'
import { formatSubscribers, getStatusColor, getPlatformIcon } from '@/lib/data'

interface FeaturedInfluencerProps {
  candidate: Candidate
}

export function FeaturedInfluencer({ candidate }: FeaturedInfluencerProps) {
  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-card glow-primary">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
      
      <CardContent className="relative p-4 md:p-6">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="outline" className="border-primary text-primary">
            <Flame className="mr-1 h-3 w-3" />
            今週の最注目
          </Badge>
          <Badge className={getStatusColor(candidate.status)}>
            {candidate.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          {/* Left content */}
          <div className="space-y-4">
            {/* Profile */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-2xl font-bold text-primary">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{candidate.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {candidate.platform === 'YouTube' && <Youtube className="h-4 w-4 text-red-500" />}
                    {candidate.platform === 'X' && <Twitter className="h-4 w-4" />}
                    {getPlatformIcon(candidate.platform)} {candidate.platform}
                  </span>
                  <span>•</span>
                  <span>{formatSubscribers(candidate.subscribers)} 登録者</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg bg-success/10 px-3 py-2">
                <div className="flex items-center gap-1 text-success">
                  <Flame className="h-4 w-4" />
                  <span className="text-lg font-bold">{candidate.engagement}%</span>
                </div>
                <p className="text-xs text-muted-foreground">エンゲージメント率</p>
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-2">
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-lg font-bold">+{candidate.growth}%</span>
                </div>
                <p className="text-xs text-muted-foreground">30日成長率</p>
              </div>
            </div>

            {/* Latest video */}
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs text-muted-foreground">最新動画</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium">
                {candidate.latestVideos[0]?.title}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button className="flex-1 md:flex-none">
                <MessageSquare className="mr-2 h-4 w-4" />
                DMテンプレを見る
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                <ExternalLink className="mr-2 h-4 w-4" />
                プロフィール
              </Button>
            </div>
          </div>

          {/* Score circle */}
          <div className="flex items-center justify-center md:min-w-[140px]">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="fill-none stroke-muted"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="fill-none stroke-primary transition-all duration-1000"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(candidate.score / 100) * 352} 352`}
                />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{candidate.score}</span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
