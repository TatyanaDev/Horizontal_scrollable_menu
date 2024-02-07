import { services } from "../../constants";
import { Service } from "../Header";
import "./styles.css";

const Content = () => (
  <div className="blocks">
    {services?.map((service: Service, idx: number) => (
      <div data-id={`${idx}`} key={idx}>
        <h1 className="title">{service.title}</h1>

        <p className="description">{service.description}</p>
      </div>
    ))}
  </div>
);

export default Content;
