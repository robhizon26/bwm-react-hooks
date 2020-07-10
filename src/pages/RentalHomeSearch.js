import React, { useEffect, useCallback } from "react";
import RentalCard from "components/rental/RentalCard";
import { useSelector,useDispatch } from "react-redux";
import { fetchRentals } from "actions";
import { withRouter } from "react-router-dom";
import { capitalize } from "helpers/functions";

const RentalHomeSearch = (props) => {
  const location = props.match.params.location;
  const  dispatch  = useDispatch();

  const getRentals = useCallback(
    (location) => {
      console.log("getRentals");
      dispatch(fetchRentals(location));
    },
    [dispatch]
  );

  useEffect(() => {
    getRentals(location);
  }, [getRentals, location]);

  const renderRentals = (rentals) =>
    rentals.map((rental) => (
      <div key={rental._id} className="col-md-3">
        <RentalCard rental={rental} />
      </div>
    ));

  const rentals = useSelector((state) => state.rentals.items);
  const isFetching = useSelector((state) => state.rentals.isFetching);
  const noRentalsFound = rentals.length === 0 && !isFetching;
  return (
    <div className="card-list">
      <h1 className="page-title">Your Home in "{capitalize(location)}"</h1>
      <div className="row">{renderRentals(rentals)}</div>
      {noRentalsFound && (
        <p className="alert alert-warning">No rentals found :(</p>
      )}
    </div>
  );
};

export default withRouter(RentalHomeSearch);
 