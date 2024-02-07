import { RefObject } from "react";
import { services } from "../../constants";
import "./styles.css";

export interface Service {
  title: string;
  description: string;
}

interface HeaderProps {
  titlesContainerRef: RefObject<HTMLDivElement>;
}

const Header = ({ titlesContainerRef }: HeaderProps) => (
  <div className="titles">
    <div ref={titlesContainerRef}>
      {services.map((service: Service, idx: number) => (
        <button data-id={`${idx}`} key={idx}>
          {service.title}
        </button>
      ))}
    </div>
  </div>
);

export default Header;
