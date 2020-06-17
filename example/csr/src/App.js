import React, { useEffect, useReducer, useState, useContext } from "react";
// import ContextDevTool from "react-context-devtool";

const MyContext1 = React.createContext({});
const MyContext2 = React.createContext({});

// MyContext1.displayName = "MyContext1";
// MyContext2.displayName = "MyContext2";

const demo = {
    id: "0001",
    type: "demo",
    name: "Context Demo",
};

const Test = () => {
    const [counter3, setCounter3] = React.useState(0);
    const [counter4, setCounter4] = React.useState(0);

    return (
        <div>
            {/* <button onClick={() => setCounter3(counter3 + 1)}>
                Click 3 Me {counter3}
            </button> */}
            {/* <button onClick={() => setCounter4(counter4 + 1)}>Click 4 Me {counter4}</button> */}
            <MyContext2.Provider value={{ id: counter4, b: "world" }}>
                {/* <ContextDevTool
          context={MyContext2}
          id="cont2"
          displayName="Demo Context"
        /> */}
                <button onClick={() => setCounter4(counter4 + 1)}>
                    Click 4 Me {counter4}
                </button>
            </MyContext2.Provider>
        </div>
    );
};

class Test2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter5: 0,
        };
    }

    render() {
        const { counter5 } = this.state;
        const { id } = this.props;
        // const { id } = this.context;

        return (
            <button onClick={() => this.setState({ counter5: counter5 + 1 })}>
                Click 5 Me {counter5} {id}
            </button>
        );
    }
}

Test2.contextType = MyContext1;

// function App() {
//   const [counter1, setCounter1] = React.useState(0);
//   const [counter2, setCounter2] = React.useState(0);

//   const updateCounter1 = () => {
//     setCounter1(counter1 + 1);
//   };

//   const updateCounter2 = () => {
//     setCounter2(counter2 + 1);
//   };

//   // useEffect(() => {
//   //   setInterval(() => {
//   //     setCounter2(counter2 + 1);
//   //   }, 200);
//   // }, [])

//   return (
//     <MyContext1.Provider value={{ ...demo, id: counter1 }}>
//       <ContextDevTool
//         context={MyContext1}
//         id="hello"
//         displayName="My Context"
//       />
//       <button onClick={updateCounter1}>Click Me {counter1}</button>
//       {/* <MyContext1.Consumer>
//         {
//           val => (
//             <button onClick={updateCounter1}>Click Me {val.id}</button>
//           )
//         }
//       </MyContext1.Consumer> */}
//       <MyContext2.Provider value={{ id: counter2, b: "world" }}>
//         <ContextDevTool
//           context={MyContext2}
//           id="cont2"
//           displayName="Demo Context"
//         />
//         <button onClick={updateCounter2}>Click Me {counter2}</button>
//       </MyContext2.Provider>
//       <button onClick={updateCounter2}>Click Me {counter2}</button>
//       <Test2 id={counter1} />
//     </MyContext1.Provider>
//   );
// }

const initialState = {count: 0};

// let counter = 0;

function reducer(state, action) {
  // counter++;
  // console.log(counter);
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const dd = useContext(MyContext1);
  // const [state2, dispatch3] = useReducer(reducer, initialState);
  // const [abcd, setabcd] = useState(2);


  return (
    <>
      {/* Count: {dd.id} */}
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

const d = "a".repeat(1 * 1024 * 1024);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter1: 1,
        };
    }

    render() {
      const { counter1 } = this.state;
        return (
          <>
            {/* {
              new Array(6000).fill().map((d, ind) => <div>{ind}</div>)
            } */}
            <MyContext1.Provider value={{ d , id: counter1 }} sdisplayName="test">
            {/* <> */}
                <button onClick={() => this.setState({ counter1: counter1 + 1 })}>Click Me {counter1}</button>
                <button onClick={() => changeValue({type: 'increment'})}>ddddddddddddddddddddd</button>
                <Counter />
                <div id="root1">ssss</div>
                {
                  counter1 < 4 && <Counter />
                }
                {
                  counter1 < 5 && <Test />
                }
                {/* <Test2 id={counter1} /> */}
                {/* <ContextDevTool
                  context={MyContext1}
                  id="cont2"
                  displayName="Demo Context"
                /> */}
              {/* </> */}
             </MyContext1.Provider>
          </>
        );
    }
}

export default App;