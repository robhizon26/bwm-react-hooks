import React, { useEffect } from "react";
import RentalCard from "components/rental/RentalCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchRentals } from "actions";

const RentalHome = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRentals());
  }, [dispatch]);

  const renderRentals = (rentals) =>
    rentals.map((rental) => (
      <div key={rental._id} className="col-md-3">
        <RentalCard rental={rental} />
      </div>
    ));
  const rentals = useSelector((state) => state.rentals.items);

  return (
    <div className="card-list">
      <h1 className="page-title">Your Home All Around the World</h1>
      <div className="row">{renderRentals(rentals)}</div>
    </div>
  );
};

export default RentalHome;
 