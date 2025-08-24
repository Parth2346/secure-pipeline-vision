import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Download,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Activity,
  AlertCircle
} from 'lucide-react';

const AnomalyDetection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  // Mock anomaly data
  const anomalies = [
    {
      id: 'ANO_001',
      timestamp: '2024-01-20 14:32:18',
      type: 'Statistical Outlier',
      risk: 'high',
      confidence: 0.94,
      feature: 'transaction_amount',
      value: '$45,892.33',
      expected: '$2,450.00',
      deviation: '18.7σ',
      description: 'Transaction amount significantly exceeds normal range',
      affectedRecords: 1,
      source: 'payment_data.csv'
    },
    {
      id: 'ANO_002',
      timestamp: '2024-01-20 14:28:45', 
      type: 'Distribution Drift',
      risk: 'medium',
      confidence: 0.87,
      feature: 'user_behavior_score',
      value: '8.2',
      expected: '5.4 ± 1.2',
      deviation: '2.1σ',
      description: 'User behavior pattern has shifted from baseline',
      affectedRecords: 127,
      source: 'user_metrics.csv'
    },
    {
      id: 'ANO_003',
      timestamp: '2024-01-20 14:25:12',
      type: 'Pattern Anomaly',
      risk: 'high',
      confidence: 0.91,
      feature: 'access_pattern',
      value: 'Sequence: A→C→B→D',
      expected: 'A→B→C→D',
      deviation: 'Unusual sequence',
      description: 'Access pattern deviates from established user flows',
      affectedRecords: 23,
      source: 'access_logs.csv'
    },
    {
      id: 'ANO_004',
      timestamp: '2024-01-20 14:22:33',
      type: 'Data Quality Issue',
      risk: 'low',
      confidence: 0.76,
      feature: 'missing_values',
      value: '15.2%',
      expected: '< 2%',
      deviation: '13.2% increase',
      description: 'Significant increase in missing values detected',
      affectedRecords: 2407,
      source: 'customer_data.csv'
    },
    {
      id: 'ANO_005',
      timestamp: '2024-01-20 14:18:56',
      type: 'Temporal Anomaly',
      risk: 'medium',
      confidence: 0.83,
      feature: 'request_frequency',
      value: '245 req/min',
      expected: '45 ± 15 req/min',
      deviation: '4.3σ',
      description: 'Unusual spike in API request frequency',
      affectedRecords: 1,
      source: 'api_logs.csv'
    },
    {
      id: 'ANO_006',
      timestamp: '2024-01-20 14:15:23',
      type: 'Feature Correlation',
      risk: 'high',
      confidence: 0.89,
      feature: 'age_income_ratio',
      value: '0.02',
      expected: '0.45 ± 0.15',
      deviation: 'Negative correlation',
      description: 'Unexpected correlation between age and income features',
      affectedRecords: 45,
      source: 'demographics.csv'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

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
      case 'medium': return <AlertCircle className="h-3 w-3" />;
      case 'low': return <Activity className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Statistical Outlier': return <Target className="h-4 w-4" />;
      case 'Distribution Drift': return <TrendingUp className="h-4 w-4" />;
      case 'Pattern Anomaly': return <Activity className="h-4 w-4" />;
      case 'Data Quality Issue': return <AlertTriangle className="h-4 w-4" />;
      case 'Temporal Anomaly': return <Zap className="h-4 w-4" />;
      case 'Feature Correlation': return <TrendingDown className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSearch = anomaly.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anomaly.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anomaly.feature.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || anomaly.type === filterType;
    const matchesRisk = filterRisk === 'all' || anomaly.risk === filterRisk;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  const anomalyStats = {
    total: anomalies.length,
    high: anomalies.filter(a => a.risk === 'high').length,
    medium: anomalies.filter(a => a.risk === 'medium').length,
    low: anomalies.filter(a => a.risk === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Anomalies</p>
                <p className="text-2xl font-bold">{anomalyStats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-destructive">{anomalyStats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-2xl font-bold text-warning">{anomalyStats.medium}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-2xl font-bold text-success">{anomalyStats.low}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anomalies by ID, type, or feature..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Statistical Outlier">Statistical Outlier</SelectItem>
                <SelectItem value="Distribution Drift">Distribution Drift</SelectItem>
                <SelectItem value="Pattern Anomaly">Pattern Anomaly</SelectItem>
                <SelectItem value="Data Quality Issue">Data Quality Issue</SelectItem>
                <SelectItem value="Temporal Anomaly">Temporal Anomaly</SelectItem>
                <SelectItem value="Feature Correlation">Feature Correlation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Alert */}
      {anomalyStats.high > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{anomalyStats.high} high-risk anomalies</strong> require immediate attention. 
            Review and investigate these incidents to ensure system security.
          </AlertDescription>
        </Alert>
      )}

      {/* Anomaly Cards */}
      <div className="space-y-4">
        {filteredAnomalies.map((anomaly, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-muted ${getRiskColor(anomaly.risk)}`}>
                    {getTypeIcon(anomaly.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{anomaly.id}</h3>
                      <Badge className={getRiskBadge(anomaly.risk)}>
                        {getRiskIcon(anomaly.risk)}
                        {anomaly.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{anomaly.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{Math.round(anomaly.confidence * 100)}% confidence</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Anomaly Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Type:</span> {anomaly.type}</div>
                    <div><span className="text-muted-foreground">Feature:</span> <code>{anomaly.feature}</code></div>
                    <div><span className="text-muted-foreground">Source:</span> {anomaly.source}</div>
                    <div><span className="text-muted-foreground">Affected Records:</span> {anomaly.affectedRecords.toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Statistical Analysis</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Observed:</span> <code>{anomaly.value}</code></div>
                    <div><span className="text-muted-foreground">Expected:</span> <code>{anomaly.expected}</code></div>
                    <div><span className="text-muted-foreground">Deviation:</span> <code>{anomaly.deviation}</code></div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm">{anomaly.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnomalies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No anomalies found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnomalyDetection;