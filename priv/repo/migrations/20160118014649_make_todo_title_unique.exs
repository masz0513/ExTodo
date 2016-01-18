defmodule ExTodo.Repo.Migrations.MakeTodoTitleUnique do
  use Ecto.Migration

  def change do
    create unique_index(:todos, [:title])
  end
end
