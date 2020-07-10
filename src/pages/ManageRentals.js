import React, { useEffect } from "react";
import { fetchUserRentals, deleteRental } from "actions";
import { useSelector, useDispatch } from "react-redux";
import RentalCard from "components/rental/RentalCard";
import ApiErrors from "components/forms/ApiErrors";
import { Link } from "react-router-dom";

const ManageRentals = (props) => {
  const  dispatch  = useDispatch();
  useEffect(() => {
    dispatch(fetchUserRentals());
  }, [dispatch]);

  const deleteRental = (rentalId) => {
    const canDelete = askForPermission();
    if (!canDelete) {
      return;
    }

    dispatch(deleteRental(rentalId));
  };

  const askForPermission = () => {
    return window.confirm("Are you sure you want to delete this rental?");
  };

  const renderRentals = (rentals) => {
    return rentals.map((rental) => (
      <div key={rental._id} className="col-md-3">
        <RentalCard
          rental={rental}
          renderMenu={() => (
            <>
              <button
                onClick={() => deleteRental(rental._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
              <Link
                to={{ pathname: `/rentals/${rental._id}/edit` }}
                className="btn btn-bwm-main ml-2"
              >
                Update
              </Link>
            </>
          )}
        />
      </div>
    ));
  };

  const rentals = useSelector((state) => state.manage.rentals.items);
  const isFetching = useSelector((state) => state.manage.rentals.isFetching);
  const errors = useSelector((state) => state.manage.rentals.errors);
  return (
    <div className="card-list">
      <h1 className="page-title">My Rentals</h1>
      <ApiErrors errors={errors} />
      <div className="row">{renderRentals(rentals)}</div>
      {!isFetching && rentals.length === 0 && (
        <p className="alert alert-warning">
          You dont have any rentals currently created :(
        </p>
      )}
    </div>
  );
};

export default  ManageRentals ; 