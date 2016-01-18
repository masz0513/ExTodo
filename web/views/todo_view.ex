defmodule ExTodo.TodoView do
  use ExTodo.Web, :view

  def render("show.json", %{id: id, title: title, todos: todos}) do
    render("stat.json", %{todos: todos})
    |> Map.put(:id, id)
    |> Map.put(:title, title)
  end

  def render("stat.json", %{todos: todos}) do
    %{itemsLeftCount: ExTodo.TodoView.items_left_count(todos),
      hasCompleted: ExTodo.TodoView.has_completed?(todos)}
  end

  def items_left_count(todos) do
    todos
    |> Enum.count(&(not &1.completed))
  end

  def has_completed?(todos) do
    todos
    |> Enum.any?(&(&1.completed))
  end
end
