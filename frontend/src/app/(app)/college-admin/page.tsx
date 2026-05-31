'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Building2, User, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function CollegeAdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState<{ admin: { firstName: string; lastName: string; email: string }; temporaryPassword: string } | null>(null);

  // College fields
  const [collegeName, setCollegeName] = React.useState('');
  const [collegeCode, setCollegeCode] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [collegePhone, setCollegePhone] = React.useState('');
  const [collegeEmail, setCollegeEmail] = React.useState('');

  // Admin fields
  const [adminFirstName, setAdminFirstName] = React.useState('');
  const [adminLastName, setAdminLastName] = React.useState('');
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPhone, setAdminPhone] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [designation, setDesignation] = React.useState('');

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
        collegeName,
        collegeCode,
        address,
        city,
        state,
        pincode,
        collegePhone,
        collegeEmail,
        adminFirstName,
        adminLastName,
        adminEmail,
        adminPhone: adminPhone || undefined,
        department: department || undefined,
        designation: designation || undefined,
      };

      const response = await api.post('/admin/college-admin', payload);
      setResult(response.data.data);
      setSuccess(true);

      setCollegeName('');
      setCollegeCode('');
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
      setCollegePhone('');
      setCollegeEmail('');
      setAdminFirstName('');
      setAdminLastName('');
      setAdminEmail('');
      setAdminPhone('');
      setDepartment('');
      setDesignation('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create college admin';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">College Admin Management</h1>
        <p className="text-sm text-muted-foreground">Create a new college and assign a college admin</p>
      </div>

      {success && result && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="space-y-2">
                <p className="font-medium text-green-800 dark:text-green-300">College admin created successfully!</p>
                <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <p><strong>Admin:</strong> {result.admin.firstName} {result.admin.lastName} ({result.admin.email})</p>
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
                <Building2 className="h-4 w-4" />
                College Details
              </CardTitle>
              <CardDescription>Enter the details of the college</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Input id="collegeName" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collegeCode">College Code *</Label>
                  <Input id="collegeCode" value={collegeCode} onChange={(e) => setCollegeCode(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="collegePhone">College Phone *</Label>
                  <Input id="collegePhone" type="tel" value={collegePhone} onChange={(e) => setCollegePhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collegeEmail">College Email *</Label>
                  <Input id="collegeEmail" type="email" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Admin Details
              </CardTitle>
              <CardDescription>Enter the details of the college admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName">First Name *</Label>
                  <Input id="adminFirstName" value={adminFirstName} onChange={(e) => setAdminFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminLastName">Last Name *</Label>
                  <Input id="adminLastName" value={adminLastName} onChange={(e) => setAdminLastName(e.target.value)} required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input id="adminEmail" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Admin Phone</Label>
                  <Input id="adminPhone" type="tel" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
              {loading ? 'Creating...' : 'Create College Admin'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
