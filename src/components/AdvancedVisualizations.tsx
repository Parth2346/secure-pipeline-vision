import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Map,
  Zap,
  Calendar,
  Target,
  Layers,
  Download,
  Settings,
  Filter
} from 'lucide-react';

const AdvancedVisualizations = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('anomalies');

  // Mock data for heatmap
  const generateHeatmapData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => ({
      day,
      hours: hours.map(hour => ({
        hour,
        value: Math.random() * 100,
        anomalies: Math.floor(Math.random() * 10)
      }))
    }));
  };

  const heatmapData = generateHeatmapData();

  // Mock drift detection data
  const driftData = [
    { timestamp: '2024-01-15', feature: 'transaction_amount', driftScore: 0.12, status: 'stable' },
    { timestamp: '2024-01-16', feature: 'transaction_amount', driftScore: 0.18, status: 'stable' },
    { timestamp: '2024-01-17', feature: 'transaction_amount', driftScore: 0.34, status: 'warning' },
    { timestamp: '2024-01-18', feature: 'transaction_amount', driftScore: 0.67, status: 'critical' },
    { timestamp: '2024-01-19', feature: 'transaction_amount', driftScore: 0.45, status: 'warning' },
    { timestamp: '2024-01-20', feature: 'transaction_amount', driftScore: 0.23, status: 'stable' },
  ];

  const getHeatmapColor = (value: number) => {
    if (value < 20) return 'bg-green-500/20';
    if (value < 40) return 'bg-yellow-500/40';
    if (value < 70) return 'bg-orange-500/60';
    return 'bg-red-500/80';
  };

  const getDriftColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getDriftBadge = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-gradient-risk-low';
      case 'warning': return 'bg-gradient-risk-medium';
      case 'critical': return 'bg-gradient-risk-high';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Advanced Analytics & Visualizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anomalies">Anomaly Count</SelectItem>
                <SelectItem value="risk">Risk Score</SelectItem>
                <SelectItem value="volume">Data Volume</SelectItem>
                <SelectItem value="drift">Feature Drift</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Anomaly Heatmap
          </TabsTrigger>
          <TabsTrigger value="drift" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Drift Detection
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Timeline Analysis
          </TabsTrigger>
        </TabsList>

        {/* Anomaly Heatmap */}
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Anomaly Detection Heatmap
                </CardTitle>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedTimeRange.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Anomaly distribution across time periods. Darker colors indicate higher anomaly concentrations.
                </div>
                
                {/* Time labels */}
                <div className="flex text-xs text-muted-foreground ml-16">
                  <div className="grid grid-cols-24 gap-1 flex-1">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="text-center">
                        {i % 4 === 0 ? `${i}:00` : ''}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap grid */}
                <div className="space-y-1">
                  {heatmapData.map((dayData, dayIndex) => (
                    <div key={dayIndex} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-right">
                        {dayData.day}
                      </div>
                      <div className="grid grid-cols-24 gap-1 flex-1">
                        {dayData.hours.map((hourData, hourIndex) => (
                          <div
                            key={hourIndex}
                            className={`h-6 rounded-sm cursor-pointer transition-all hover:scale-110 ${getHeatmapColor(hourData.value)}`}
                            title={`${dayData.day} ${hourData.hour}:00 - ${hourData.anomalies} anomalies`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Anomaly Density:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500/20 rounded"></div>
                      <span className="text-xs">Low</span>
                      <div className="w-4 h-4 bg-yellow-500/40 rounded"></div>
                      <span className="text-xs">Medium</span>
                      <div className="w-4 h-4 bg-orange-500/60 rounded"></div>
                      <span className="text-xs">High</span>
                      <div className="w-4 h-4 bg-red-500/80 rounded"></div>
                      <span className="text-xs">Critical</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Peak anomaly period: Thu 14:00-16:00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drift Detection */}
        <TabsContent value="drift">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribution Drift Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Monitoring changes in data distribution over time. Drift scores above 0.5 indicate significant changes.
                </div>

                {/* Drift Chart Visualization */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
                    <span>1.0</span>
                    <span>0.75</span>
                    <span>0.5</span>
                    <span>0.25</span>
                    <span>0.0</span>
                  </div>
                  
                  <div className="ml-12 relative h-48 border-l border-b">
                    {/* Threshold line */}
                    <div className="absolute w-full h-px bg-red-500/50 border-t border-dashed" style={{ bottom: '50%' }}>
                      <span className="absolute right-0 -top-4 text-xs text-red-500">Critical Threshold (0.5)</span>
                    </div>
                    
                    {/* Data points */}
                    <div className="flex items-end h-full justify-between px-4">
                      {driftData.map((point, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-6 h-2 rounded-full transition-all cursor-pointer ${getDriftColor(point.status)} bg-current`}
                            style={{ height: `${point.driftScore * 180}px` }}
                            title={`${point.timestamp}: ${point.driftScore} (${point.status})`}
                          />
                          <Badge className={`${getDriftBadge(point.status)} text-xs`}>
                            {point.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="ml-12 flex justify-between text-xs text-muted-foreground mt-2">
                    {driftData.map((point, index) => (
                      <span key={index}>{point.timestamp.slice(-5)}</span>
                    ))}
                  </div>
                </div>

                {/* Drift Analysis Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">0.67</div>
                        <p className="text-sm text-muted-foreground">Peak Drift Score</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">2</div>
                        <p className="text-sm text-muted-foreground">Drift Events</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">Stable</div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Analysis */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Anomaly Timeline Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Chronological view of anomaly patterns and security events over time.
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
                  
                  <div className="space-y-6">
                    {[
                      {
                        time: '14:45',
                        type: 'Critical Alert',
                        description: 'Data breach attempt detected',
                        icon: <Target className="h-4 w-4" />,
                        color: 'text-red-500',
                        bgColor: 'bg-red-500/10'
                      },
                      {
                        time: '14:32',
                        type: 'High Risk Anomaly',
                        description: 'Statistical outlier in transaction data',
                        icon: <Zap className="h-4 w-4" />,
                        color: 'text-orange-500',
                        bgColor: 'bg-orange-500/10'
                      },
                      {
                        time: '14:18',
                        type: 'Pattern Change',
                        description: 'User behavior drift detected',
                        icon: <TrendingUp className="h-4 w-4" />,
                        color: 'text-yellow-500',
                        bgColor: 'bg-yellow-500/10'
                      },
                      {
                        time: '13:56',
                        type: 'Threat Mitigated',
                        description: 'SQL injection attempt blocked',
                        icon: <Activity className="h-4 w-4" />,
                        color: 'text-green-500',
                        bgColor: 'bg-green-500/10'
                      }
                    ].map((event, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className={`relative z-10 p-2 rounded-full ${event.bgColor} ${event.color}`}>
                          {event.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{event.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.time}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">5</div>
                    <p className="text-sm text-muted-foreground">Critical Events</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">12</div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">28</div>
                    <p className="text-sm text-muted-foreground">Medium Risk</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">18</div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedVisualizations;