defmodule ExTodo.Repo.Migrations.CreateTodo do
  use Ecto.Migration

  def change do
    create table(:todos) do
      add :title, :string
      add :completed, :boolean, default: false
      add :archived, :boolean, default: false

      timestamps
    end

  end
end
