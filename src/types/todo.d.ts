
export declare interface Todo {
    id: number,
    name: string,
    completed: boolean
}

export declare type FiltersKey = keyof Filters

export declare type Filters = {
    all: (T: Array<Todo>) => T,
    active: (T: Array<Todo>)  => T,
    completed: (T: Array<Todo>)  => T
}