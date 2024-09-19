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
import display from '../assests/Display.svg'
import UserCard from './UserCard';

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
      const unassignedTickets = tickets.filter(ticket => !ticket.userId);
if (unassignedTickets.length > 0) {
  groupedTickets['Unassigned'] = unassignedTickets;
}
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
      <div style={{ position: 'relative', marginBottom: '2vh'}} >
        <button
          onClick={toggleDisplay}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1vh',
            border: '0.1vh solid #ccc',
            borderRadius: '0.5vh',
            background: 'white',
            cursor: 'pointer',
            marginLeft: "2vw",
            marginTop:'2vw'
          }}
        >
           <img 
            src={display} 
            alt="Display"
            style={{ 
              width: '2vh',
              height: '2vh',
              marginRight: '1vw'
            }}
          /> Display
          <span style={{ marginLeft: '1vw' }}>{isDisplayOpen ? '▲' : '▼'}</span>
        </button>
        {isDisplayOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              border: '0.1vh solid #ccc',
              borderRadius: '0.5vh',
              padding: '1vh',
              zIndex: 1000,
            }}
          >
            <div style={{ marginBottom: '1vh' }}>
              <label style={{ display: 'block', marginBottom: '0.5vh' }}>Grouping</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                style={{ width: '100%', padding: '0.5vh' }}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5vh' }}>Ordering</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                style={{ width: '100%', padding: '0.5vh' }}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2vw' }}>
        {groupedAndSortedTickets.map(({ groupName, tickets }) => (
          <div key={groupName} style={{ flex: '1 1 18vw', minWidth: '18vw', maxWidth: '100%' }}>
            <div style={{ padding: '0 1vw' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {getGroupImage(groupName) && (
                    <img
                      src={getGroupImage(groupName)}
                      alt={groupName}
                      style={{ width: '1.5vw', height: '1.5vw', marginRight: '0.5vw' }}
                    />
                  )}
                  {group === 'user' && (
                    <div style={{ position: 'relative', marginRight: '0.5vw' }}>
                      <img
                        src="//i.ibb.co/3hZy7G2/Whats-App-Image-2022-02-06-at-9-42-49-PM.jpg"
                        alt="profilepic"
                        style={{ width: '1.5vw', height: '1.5vw', borderRadius: '50%' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '0.5vw',
                          height: '0.5vw',
                          borderRadius: '50%',
                          backgroundColor: users.find(user => user.name === groupName)?.available ? 'green' : 'grey',
                        }}
                      />
                    </div>
                  )}
                  <span style={{fontSize:'1.6vw'}}>{groupName}</span>
                  <span style={{ marginLeft: '0.5vw', fontSize: '1.4vw', color: '#666' }}>
                    {tickets.length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={add} alt="add" style={{ width: '1.5vw', height: '1.5vw', marginRight: '0.5vw' }} />
                  <img src={dot3} alt="options" style={{ width: '1.5vw', height: '1.5vw' }} />
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