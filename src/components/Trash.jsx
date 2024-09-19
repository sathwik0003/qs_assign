import React, { useEffect, useState } from 'react';
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
import dot3 from "../assests/3dot.svg";
import add from "../assests/add.svg";

// UserCard component remains the same

const AllDetails = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState('status');
  const [order, setOrder] = useState('priority');
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await res.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getDetails();
  }, []);

  const priorities = {
    0: 'No priority',
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
  };

  const statusOrder = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];

  const statusImages = {
    Todo: todo,
    'In progress': progress,
    Backlog: backlog,
    Done: done,
    Cancelled: cancel,
  };

  const priorityImages = {
    'No priority': nopr,
    Low: lowpr,
    Medium: mediumpr,
    High: highpr,
    Urgent: urgentpr,
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const getGroupedTickets = () => {
    let groupedTickets = {};

    if (group === 'status') {
      statusOrder.forEach(status => {
        groupedTickets[status] = tickets.filter(ticket => ticket.status === status);
      });
    } else if (group === 'user') {
      users.forEach(user => {
        groupedTickets[user.name] = tickets.filter(ticket => ticket.userId === user.id);
      });
      groupedTickets['Unassigned'] = tickets.filter(ticket => !ticket.userId);
    } else if (group === 'priority') {
      Object.values(priorities).forEach(priority => {
        groupedTickets[priority] = tickets.filter(ticket => priorities[ticket.priority] === priority);
      });
    }

    return groupedTickets;
  };

  const sortTickets = (ticketsArray) => {
    return ticketsArray.sort((a, b) => {
      if (order === 'priority') {
        return b.priority - a.priority;
      } else if (order === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return 0;
      }
    });
  };

  const groupedAndSortedTickets = Object.entries(getGroupedTickets()).map(
    ([groupName, groupTickets]) => ({
      groupName,
      tickets: sortTickets(groupTickets),
    })
  );

  const toggleDisplay = () => {
    setIsDisplayOpen(!isDisplayOpen);
  };

  const getGroupImage = (groupName) => {
    if (group === 'status') {
      return statusImages[groupName] || null;
    } else if (group === 'priority') {
      return priorityImages[groupName] || null;
    }
    return null;
  };

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <button
          onClick={toggleDisplay}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          <span style={{ marginRight: '10px' }}>&#9776;</span> Display
          <span style={{ marginLeft: '10px' }}>{isDisplayOpen ? '▲' : '▼'}</span>
        </button>
        {isDisplayOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              zIndex: 1000,
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Grouping</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Ordering</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {groupedAndSortedTickets.map(({ groupName, tickets }) => (
          <div key={groupName} style={{ flex: '1 0 250px', minWidth: '250px', maxWidth: '350px' }}>
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {getGroupImage(groupName) && (
                    <img
                      src={getGroupImage(groupName)}
                      alt={groupName}
                      style={{ width: '16px', height: '16px', marginRight: '8px' }}
                    />
                  )}
                  {group === 'user' && (
                    <div style={{ position: 'relative', marginRight: '8px' }}>
                      <img
                        src="//i.ibb.co/3hZy7G2/Whats-App-Image-2022-02-06-at-9-42-49-PM.jpg"
                        alt="profilepic"
                        style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: users.find(user => user.name === groupName)?.available ? 'green' : 'grey',
                        }}
                      />
                    </div>
                  )}
                  <span>{groupName}</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#666' }}>
                    {tickets.length}
                  </span>
                </div>
                <div>
                  <img src={add} alt="add" style={{ marginRight: '8px' }} />
                  <img src={dot3} alt="options" />
                </div>
              </h2>
            </div>
            {tickets.map((ticket) => {
              const user = getUserById(ticket.userId);
              return (
                <UserCard
                  key={ticket.id}
                  id={ticket.id}
                  title={ticket.title}
                  priority={ticket.priority}
                  status={ticket.status}
                  tags={ticket.tag}
                  user={user}
                  group={group}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDetails;