'use client'

import { format, isValid, parseISO } from 'date-fns'
import { CalendarIcon, MapPinIcon, TagIcon, UserIcon } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface EventInfoProps {
  name: string;
  description: string;
  date: Date | string;
  location: string;
  createdAt: Date | string;
  TeamsApplied_id: string[];
  TeamsAccepted_id: string[];
  tags: string[];
  category: string;
  createdBy: string;
}

export function EventInfoPageComponent({ 
  name,
  description,
  date,
  location,
  createdAt,
  TeamsApplied_id,
  TeamsAccepted_id,
  tags,
  category,
  createdBy
}: EventInfoProps) {
  const formatDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return 'Date not available'
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? format(dateValue, 'PPP') : 'Invalid Date'
    }
    if (typeof dateValue === 'string') {
      const parsedDate = parseISO(dateValue)
      return isValid(parsedDate) ? format(parsedDate, 'PPP') : 'Invalid Date'
    }
    return 'Invalid Date'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{name || 'Untitled Event'}</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(date)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{description || 'No description available'}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-gray-500" />
              <span>{location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span>Created by: {createdBy || 'Unknown'}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="font-semibold">Event Details</h3>
            <div><strong>Category:</strong> {category || 'Uncategorized'}</div>
            <div><strong>Created At:</strong> {formatDate(createdAt)}</div>
            <div><strong>Teams Applied:</strong> {TeamsApplied_id?.length || 0}</div>
            <div><strong>Teams Accepted:</strong> {TeamsAccepted_id?.length || 0}</div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap gap-2">
            <TagIcon className="w-5 h-5 text-gray-500" />
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))
            ) : (
              <span className="text-gray-500">No tags</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}