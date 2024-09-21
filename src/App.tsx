import "./App.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRenderCount } from "@uidotdev/usehooks";

function Todo({ done: initDone, text }: { done: boolean; text: string }) {
  const renderCnt = useRenderCount();

  const [done, setDone] = useState(initDone);

  return (
    <li
      onClick={() => setDone((d) => !d)}
      className={"todo-list_item"}
      style={{ background: done ? "green" : "" }}
    >
      <span>
        todo renderCnt:{renderCnt} {done ? "done" : "not done"} {text}
      </span>
    </li>
  );
}

const todos = [
  { done: true, text: "fff" },
  { done: false, text: "eee" },
  { done: true, text: "ddd" },
].concat(
  new Array(5e4)
    .fill(null)
    .map((_, idx) => ({ done: Math.random() > 0.95, text: "todo-" + idx })),
);

const INIT_THEME_COLOR = "#0f3128";

function useThemedShell() {
  const refHandleThemeColorChange = useRef((() => {}) as (
    ev: ChangeEvent<HTMLInputElement>,
  ) => void);

  function Shell(props: React.PropsWithChildren<unknown>) {
    const [themeColor, setThemeColor] = useState(INIT_THEME_COLOR);

    useEffect(() => {
      refHandleThemeColorChange.current = (
        ev: ChangeEvent<HTMLInputElement>,
      ) => {
        const nextColor = ev.target.value;
        setThemeColor(nextColor);
      };
    }, [setThemeColor]);

    const renderCnt = useRenderCount();
    return (
      <main style={{ backgroundColor: themeColor }}>
        <p>themed shell renderCnt:{renderCnt}</p>
        {props.children}
      </main>
    );
  }

  return [
    Shell,
    <input
      defaultValue={INIT_THEME_COLOR}
      type="color"
      name="theme-color"
      id="theme-color"
      onChange={(e) => refHandleThemeColorChange.current?.(e)}
    />,
  ] as const;
}

enum TODO_FILTER {
  ALL = 1000,
  DONE,
  NOT_DONE,
}

function TodoFilterRadioButtons(props: {
  value: TODO_FILTER;
  onChange: (value: TODO_FILTER) => void;
  options: { value: TODO_FILTER; label: string }[];
}) {
  const { value, onChange, options } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(+e.target.value);
  }

  return options.map((option) => {
    const key = "todo-filter_" + option.label;
    return (
      <label htmlFor={key}>
        <input
          key={key}
          type="radio"
          name="todo-filter"
          id={key}
          value={option.value}
          onChange={handleChange}
          defaultChecked={option.value === value}
        />
        {option.label}
      </label>
    );
  });
}

function App() {
  const renderCnt = useRenderCount();

  const [ThemedShell, colorPicker] = useThemedShell();

  const [todoFilter, setTodoFilter] = useState(TODO_FILTER.ALL);
  function handleTodoFilterChange(value: TODO_FILTER) {
    setTodoFilter(value);
  }

  const showingTodos = todos.filter((todo) => {
    switch (todoFilter) {
      case TODO_FILTER.ALL:
        return true;
      case TODO_FILTER.DONE:
        return todo.done;
      case TODO_FILTER.NOT_DONE:
        return !todo.done;
    }
  });

  return (
    <ThemedShell>
      <p>strict mode renders twice on re-render</p>
      <p>app renderCnt:{renderCnt}</p>
      {colorPicker}
      {TodoFilterRadioButtons({
        value: todoFilter,
        onChange: handleTodoFilterChange,
        options: [
          { value: TODO_FILTER.NOT_DONE, label: "not done" },
          { value: TODO_FILTER.ALL, label: "all" },
          { value: TODO_FILTER.DONE, label: "done" },
        ],
      })}
      <h2>showing {showingTodos.length} todos</h2>
      <ol>
        {showingTodos.map((todo) => (
          <Todo key={todo.text} {...todo} />
        ))}
      </ol>
    </ThemedShell>
  );
}

export default App;
