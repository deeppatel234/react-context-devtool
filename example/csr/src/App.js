import React from "react";
import ContextDevTool from "react-context-devtool";

const MyContext1 = React.createContext({});
const MyContext2 = React.createContext({});

const demo = {
  id: "0001",
  type: "demo",
  name: "Context Demo"
};

function App() {
  const [counter1, setCounter1] = React.useState(0);
  const [counter2, setCounter2] = React.useState(0);

  const updateCounter1 = () => {
    setCounter1(counter1 + 1);
  };

  const updateCounter2 = () => {
    setCounter2(counter2 + 1);
  };

  return (
    <MyContext1.Provider value={{ ...demo, id: counter1 }}>
      <ContextDevTool
        context={MyContext1}
        id="hello"
        displayName="My Context"
      />
      <button onClick={updateCounter1}>Click Me {counter1}</button>
      <MyContext2.Provider value={{ id: counter2, b: "world" }}>
        <ContextDevTool
          context={MyContext2}
          id="cont2"
          displayName="Demo Context"
        />
        <button onClick={updateCounter2}>Click Me {counter2}</button>
      </MyContext2.Provider>
    </MyContext1.Provider>
  );
}

export default App;
