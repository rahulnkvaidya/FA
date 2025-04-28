import React from "react";
import moment from 'moment-timezone';

function Time(props) {
  // Assuming props.time is the date time from DynamoDB
  const dynamoDBTime = props.time;

  // Convert the date to IST (Indian Standard Time)
  const istTime = moment.tz(dynamoDBTime, 'Asia/Kolkata');

  // Convert IST time to the desired format for display
  const formattedTime = istTime.format('DD/MM/YYYY hh:mm A');

  return <div>{formattedTime}</div>;
}

export default Time;
