defmodule ExTodo.PageView do
  use ExTodo.Web, :view

  def items_left_count(todos) do
    todos
    |> Enum.count(&(not &1.completed))
  end

  def has_completed?(todos) do
    todos
    |> Enum.any?(&(&1.completed))
  end
end
