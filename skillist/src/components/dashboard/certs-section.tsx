'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, ExternalLink, Award, Plus } from 'lucide-react'
import { addCertification, deleteCertification } from '@/app/dashboard/_actions'

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: Date | null
  credentialUrl: string | null
}

export function CertsSection({ initialCerts }: { initialCerts: Certification[] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addCertification({
        name: formData.get('name') as string,
        issuer: formData.get('issuer') as string,
        issueDate: formData.get('issueDate') as string,
        credentialUrl: formData.get('credentialUrl') as string,
      })
      setIsOpen(false)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Certifications</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </DialogTrigger>
          <DialogContent>
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Certification</DialogTitle>
                <DialogDescription>List your professional certifications and achievements.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name</Label>
                  <Input id="name" name="name" placeholder="e.g. AWS Certified Solutions Architect" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input id="issuer" name="issuer" placeholder="e.g. Amazon Web Services" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" name="issueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialUrl">Credential URL</Label>
                  <Input id="credentialUrl" name="credentialUrl" placeholder="https://..." type="url" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Save Certification'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {initialCerts.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-2">No certifications added yet.</p>
        ) : (
          initialCerts.map((cert) => (
            <Card key={cert.id} className="group relative">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <CardDescription>{cert.issuer}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => deleteCertification(cert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                  </span>
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      View Credential <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
