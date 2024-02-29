import { useContext } from "react";
import { AppContext } from "../AppContext";

export function useFigmaData() {
  const {
    data: { figmaData },
  } = useContext(AppContext);
  return figmaData;
}

export function useSettings() {
  const {
    data: { figmaData },
  } = useContext(AppContext);
  return figmaData.settings;
}

export function useAppState() {
  const {
    data: { state },
  } = useContext(AppContext);
  return state;
}

export function useDispatch() {
  const { dispatch } = useContext(AppContext);
  return dispatch;
}
