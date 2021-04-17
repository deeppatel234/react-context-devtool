import React, { useReducer } from "react";

const MyContext1 = React.createContext({});
const MyContext2 = React.createContext({});

MyContext1.displayName = "MyContext1";
MyContext2.displayName = "MyContext2";


const ws = new WeakSet();
const foo = {};

ws.add(foo);

let myMap = new Map()
myMap.set("s", 'not a number')

const valuesToTest = {
  f: new Set([1,2, 3,3]),
  g: ws,
  h: myMap,
  i: ws,
}

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
        <MyContext2.Provider value={{ id: counter5, b: "world", ...valuesToTest }}>
          <button onClick={() => this.setState({ counter5: counter5 + 1 })}>
              Click 5 Me {counter5} {id}
          </button>
        </MyContext2.Provider>
      );
  }
}

Test2.contextType = MyContext1;

function myReducer(state, action) {
  // counter++;
  // console.log(counter);
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      // throw new Error();
  }

  return state;
}

const initialState = {count: 0};

function Counter() {
  const [state, dispatch] = useReducer(myReducer, initialState);
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


export default function Home() {
  return (
    <div>
      <Test2 />
      <Counter />
    </div>
  )
}
