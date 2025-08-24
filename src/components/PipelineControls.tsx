import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Zap, 
  Shield,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PipelineControlsProps {
  status: 'idle' | 'running' | 'completed' | 'error';
  onStatusChange: (status: 'idle' | 'running' | 'completed' | 'error') => void;
}

const PipelineControls: React.FC<PipelineControlsProps> = ({ status, onStatusChange }) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [sensitivityLevel, setSensitivityLevel] = useState([75]);
  const [enableRealTime, setEnableRealTime] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const { toast } = useToast();

  const pipelineStages = [
    { name: 'Data Validation', icon: Shield, duration: 2000 },
    { name: 'Preprocessing', icon: Settings, duration: 3000 },
    { name: 'Feature Engineering', icon: Brain, duration: 4000 },
    { name: 'Anomaly Detection', icon: TrendingUp, duration: 5000 },
    { name: 'Security Analysis', icon: Shield, duration: 3000 },
    { name: 'Report Generation', icon: CheckCircle2, duration: 2000 }
  ];

  const startPipeline = async () => {
    onStatusChange('running');
    setProgress(0);
    
    for (let i = 0; i < pipelineStages.length; i++) {
      const stage = pipelineStages[i];
      setCurrentStage(stage.name);
      
      // Simulate stage processing
      const stageProgress = (i / pipelineStages.length) * 100;
      setProgress(stageProgress);
      
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      
      // Update progress within stage
      setProgress(((i + 1) / pipelineStages.length) * 100);
    }
    
    setCurrentStage('Completed');
    onStatusChange('completed');
    toast({
      title: "Pipeline Completed",
      description: "Security analysis completed successfully. Check results in other tabs.",
    });
  };

  const pausePipeline = () => {
    onStatusChange('idle');
    setCurrentStage('Paused');
    toast({
      title: "Pipeline Paused",
      description: "Processing has been paused. Click resume to continue.",
    });
  };

  const stopPipeline = () => {
    onStatusChange('idle');
    setProgress(0);
    setCurrentStage('');
    toast({
      title: "Pipeline Stopped",
      description: "Processing has been stopped and reset.",
    });
  };

  const resetPipeline = () => {
    onStatusChange('idle');
    setProgress(0);
    setCurrentStage('');
  };

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Pipeline Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={startPipeline}
              disabled={status === 'running'}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Play className="mr-2 h-4 w-4" />
              {status === 'idle' ? 'Start Pipeline' : 'Resume'}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={pausePipeline}
              disabled={status !== 'running'}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            
            <Button 
              variant="destructive"
              onClick={stopPipeline}
              disabled={status === 'idle'}
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
            
            <Button 
              variant="outline"
              onClick={resetPipeline}
              disabled={status === 'running'}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Status and Progress */}
          {status === 'running' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-gradient-primary">
                    <Zap className="h-3 w-3 mr-1 animate-pulse" />
                    Processing
                  </Badge>
                  <span className="text-sm font-medium">{currentStage}</span>
                </div>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {status === 'completed' && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-gradient-risk-low">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
              <span className="text-sm text-muted-foreground">Pipeline finished successfully</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pipeline Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Detection Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ensemble">Ensemble Model (Recommended)</SelectItem>
                <SelectItem value="isolation-forest">Isolation Forest</SelectItem>
                <SelectItem value="one-class-svm">One-Class SVM</SelectItem>
                <SelectItem value="local-outlier">Local Outlier Factor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sensitivity Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Anomaly Sensitivity</Label>
              <span className="text-sm text-muted-foreground">{sensitivityLevel[0]}%</span>
            </div>
            <Slider
              value={sensitivityLevel}
              onValueChange={setSensitivityLevel}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Real-time Processing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Real-time Monitoring</Label>
              <p className="text-sm text-muted-foreground">
                Enable continuous anomaly detection
              </p>
            </div>
            <Switch
              checked={enableRealTime}
              onCheckedChange={setEnableRealTime}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pipelineStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = status === 'completed' || (status === 'running' && progress > (index / pipelineStages.length) * 100);
              const isCurrent = status === 'running' && currentStage === stage.name;
              
              return (
                <div 
                  key={stage.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isCurrent ? 'bg-primary/10 border-primary' : 
                    isCompleted ? 'bg-success/10 border-success' : 
                    'bg-muted/30 border-muted'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCurrent ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-success text-success-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <StageIcon className="h-4 w-4" />
                  </div>
                  <span className={`font-medium ${
                    isCurrent ? 'text-primary' : 
                    isCompleted ? 'text-success' : 
                    'text-muted-foreground'
                  }`}>
                    {stage.name}
                  </span>
                  {isCompleted && !isCurrent && (
                    <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
                  )}
                  {isCurrent && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineControls;