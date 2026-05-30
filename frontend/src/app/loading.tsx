import { GraduationCap } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="absolute -inset-2 animate-pulse rounded-2xl bg-primary/20" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight">CampusSkill Hub</h2>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
