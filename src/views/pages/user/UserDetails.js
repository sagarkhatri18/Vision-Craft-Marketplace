import React from "react";
import { Tag } from "primereact/tag";

const UserDetails = (props) => {
  const userData = props.data;

  const severity = userData.verified ? "success" : "danger";
  const statusValue = userData.verified ? "VERIFIED" : "NOT VERIFIED";

  return (
    <>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>First Name: </th>
            <td>{userData.firstName}</td>
          </tr>
          <tr>
            <th>Last Name: </th>
            <td>{userData.lastName}</td>
          </tr>
          <tr>
            <th>Email: </th>
            <td>{userData.email}</td>
          </tr>
          {userData.contact != null ? (
            <tr>
              <th>Contact: </th>
              <td>{userData.contact}</td>
            </tr>
          ) : (
            ""
          )}
          {userData.address != null ? (
            <tr>
              <th>Address: </th>
              <td>{userData.address}</td>
            </tr>
          ) : (
            ""
          )}
          <tr>
            <th>Role: </th>
            <td>{userData.role}</td>
          </tr>
          <tr>
            <th>Verified: </th>
            <td>{<Tag value={statusValue} severity={severity} />}</td>
          </tr>
          <tr>
            <th>Created At: </th>
            <td>{new Date(userData.createdAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default UserDetails;
