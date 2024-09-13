import { useState } from "react";
import "./App.css";
import { useRenderCount } from "@uidotdev/usehooks";

function Todo({
  done,
  text,
  toggle,
}: {
  toggle: (text: string) => void;
  done: boolean;
  text: string;
}) {
  const renderCnt = useRenderCount();

  return (
    <li
      onClick={() => toggle(text)}
      className={"todo-list_item"}
      style={{ background: done ? "green" : "" }}
    >
      <span>
        renderCnt:{renderCnt} {done ? "done" : "not done"} {text}
      </span>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState(
    [
      { done: true, text: "fff" },
      { done: false, text: "eee" },
      { done: true, text: "ddd" },
    ].concat(
      new Array(5)
        .fill(null)
        .map((_, idx) => ({ done: Math.random() > 0.5, text: "todo-" + idx })),
    ),
  );

  function handleToggleTodo(text: string) {
    setTodos((todos) => {
      return todos.map((todo) => ({
        ...todo,
        done: todo.text === text ? !todo.done : todo.done,
      }));
    });
  }

  const renderCnt = useRenderCount();
  return (
    <>
      <main>
        <p>strict mode renders twice on re-render</p>
        <p>renderCnt:{renderCnt}</p>
        <ol>
          {todos.map((todo) => (
            <Todo toggle={handleToggleTodo} key={todo.text} {...todo} />
          ))}
        </ol>
      </main>
    </>
  );
}

export default App;
