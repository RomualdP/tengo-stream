export interface StreamsPageParams {
  type: 'streams';
}

export interface PipelinePageParams {
  type: 'pipeline';
}

export interface TenderDetailPageParams {
  type: 'tender-detail';
  tenderId: number;
  returnTo?: 'streams' | 'pipeline';
}

export type PageParams = StreamsPageParams | PipelinePageParams | TenderDetailPageParams;

export interface NavigationState {
  currentPage: PageParams;
  history: PageParams[];
}
