
import React, { useEffect } from 'react';
import BookingListing from 'components/booking/BookingListing';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReceivedBookings } from 'actions';

const ReceivedBookings = (props) => {
  const  dispatch  = useDispatch();
  useEffect(() => {
    dispatch(fetchReceivedBookings());
  }, [dispatch]);

  const bookings = useSelector((state) => state.manage.receivedBookings.items);
  const isFetching = useSelector((state) => state.manage.receivedBookings.isFetching);
  const errors = useSelector((state) => state.manage.receivedBookings.errors);
  return (
    <BookingListing
      errors={errors}
      isFetching={isFetching}
      title="Received Bookings"
      type="received"
      bookings={bookings} />
  )
}

export default  ReceivedBookings;
 