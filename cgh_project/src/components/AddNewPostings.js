import "../styles/staffdetailpage.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const AddNewPostings = () => {
  const { mcr_number } = useParams(); // Get the MCR number from route params
  const [isPostingFormOpen, setPostingFormOpen] = useState(false);

  const [newPosting, setNewPosting] = useState({
    mcr_number: mcr_number, // Set from URL params
    academic_year: "",
    school_name: "",
    posting_number: "",
    total_training_hour: "",
    rating: "",
  });

  const [postingStatus, setPostingStatus] = useState(""); // Status for posting number check
  const [postingMessage, setPostingMessage] = useState(""); // Message for posting number availability

  const handleNewPostingInputChange = async (event) => {
    const { name, value } = event.target;
    setNewPosting({
      ...newPosting,
      [name]: value,
    });

    // Only proceed if mcr_number, school_name, academic_year, and posting_number are all set
    if (
      name === "posting_number" &&
      newPosting.mcr_number &&
      newPosting.school_name &&
      newPosting.academic_year
    ) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/postings/check?mcr_number=${newPosting.mcr_number}&school_name=${newPosting.school_name}&academic_year=${newPosting.academic_year}&posting_number=${value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setPostingStatus("taken");
          setPostingMessage(
            "Posting number already exists for this MCR number, school, and academic year."
          );
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setPostingStatus("available");
          setPostingMessage("Posting number is available");
        } else {
          setPostingStatus("error");
          setPostingMessage("Error checking posting number");
        }
      }
    }
  };
  const handleNewPosting = async () => {
    // Input validation
    if (
      !newPosting.academic_year ||
      !newPosting.school_name ||
      !newPosting.total_training_hour ||
      !newPosting.rating
    ) {
      toast.error("Please fill all required fields before submitting");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/postings`,
        newPosting,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success("New posting added successfully!");
        setNewPosting({
          mcr_number: mcr_number,
          academic_year: "",
          school_name: "",
          posting_number: "",
          total_training_hour: "",
          rating: "",
        });
        setPostingStatus(""); // Reset posting status
        setPostingMessage(""); // Reset message
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding new posting:", error);
      toast.error("Failed to add new posting");
    }
  };

  return (
    <div>
      <ToastContainer />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="toggle-add-contract-button"
        onClick={() => setPostingFormOpen((prev) => !prev)}
      >
        {isPostingFormOpen ? "Close" : "Add New Postings"}
      </motion.button>
      {isPostingFormOpen && (
        <div>
          <div className="contract-input-container">
            <div className="input-group">
              <label>School Name:</label>
              <select
                name="school_name"
                value={newPosting.school_name}
                onChange={handleNewPostingInputChange}
              >
                <option value="">Select School</option>
                <option value="Duke NUS">Duke NUS</option>
                <option value="SingHealth Residency">
                  SingHealth Residency
                </option>
                <option value="SUTD">SUTD</option>
                <option value="NUS YLL">NUS Yong Loo Lin School</option>
                <option value="NTU LKC">NTU LKC</option>
              </select>
            </div>
          </div>

          <div className="contract-input-container">
            <div className="input-group">
              <label>Academic Year:</label>
              <select
                name="academic_year"
                value={newPosting.academic_year}
                onChange={handleNewPostingInputChange}
              >
                <option value="">Select Academic Year</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          <div className="contract-input-container">
            <div className="input-group">
              <label>Posting Number:</label>
              <input
                type="number"
                name="posting_number"
                placeholder="Posting Number"
                value={newPosting.posting_number}
                onChange={handleNewPostingInputChange}
              />
            </div>
          </div>

          <div className="contract-input-container">
            <div className="input-group">
              {postingMessage && (
                <div
                  className={`posting-message ${
                    postingStatus === "taken" ? "taken" : "available"
                  }`}
                >
                  <p>{postingMessage}</p>
                </div>
              )}
            </div>
          </div>

          <div className="contract-input-container">
            <div className="input-group">
              <label>Training Hours:</label>
              <input
                type="number"
                name="total_training_hour"
                placeholder="Training Hours"
                value={newPosting.total_training_hour}
                onChange={handleNewPostingInputChange}
              />
            </div>
          </div>

          <div className="contract-input-container">
            <div className="input-group">
              <label>Rating:</label>
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                step="0.5"
                value={newPosting.rating}
                onChange={handleNewPostingInputChange}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="add-contract-button"
            onClick={handleNewPosting}
          >
            Submit
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AddNewPostings;