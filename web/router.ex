defmodule ExTodo.Router do
  use ExTodo.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ExTodo do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", ExTodo do
    pipe_through :api

    resources "/todos", TodoController, except: [:new, :edit]
    put "/todos/toggle/:id", TodoController, :toggle
  end
end
