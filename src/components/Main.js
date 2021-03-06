import React, { Component } from "react";

import { AuthUserContext } from "./Session";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import HolidayCard from "./HolidayCard";
import QueueAnim from "rc-queue-anim";
import Slider from "react-slick";
import URL from "../configs/url.json";
import axios from "axios";
import loadingImg from "../svg/Interwind-1s-200px.svg";
import moment from "moment";
import { withFirebase } from "./Firebase";

const months = [
  { month: "January", data: [], bodyClass: "" },
  { month: "February", data: [] },
  { month: "March", data: [] },
  { month: "April", data: [] },
  { month: "May", data: [] },
  { month: "June", data: [] },
  { month: "July ", data: [] },
  { month: "August", data: [] },
  { month: "September", data: [] },
  { month: "October", data: [] },
  { month: "November ", data: [] },
  { month: "December", data: [] },
];

const mapingFromTemplate = (holidays) => {
  return months.map((item, index) => {
    item.data = holidays.filter(
      (holiday) => moment(holiday.publicHolidayDate).get("month") === index
    );
    item.bgUrl =
      "https://image.freepik.com/free-vector/geometric-background-japanese-style_23-2148474120.jpg";
    return item;
  });
};
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidaysData: [],
      yearSeleced: moment().year(),
      cardData: [],
      options: [],
      loading: false,
    };

    this.selectChange = this.selectChange.bind(this);
    // this.prepareOption = this.prepareOption.bind(this);
    this.getHolidayData = this.getHolidayData.bind(this);
    this.synchronizeData = this.synchronizeData.bind(this);
  }

  async componentDidMount() {
    const { firebase } = this.props;
    this.getHolidayData();
    firebase.askForPermissioToReceiveNotifications();
    firebase.onMessage();
  }

  synchronizeData = async () => {
    this.setState({ loading: true });
    const data = await this.getDatabase();
    const scgData = await this.getScgData();

    if (data && scgData && data.length !== scgData.length) {
      const url = `${URL.HolidaysAPI}/insert`;
      for (let index = 0; index < scgData.length; index++) {
        const element = scgData[index];
        await axios
          .post(url, element)
          .then((response) => console.log(response));
      }
    }

    await this.getHolidayData();

    this.setState({ loading: false });
  };

  getDatabase = () => {
    const { yearSeleced } = this.state;
    const url = `${URL.HolidaysAPI}/all?year=${yearSeleced}&grouping=true`;
    return axios.get(url).then((response) => response.data);
  };

  getScgData = () => {
    const { yearSeleced } = this.state;
    const url = `${URL.ScgAPI}?years=${yearSeleced}`;
    return axios.get(url).then((response) => response.data);
  };

  getHolidayData = async () => {
    this.setState({ loading: true });
    const data = await this.getScgData();
    this.setState({ cardData: mapingFromTemplate(data), loading: false });
  };

  selectChange(event) {
    this.setState({ yearSeleced: event.target.value });
  }

  renderCardGroup = () => {
    const { cardData, loading } = this.state;

    const now = moment();
    const month = now.format("MM");

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: parseInt(month) - 1,
      // adaptiveHeight: true
    };

    return loading ? (
      <div className="loading-center">
        <img
          src={loadingImg}
          style={{
            margin: "-100px 0 0 -100px",
          }}
          alt="loading"
        />
      </div>
    ) : (
      <div key="animate1">
        <Slider {...settings}>
          {cardData.map((item, index) => (
            <HolidayCard cardData={item} index={index} />
          ))}
        </Slider>
      </div>
    );
  };

  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          authUser ? (
            <div className="center-container">
              <CssBaseline />
              <Container>
                <QueueAnim delay={300}>{this.renderCardGroup()}</QueueAnim>
              </Container>
            </div>
          ) : (
            "Don't have permission"
          )
        }
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Main);
