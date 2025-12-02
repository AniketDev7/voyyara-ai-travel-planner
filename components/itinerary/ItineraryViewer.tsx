'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Activity {
  time: string;
  activity_type: string;
  activity_id?: string;
  custom_title?: string;
  custom_description?: string;
  duration_minutes: number;
  estimated_cost?: number;
  notes?: string;
}

interface Day {
  day_number: number;
  date: string;
  title: string;
  description?: string;
  activities: Activity[];
}

interface BudgetBreakdown {
  attractions: number;
  food: number;
  accommodation: number;
  activities: number;
  transportation: number;
  total: number;
  currency: string;
}

interface ItineraryViewerProps {
  title: string;
  summary?: string;
  days: Day[];
  estimated_budget?: BudgetBreakdown;
  travel_tips?: string[];
  onSave?: () => void;
}

export function ItineraryViewer({
  title,
  summary,
  days,
  estimated_budget,
  travel_tips,
  onSave,
}: ItineraryViewerProps) {
  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      attraction: '🏛️',
      restaurant: '🍽️',
      activity: '🎯',
      hotel: '🏨',
      transport: '🚗',
    };
    return icons[type] || '📍';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {summary && <p className="text-lg text-gray-600">{summary}</p>}
      </motion.div>

      {/* Budget Overview */}
      {estimated_budget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle>Estimated Budget</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Attractions</p>
                  <p className="text-lg font-semibold">
                    {estimated_budget.currency} {estimated_budget.attractions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Food</p>
                  <p className="text-lg font-semibold">
                    {estimated_budget.currency} {estimated_budget.food}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accommodation</p>
                  <p className="text-lg font-semibold">
                    {estimated_budget.currency} {estimated_budget.accommodation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-lg font-semibold">
                    {estimated_budget.currency} {estimated_budget.activities}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transport</p>
                  <p className="text-lg font-semibold">
                    {estimated_budget.currency} {estimated_budget.transportation}
                  </p>
                </div>
                <div className="border-l-2 border-purple-600 pl-4">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-purple-600">
                    {estimated_budget.currency} {estimated_budget.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Days Timeline */}
      <div className="space-y-8 mb-8">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day.day_number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + dayIndex * 0.1 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="text-white">
                  Day {day.day_number} - {day.date}
                </CardTitle>
                <CardDescription className="text-white/80">
                  {day.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {day.description && (
                  <p className="text-gray-600 mb-6">{day.description}</p>
                )}
                
                <div className="space-y-4">
                  {day.activities.map((activity, actIndex) => (
                    <div
                      key={actIndex}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-purple-600">
                            {activity.time}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.duration_minutes} min
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-lg mb-1">
                          {activity.custom_title || 'Activity'}
                        </h4>
                        
                        {activity.custom_description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {activity.custom_description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {activity.notes && (
                            <p className="text-sm text-gray-500 italic">
                              💡 {activity.notes}
                            </p>
                          )}
                          {activity.estimated_cost && activity.estimated_cost > 0 && (
                            <span className="text-sm font-medium text-green-600">
                              {estimated_budget?.currency || '$'} {activity.estimated_cost}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Travel Tips */}
      {travel_tips && travel_tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>💡 Travel Tips</CardTitle>
              <CardDescription>Helpful advice for your trip</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {travel_tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {onSave && (
          <Button size="lg" onClick={onSave} className="text-lg">
            💾 Save Itinerary
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={() => window.print()}>
          🖨️ Print
        </Button>
        <Button size="lg" variant="outline">
          📧 Email
        </Button>
      </motion.div>
    </div>
  );
}

