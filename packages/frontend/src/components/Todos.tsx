import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Todos = component$<{
  todos: {
    id: string;
    attributes: {
      title: string;
      description: string;
      completed?: boolean;
    };
  }[];
}>(({ todos }) => {
  return (
    <div class="mt-2 flex flex-col justify-center">
      {todos.map((todo) => {
        return (
          <div key={todo.id} class="my-2 w-80 rounded-lg border-2 p-4">
            <p class="font-bold underline">{todo.attributes.title}</p>
            <p class="italic text-gray-800">{todo.attributes.description}</p>
            <p>
              Status:{" "}
              <span class="font-bold underline">
                {todo.attributes.completed ? "Completed" : "Pending"}
              </span>
            </p>
            <Link href={`/todo/${todo.id}`} prefetch="js" replaceState={true}>
              <button class="float-right rounded-md bg-gray-400 p-2">
                Edit
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
});
