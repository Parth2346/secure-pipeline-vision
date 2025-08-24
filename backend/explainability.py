import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from scipy import stats
import logging

logger = logging.getLogger(__name__)

class ExplainabilityEngine:
    """
    Provides explanations for why samples were flagged as anomalies
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_importance = {}
        self.thresholds = {}
        
    def explain_anomaly(self, sample: Dict[str, Any], reference_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Explain why a sample was flagged as anomalous
        """
        explanations = {
            'sample_id': sample.get('id', 'unknown'),
            'risk_score': sample.get('risk_score', 0),
            'primary_reasons': [],
            'feature_contributions': {},
            'statistical_deviations': {},
            'recommendations': []
        }
        
        try:
            # Convert sample to DataFrame for processing
            sample_df = pd.DataFrame([sample])
            numeric_cols = sample_df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) == 0:
                explanations['primary_reasons'].append("No numeric features found for analysis")
                return explanations
                
            # Statistical deviation analysis
            for col in numeric_cols:
                if col in reference_data.columns:
                    sample_value = sample_df[col].iloc[0]
                    ref_values = reference_data[col].dropna()
                    
                    if len(ref_values) > 0:
                        mean_ref = ref_values.mean()
                        std_ref = ref_values.std()
                        
                        if std_ref > 0:
                            z_score = abs((sample_value - mean_ref) / std_ref)
                            explanations['statistical_deviations'][col] = {
                                'z_score': float(z_score),
                                'sample_value': float(sample_value),
                                'reference_mean': float(mean_ref),
                                'reference_std': float(std_ref),
                                'percentile': float(stats.percentileofscore(ref_values, sample_value))
                            }
                            
                            # Flag significant deviations
                            if z_score > 3:
                                explanations['primary_reasons'].append(
                                    f"Extreme outlier in {col}: {z_score:.2f} standard deviations from normal"
                                )
                                explanations['feature_contributions'][col] = float(z_score * 0.3)
                            elif z_score > 2:
                                explanations['primary_reasons'].append(
                                    f"Significant deviation in {col}: {z_score:.2f} standard deviations"
                                )
                                explanations['feature_contributions'][col] = float(z_score * 0.2)
            
            # Distribution shift detection
            shift_score = self._detect_distribution_shift(sample_df, reference_data)
            if shift_score > 0.7:
                explanations['primary_reasons'].append(
                    f"Distribution shift detected (score: {shift_score:.2f})"
                )
                explanations['feature_contributions']['distribution_shift'] = float(shift_score)
            
            # Duplicate detection
            duplicate_score = self._check_duplicates(sample_df, reference_data)
            if duplicate_score > 0.8:
                explanations['primary_reasons'].append(
                    f"Potential duplicate detected (similarity: {duplicate_score:.2f})"
                )
                explanations['feature_contributions']['duplicate_likelihood'] = float(duplicate_score)
            
            # Generate recommendations
            explanations['recommendations'] = self._generate_recommendations(explanations)
            
            # Sort primary reasons by importance
            explanations['primary_reasons'] = sorted(
                explanations['primary_reasons'], 
                key=lambda x: self._get_reason_priority(x), 
                reverse=True
            )[:3]  # Top 3 reasons
            
        except Exception as e:
            logger.error(f"Error explaining anomaly: {str(e)}")
            explanations['primary_reasons'].append(f"Analysis error: {str(e)}")
        
        return explanations
    
    def _detect_distribution_shift(self, sample_df: pd.DataFrame, reference_data: pd.DataFrame) -> float:
        """
        Detect if sample comes from a different distribution than reference data
        """
        try:
            numeric_cols = sample_df.select_dtypes(include=[np.number]).columns
            shift_scores = []
            
            for col in numeric_cols:
                if col in reference_data.columns:
                    sample_val = sample_df[col].iloc[0]
                    ref_vals = reference_data[col].dropna()
                    
                    if len(ref_vals) > 10:  # Need sufficient reference data
                        # Use percentile-based approach
                        percentile = stats.percentileofscore(ref_vals, sample_val)
                        
                        # Score based on how extreme the percentile is
                        if percentile < 1 or percentile > 99:
                            shift_scores.append(0.9)
                        elif percentile < 5 or percentile > 95:
                            shift_scores.append(0.7)
                        elif percentile < 10 or percentile > 90:
                            shift_scores.append(0.5)
                        else:
                            shift_scores.append(0.1)
            
            return np.mean(shift_scores) if shift_scores else 0.0
            
        except Exception as e:
            logger.error(f"Error in distribution shift detection: {str(e)}")
            return 0.0
    
    def _check_duplicates(self, sample_df: pd.DataFrame, reference_data: pd.DataFrame) -> float:
        """
        Check similarity to existing samples
        """
        try:
            numeric_cols = sample_df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) == 0:
                return 0.0
            
            sample_values = sample_df[numeric_cols].iloc[0].values
            ref_values = reference_data[numeric_cols].values
            
            # Calculate cosine similarity with all reference samples
            similarities = []
            for ref_row in ref_values:
                if not np.any(np.isnan(ref_row)) and not np.any(np.isnan(sample_values)):
                    similarity = np.dot(sample_values, ref_row) / (
                        np.linalg.norm(sample_values) * np.linalg.norm(ref_row)
                    )
                    similarities.append(abs(similarity))
            
            return max(similarities) if similarities else 0.0
            
        except Exception as e:
            logger.error(f"Error in duplicate detection: {str(e)}")
            return 0.0
    
    def _generate_recommendations(self, explanations: Dict[str, Any]) -> List[str]:
        """
        Generate actionable recommendations based on explanations
        """
        recommendations = []
        
        # Based on primary reasons
        for reason in explanations['primary_reasons']:
            if 'outlier' in reason.lower():
                recommendations.append("Verify data collection process for this sample")
                recommendations.append("Check if extreme values are measurement errors")
            elif 'distribution shift' in reason.lower():
                recommendations.append("Review data preprocessing pipeline")
                recommendations.append("Consider retraining model with recent data")
            elif 'duplicate' in reason.lower():
                recommendations.append("Check for data leakage or repeated entries")
                recommendations.append("Review data deduplication process")
        
        # Based on statistical deviations
        high_z_features = [
            feat for feat, contrib in explanations['feature_contributions'].items()
            if contrib > 0.5
        ]
        
        if high_z_features:
            recommendations.append(f"Focus investigation on features: {', '.join(high_z_features[:3])}")
        
        # General recommendations
        if explanations['risk_score'] > 0.8:
            recommendations.append("High risk sample - requires immediate manual review")
        elif explanations['risk_score'] > 0.6:
            recommendations.append("Medium risk sample - consider additional validation")
        
        # Remove duplicates and limit to top 5
        recommendations = list(dict.fromkeys(recommendations))[:5]
        
        return recommendations
    
    def _get_reason_priority(self, reason: str) -> int:
        """
        Assign priority scores to different types of reasons
        """
        reason_lower = reason.lower()
        
        if 'extreme outlier' in reason_lower:
            return 10
        elif 'outlier' in reason_lower:
            return 8
        elif 'distribution shift' in reason_lower:
            return 7
        elif 'duplicate' in reason_lower:
            return 6
        elif 'deviation' in reason_lower:
            return 5
        else:
            return 1
    
    def explain_batch(self, anomalous_samples: List[Dict[str, Any]], 
                     reference_data: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Explain multiple anomalous samples
        """
        explanations = []
        
        for sample in anomalous_samples:
            explanation = self.explain_anomaly(sample, reference_data)
            explanations.append(explanation)
        
        return explanations
    
    def get_feature_importance_summary(self, explanations: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Aggregate feature importance across all explanations
        """
        feature_importance = {}
        
        for explanation in explanations:
            for feature, contribution in explanation.get('feature_contributions', {}).items():
                if feature not in feature_importance:
                    feature_importance[feature] = []
                feature_importance[feature].append(contribution)
        
        # Calculate average importance
        importance_summary = {
            feature: np.mean(contributions)
            for feature, contributions in feature_importance.items()
        }
        
        # Sort by importance
        return dict(sorted(importance_summary.items(), key=lambda x: x[1], reverse=True))