import React, { memo } from "react";

//components
import AllTable from "./Tables/all";
import TicketTable from "./Tables/ticket";
import ParkingTable from "./Tables/parking";

const Closure = ({ type, event }) => {

  return (
    <>
    {type === "all" && <AllTable type={type} event={event} />}
    {type === "ingresso" && <TicketTable type={type} event={event} />}
    {type === "estacionamento" && <ParkingTable type={type} event={event} />}
    </>
  );
};

export default memo(Closure);
