import React, { useState, useEffect } from 'react';
import styles from "./UserCard.module.css";
import todo from "../assests/todo.svg";
import done from "../assests/Done.svg";
import cancel from "../assests/Cancelled.svg";
import progress from "../assests/inprogress.svg";
import backlog from "../assests/backlog.svg";
import nopr from "../assests/nopr.svg";
import lowpr from "../assests/lowpr.svg";
import mediumpr from "../assests/mediumpr.svg";
import highpr from "../assests/highpr.svg";
import urgentpr from "../assests/urgentpr.svg";

const UserCard = ({ id, title, priority, status, tags, user, group }) => {
  const [statusIcon, setStatusIcon] = useState(null);
  const [priorityIcon, setPriorityIcon] = useState(null);
  const [hideStatus, setHideStatus] = useState(false);
  const [hideUser, setHideUser] = useState(false);
  const [hidePriority, setHidePriority] = useState(false);

  useEffect(() => {
    if (group === "status") {
      setHideStatus(true);
    } else if (group === "user") {
      setHideUser(true);
    } else if (group === "priority") {
      setHidePriority(true);
    }
  }, [group]);

  useEffect(() => {
    if (status === "Todo") {
      setStatusIcon(todo);
    } else if (status === "Done") {
      setStatusIcon(done);
    } else if (status === "Cancelled") {
      setStatusIcon(cancel);
    } else if (status === "In progress") {
      setStatusIcon(progress);
    } else if (status === "Backlog") {
      setStatusIcon(backlog);
    }
  }, [status]);

  useEffect(() => {
    if (priority === 0) {
      setPriorityIcon(nopr);
    } else if (priority === 1) {
      setPriorityIcon(lowpr);
    } else if (priority === 2) {
      setPriorityIcon(mediumpr);
    } else if (priority === 3) {
      setPriorityIcon(highpr);
    } else if (priority === 4) {
      setPriorityIcon(urgentpr);
    }
  }, [priority]);

  return (
    <div className={styles.carduc}>
      <div className={styles.idpuc}>
        <div>{id}</div>
        <div className={styles.userAvatarContainer}>
          <img
            src="//i.ibb.co/3hZy7G2/Whats-App-Image-2022-02-06-at-9-42-49-PM.jpg"
            alt="profilepic"
            className={styles.userAvatar}
            style={{ display: hideUser ? "none" : "block" }}
          />
          {!hideUser && (
            <div
              className={styles.availabilityIndicator}
              style={{
                backgroundColor: user.available ? 'green' : 'grey',
              }}
            />
          )}
        </div>
      </div>
      <div className={styles.miduc}>
        <span>
          <img src={statusIcon} alt={status} style={{ display: hideStatus ? "none" : "inline" }} />
        </span>
        <span><div className={styles.tuc}>{title}</div></span>
      </div>
      <div className={styles.infouc}>
        <div><img src={priorityIcon} alt={priority} style={{ display: hidePriority ? "none" : "inline" }} /></div>
        <div>
          {tags.map((tag, index) => (
            <div key={index}>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCard;