import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, BarChart3, AlertTriangle, Brain, Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import PipelineControls from '@/components/PipelineControls';
import ResultsVisualization from '@/components/ResultsVisualization';
import AnomalyDetection from '@/components/AnomalyDetection';
import SecurityAlerts from '@/components/SecurityAlerts';
import ExplainabilityPanel from '@/components/ExplainabilityPanel';
import AdvancedVisualizations from '@/components/AdvancedVisualizations';

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Secure ML Pipeline
                </h1>
                <p className="text-muted-foreground">Advanced Security & Anomaly Detection Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={pipelineStatus === 'running' ? 'default' : 'secondary'} className="px-3 py-1">
                <Zap className="h-4 w-4 mr-1" />
                {pipelineStatus === 'running' ? 'Processing' : 'Ready'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-secondary">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="explainability" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload onStatusChange={setPipelineStatus} />
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <PipelineControls 
              status={pipelineStatus} 
              onStatusChange={setPipelineStatus}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsVisualization />
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <AnomalyDetection />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityAlerts />
            <AdvancedVisualizations />
          </TabsContent>

          <TabsContent value="explainability" className="space-y-6">
            <ExplainabilityPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;