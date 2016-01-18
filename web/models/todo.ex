defmodule ExTodo.Todo do
  use ExTodo.Web, :model
  import Ecto
  alias ExTodo.Repo
  alias ExTodo.Todo

  schema "todos" do
    field :title, :string
    field :completed, :boolean, default: false
    field :archived, :boolean, default: false

    timestamps
  end

  @required_fields ~w(title completed archived)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:title)
  end

  def get_all_active do
    query = from t in Todo, 
      where: not t.archived,
      order_by: [asc: t.id], 
      select: t
    Repo.all(query)
  end

  def toggle(id, completed) do
    todo = Repo.get!(Todo, id)
    Repo.update!(Todo.changeset(todo, %{completed: completed}))
  end
end
