import { ButtonGroup, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { increment, reset, toggleDisabled } from "../store/counterSlice";

export default function CounterButtonGroup() {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.counter.value);
  const disabled = useSelector((state: RootState) => state.counter.disabled);

  return (
    <ButtonGroup variant="outlined" color="primary" orientation="vertical">
      <Button onClick={() => dispatch(increment())} disabled={disabled}>
        CLICK: {value}
      </Button>
      <Button onClick={() => dispatch(reset())}>CLEAR</Button>
      <Button onClick={() => dispatch(toggleDisabled())}>
        {disabled ? "ABLE" : "DISABLE"}
      </Button>
    </ButtonGroup>
  );
}
