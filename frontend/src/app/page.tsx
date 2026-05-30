'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Users, BarChart3, Trophy, Shield, ArrowRight, CheckCircle, Star, ChevronRight, Menu, X } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Create and manage courses with rich content, modules, and assessments tailored to your curriculum.',
  },
  {
    icon: Users,
    title: 'Student Tracking',
    description: 'Monitor individual student progress, attendance, and performance metrics in real-time.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Get actionable insights with comprehensive analytics on courses, students, and institutional performance.',
  },
  {
    icon: Trophy,
    title: 'Skill Badges',
    description: 'Award digital badges and certificates to recognize student achievements and skill mastery.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security with role-based access control and data protection compliance.',
  },
  {
    icon: GraduationCap,
    title: 'Multi-College Support',
    description: 'Manage multiple colleges, departments, and programs from a single unified platform.',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Colleges', icon: GraduationCap },
  { value: 50, suffix: 'K+', label: 'Students', icon: Users },
  { value: 10, suffix: 'K+', label: 'Courses', icon: BookOpen },
  { value: 95, suffix: '%', label: 'Satisfaction', icon: Trophy },
];

const steps = [
  {
    number: '01',
    title: 'Set Up Your Institution',
    description: 'Register your college, customize your profile, and define your academic structure in minutes.',
  },
  {
    number: '02',
    title: 'Create & Assign Courses',
    description: 'Build comprehensive courses with modules, assessments, and track student progress effortlessly.',
  },
  {
    number: '03',
    title: 'Monitor & Celebrate Success',
    description: 'Track performance analytics, generate reports, and award certificates for completed milestones.',
  },
];

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Dean, Tech University',
    content: 'CampusSkill Hub has transformed how we manage our technical training programs. The analytics are invaluable.',
    rating: 5,
  },
  {
    name: 'Prof. Michael Chen',
    role: 'CS Department Head',
    content: 'The course management system is intuitive and powerful. Our student engagement has increased by 60%.',
    rating: 5,
  },
  {
    name: 'Anita Sharma',
    role: 'Training Coordinator',
    content: 'From enrollment to certification, everything is streamlined. Our administrative workload has reduced significantly.',
    rating: 5,
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">CampusSkill Hub</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Testimonials
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <Link href="#features" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Testimonials
              </Link>
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="hero-gradient relative overflow-hidden pt-24 md:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="container relative px-4 pb-20 pt-16 text-center md:pb-32 md:pt-20">
            <Badge variant="secondary" className="mb-6">
              The Future of Campus Training Management
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transform Your Campus with{' '}
              <span className="gradient-text">CampusSkill Hub</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              The all-in-one platform for training and progress management. Empower your college with
              powerful tools for courses, assessments, and student analytics.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 text-base" asChild>
                <Link href="/register">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> No credit card
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> Free setup
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> 24/7 support
              </span>
            </div>
          </div>
        </section>

        <section id="stats" className="border-y bg-muted/30 py-16">
          <div className="container px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
                  <div className="text-3xl font-bold md:text-4xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to Manage Training
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features designed to streamline campus training, track progress, and drive student success.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group relative overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-muted/30 py-20 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started in three simple steps and transform your campus training management.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Trusted by Educators
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Hear from college administrators and faculty who use CampusSkill Hub.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <StarRating rating={testimonial.rating} />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {testimonial.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-20 md:py-32">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Transform Your Campus?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join hundreds of colleges already using CampusSkill Hub to manage training and track student success.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="gap-2 text-base" asChild>
                <Link href="/register">
                  Get Started Free <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold">CampusSkill Hub</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Empowering colleges with comprehensive training and progress management solutions.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="transition-colors hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Integrations</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="transition-colors hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">API Reference</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="transition-colors hover:text-foreground">About</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="transition-colors hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusSkill Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
