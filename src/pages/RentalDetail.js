import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRentalById } from "actions";
import RentalInfo from "components/rental/RentalInfo";
import TomMap from "components/map/TomMap";
import BookingReserve from "components/booking/BookingReserve";

const RentalDetail = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  useEffect(() => {
    dispatch(fetchRentalById(id));
    return () => {
      dispatch({ type: "UNMOUNT_RENTAL" });
    };
  }, [dispatch, id]);

  // useEffect(() => {
  //   return () => {
  //     dispatch({ type: "UNMOUNT_RENTAL" });
  //   };
  // }, [dispatch]);

  const rental = useSelector((state) => state.rental.item);
  const isFetching = useSelector((state) => state.rental.isFetching);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { street, city } = rental;
  const location = street && city && city + ", " + street;
  if (isFetching || !rental._id) {
    return null;
  }

  return (
    <section id="rentalDetails">
      <div className="upper-section">
        <div className="row">
          <div className="col-md-6">
            <img
              className="rental-img"
              src={rental.image.url}
              alt={rental.title}
            />
          </div>
          <div className="col-md-6">
            <TomMap location={location} />
          </div>
        </div>
      </div>
      <div className="details-section">
        <div className="row">
          <div className="col-md-8">
            <RentalInfo rental={rental} />
          </div>
          <div className="col-md-4">
            <BookingReserve rental={rental} isAuth={isAuth} />
          </div>
        </div>
      </div>
    </section>
  );
};

const RentalDetailWithRouter = withRouter(RentalDetail);
export default RentalDetailWithRouter;


 