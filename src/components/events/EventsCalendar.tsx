
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Gift, Plus, Edit, Trash, Calendar as CalendarComponent, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Event } from './EventForm';
import { format, isSameDay, addDays, isBefore, differenceInDays } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface EventsCalendarProps {
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id);
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar."
      });
    }
  };

  const upcomingEvents = [...events]
    .filter(event => !isBefore(new Date(event.date), new Date()))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const daysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(new Date(date), today);
  };

  const eventsOnSelectedDate = selectedDate
    ? events.filter(event => isSameDay(new Date(event.date), selectedDate))
    : [];

  // Function to highlight event dates on the calendar
  const isDayWithEvent = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  const connectGoogleCalendar = () => {
    toast({
      title: "Feature coming soon",
      description: "Google Calendar integration will be available in the next update."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <motion.div 
        className="lg:col-span-3 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button onClick={onAddEvent} variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add Event
              </Button>
            </div>
            <CardDescription>
              Keep track of birthdays, anniversaries, and other special occasions
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <Alert variant="default" className="bg-secondary border-none">
                <AlertDescription className="flex flex-col items-center py-6 text-center">
                  <Gift className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="font-medium">No upcoming events</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your first event to get gift reminders
                  </p>
                  <Button onClick={onAddEvent} className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const days = daysUntil(new Date(event.date));
                    const isUpcoming = days <= 7;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Card className={`overflow-hidden ${isUpcoming ? 'border border-primary/40' : ''}`}>
                          <CardContent className="p-0">
                            <div className="flex items-stretch">
                              <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center py-4 ${isUpcoming ? 'bg-primary/10' : 'bg-secondary'}`}>
                                <span className="text-2xl font-bold">{format(new Date(event.date), 'd')}</span>
                                <span className="text-sm">{format(new Date(event.date), 'MMM')}</span>
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">For: {event.recipient}</p>
                                  </div>
                                  
                                  {isUpcoming && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                      {days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} away`}
                                    </Badge>
                                  )}
                                </div>
                                
                                {event.notes && (
                                  <p className="text-sm mt-2 text-muted-foreground">{event.notes}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          
                          <Separator />
                          
                          <CardFooter className="py-2 px-4 flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 gap-1 text-xs"
                              onClick={() => onEditEvent(event)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 gap-1 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(event)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 pb-4 px-6 flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1 text-xs"
                onClick={connectGoogleCalendar}
              >
                <CalendarComponent className="h-3.5 w-3.5" />
                <span>Connect Google Calendar</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Email reminders will be sent 7 days before each event
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      
      <motion.div 
        className="lg:col-span-2 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendar</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                eventDay: (date) => isDayWithEvent(date),
              }}
              modifiersStyles={{
                eventDay: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'hsl(var(--primary))',
                },
              }}
            />
            
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-sm">
                {selectedDate ? (
                  <span>Events on {format(selectedDate, 'MMMM d, yyyy')}</span>
                ) : (
                  <span>Select a date to view events</span>
                )}
              </h3>
              
              {selectedDate && eventsOnSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events on this date</p>
              ) : (
                <AnimatePresence>
                  {eventsOnSelectedDate.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="mb-2">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-xs text-muted-foreground">For: {event.recipient}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => onEditEvent(event)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{eventToDelete?.title}" for {eventToDelete?.recipient}?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsCalendar;
