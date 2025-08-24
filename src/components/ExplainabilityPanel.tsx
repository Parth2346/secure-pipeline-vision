import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Info,
  Zap
} from 'lucide-react';

const ExplainabilityPanel = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState('ANO_001');
  const [selectedModel, setSelectedModel] = useState('ensemble');

  // Mock explanation data
  const explanations = {
    'ANO_001': {
      id: 'ANO_001',
      type: 'Statistical Outlier',
      confidence: 0.94,
      riskScore: 9.1,
      feature: 'transaction_amount',
      value: '$45,892.33',
      featureImportance: [
        { feature: 'transaction_amount', importance: 85, contribution: 'positive', description: 'Amount significantly exceeds historical patterns' },
        { feature: 'time_of_day', importance: 12, contribution: 'positive', description: 'Transaction occurred outside normal business hours' },
        { feature: 'user_location', importance: 8, contribution: 'negative', description: 'Location consistent with user profile' },
        { feature: 'payment_method', importance: 6, contribution: 'positive', description: 'New payment method used' },
        { feature: 'merchant_category', importance: 4, contribution: 'neutral', description: 'Standard merchant category' }
      ],
      distributionAnalysis: {
        mean: 2450.00,
        stdDev: 1200.50,
        percentile99: 8500.00,
        zScore: 18.7,
        historicalContext: 'This transaction amount is 18.7 standard deviations above the mean, placing it in the 99.99th percentile.'
      },
      modelDecision: {
        primaryReason: 'Extreme statistical outlier in transaction amount',
        contributingFactors: [
          'Transaction amount: $45,892.33 vs expected ~$2,450',
          'Timing: 2:34 AM (unusual for this user)',
          'New payment method introduction',
          'No prior transactions above $10,000'
        ],
        confidence: 'Very High (94%)',
        threshold: 'Outlier threshold: >3σ (actual: 18.7σ)'
      }
    },
    'ANO_002': {
      id: 'ANO_002',
      type: 'Distribution Drift',
      confidence: 0.87,
      riskScore: 7.4,
      feature: 'user_behavior_score',
      value: '8.2',
      featureImportance: [
        { feature: 'session_duration', importance: 45, contribution: 'positive', description: 'Sessions 3x longer than typical' },
        { feature: 'page_views_per_session', importance: 32, contribution: 'positive', description: 'Unusually high page engagement' },
        { feature: 'click_patterns', importance: 28, contribution: 'positive', description: 'Non-human-like clicking behavior' },
        { feature: 'device_fingerprint', importance: 18, contribution: 'negative', description: 'Consistent device usage' },
        { feature: 'geographic_location', importance: 12, contribution: 'neutral', description: 'Standard location' }
      ],
      distributionAnalysis: {
        mean: 5.4,
        stdDev: 1.2,
        percentile99: 7.8,
        zScore: 2.1,
        historicalContext: 'User behavior score has shifted significantly from baseline over the past 7 days.'
      },
      modelDecision: {
        primaryReason: 'Significant deviation from established user behavior patterns',
        contributingFactors: [
          'Behavior score: 8.2 vs typical range 4.2-6.6',
          'Session patterns suggest automated activity',
          'Engagement metrics inconsistent with human behavior',
          'Gradual shift observed over 7-day period'
        ],
        confidence: 'High (87%)',
        threshold: 'Drift threshold: >2σ change (actual: 2.1σ)'
      }
    }
  };

  const currentExplanation = explanations[selectedAnomaly as keyof typeof explanations];

  const getContributionColor = (contribution: string) => {
    switch (contribution) {
      case 'positive': return 'text-red-500';
      case 'negative': return 'text-green-500';
      case 'neutral': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getContributionBadge = (contribution: string) => {
    switch (contribution) {
      case 'positive': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'negative': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'neutral': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Explainability & Transparency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Anomaly to Explain</label>
              <Select value={selectedAnomaly} onValueChange={setSelectedAnomaly}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANO_001">ANO_001 - Statistical Outlier (Critical)</SelectItem>
                  <SelectItem value="ANO_002">ANO_002 - Distribution Drift (Medium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Explanation Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensemble">Ensemble Explanation</SelectItem>
                  <SelectItem value="shap">SHAP Values</SelectItem>
                  <SelectItem value="lime">LIME Analysis</SelectItem>
                  <SelectItem value="statistical">Statistical Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Explanation */}
      {currentExplanation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Anomaly Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Anomaly ID</span>
                <Badge variant="outline">{currentExplanation.id}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Type</span>
                <Badge>{currentExplanation.type}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Risk Score</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-destructive">
                    {currentExplanation.riskScore}/10
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Model Confidence</span>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {Math.round(currentExplanation.confidence * 100)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-medium">Affected Feature</span>
                <div className="bg-muted p-2 rounded font-mono text-sm">
                  {currentExplanation.feature}: <span className="font-bold">{currentExplanation.value}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Decision Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Why This Was Flagged
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Primary Reason</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  {currentExplanation.modelDecision.primaryReason}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contributing Factors</h4>
                <ul className="space-y-2">
                  {currentExplanation.modelDecision.contributingFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-sm font-medium">Confidence</span>
                  <p className="text-sm text-muted-foreground">{currentExplanation.modelDecision.confidence}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Threshold</span>
                  <p className="text-sm text-muted-foreground">{currentExplanation.modelDecision.threshold}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Importance Analysis */}
      {currentExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Feature Importance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                This analysis shows how much each feature contributed to the anomaly detection decision.
              </p>
              
              {currentExplanation.featureImportance.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.feature}</span>
                      <Badge variant="outline" className={getContributionBadge(item.contribution)}>
                        {item.contribution}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{item.importance}%</span>
                  </div>
                  
                  <Progress value={item.importance} className="h-2" />
                  
                  <p className="text-xs text-muted-foreground pl-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistical Context */}
      {currentExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Statistical Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Distribution Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Historical Mean</span>
                    <span className="font-mono">${currentExplanation.distributionAnalysis.mean.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Deviation</span>
                    <span className="font-mono">±${currentExplanation.distributionAnalysis.stdDev.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>99th Percentile</span>
                    <span className="font-mono">${currentExplanation.distributionAnalysis.percentile99.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Z-Score</span>
                    <span className="font-mono font-bold text-destructive">{currentExplanation.distributionAnalysis.zScore}σ</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Interpretation</h4>
                <div className="bg-muted p-3 rounded">
                  <p className="text-sm">
                    {currentExplanation.distributionAnalysis.historicalContext}
                  </p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Normal Range</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">
                    Values within ±3σ are typically considered normal
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Anomaly Threshold</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">
                    Values beyond ±3σ are flagged as statistical outliers
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Export Explanation</h3>
              <p className="text-sm text-muted-foreground">
                Download detailed explanation report for compliance and audit purposes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainabilityPanel;