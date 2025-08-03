import "./index.css";
import CounterButtonGroup from "./component/CounterButtonGroup";
import WorldBankPopulationChart from "./component/WorldBankPopulationChart";

export default function App() {
  return (
    <div className="App">
      <h2>Q1 ANSWER</h2>
      <CounterButtonGroup />
      <hr />
      <h2>Q2 ANSWER</h2>
      <WorldBankPopulationChart />
    </div>
  );
}
