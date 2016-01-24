defmodule ExTodo.TodoController do
  use ExTodo.Web, :controller

  alias ExTodo.Todo

  plug :scrub_params, "title" when action in [:create, :update]

  def index(conn, %{"filter" => "active"}) do
    render(conn, "reload_all.json", 
      itemsLeftCount: Todo.itemsLeftCount, 
      hasCompleted: Todo.has_completed?, 
      todos: Todo.get_all(:active))
  end

  def index(conn, %{"filter" => "completed"}) do
    render(conn, "reload_all.json", 
      itemsLeftCount: Todo.itemsLeftCount, 
      hasCompleted: Todo.has_completed?, 
      todos: Todo.get_all(:completed))
  end

  def index(conn, _params) do
    render(conn, "reload_all.json", 
      itemsLeftCount: Todo.itemsLeftCount, 
      hasCompleted: Todo.has_completed?, 
      todos: Todo.get_all)
  end

  def create(conn, %{"title" => title}) do
    changeset = Todo.changeset(%Todo{}, %{title: title})

    case Repo.insert(changeset) do
      {:ok, todo} ->
        conn
        |> put_status(:created)
        |> render("result.json", id: todo.id, title: todo.title, itemsLeftCount: Todo.itemsLeftCount, hasCompleted: Todo.has_completed?)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ExTodo.ChangesetView, "error.json", changeset: changeset)
    end
  end

  @doc """
  HTTP Request Type: Delete
  """
  def delete(conn, %{"id" => id}) do
    Todo.delete!(id)
    render(conn, "result.json", itemsLeftCount: Todo.itemsLeftCount, hasCompleted: Todo.has_completed?)
  end

  @doc """
  HTTP Request Type: Patch
  """
  def update(conn, %{"id" => id, "completed" => completed}) do
    Todo.toggle!(id, completed)
    render(conn, "result.json", itemsLeftCount: Todo.itemsLeftCount, hasCompleted: Todo.has_completed?)
  end

  @doc """
  HTTP Request Type: PUT
  """
  def update(conn, %{"id" => id, "title" => newTitle}) do
    Todo.edit!(id, newTitle)

    conn |> send_resp(200, "")
  end

  @doc """
  Delete completed todos and return all active.
  """
  def delete(conn, %{"current_filter" => _}) do
    Todo.delete_completed
    todos = Todo.get_all(:active)
    render(conn, "reload_all.json", itemsLeftCount: Enum.count(todos), hasCompleted: false, todos: todos)
  end

  @doc """
  Delete completed todos.
  """
  def delete(conn, %{"current_filter" => "completed"}) do
    Todo.delete_completed
    render(conn, "reload_all.json", itemsLeftCount: Todo.itemsLeftCount, hasCompleted: false)
  end
end
