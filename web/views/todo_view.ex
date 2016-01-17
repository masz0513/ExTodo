defmodule ExTodo.TodoView do
  use ExTodo.Web, :view

  def render("index.json", %{todos: todos}) do
    %{todos: render_many(todos, ExTodo.TodoView, "todo.json")}
  end

  def render("show.json", %{todo: todo}) do
    %{todo: render_one(todo, ExTodo.TodoView, "todo.json")}
  end

  def render("todo.json", %{todo: todo}) do
    %{id: todo.id,
      title: todo.title,
      completed: todo.completed,
      archived: todo.archived}
  end

  def render("stat.json", %{todos: todos}) do
    %{itemsLeftCount: ExTodo.PageView.items_left_count(todos),
      hasCompleted: ExTodo.PageView.has_completed?(todos)}
  end
end
