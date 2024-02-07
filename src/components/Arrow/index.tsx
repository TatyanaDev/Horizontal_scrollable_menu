import { MouseEvent, RefObject } from "react";
import "./styles.css";

interface ArrowProps {
  nameOfClass: string;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  hookRef: RefObject<HTMLDivElement>;
  arrowSign: string;
}

const Arrow = ({ nameOfClass, onClick, hookRef, arrowSign }: ArrowProps) => (
  <div className={nameOfClass} onClick={onClick} ref={hookRef}>
    <p>{arrowSign}</p>
  </div>
);

export default Arrow;
