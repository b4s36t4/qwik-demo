import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  routeAction$,
  routeLoader$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { AxiosError } from "axios";
import { instance } from "~/axiosInstance";

export const useCreateTodo = routeAction$(async (form, { fail, redirect }) => {
  try {
    await instance.post("/todos", {
      data: {
        title: form.title,
        description: form.description,
        completed: false,
      },
    });

    redirect(301, "/");
  } catch (e) {
    if (e instanceof AxiosError) {
      return fail(500, { status: "error", error: e.response?.data.message });
    }
  }
});

export const useEditTodo = routeAction$(async (form, { fail, redirect }) => {
  try {
    await instance.put(`/todos/${form.id}`, {
      data: {
        ...(form as any).data,
      },
    });
    redirect(301, "/");
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(JSON.stringify(e.response?.data), "data");
      return fail(500, { status: "error", error: e.response?.data.message });
    }
  }
});

export const useTodo = routeLoader$<{
  id: string;
  attributes: {
    title: string;
    description: string;
    completed?: boolean;
  };
} | null>(async (requestEvent) => {
  const currentTodo = requestEvent.params;
  if (!currentTodo.id) {
    return null;
  }
  const parsedId = Number.parseInt(currentTodo.id);
  if (Number.isNaN(parsedId)) {
    return null;
  }
  const todoId = currentTodo.id;

  const res = await instance.get(`/todos/${todoId}`);

  return res.data.data as {
    id: string;
    attributes: {
      title: string;
      description: string;
      completed?: boolean;
    };
  };
});

const CreateTodo = component$(() => {
  const newTodo = useCreateTodo();
  const editTodo = useEditTodo();
  const location = useLocation();

  const todo = useTodo();

  const todoID = location.params as { id: "new" | number };

  const navigate = useNavigate();
  const isNew = useComputed$(() => {
    if (!todoID.id) {
      navigate("/");
      return false;
    }
    const parsed = Number.parseInt(todoID.id.toString());
    if (Number.isNaN(parsed) && todoID.id === "new") {
      return true;
    }

    return false;
  });

  const title = useSignal(todo.value?.attributes.title ?? "");
  const description = useSignal(todo.value?.attributes.description ?? "");
  const completed = useSignal(todo.value?.attributes.completed ?? false);

  const onSubmit = $(async () => {
    if (isNew.value) {
      await newTodo.submit({
        title: title.value,
        description: description.value,
      });
    } else {
      await editTodo.submit({
        data: {
          title: title.value,
          description: description.value,
          completed: completed.value,
        },
        id: todo.value?.id,
      });
    }
  });

  return (
    <div>
      <div class="flex flex-col items-center justify-center space-y-4">
        <h3 class="my-6">Create a new TODO</h3>
        <input
          placeholder="title"
          name="title"
          class="w-96 rounded-md border-2 p-1"
          bind:value={title}
        />
        <textarea
          name="description"
          placeholder="description"
          class="w-96 rounded-md border-2 p-1"
          bind:value={description}
        />
        {!isNew.value && (
          <div>
            <input type="checkbox" name="completed" bind:checked={completed} />
            <span>Mark as completed</span>
          </div>
        )}
        <button onClick$={onSubmit}>{isNew.value ? "Create" : "Update"}</button>
      </div>
    </div>
  );
});

export default CreateTodo;

export const head: DocumentHead = {
  title: "Create a new Todo",
};
