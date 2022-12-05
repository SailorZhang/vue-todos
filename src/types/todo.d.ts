interface Todo {
  id: number;
  name: string;
  completed: boolean;
}

type Filters = {
  all: (T: Array<Todo>) => T;
  active: (T: Array<Todo>) => T;
  completed: (T: Array<Todo>) => T;
};

type FiltersKey = keyof Filters;
