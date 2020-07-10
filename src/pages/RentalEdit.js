import React, { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRentalById, verifyRentalOwner, updateRental } from "actions";
import TomMap from "components/map/TomMap";
import RentalAssets from "components/rental/RentalAssets";
import { capitalize } from "helpers/functions";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditableInput,
  EditableTextarea,
  EditableSelect,
  EditableImage,
} from "components/editable";

const withUserCheck = (Component) => (props) => {
  const [guard, setGuard] = useState({ canProceed: false, isChecking: true });
  const { id } = props.match.params;

  useEffect(() => {
    verifyRentalOwner(id)
      .then((_) => setGuard({ canProceed: true, isChecking: false }))
      .catch((_) => setGuard({ canProceed: false, isChecking: false }));
  }, [id]);

  const { canProceed, isChecking } = guard;
  if (!isChecking && canProceed) {
    return <Component {...props} />;
  } else if (!isChecking && !canProceed) {
    return <Redirect to={{ pathname: "/" }} />;
  } else {
    return <h1>Loading...</h1>;
  }
};

const RentalEdit = (props) => {
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

  const lupdateRental = (rentalData, onSuccess, onError) => {
    dispatch(updateRental(id, rentalData))
      .then(() => {
        onSuccess();
      })
      .catch((errors) => {
        const message =
          errors.length > 0 ? errors[0].detail : "Ooops, something went wrong";
        toast.error(message, {
          autoClose: 3000,
        });
        onError();
      });
  };

  const rental = useSelector((state) => state.rental.item);
  const isFetching = useSelector((state) => state.rental.isFetching);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { street, city } = rental;
  const location = street && city && city + ", " + street;
  if (isFetching || !rental._id) {
    return null;
  }

  return (
    <section id="rentalEdit">
      <div className="upper-section">
        <div className="row">
          <div className="col-md-6">
            <EditableImage
              entity={rental}
              field={"image"}
              containerType={"block"}
              className="rental-img mb-2"
              transformView={(image) => image.url}
              onUpdate={lupdateRental}
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
            <div className="rental">
              <span className="rental-city">Is shared: </span>
              <EditableSelect
                entity={rental}
                field={"shared"}
                containerType={"inline"}
                options={[true, false]}
                onUpdate={lupdateRental}
                className={`rental-type type-${rental.category}`}
              />
              <EditableSelect
                entity={rental}
                field={"category"}
                options={["apartment", "condo", "house"]}
                onUpdate={lupdateRental}
                className={`rental-type type-${rental.category}`}
              />
              <EditableInput
                entity={rental}
                field={"title"}
                onUpdate={lupdateRental}
                className={"rental-title"}
              />
              <EditableInput
                entity={rental}
                field={"city"}
                onUpdate={lupdateRental}
                transformView={(value) => capitalize(value)}
                className={"rental-city"}
              />
              <EditableInput
                entity={rental}
                field={"street"}
                onUpdate={lupdateRental}
                transformView={(value) => capitalize(value)}
                className={"rental-street"}
              />
              <div className="rental-room-info mb-1">
                <span>
                  <FontAwesomeIcon icon="building" />
                  <EditableInput
                    entity={rental}
                    field={"numOfRooms"}
                    onUpdate={lupdateRental}
                    containerType={"inline"}
                    className={"mr-0 ml-2"}
                  />{" "}
                  bedrooms
                </span>
                <span>
                  <FontAwesomeIcon icon="user" /> {rental.numOfRooms + 4} guests
                </span>
                <span>
                  <FontAwesomeIcon icon="bed" /> {rental.numOfRooms + 2} beds
                </span>
              </div>
              <EditableTextarea
                entity={rental}
                field={"description"}
                onUpdate={lupdateRental}
                className={"rental-description"}
                rows={5}
                cols={60}
              />
              <hr />
              <RentalAssets />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RentalEditWithRouterAndCheck = withRouter(withUserCheck(RentalEdit));
export default RentalEditWithRouterAndCheck;

 