import React, { useEffect, useState,useCallback,useRef } from 'react';
import { Link } from 'react-router-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import BwmModal from 'components/shared/Modal';
import ApiErrors from 'components/forms/ApiErrors';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { createBooking, getBookings } from 'actions';
import { toast } from 'react-toastify';

const moment = extendMoment(Moment);
let bookedOutDates = [];

const BookingReserve = props => {
  let dateRef = useRef();//React.createRef();
  const [errors, setErrors] = useState([]);
  const [proposedBooking, setProposedBooking] = useState({
    guests: '',
    startAt: null,
    endAt: null
  });
  const { rental, isAuth } = props;
  const getAsyncBookings = useCallback(async () => {
    bookedOutDates = await getBookings(rental._id);
  },[rental])

  useEffect(() => {
    getAsyncBookings();
  }, [getAsyncBookings]);

 
  const handleApply = (_, { startDate, endDate }) => {
    dateRef.current.value = moment(startDate).format('YYYY/MM/DD') + ' to ' + moment(endDate).format('YYYY/MM/DD')
    setProposedBooking({
      ...proposedBooking,
      startAt: startDate,
      endAt: endDate
    })
  }

  const processAditionalData = () => {
    setProposedBooking({
      ...proposedBooking,
      nights:nights(),
      price:price(),
      rental: props.rental
    });
  }

  const checkInvalidDates = (date) => {
    let isBookedOut = false;

    isBookedOut = bookedOutDates.some(booking =>
      moment.range(booking.startAt, booking.endAt).contains(date)
    )

    return date < moment().add(-1, 'days') || isBookedOut;
  }

  const handleGuestsChange = (event) => {
    setProposedBooking({
      ...proposedBooking,
      guests: parseInt(event.target.value, 10)
    });
  }

  const resetData = () => {
    dateRef.current.value = '';
    setProposedBooking({ guests: '', startAt: null, endAt: null });
    setErrors([]);
  }

  const reserveRental = (closeCallback) => {
    createBooking(proposedBooking)
      .then(newBooking => {
        bookedOutDates.push(newBooking);
        resetData();
        toast.success("Booking has been created!", {
          autoClose: 3000
        });
        closeCallback();
      })
      .catch((errors) => setErrors(errors))
  }

  const nights = () => {
    const { startAt, endAt } = proposedBooking;
    if (!startAt || !endAt) { return null; }
    const range = moment.range(startAt, endAt);
    return Array.from(range.by('days')).length - 1;
  }

  const price = () => {
    const { rental: { dailyPrice } } = props;
    return dailyPrice && nights() * dailyPrice;
  }

  const isBookingValid = () => {
    const { startAt, endAt, guests } = proposedBooking;
    return startAt && endAt && guests;
  }

  const formattedDate = () => {
    return dateRef.current ? dateRef.current.value : '';
  }
   
  const { guests } = proposedBooking;
  return (
    <div className='booking'>
      <h3 className='booking-price'>$ {rental.dailyPrice} <span className='booking-per-night'>per night</span></h3>
      <hr></hr>
      {!isAuth &&
        <Link
          to={{ pathname: '/login' }}
          className="btn btn-bwm-main btn-block">Login to book this place</Link>
      }
      {isAuth &&
        <>
          <div className='form-group'>
            <label htmlFor='dates'>Dates</label>
            <DateRangePicker
              onApply={handleApply}
              opens="left"
              containerStyles={{ display: 'block' }}
              isInvalidDate={checkInvalidDates}>
              <input
                ref={dateRef}
                id="dates"
                type="text"
                className="form-control">
              </input>
            </DateRangePicker>
          </div>
          <div className='form-group'>
            <label htmlFor='guests'>Guests</label>
            <input
              onChange={handleGuestsChange}
              value={guests}
              type='number'
              className='form-control'
              id='guests'
              aria-describedby='guests'>
            </input>
          </div>
          <BwmModal
            onSubmit={reserveRental}
            title="Confirm Booking"
            subtitle={formattedDate()}
            openBtn={
              <button
                onClick={processAditionalData}
                disabled={!isBookingValid()}
                className='btn btn-bwm-main btn-block'>Reserve place now
              </button>}
          >
            <div className="mb-2">
              <em>{nights()}</em> Nights /
              <em> ${rental.dailyPrice}</em> per Night
              <p>Guests: <em>{guests}</em></p>
              <p>Price: <em>${price()}</em></p>
              <p>Do you confirm your booking for selected days?</p>
            </div>
            <ApiErrors errors={errors} />
          </BwmModal>
        </>
      }
      <hr></hr>
      <p className='booking-note-title'>People are interested into this house</p>
      <p className='booking-note-text'>
        More than 500 people checked this rental in last month.
        </p>
    </div>
  )
}

export default BookingReserve;
 