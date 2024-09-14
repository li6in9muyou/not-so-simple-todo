import {
  ChangeEvent,
  Children,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import "./App.css";
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
        renderCnt:{renderCnt} {done ? "done" : "not done"} {text}
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

const ThemedShellInputProvider = createContext(null);

function ThemedShell(props: any) {
  const [themeColor, setThemeColor] = useState(INIT_THEME_COLOR);

  function handleThemeColorChange(ev: ChangeEvent<HTMLInputElement>) {
    const nextColor = ev.target.value;
    setThemeColor(nextColor);
    console.log("dev handleThemeColorChange", nextColor);
  }

  const renderCnt = useRenderCount();
  return (
    <main style={{ backgroundColor: themeColor }}>
      <p>renderCnt:{renderCnt}</p>
      <ThemedShellInputProvider.Provider
        value={
          <input
            defaultValue={themeColor}
            type="color"
            name="theme-color"
            id="theme-color"
            onChange={handleThemeColorChange}
          />
        }
      >
        {props.children}
      </ThemedShellInputProvider.Provider>
    </main>
  );
}

function App() {
  const renderCnt = useRenderCount();
  const colorPicker = useContext(ThemedShellInputProvider);

  return (
    <ThemedShell>
      <p>strict mode renders twice on re-render</p>
      <p>renderCnt:{renderCnt}</p>
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
