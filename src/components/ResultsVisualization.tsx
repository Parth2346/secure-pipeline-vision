import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter,
  Table,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const ResultsVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState('anomalies');
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data
  const summaryStats = {
    totalRecords: 15847,
    anomaliesDetected: 234,
    highRiskItems: 45,
    mediumRiskItems: 123,
    lowRiskItems: 66,
    processingTime: '4m 32s'
  };

  const anomalyTypes = [
    { type: 'Statistical Outliers', count: 89, percentage: 38, risk: 'medium' },
    { type: 'Distribution Drift', count: 67, percentage: 29, risk: 'high' },
    { type: 'Data Quality Issues', count: 45, percentage: 19, risk: 'low' },
    { type: 'Pattern Anomalies', count: 33, percentage: 14, risk: 'high' }
  ];

  const recentDetections = [
    {
      id: 'ANO_001',
      timestamp: '2024-01-20 14:32:18',
      type: 'Statistical Outlier',
      risk: 'high',
      confidence: 0.94,
      feature: 'transaction_amount',
      value: '$45,892.33'
    },
    {
      id: 'ANO_002', 
      timestamp: '2024-01-20 14:28:45',
      type: 'Distribution Drift',
      risk: 'medium',
      confidence: 0.87,
      feature: 'user_behavior_score',
      value: '2.1 σ'
    },
    {
      id: 'ANO_003',
      timestamp: '2024-01-20 14:25:12',
      type: 'Pattern Anomaly',
      risk: 'high',
      confidence: 0.91,
      feature: 'access_pattern',
      value: 'Unusual sequence'
    },
    {
      id: 'ANO_004',
      timestamp: '2024-01-20 14:22:33',
      type: 'Data Quality',
      risk: 'low',
      confidence: 0.76,
      feature: 'missing_values',
      value: '15% increase'
    }
  ];

  const getRiskBadge = (risk: string) => {
    const variants = {
      high: 'bg-gradient-risk-high',
      medium: 'bg-gradient-risk-medium', 
      low: 'bg-gradient-risk-low'
    };
    return variants[risk as keyof typeof variants] || variants.low;
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{summaryStats.totalRecords.toLocaleString()}</p>
              </div>
              <Table className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Anomalies Found</p>
                <p className="text-2xl font-bold text-destructive">{summaryStats.anomaliesDetected}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-destructive">{summaryStats.highRiskItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold text-success">{summaryStats.processingTime}</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Anomaly Distribution
              </CardTitle>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalyTypes.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskBadge(item.risk)}>
                        {getRiskIcon(item.risk)}
                        {item.risk.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.count} cases</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        item.risk === 'high' ? 'from-red-500 to-red-600' :
                        item.risk === 'medium' ? 'from-yellow-500 to-yellow-600' :
                        'from-green-500 to-green-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">
                  {Math.round((summaryStats.anomaliesDetected / summaryStats.totalRecords) * 100 * 100) / 100}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Anomaly Rate</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="h-2 bg-gradient-risk-high rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">30%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medium Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="h-2 bg-gradient-risk-medium rounded-full" style={{ width: '52%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">52%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low Risk</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="h-2 bg-gradient-risk-low rounded-full" style={{ width: '18%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Detections Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recent Detections
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Timestamp</th>
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Risk Level</th>
                  <th className="text-left py-3 px-2">Confidence</th>
                  <th className="text-left py-3 px-2">Feature</th>
                  <th className="text-left py-3 px-2">Value</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((detection, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-mono text-xs">{detection.id}</td>
                    <td className="py-3 px-2 text-xs">{detection.timestamp}</td>
                    <td className="py-3 px-2">{detection.type}</td>
                    <td className="py-3 px-2">
                      <Badge className={`${getRiskBadge(detection.risk)} text-xs`}>
                        {getRiskIcon(detection.risk)}
                        {detection.risk.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{Math.round(detection.confidence * 100)}%</td>
                    <td className="py-3 px-2 font-mono text-xs">{detection.feature}</td>
                    <td className="py-3 px-2 font-mono text-xs">{detection.value}</td>
                    <td className="py-3 px-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsVisualization;