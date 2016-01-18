defmodule ExTodo.TodoView do
  use ExTodo.Web, :view

  def render("show.json", %{id: id, title: title, todos: todos}) do
    render("stat.json", %{todos: todos})
    |> Map.put(:id, id)
    |> Map.put(:title, title)
  end

  def render("stat.json", %{todos: todos}) do
    %{itemsLeftCount: ExTodo.PageView.items_left_count(todos),
      hasCompleted: ExTodo.PageView.has_completed?(todos)}
  end
end
