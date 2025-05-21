import React, { useEffect, useState } from "react";
import { writeClient } from '../../sanityClient';
import { Link } from 'react-router-dom';
import './ProfilesList.css';

export default function ProfilesList({ mockUsers }) {
  const [users, setUsers] = useState(mockUsers || null);

  useEffect(() => {
    if (!mockUsers) {
      writeClient
        .fetch('*[_type=="user"]{ _id, username, bio }')
        .then(setUsers)
        .catch(console.error);
    }
  }, [mockUsers]);

  if (!users) return <p>Laddar användarprofiler...</p>;

  return (
    <section className="profiles-list">
      <div>
        <h2>Användarprofiler</h2>
        <ul>
          {users.map(u => (
            <li key={u._id}>
              <Link to={`/profile/${u._id}`}>
                <strong>{u.username}</strong>
              </Link>
              <p>{u.bio?.slice(0, 60) || '_'}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
