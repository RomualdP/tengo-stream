export interface Tender {
  id: number;
  title: string;
  cpvAsString: string[];
  category: 'SERVICES' | 'SUPPLIES' | 'WORKS';
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  publicationDate: string;
  responseDeadline: string;
  executionLocation: string | { postalCode: string } | null;
  buyerContact: {
    location: {
      city: string;
      postalCode: string;
    };
  };
  estimatedValueInEur: number;
  durationInMonth: number;
  durationInMonthMeta: {
    scrapedValue: string | null;
    dataPointSources: Array<{
      pageNumber: number;
      docFilePath: string;
      originalChunkExtract: string;
    }>;
    retreivedWithLLMValue: number;
  };
  estimatedValueInEurMeta: {
    scrapedValue: string | null;
    dataPointSources: Array<{
      pageNumber: number;
      docFilePath: string;
      originalChunkExtract: string;
    }>;
    retreivedWithLLMValue: number;
  };
  buyer: {
    id: number;
    originalName: string;
    normalizedName: string;
    normalizedAliases: string[];
  };
}

export type DecisionStatus = 'TO_ANALYZE' | 'REJECTED';

export interface Interaction {
  tenderId: number;
  decisionStatus: DecisionStatus;
}

export interface TenderSearchResponse {
  pagination: {
    skip: number;
    take: number;
  };
  results: Tender[];
  totalCount: number;
  remainingCount: number;
}

export interface Stream {
  id: string;
  name: string;
  description?: string;
  filters?: Record<string, unknown>;
  tenderCount: number;
}

export interface StreamStats {
  totalTenders: number;
  remainingTenders: number;
  analyzedTenders: number;
  rejectedTenders: number;
}
