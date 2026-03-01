import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mountain, Calendar, ExternalLink, Wind, Snowflake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AvalancheProblem {
  type: string;
  aspects: string[];
  elevation?: {
    lowerBound?: string;
    upperBound?: string;
  };
  timePeriod?: string;
}

interface AvalancheData {
  riskLevel: number;
  riskLevelLabel: string;
  regionName: string;
  validFrom: string | null;
  validTo: string | null;
  altitude: {
    low: number | null;
    high: number | null;
  };
  problems: AvalancheProblem[];
  commentary: string;
  tendency: string | null;
  snowpackComment: string | null;
  lastUpdate: string | null;
  source: string;
  sourceUrl: string;
  error?: string;
}

interface AvalancheRiskProps {
  region?: string; // EAWS region code (e.g., "AT-07" for Tyrol)
}

export const AvalancheRisk = ({ region = "AT-07" }: AvalancheRiskProps) => {
  const [avalancheData, setAvalancheData] = useState<AvalancheData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvalancheData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('eaws-avalanche', {
          body: { region },
        });

        if (error) throw error;
        setAvalancheData(data);
      } catch (error) {
        console.error('Error fetching avalanche data:', error);
        setAvalancheData({
          riskLevel: 0,
          riskLevelLabel: 'Unavailable',
          regionName: 'Unknown',
          validFrom: null,
          validTo: null,
          altitude: { low: null, high: null },
          problems: [],
          commentary: '',
          tendency: null,
          snowpackComment: null,
          lastUpdate: null,
          source: 'avalanche.report',
          sourceUrl: 'https://avalanche.report/bulletin/latest',
          error: 'Unable to fetch avalanche data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvalancheData();
  }, [region]);

  const getRiskColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'bg-green-500',
      2: 'bg-yellow-500',
      3: 'bg-orange-500',
      4: 'bg-red-500',
      5: 'bg-purple-600',
    };
    return colors[level] || 'bg-gray-400';
  };

  const getRiskTextColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'text-green-700 dark:text-green-400',
      2: 'text-yellow-700 dark:text-yellow-400',
      3: 'text-orange-700 dark:text-orange-400',
      4: 'text-red-700 dark:text-red-400',
      5: 'text-purple-700 dark:text-purple-400',
    };
    return colors[level] || 'text-gray-700 dark:text-gray-400';
  };

  const getProblemIcon = (type: string) => {
    if (type.toLowerCase().includes('wind')) return <Wind className="h-4 w-4" />;
    if (type.toLowerCase().includes('snow')) return <Snowflake className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Avalanche Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!avalancheData || avalancheData.error || avalancheData.riskLevel === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mountain className="h-5 w-5" />
              Avalanche Risk — {avalancheData?.regionName || 'Tyrol'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {avalancheData?.commentary || 'Check the avalanche bulletin for current conditions before your tour.'}
            </p>
            <a 
              href="https://avalanche.report/bulletin/latest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View current bulletin on avalanche.report
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Avalanche Risk — {avalancheData.regionName}
          </CardTitle>
          <a 
            href={avalancheData.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          >
            avalanche.report <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${getRiskColor(avalancheData.riskLevel)} flex items-center justify-center`}>
            <span className="text-2xl font-bold text-white">
              {avalancheData.riskLevel || '?'}
            </span>
          </div>
          <div className="flex-1">
            <p className={`text-lg font-semibold ${getRiskTextColor(avalancheData.riskLevel)}`}>
              {avalancheData.riskLevelLabel}
            </p>
            <p className="text-sm text-muted-foreground">European Avalanche Danger Scale</p>
          </div>
        </div>

        {avalancheData.altitude.low !== null && avalancheData.altitude.high !== null && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Risk applies above {avalancheData.altitude.low}m, critical above {avalancheData.altitude.high}m
            </span>
          </div>
        )}

        {(avalancheData.validFrom || avalancheData.validTo) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Valid: {avalancheData.validFrom ? new Date(avalancheData.validFrom).toLocaleDateString() : ''} 
              {avalancheData.validTo ? ` - ${new Date(avalancheData.validTo).toLocaleDateString()}` : ''}
            </span>
          </div>
        )}

        {avalancheData.problems.length > 0 && (
          <div className="space-y-2">
            <p className="font-semibold text-sm">Avalanche Problems:</p>
            <div className="flex flex-wrap gap-2">
              {avalancheData.problems.map((problem, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {getProblemIcon(problem.type)}
                  {problem.type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {avalancheData.tendency && (
          <Badge variant="secondary" className="w-fit">
            Tendency: {avalancheData.tendency}
          </Badge>
        )}

        {avalancheData.commentary && (
          <div className="text-sm">
            <p className="font-semibold mb-1">Avalanche Activity:</p>
            <p className="text-muted-foreground whitespace-pre-line">{avalancheData.commentary}</p>
          </div>
        )}

        {avalancheData.snowpackComment && (
          <div className="text-sm">
            <p className="font-semibold mb-1">Snowpack Structure:</p>
            <p className="text-muted-foreground">{avalancheData.snowpackComment}</p>
          </div>
        )}

        {avalancheData.lastUpdate && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(avalancheData.lastUpdate).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
