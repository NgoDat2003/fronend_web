import { Carousel } from "antd";
import Slider_1 from "../../image/Slider_1.png";
import Slider_2 from "../../image/slider_2.png";
import Slider_3 from "../../image/slider_3.png";
import Slider_4 from "../../image/slider_4.png";
const contentStyle = {
  objectFit: "cover",
  width: "100%",
  height: "566px",
};
const CaroselHomePage = () => {


  return (
    <Carousel
      autoplay
      draggable
    >
      <div>
        <img src={Slider_1} alt="" style={contentStyle} />
      </div>
      <div>
        <img src={Slider_2} alt="" style={contentStyle} />
      </div>
      <div>
        <img src={Slider_3} alt="" style={contentStyle} />
      </div>
      <div>
        <img src={Slider_4} alt="" style={contentStyle} />
      </div>
    </Carousel>
  );
};
export default CaroselHomePage;
