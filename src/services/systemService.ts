
// Service for system health monitoring and status

// Define system health interface
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: string;
  apiStatus: 'operational' | 'degraded' | 'down';
  modelLatency: string;
}

class SystemService {
  // Get current system health status
  getSystemHealth(): SystemHealth {
    // In a real implementation, this would connect to a backend health check API
    // Here we're simulating a health check with random values that are mostly healthy
    
    // Generate random latency values for simulation
    const apiLatency = Math.random() * 50 + 25; // 25-75ms
    const modelLatency = Math.random() * 200 + 300; // 300-500ms
    
    // Simulate occasional degraded status (5% of the time)
    const isHealthy = Math.random() > 0.05;
    
    return {
      status: isHealthy ? 'healthy' : 'degraded',
      latency: `${apiLatency.toFixed(0)}ms`,
      apiStatus: isHealthy ? 'operational' : 'degraded',
      modelLatency: `${modelLatency.toFixed(0)}ms`
    };
  }
  
  // Log system error
  logError(component: string, error: Error): void {
    // In a real implementation, this would send to error tracking service
    console.error(`[SYSTEM ERROR] ${component}: ${error.message}`, error);
  }
  
  // Check API availability
  async checkApiAvailability(): Promise<boolean> {
    try {
      // Simulate API health check
      await new Promise(resolve => setTimeout(resolve, 100));
      return Math.random() > 0.02; // 98% success rate
    } catch (error) {
      this.logError('API Health Check', error as Error);
      return false;
    }
  }
}

// Export as singleton
export const systemService = new SystemService();
