import React, { useEffect, useState, useContext } from "react";
import { getMembership } from "../../api/membershipApi";
import Menu from "../Layouts/Menu";
import { MembershipContext } from "./Context/MembershipContext";
import { useNavigate } from "react-router-dom";
import IsSystemUser from "../../CustomHook/IsSystemUser";
import { Ability } from "../../Authentication/PermissionForUser";

const Membership = () => {
  const { userData, membershipPlan, setMembershipPlan, setTotal } =
    useContext(MembershipContext);
  const [memberships, setMemberships] = useState([]); // Store membership plans
  const [selectPlan, setSelectPlan] = useState(null); // Track selected plan
  const [showLoginModal, setShowLoginModal] = useState(false); // Control modal visibility
  const navigate = useNavigate();
  const [isMember, setIsmember] = useState(false);
  const ability = Ability();
  const [user, setUser] = useState(null);

  // Check system user details on component mount
  useEffect(() => {
    const { isMember, user } = IsSystemUser();
    setIsmember(isMember);
    if (user) {
      setUser(user);
    } else {
      // If no user exists, show the login modal immediately
      setShowLoginModal(true);
    }
  }, []);

  // Fetch membership plans on component mount
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getMembership();
        setMemberships(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching memberships:", error);
        setMemberships([]);
      }
    };

    fetchMemberships();
  }, []);

  // Handle plan selection with a login check
  const handleChoosePlan = (membership) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // If user is logged in, select the plan
    setSelectPlan({
      planName: membership.PlanName,
      price: membership.Price,
    });
    //console.log("membership", membership.id);
    setMembershipPlan({
      id: membership.id,
      duration: membership.Duration,
    });
    setTotal(membership.Price);
  };

  return (
    <div>
      {/* Pricing Section */}
      <div className="pricing8 py-2" style={{ marginTop: "4vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h3 className="mb-3">Pricing to make your Work Effective</h3>
              <h6 className="subtitle font-weight-normal">
                We offer 100% satisfaction and Money back Guarantee
              </h6>
            </div>

            {/* Membership Plans */}
            <div className="row mt-4">
              {memberships.map((membership, index) => (
                <div
                  className="col-md-4 ml-auto pricing-box align-self-center"
                  key={index}
                >
                  <div
                    className="card mb-4 text-white"
                    style={{ backgroundColor: "#4e73df" }}
                  >
                    <div className="card-body p-4 text-center">
                      <h5 className="font-weight-normal text-white">
                        {membership.PlanName}
                      </h5>
                      <sup>$</sup>
                      <span className="text-dark display-5 text-white">
                        {membership.Price}
                      </span>
                      <h6 className="font-weight-light font-14 text-white">
                        {membership.Duration}{" "}
                        {membership.Duration > 1 ? "Months" : "Month"}
                      </h6>
                      <p className="mt-4 text-white">
                        {membership.Description}
                      </p>
                    </div>
                    {selectPlan == null &&
                      isMember === false &&
                      ability.can("choose", "membership") && (
                        <button
                          className="btn btn-white p-3 btn-block border-0"
                          style={{ background: "white", color: "#4e73df" }}
                          onClick={() => handleChoosePlan(membership)}
                        >
                          CHOOSE PLAN
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Summary */}
      {selectPlan !== null && (
        <div className="container d-flex justify-content-center mt-1">
          <div className="border rounded p-3 w-100">
            <div className="d-flex justify-content-between">
              <p className="mb-1">{selectPlan.planName}</p>
              <p className="mb-1">${selectPlan.price}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <p className="fw-bold mb-0">Today's total</p>
              <p className="fw-bold mb-0 text-primary">${selectPlan.price}</p>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-danger w-75 mt-3"
                onClick={() => {
                  setSelectPlan(null);
                  setMembershipPlan(null);
                  setTotal(null);
                }}
              >
                Cancel Subscription
              </button>
            </div>
            <div
              className="d-flex justify-content-center mt-3"
              onClick={() => {
                navigate("/Payment");
              }}
            >
              <a href="#" className="btn btn-link p-0">
                Go to Payment &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowLoginModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  You need to be logged in or registered first to choose a plan.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate("/");
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
