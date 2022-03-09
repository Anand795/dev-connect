import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Profile = ({ getProfileById, profile: { profile }, auth }) => {
  // Get ID from URL
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  return (
    <section className="container">
      <Fragment>
        {profile === null ? (
          <Spinner />
        ) : (
          <Fragment>
            <Link to="/profiles" className="btn btn-light">
              Back To Profiles
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === profile.user._id && (
                <Link to="/edit-profile" className="btn btn-dark">
                  Edit Profile
                </Link>
              )}
          </Fragment>
        )}
      </Fragment>
    </section>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.authReducer,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
