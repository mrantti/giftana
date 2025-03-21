
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Gift, Calendar, MessageCircle, ArrowRight, Check } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <motion.section 
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Find the Perfect Gift with AI-Powered Suggestions
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Never stress about gift shopping again. PerfectGiftAI helps you discover thoughtful, personalized gifts for everyone in your life.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/chat">
                  Try It Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 md:mt-16 relative mx-auto max-w-4xl overflow-hidden rounded-xl shadow-xl"
          >
            <div className="bg-card overflow-hidden border rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000&auto=format&fit=crop"
                alt="PerfectGiftAI Interface" 
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <section className="py-16 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              PerfectGiftAI takes the stress out of gift shopping in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <MessageCircle className="h-10 w-10 text-primary" />,
                title: "Chat with AI",
                description: "Describe who you're shopping for and their interests. Our AI understands their personality and preferences."
              },
              {
                icon: <Gift className="h-10 w-10 text-primary" />,
                title: "Get Personalized Suggestions",
                description: "Receive thoughtfully curated gift ideas that match their interests, your budget, and the occasion."
              },
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Never Miss an Occasion",
                description: "Set up reminders for birthdays and events. We'll notify you with enough time to find the perfect gift."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Keep Track of Important Dates
              </h2>
              <p className="text-muted-foreground mb-6">
                Never forget a birthday, anniversary, or special occasion again. PerfectGiftAI helps you keep track of important dates and sends timely reminders so you always have time to find the perfect gift.
              </p>
              
              <div className="space-y-3">
                {[
                  "Sync with Google Calendar",
                  "Email reminders before events",
                  "Personalized gift suggestions for each occasion",
                  "Notes and preferences for each recipient"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button asChild className="gap-2">
                  <Link to="/events">
                    Try Calendar Features
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-lg border">
                <img 
                  src="https://images.unsplash.com/photo-1513267048331-5611cad62e41?q=80&w=1000&auto=format&fit=crop" 
                  alt="Calendar View" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Find the Perfect Gift?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join PerfectGiftAI today and never stress about gift shopping again. It's free to get started!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/chat">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
