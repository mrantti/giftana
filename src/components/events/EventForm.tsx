
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export interface Event {
  id: string;
  title: string;
  date: Date;
  recipient: string;
  notes?: string;
}

interface EventFormProps {
  onSave: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Event>;
}

const EventForm: React.FC<EventFormProps> = ({
  onSave,
  onCancel,
  initialValues
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [date, setDate] = useState<Date | undefined>(initialValues?.date);
  const [recipient, setRecipient] = useState(initialValues?.recipient || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [recipientError, setRecipientError] = useState('');
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setTitleError('');
    setDateError('');
    setRecipientError('');
    
    // Validate form
    let isValid = true;
    
    if (!title) {
      setTitleError('Please enter an event title');
      isValid = false;
    }
    
    if (!date) {
      setDateError('Please select a date');
      isValid = false;
    }
    
    if (!recipient) {
      setRecipientError('Please enter a recipient name');
      isValid = false;
    }
    
    if (!isValid) return;
    
    onSave({
      title,
      date: date as Date,
      recipient,
      notes
    });
    
    toast({
      title: initialValues ? 'Event updated' : 'Event created',
      description: initialValues 
        ? 'Your event has been updated successfully.'
        : 'Your event has been created successfully.'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>{initialValues ? 'Edit Event' : 'Add New Event'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Birthday, Anniversary, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={titleError ? 'border-destructive' : ''}
              />
              {titleError && <p className="text-xs text-destructive">{titleError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      dateError && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateError && <p className="text-xs text-destructive">{dateError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input
                id="recipient"
                placeholder="Who is this event for?"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={recipientError ? 'border-destructive' : ''}
              />
              {recipientError && <p className="text-xs text-destructive">{recipientError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Gift ideas, preferences, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? 'Update Event' : 'Save Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default EventForm;
