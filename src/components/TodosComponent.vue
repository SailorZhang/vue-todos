<script setup lang="ts">
import { ref, watchEffect, type Ref } from "vue";
import { computed } from "vue";

const visibility = ref<FiltersKey>("all");
const editedTodo = ref<Todo>();

const filter: Filters = {
  all: (todos: Array<Todo>) => todos,
  active: (todos: Array<Todo>) => todos.filter((x: Todo) => !x.completed),
  completed: (todos: Array<Todo>) => todos.filter((x: Todo) => x.completed),
};

// 处理路由
window.addEventListener("hashchange", onHashChange);
onHashChange();

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, "") as FiltersKey;
  if (route in filter) {
    visibility.value = route;
  } else {
    window.location.hash = "";
    visibility.value = "all";
  }
}

const todos: Ref<Array<Todo>> = ref(
  JSON.parse(sessionStorage.getItem("todos") || "[]")
);

function addTodo(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.value.trim()) {
    return;
  }
  todos.value.push({ id: Date.now(), name: target.value, completed: false });
  target.value = "";
}

const filteredTodos = computed<Todo[]>(() =>
  filter[visibility.value](todos.value)
);

const remaining = computed(() => {
  return filter.active(todos.value).length;
});

watchEffect(() => {
  sessionStorage.setItem("todos", JSON.stringify(todos.value));
});

function deleteTodo(todo: any) {
  todos.value.splice(todos.value.indexOf(todo), 1);
}

function clearCompleted() {
  todos.value = filter.active(todos.value);
}

let editNameCache = "";
function editTodo(todo: Todo) {
  if (!todo.completed) {
    editedTodo.value = todo;
    editNameCache = todo.name;
  }
}

function cancelEdit(todo: Todo) {
  editedTodo.value = undefined;
  todo.name = editNameCache;
}

function doneEdit(todo: Todo) {
  if (editedTodo.value) {
    todo.name = todo.name.trim();
    editedTodo.value = undefined;
    if (!todo.name) deleteTodo(todo);
  }
}

function mounted({ el }: { el: HTMLInputElement }) {
  el.focus();
}

function toggle(event: Event) {
  todos.value.forEach((todo) => {
    todo.completed = (event.target as HTMLInputElement).checked;
  });
}
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggle"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          class="todo"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
          v-for="todo of filteredTodos"
          :key="todo.id"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label v-on:dblclick="editTodo(todo)">{{ todo.name }}</label>
            <button class="destroy" @click="deleteTodo(todo)"></button>
          </div>
          <input
            v-if="editedTodo === todo"
            class="edit"
            type="text"
            v-model="todo.name"
            @vnode-mounted="mounted"
            v-on:blur="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
            @keyup.enter="doneEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong></strong>
        <span>{{ remaining + (remaining > 1 ? " items" : " item") }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a :class="{ selected: visibility == 'all' }" href="#/all">All</a>
        </li>
        <li>
          <a :class="{ selected: visibility == 'active' }" href="#/active"
            >Active</a
          >
        </li>
        <li>
          <a :class="{ selected: visibility == 'completed' }" href="#/completed"
            >Completed</a
          >
        </li>
      </ul>
      <button v-on:click="clearCompleted" class="clear-completed">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style>
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>
