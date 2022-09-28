export interface Board {
  _id: string;
  user: string;
  title: string;
  description: string;
  icon: string;
  position: number;
  favourite: boolean;
  favouritePosition: number;
  sections: Section[];
}

export interface Section {
  _id: string;
  title: string;
  board: string;
  tasks: Task[];
}

export interface Task {
  _id: string;
  section: Section;
  title: string;
  content: string;
  position: number;
  createdAt: string;
}
