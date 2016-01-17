# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     ExTodo.Repo.insert!(%ExTodo.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias ExTodo.Repo
alias ExTodo.Todo

[
  %Todo {
    title: "Sample Todo 1",
    completed: false,
    archived: false
  },
  %Todo {
    title: "Sample Todo 2",
    completed: false,
    archived: true
  }
] |>  Enum.each(&Repo.insert!(&1))