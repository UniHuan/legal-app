export interface Scenario {
  id: string; title: string; category: string; conclusion: string;
  conclusion_type: 'good'|'warn'|'bad'; steps: string[];
  legal_analysis: string; warnings: string[]; article_numbers: number[];
  value_tags: string[]; difficulty: string; view_count: number;
}
export interface Article {
  article_number: number; book: number; book_title: string; chapter: string;
  content_original: string; content_plain: string; one_liner: string;
  value_tags: string[];
}
export interface Value {
  id: string; name: string; tier: 'national'|'social'|'personal';
  description: string; legal_basis: string; icon: string;
  scenario_count: number; sort_order: number;
}
export interface Quiz {
  id: string; question: string; options: {label:string;text:string}[];
  correct_answer: string; explanation: string;
  article_number: number; value_tags: string[]; publish_date: string;
}
export interface Template {
  id: string; type: string; title: string; description: string;
  content_format: string; fill_guide: string; warnings: string[];
}
