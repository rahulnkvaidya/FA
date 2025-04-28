import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { serverUrl } from '../config';

const Header = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
//  console.log(menuItems)
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          serverUrl + `/api/menu`
        );
    //    console.log(response.data)
        const data = response.data;
        if (data && data.length > 1) {
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <div className="mt-2">
      <style jsx>{`
        .list-group-item:hover {
          background-color: #f5f5f5;
        }
        .list-group-item.active {
          background-color: #007bff;
          color: white;
        }
      `}</style>

      <ul className="list-group">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {item.icon} {item.label}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Header;
