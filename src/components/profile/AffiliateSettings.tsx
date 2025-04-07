
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { affiliateService } from '@/services/affiliateService';

const AffiliateSettings = () => {
  const { toast } = useToast();
  const config = affiliateService.getConfig();
  
  const [amazonId, setAmazonId] = useState(config.trackingIds.amazon);
  const [etsyId, setEtsyId] = useState(config.trackingIds.etsy);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = () => {
    setIsSubmitting(true);
    
    try {
      affiliateService.setConfig({
        trackingIds: {
          amazon: amazonId,
          etsy: etsyId
        }
      });
      
      toast({
        title: "Affiliate settings updated",
        description: "Your affiliate IDs have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem saving your affiliate settings.",
        variant: "destructive",
      });
      console.error("Error saving affiliate settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Settings</CardTitle>
        <CardDescription>
          Configure your affiliate tracking IDs for product links
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amazon-id">Amazon Associates ID</Label>
          <Input
            id="amazon-id"
            placeholder="yourname-20"
            value={amazonId}
            onChange={(e) => setAmazonId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your Amazon Associates tracking ID (e.g., yourname-20)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="etsy-id">Etsy Affiliate ID</Label>
          <Input
            id="etsy-id"
            placeholder="12345"
            value={etsyId}
            onChange={(e) => setEtsyId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your Etsy affiliate partner ID
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AffiliateSettings;
