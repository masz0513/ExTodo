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

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(todo)

    send_resp(conn, :no_content, "")
  end

  def toggle(conn, %{"id" => id, "completed" => completed}) do
    Todo.toggle(id, completed)
    todos = Todo.get_all_active
    render(conn, "stat.json", todos: todos)
  end
end
