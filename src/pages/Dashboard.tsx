
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Gift, MessageCircle, Calendar, Bell, ArrowRight, Heart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-6 pb-16">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name || 'there'}</h1>
          <p className="text-muted-foreground">
            Ready to discover the perfect gift?
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="mt-4">Gift Chat</CardTitle>
              <CardDescription>
                Ask our AI for personalized gift suggestions based on your recipient's interests
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-6">
                Describe who you're shopping for and get instant, tailored gift ideas that match their personality.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full gap-1 group">
                <Link to="/chat">
                  Start Chatting
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="mt-4">Event Calendar</CardTitle>
              <CardDescription>
                Keep track of birthdays, anniversaries, and other special occasions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-6">
                Never miss an important date again. Add events manually or sync with Google Calendar to get timely reminders.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full gap-1 group">
                <Link to="/events">
                  View Calendar
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="mt-4">Email Reminders</CardTitle>
              <CardDescription>
                Get timely notifications before important occasions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-6">
                Receive email reminders 7 days before each event, giving you plenty of time to find the perfect gift.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-10"
      >
        <Card className="bg-primary/5 border-none">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="rounded-full bg-primary/10 p-4 flex-shrink-0">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Ready to find the perfect gift?</h3>
                <p className="text-muted-foreground mb-0">
                  Start a conversation with our AI to get personalized gift suggestions for any occasion.
                </p>
              </div>
              
              <Button asChild className="flex-shrink-0 gap-2">
                <Link to="/chat">
                  Start Gift Chat
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> by PerfectGiftAI
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
