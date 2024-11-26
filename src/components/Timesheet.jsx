import { useState, useEffect } from "react";
import "./Timesheet.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Timesheet = () => {
  const [data, setData] = useState({
    leaveType: "",
    workingHours: Array(15).fill(""),
    leaveHours: Array(15).fill(""),
    employeeName: "",
    totalHours: 0,
  });
  const navigate = useNavigate();
  const [selectedMonthRange, setSelectedMonthRange] = useState("Select Month");
  const [selectedLeaveType, setSelectedLeaveType] = useState("Casual Leave");
  const [days, setDays] = useState(Array.from({ length: 15 }, (_, i) => i + 1));

  const dateRanges = [
    { label: "15/11/2024", days: Array.from({ length: 15 }, (_, i) => i + 1) },
    { label: "30/11/2024", days: Array.from({ length: 15 }, (_, i) => i + 16) },
    { label: "15/12/2024", days: Array.from({ length: 15 }, (_, i) => i + 1) },
    { label: "31/12/2024", days: Array.from({ length: 16 }, (_, i) => i + 16) },
  ];

  const handleDateRangeChange = (range) => {
    setSelectedMonthRange(range.label);
    setDays(range.days);
    setData({
      ...data,
      workingHours: Array(range.days.length).fill(""),
      leaveHours: Array(range.days.length).fill(""),
    });
  };

  const calculateColumnTotal = (colIndex) => {
    return (
      (Number(data.workingHours[colIndex]) || 0) +
      (Number(data.leaveHours[colIndex]) || 0)
    );
  };

  const calculateOverallTotal = () => {
    return data.workingHours.reduce((total, _, index) => {
      return total + calculateColumnTotal(index);
    }, 0);
  };

  const handleChange = (e, row, col) => {
    const newData = { ...data };
    if (row === "workingHours") {
      newData.workingHours[col] = e.target.value;
    } else if (row === "leaveHours") {
      newData.leaveHours[col] = e.target.value;
    }
    setData(newData);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the user token is sent for authentication
      console.log("Submitting data: ", data);
      const calculatedTotalHours = calculateOverallTotal();
      const response = await axios.post(
        "https://tabletimesheetbackend.onrender.com/api/timesheet/addorupdate",
        {
          ...data,
          leaveType: selectedLeaveType,
          totalHours: calculatedTotalHours,
          workingHours: data.workingHours,
          leaveHours: data.leaveHours,
          selectedMonthRange,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Timesheet submitted successfully:", response.data);
      toast.success("Timesheet submitted successfully!");
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error(
        error.response?.data?.message ||
          "Error submitting timesheet. Please try again."
      );
    }
  };

  const handleLeaveTypeChange = (leaveType) => {
    setSelectedLeaveType(leaveType);
  };

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        const token = localStorage.getItem("token");
        const employeeName = localStorage.getItem("employeeName");
        if (employeeName) {
          setData((prevData) => ({
            ...prevData,
            employeeName,
          }));
        }

        console.log("Employee Name from localStorage:", employeeName);

        const response = await axios.get(
          `https://tabletimesheetbackend.onrender.com/api/timesheet/get?dateRange=${selectedMonthRange}`,
          {
            headers: { Authorization: token },
          }
        );

        const { data } = response.data;
        setData({
          leaveType: data.leaveType,
          workingHours: data.workingHours,
          leaveHours: data.leaveHours,
          totalHours: data.totalHours,
          employeeName: employeeName,
        });

        toast.success("Timesheet fetched successfully!");
      } catch (error) {
        console.error("Error fetching timesheet:", error);
        toast.error(
          error.response.data.message ||
            "Error fetching timesheet. Please try again."
        );
      }
    };

    fetchTimesheet();
  }, [selectedMonthRange]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeName");
    navigate("/login");
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th
              colSpan={days.length + 2}
              style={{
                backgroundColor: "#f9f9f9",
                textAlign: "left",
                fontSize: "20px",
              }}
            >
              Timesheet
              <span style={{ float: "right", fontSize: "16px" }}>
                Employee: {data.employeeName || "Loading..."}
              </span>
            </th>
          </tr>
          <tr>
            <th colSpan={days.length + 2} style={{ textAlign: "right" }}>
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={handleLogout} style={{ marginLeft: "4px" }}>
                Logout
              </button>
              <span style={{ float: "left", fontSize: "16px" }}>
                <div className="dropdown">
                  <span
                    className="dropdown-toggle"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    {selectedMonthRange}
                  </span>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {dateRanges.map((range) => (
                      <li key={range.label}>
                        <span
                          className="dropdown-item"
                          onClick={() => handleDateRangeChange(range)}
                          style={{ cursor: "pointer" }}
                        >
                          {range.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </span>
            </th>
          </tr>
          <tr>
            <th></th>
            {days.map((day, i) => (
              <th key={i}>Day {day}</th>
            ))}
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
                <div className="dropdown">
                  <span
                    id="dropdownLeaveType"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    {selectedLeaveType}
                  </span>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownLeaveType"
                  >
                    {["Casual Leave"].map((leaveType) => (
                      <li key={leaveType}>
                        <span
                          className="dropdown-item"
                          onClick={() => handleLeaveTypeChange(leaveType)}
                          style={{ cursor: "pointer" }}
                        >
                          {leaveType}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </td>
            {data.leaveHours.map((value, i) => (
              <td key={i}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e, "leaveHours", i)}
                />
              </td>
            ))}
            <td>
              {data.leaveHours.reduce(
                (total, value) => total + Number(value || 0),
                0
              ) > 0 &&
                data.leaveHours.reduce(
                  (total, value) => total + Number(value || 0),
                  0
                )}
            </td>
          </tr>
          <tr>
            <td>Working Hours</td>
            {data.workingHours.map((value, i) => (
              <td key={i}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e, "workingHours", i)}
                />
              </td>
            ))}
            <td>
              {data.workingHours.reduce(
                (total, value) => total + Number(value || 0),
                0
              ) > 0 &&
                data.workingHours.reduce(
                  (total, value) => total + Number(value || 0),
                  0
                )}
            </td>
          </tr>
          <tr>
            <td>Total Hours</td>
            {Array.from({ length: 15 }).map((_, i) => (
              <td key={i}>
                {calculateColumnTotal(i) > 0 && calculateColumnTotal(i)}
              </td>
            ))}
            <td>{calculateOverallTotal() > 0 && calculateOverallTotal()}</td>
          </tr>
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Timesheet;
