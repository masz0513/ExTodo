defmodule ExTodo.PageController do
  use ExTodo.Web, :controller
  alias ExTodo.Todo

  def index(conn, _params) do
    todos = Todo.get_all_active
    render conn, "index.html", todos: todos
  end
end
