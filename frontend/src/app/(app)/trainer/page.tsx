'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import * as XLSX from 'xlsx';
import { UserCog, Save, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import api from '@/lib/axios';

export default function TrainerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState<{ trainer: { firstName: string; lastName: string; email: string }; company: string | null; temporaryPassword: string } | null>(null);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [specialization, setSpecialization] = React.useState('');
  const [expertise, setExpertise] = React.useState('');
  const [bio, setBio] = React.useState('');

  if (user?.role !== 'super_admin') {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        specialization: specialization || undefined,
        expertise: expertise || undefined,
        bio: bio || undefined,
      };

      const response = await api.post('/admin/trainer', payload);
      const data = response.data.data;
      setResult(data);
      setSuccess(true);

      const ws = XLSX.utils.json_to_sheet([
        {
          Role: 'Trainer',
          'First Name': data.trainer.firstName,
          'Last Name': data.trainer.lastName,
          Email: data.trainer.email,
          Password: data.temporaryPassword,
          Company: data.company || '',
        },
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Credentials');
      XLSX.writeFile(wb, `trainer-${data.trainer.email.split('@')[0]}-credentials.xlsx`);

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSpecialization('');
      setExpertise('');
      setBio('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create trainer';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trainer Management</h1>
        <p className="text-sm text-muted-foreground">Create a new trainer account</p>
      </div>

      {success && result && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="space-y-2">
                <p className="font-medium text-green-800 dark:text-green-300">Trainer created successfully!</p>
                <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <p><strong>Trainer:</strong> {result.trainer.firstName} {result.trainer.lastName} ({result.trainer.email})</p>
                  {result.company && <p><strong>Company:</strong> {result.company}</p>}
                  <p><strong>Temporary Password:</strong> <code className="rounded bg-green-200 dark:bg-green-900 px-1.5 py-0.5 font-mono">{result.temporaryPassword}</code></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCog className="h-4 w-4" />
                Personal Details
              </CardTitle>
              <CardDescription>Enter the trainer&apos;s personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                Professional Details
              </CardTitle>
              <CardDescription>Enter the trainer&apos;s professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Google, Microsoft" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Full Stack Development" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise</Label>
                <Input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g., React, Node.js, Python (comma-separated)" />
                <p className="text-xs text-muted-foreground">Comma-separated list of skills</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief description about the trainer" rows={4} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
              {loading ? 'Creating...' : 'Create Trainer'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
