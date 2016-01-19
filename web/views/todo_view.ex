defmodule ExTodo.TodoView do
  use ExTodo.Web, :view

  def render("result.json", %{id: id, title: title, itemsLeftCount: itemsLeftCount, hasCompleted: hasCompleted}) do
    %{id: id, 
      title: title, 
      itemsLeftCount: itemsLeftCount, 
      hasCompleted: hasCompleted}
  end

  def render("result.json", %{itemsLeftCount: itemsLeftCount, hasCompleted: hasCompleted}) do
    %{itemsLeftCount: itemsLeftCount, 
      hasCompleted: hasCompleted}
  end

  def render("reload_all.json", %{itemsLeftCount: itemsLeftCount, hasCompleted: hasCompleted, todos: todos}) do
    %{itemsLeftCount: itemsLeftCount, 
      hasCompleted: hasCompleted,
      todos: render_many(todos, ExTodo.TodoView, "todo.json")}
  end

  def render("reload_all.json", %{itemsLeftCount: itemsLeftCount, hasCompleted: hasCompleted}) do
    %{itemsLeftCount: itemsLeftCount, 
      hasCompleted: hasCompleted,
      todos: []}
  end

  def render("todo.json", %{todo: todo}) do
    %{id: todo.id,
      title: todo.title,
      completed: todo.completed}
  end
end
