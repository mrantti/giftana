
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventsCalendar from '@/components/events/EventsCalendar';
import EventForm, { Event } from '@/components/events/EventForm';
import { useToast } from '@/components/ui/use-toast';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Mom\'s Birthday',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
    recipient: 'Mom',
    notes: 'She mentioned wanting a new cookbook or gardening tools.'
  },
  {
    id: '2',
    title: 'Anniversary',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
    recipient: 'Partner',
    notes: 'Looking for something romantic and thoughtful.'
  },
  {
    id: '3',
    title: 'Brother\'s Graduation',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 10),
    recipient: 'Brother',
    notes: 'He\'s into tech gadgets and outdoor activities.'
  }
];

const Events = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (currentEvent) {
      // Edit existing event
      setEvents(events.map(event => 
        event.id === currentEvent.id 
          ? { ...event, ...eventData } 
          : event
      ));
    } else {
      // Add new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData
      };
      setEvents([...events, newEvent]);
    }
    
    setShowEventForm(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-6 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Event Calendar</h1>
        <p className="text-muted-foreground">Keep track of important dates and never miss an occasion</p>
      </div>
      
      <AnimatePresence mode="wait">
        {showEventForm ? (
          <motion.div
            key="event-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 max-w-xl mx-auto"
          >
            <EventForm 
              onSave={handleSaveEvent}
              onCancel={() => setShowEventForm(false)}
              initialValues={currentEvent || undefined}
            />
          </motion.div>
        ) : (
          <motion.div
            key="events-calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventsCalendar 
              events={events}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
