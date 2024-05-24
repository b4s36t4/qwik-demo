import { Resource, component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { instance } from "~/axiosInstance";
import { Todos } from "~/components/Todos";

export const useTodos = routeLoader$(async () => {
  const request = await instance.get<{
    data: {
      id: string;
      attributes: {
        title: string;
        description: string;
        completed?: boolean;
      };
    }[];
  }>("/todos");
  return request.data.data;
});

export default component$(() => {
  const todos = useTodos();

  return (
    <div class="flex flex-col items-center justify-center">
      <h1>Hi, here are your todos</h1>
      <Link href="todo/new">Create New Todo</Link>
      <Resource
        value={todos}
        onPending={() => <p>Loading...</p>}
        onResolved={(value) => {
          return <Todos todos={value} />;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
