ExUnit.start

Mix.Task.run "ecto.create", ~w(-r ExTodo.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r ExTodo.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(ExTodo.Repo)

