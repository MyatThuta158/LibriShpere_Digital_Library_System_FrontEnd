import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getNoti } from "../../api/notificationApi"; // Adjust the import path as needed

// Define your status priority ordering. Lower numbers mean higher priority.
const getStatusPriority = (status) => {
  switch (status) {
    case "Approved":
      return 1;
    case "Rejected":
      return 2;
    case "Resubmit":
      return 3;
    case "pending":
      return 4;
    case "cancel":
      return 5;
    default:
      return 6;
  }
};

function Notification() {
  const [notifications, setNotifications] = useState({
    subscription_notifications: [],
    discussion_notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNoti();
        //   console.log(data);
        setNotifications(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleDiscussionClick = (forumPostId) => {
    // Navigate to the related forum post page.
    navigate(`/community/postdetail/${forumPostId}`);
  };

  const handleRetryPayment = (subscriptionId) => {
    // Handle the payment retry action.
    //  console.log("Retry payment for subscription:", subscriptionId);
    navigate(`/Community/PaymentResubmit/${subscriptionId}`);
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Failed to load notifications: {error.message}
        </Alert>
      </Container>
    );
  }

  // Preprocess notifications so that for duplicate subscription IDs,
  // we mark the one with the highest-priority status as the "first occurrence."
  // First, create a copy of the subscription notifications and add an "isFirstOccurrence" flag.
  const processedNotifications = notifications.subscription_notifications.map(
    (notification) => ({
      ...notification,
      isFirstOccurrence: false,
    })
  );

  // Create a map to track the best (first) notification for each subscription id.
  const bestNotificationIndex = {};

  processedNotifications.forEach((notification, index) => {
    if (notification.subscription && notification.subscription.id) {
      const subId = notification.subscription.id;
      const currentPriority = getStatusPriority(
        notification.subscription.PaymentStatus
      );
      if (bestNotificationIndex[subId] === undefined) {
        bestNotificationIndex[subId] = index;
      } else {
        const bestIndex = bestNotificationIndex[subId];
        const bestPriority = getStatusPriority(
          processedNotifications[bestIndex].subscription.PaymentStatus
        );
        // If the current notification has a higher priority (lower number) then update.
        if (currentPriority < bestPriority) {
          bestNotificationIndex[subId] = index;
        }
      }
    }
  });

  // Now mark the best (first) occurrence for each subscription id.
  Object.values(bestNotificationIndex).forEach((index) => {
    processedNotifications[index].isFirstOccurrence = true;
  });

  return (
    <div>
      <Container className="my-4">
        {/* Subscription Notifications Section */}
        {processedNotifications && processedNotifications.length > 0 && (
          <Row className="mb-4">
            <Col>
              <h2>Subscription Notifications</h2>
              <Card>
                <ListGroup variant="flush">
                  {processedNotifications.map((notification) => (
                    <ListGroup.Item
                      key={notification.id}
                      className="text-white"
                      style={{ background: "#4e73df" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="text-white">
                            {notification.Description}
                          </h5>
                          <small className="text-white">
                            Created at:{" "}
                            {new Date(notification.created_at).toLocaleString()}
                          </small>
                          {/* Only show the badge if this notification is the chosen one for this subscription id */}
                          {notification.subscription &&
                            notification.isFirstOccurrence && (
                              <>
                                {notification.subscription.PaymentStatus ===
                                  "Approved" && (
                                  <div
                                    className="badge d-block mt-2 bg-success text-white"
                                    style={{ width: "10vw" }}
                                  >
                                    Payment Approved
                                  </div>
                                )}
                                {notification.subscription.PaymentStatus ===
                                  "Rejected" && (
                                  <div
                                    className="badge d-block mt-2 bg-danger text-white"
                                    style={{ width: "10vw" }}
                                  >
                                    Payment Rejected
                                  </div>
                                )}
                                {notification.subscription.PaymentStatus ===
                                  "Resubmit" && (
                                  <div
                                    className="badge d-block mt-2 bg-warning text-white"
                                    style={{ width: "10vw" }}
                                  >
                                    Payment Resubmitted
                                  </div>
                                )}
                                {notification.subscription.PaymentStatus ===
                                  "pending" && (
                                  <div
                                    className="badge d-block mt-2 bg-secondary text-white"
                                    style={{ width: "10vw" }}
                                  >
                                    Payment Pending
                                  </div>
                                )}
                                {notification.subscription.PaymentStatus ===
                                  "cancel" && (
                                  <div
                                    className="badge d-block mt-2 bg-warning text-white"
                                    style={{ width: "10vw" }}
                                  >
                                    Payment Cancelled
                                  </div>
                                )}
                              </>
                            )}
                        </div>
                        <span className="badge">
                          {/* Render Retry Payment button only for rejected status on the chosen notification */}
                          {notification.subscription &&
                            notification.isFirstOccurrence &&
                            notification.subscription.PaymentStatus ===
                              "Rejected" && (
                              <div className="mt-2">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="ms-2"
                                  onClick={() =>
                                    handleRetryPayment(
                                      notification.subscription.id
                                    )
                                  }
                                >
                                  Retry Payment
                                </Button>
                              </div>
                            )}
                        </span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )}

        {/* Discussion Notifications Section */}
        {notifications.discussion_notifications &&
          notifications.discussion_notifications.length > 0 && (
            <Row>
              <Col>
                <h2>Discussion Notifications</h2>
                <Card>
                  <ListGroup variant="flush">
                    {notifications.discussion_notifications.map(
                      (notification) => (
                        <ListGroup.Item
                          key={notification.id}
                          style={{ background: "#4e73df" }}
                          action
                          onClick={() =>
                            handleDiscussionClick(notification.ForumPostId)
                          }
                          className="cursor-pointer text-white"
                        >
                          <p className="mb-1">{notification.Content}</p>
                          <small className="text-white fw-bold">
                            From: {notification.user.name} | Created at:{" "}
                            {new Date(notification.created_at).toLocaleString()}
                          </small>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}
      </Container>
    </div>
  );
}

export default Notification;
