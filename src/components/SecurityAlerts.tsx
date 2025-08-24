import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Target,
  TrendingUp,
  Activity,
  Lock,
  Key,
  Database,
  Network,
  UserX,
  FileWarning
} from 'lucide-react';

const SecurityAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Mock security data
  const securityOverview = {
    overallRiskScore: 7.2,
    totalThreats: 23,
    criticalAlerts: 5,
    activeIncidents: 2,
    resolvedToday: 18
  };

  const securityAlerts = [
    {
      id: 'SEC_001',
      timestamp: '2024-01-20 14:45:32',
      type: 'Data Breach Attempt',
      severity: 'critical',
      status: 'active',
      riskScore: 9.1,
      source: 'API Gateway',
      description: 'Multiple failed authentication attempts detected from suspicious IP ranges',
      affectedSystems: ['User Database', 'API Gateway', 'Auth Service'],
      indicators: [
        'IP: 192.168.1.100 - 47 failed attempts',
        'User enumeration patterns detected',
        'Automated attack signatures found'
      ],
      recommendedActions: [
        'Block suspicious IP ranges immediately',
        'Enable additional rate limiting',
        'Review user account security'
      ]
    },
    {
      id: 'SEC_002',
      timestamp: '2024-01-20 14:32:18',
      type: 'Privilege Escalation',
      severity: 'high',
      status: 'investigating',
      riskScore: 8.4,
      source: 'User Management',
      description: 'Unauthorized elevation of user privileges detected',
      affectedSystems: ['User Management', 'Admin Panel'],
      indicators: [
        'User ID: 12847 role changed from "user" to "admin"',
        'No approval workflow record found',
        'Activity outside normal business hours'
      ],
      recommendedActions: [
        'Immediately revoke elevated privileges',
        'Audit all recent role changes',
        'Review access control mechanisms'
      ]
    },
    {
      id: 'SEC_003',
      timestamp: '2024-01-20 14:18:45',
      type: 'Data Exfiltration',
      severity: 'high',
      status: 'active',
      riskScore: 8.7,
      source: 'File System Monitor',
      description: 'Unusual data access patterns suggesting potential data theft',
      affectedSystems: ['File Storage', 'Database', 'Network'],
      indicators: [
        'Bulk download of 50GB+ sensitive data',
        'Access to files outside normal user scope',
        'Data transfer to external endpoints'
      ],
      recommendedActions: [
        'Immediately block data transfers',
        'Investigate user account activity',
        'Review data access permissions'
      ]
    },
    {
      id: 'SEC_004',
      timestamp: '2024-01-20 13:56:12',
      type: 'SQL Injection Attempt',
      severity: 'medium',
      status: 'mitigated',
      riskScore: 6.2,
      source: 'Web Application Firewall',
      description: 'SQL injection patterns detected in web requests',
      affectedSystems: ['Web Application', 'Database'],
      indicators: [
        'Malicious SQL patterns in POST requests',
        'Multiple injection vectors attempted',
        'Requests blocked by WAF rules'
      ],
      recommendedActions: [
        'Update WAF rules if needed',
        'Review application input validation',
        'Monitor for similar attack patterns'
      ]
    },
    {
      id: 'SEC_005',
      timestamp: '2024-01-20 13:42:33',
      type: 'Malware Detection',
      severity: 'medium',
      status: 'resolved',
      riskScore: 5.8,
      source: 'Endpoint Security',
      description: 'Potentially malicious file detected on user endpoint',
      affectedSystems: ['Endpoint', 'File Scanner'],
      indicators: [
        'File hash: a1b2c3... matches known malware',
        'Suspicious network connections',
        'File quarantined successfully'
      ],
      recommendedActions: [
        'Full system scan completed',
        'User security training recommended',
        'Update endpoint protection rules'
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'bg-gradient-to-r from-red-600 to-red-700',
      high: 'bg-gradient-risk-high',
      medium: 'bg-gradient-risk-medium',
      low: 'bg-gradient-risk-low'
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-3 w-3" />;
      case 'investigating': return <Clock className="h-3 w-3" />;
      case 'mitigated': return <Shield className="h-3 w-3" />;
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Data Breach Attempt': return <UserX className="h-5 w-5" />;
      case 'Privilege Escalation': return <Key className="h-5 w-5" />;
      case 'Data Exfiltration': return <Database className="h-5 w-5" />;
      case 'SQL Injection Attempt': return <Target className="h-5 w-5" />;
      case 'Malware Detection': return <FileWarning className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-500';
    if (score >= 6) return 'text-orange-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRiskScoreColor(securityOverview.overallRiskScore)}`}>
                {securityOverview.overallRiskScore}/10
              </div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-xl font-bold">{securityOverview.totalThreats}</p>
              </div>
              <Target className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-xl font-bold text-red-500">{securityOverview.criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-orange-500">{securityOverview.activeIncidents}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold text-green-500">{securityOverview.resolvedToday}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Banner */}
      {securityOverview.criticalAlerts > 0 && (
        <Alert className="border-red-500 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{securityOverview.criticalAlerts} critical security alerts</strong> require immediate action. 
            Investigate and respond to these threats immediately to prevent potential breaches.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Alerts & Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  alert.severity === 'critical' ? 'border-red-500/50' : ''
                }`}
                onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-muted ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.id}</h3>
                          <Badge className={getSeverityBadge(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getStatusIcon(alert.status)}
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getRiskScoreColor(alert.riskScore)}`}>
                        {alert.riskScore}/10
                      </div>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">{alert.type}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Source: <span className="font-medium">{alert.source}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {selectedAlert === alert.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {selectedAlert === alert.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Affected Systems</h5>
                          <ul className="text-sm space-y-1">
                            {alert.affectedSystems.map((system, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Network className="h-3 w-3 text-muted-foreground" />
                                {system}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Threat Indicators</h5>
                          <ul className="text-sm space-y-1">
                            {alert.indicators.map((indicator, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Target className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="text-xs font-mono">{indicator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Recommended Actions</h5>
                        <ul className="text-sm space-y-1">
                          {alert.recommendedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="bg-gradient-primary">
                          <Lock className="h-3 w-3 mr-1" />
                          Mitigate Threat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAlerts;