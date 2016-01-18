defmodule ExTodo.TodoController do
  use ExTodo.Web, :controller

  alias ExTodo.Todo

  plug :scrub_params, "title" when action in [:create, :update]

  def create(conn, %{"title" => title}) do
    changeset = Todo.changeset(%Todo{}, %{title: title})

    case Repo.insert(changeset) do
      {:ok, todo} ->
        conn
        |> put_status(:created)
        |> render("show.json", id: todo.id, title: todo.title, todos: Todo.get_all_active)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ExTodo.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    todo = Repo.get!(Todo, id)
    Repo.delete!(todo)
    render(conn, "stat.json", todos: Todo.get_all_active)
  end

  def toggle(conn, %{"id" => id, "completed" => completed}) do
    Todo.toggle(id, completed)
    render(conn, "stat.json", todos: Todo.get_all_active)
  end
end
