import React, { useEffect } from "react";
import BookingListing from "components/booking/BookingListing";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBookings, deleteBooking } from "actions";

const ManageBookings = (props) => {
  const  dispatch  = useDispatch();
  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const deleteBooking = (bookingId) => {
    const canDelete = askForPermission();
    if (!canDelete) {
      return;
    }
    dispatch(deleteBooking(bookingId));
  };
   
  const askForPermission = () => {
    return window.confirm("Are you sure you want to delete this booking?");
  };

  const bookings = useSelector((state) => state.manage.bookings.items);
  const isFetching = useSelector((state) => state.manage.bookings.isFetching);
  const errors = useSelector((state) => state.manage.bookings.errors);
  return (
    <BookingListing
      errors={errors}
      isFetching={isFetching}
      title="My Bookings"
      bookings={bookings}
      renderMenu={(bookingId) => (
        <button
          onClick={() => deleteBooking(bookingId)}
          className="btn btn-danger"
        >
          Delete
        </button>
      )}
    />
  );
};

export default  ManageBookings; 