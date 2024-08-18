import "./DashboardGUI.css";
import React, { Fragment, useState, useEffect } from "react";
import api from "../../api/posts"; // Prilagodite putanju prema vašem API alatu
import { useAuth } from "../../hooks/useAuth";

export default function DashboardGUI() {
  // State-ovi za korisnike, pretragu, sortiranje, filtriranje, uređivanje, i paginaciju
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [genderFilter, setGenderFilter] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2; // Broj korisnika po strani
  const { token } = useAuth(); // Koristi autentifikacioni token iz hook-a

  // Funkcija za dobijanje korisnika sa servera
  const getUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          "x-auth-token": token,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Funkcija za brisanje korisnika
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Funkcija za promenu podataka korisnika koji se uređuje
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({
      ...editUserData,
      [name]: value,
    });
  };

  // Funkcija za ažuriranje korisnika
  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editUserId}`, editUserData, {
        headers: {
          "x-auth-token": token,
        },
      });
      getUsers();
      setEditUserId(null);
      setEditUserData({
        name: "",
        email: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // useEffect za inicijalno dobijanje korisnika
  useEffect(() => {
    getUsers();
  }, []);

  // Filtriranje korisnika prema pretrazi i filtriranju po polu
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "" || user.gender === genderFilter;
    return matchesSearchTerm && matchesGender;
  });

  // Sortiranje korisnika prema broju poruka
  const sortedUsers = filteredUsers.sort((a, b) => {
    const aMessages = a.messages.length;
    const bMessages = b.messages.length;
    if (sortOrder === "ascending") {
      return aMessages - bMessages;
    } else {
      return bMessages - aMessages;
    }
  });

  // Paginaranje korisnika
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Funkcija za konvertovanje podataka u CSV format
  const convertToCSV = (data) => {
    const header = ['User Name', 'User Email', 'Gender', 'Number of Messages'];
    const rows = data.map(user => [
      user.name,
      user.email,
      user.gender,
      user.messages.length
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  };

  // Funkcija za eksportovanje podataka u CSV fajl
  const exportToCSV = () => {
    const csvContent = convertToCSV(sortedUsers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Fragment>
      <section className="dashboard">
        <header className="dashboard-header">
          <h1 className="header">Dashboard</h1>
        </header>

        <main className="dashboard-content">
          <div className="filter-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by user name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-bar">
              <label htmlFor="sortOrder" className="sortLabel">Sort by number of messages:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>

            <div className="gender-filter-bar">
              <label htmlFor="genderFilter" className="genderLabel">Filter by gender:</label>
              <select
                id="genderFilter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="gender-select"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button onClick={exportToCSV} className="export-btn">Export to CSV</button>
          </div>

          {editUserId && (
            <div className="edit-popup">
              <div className="edit-form">
                <h2>Edit User</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editUserData.name}
                  onChange={handleEditChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editUserData.email}
                  onChange={handleEditChange}
                />
                <button onClick={handleUpdate}>Update User</button>
                <button onClick={() => setEditUserId(null)}>Cancel</button>
              </div>
            </div>
          )}

          <table className="user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Gender</th>
                <th>Number of Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-users-message">
                    No Data
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.messages.length}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditUserId(user._id);
                          setEditUserData({
                            name: user.name,
                            email: user.email,
                            password: "",
                            gender: user.gender,
                            bio: user.profile?.bio || "",
                            avatar: user.profile?.avatar || ""
                          });
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Kontrole za paginaciju */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-label">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </main>
      </section>
    </Fragment>
  );
}
