import "./App.css";
import { ChangeEvent, useState } from "react";
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
  new Array(5)
    .fill(null)
    .map((_, idx) => ({ done: Math.random() > 0.5, text: "todo-" + idx })),
);

const INIT_THEME_COLOR = "#0f3128";

function useThemedShell() {
  let handleThemeColorChange: (ev: ChangeEvent<HTMLInputElement>) => void;

  function Shell(props: React.PropsWithChildren<unknown>) {
    const [themeColor, setThemeColor] = useState(INIT_THEME_COLOR);

    handleThemeColorChange = (ev: ChangeEvent<HTMLInputElement>) => {
      console.log("dev handleThemeColorChange", ev, ev.target.value);
      const nextColor = ev.target.value;
      setThemeColor(nextColor);
    };

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
      onChange={(e) => handleThemeColorChange(e)}
    />,
  ] as const;
}

function App() {
  const renderCnt = useRenderCount();

  const [ThemedShell, colorPicker] = useThemedShell();

  return (
    <ThemedShell>
      <p>strict mode renders twice on re-render</p>
      <p>app renderCnt:{renderCnt}</p>
      {colorPicker}
      <ol>
        {todos.map((todo) => (
          <Todo key={todo.text} {...todo} />
        ))}
      </ol>
    </ThemedShell>
  );
}

export default App;
