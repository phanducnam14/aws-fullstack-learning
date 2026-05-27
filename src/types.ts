export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export type Category = 
  | 'Life' 
  | 'TOEIC' 
  | 'Frontend' 
  | 'Backend' 
  | 'AWS' 
  | 'E-learning' 
  | 'Project' 
  | 'Review';

export interface StudyDay {
  id: string; // e.g. "week6-day1"
  week: number;
  dayOfWeek: string; // "Thứ 2", "Thứ 3", etc.
  dateString: string; // "27/5"
  fullDate: string; // "2026-05-27"
  originalContent: string;
  categories: Category[];
  tasks: SubTask[];
  notes: string;
}

export interface WeeklyStatus {
  week: number;
  expanded: boolean;
}
