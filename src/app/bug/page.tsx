'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      toast.success('Bug report submitted successfully! (Demo mode)')

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">Report a Bug</CardTitle>
            <CardDescription className="text-slate-400">
              Help us improve by reporting any issues you encounter
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">
                  Bug Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief summary of the bug"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the bug"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Severity and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-slate-200">
                    Severity
                  </Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => handleSelectChange('severity', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-200">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="ui">UI/UX</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Steps to Reproduce */}
              <div className="space-y-2">
                <Label htmlFor="stepsToReproduce" className="text-slate-200">
                  Steps to Reproduce
                </Label>
                <Textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  placeholder="1. Step one&#10;2. Step two&#10;3. Step three..."
                  value={formData.stepsToReproduce}
                  onChange={handleChange}
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Expected vs Actual Behavior */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedBehavior" className="text-slate-200">
                    Expected Behavior
                  </Label>
                  <Textarea
                    id="expectedBehavior"
                    name="expectedBehavior"
                    placeholder="What should happen?"
                    value={formData.expectedBehavior}
                    onChange={handleChange}
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualBehavior" className="text-slate-200">
                    Actual Behavior
                  </Label>
                  <Textarea
                    id="actualBehavior"
                    name="actualBehavior"
                    placeholder="What actually happens?"
                    value={formData.actualBehavior}
                    onChange={handleChange}
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email (optional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Submitting...' : 'Submit Bug Report'}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                * Required fields
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
