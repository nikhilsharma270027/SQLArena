'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field'
import { toast } from 'sonner'

export default function BugReportPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: 'general',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    email: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a bug title')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return
    }

    setLoading(true)
    try {
      // TODO: Connect to backend API
      console.log('Bug report data:', formData)
      toast.success('Bug report submitted successfully!')

      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: 'general',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        email: '',
      })
    } catch (error) {
      toast.error('Failed to submit bug report')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            Report a Bug
          </CardTitle>
          <CardDescription>
            Help us improve by reporting any issues you encounter
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <Field>
              <FieldLabel>
                Bug Title <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                name="title"
                placeholder="Brief summary of the bug"
                value={formData.title}
                onChange={handleChange}
                className="rounded-xl"
              />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel>
                Description <span className="text-red-500">*</span>
              </FieldLabel>
              <Textarea
                name="description"
                placeholder="Detailed description of the bug"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="rounded-xl"
              />
            </Field>

            {/* Severity and Category */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Severity</FieldLabel>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange('severity', value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="ui">UI/UX</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Steps to Reproduce */}
            <Field>
              <FieldLabel>Steps to Reproduce</FieldLabel>
              <Textarea
                name="stepsToReproduce"
                placeholder="1. Step one&#10;2. Step two&#10;3. Step three..."
                value={formData.stepsToReproduce}
                onChange={handleChange}
                rows={3}
                className="rounded-xl"
              />
            </Field>

            {/* Expected vs Actual Behavior */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Expected Behavior</FieldLabel>
                <Textarea
                  name="expectedBehavior"
                  placeholder="What should happen?"
                  value={formData.expectedBehavior}
                  onChange={handleChange}
                  rows={2}
                  className="rounded-xl"
                />
              </Field>

              <Field>
                <FieldLabel>Actual Behavior</FieldLabel>
                <Textarea
                  name="actualBehavior"
                  placeholder="What actually happens?"
                  value={formData.actualBehavior}
                  onChange={handleChange}
                  rows={2}
                  className="rounded-xl"
                />
              </Field>
            </div>

            {/* Email */}
            <Field>
              <FieldLabel>Email (optional)</FieldLabel>
              <Input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl"
              />
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl"
            >
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
