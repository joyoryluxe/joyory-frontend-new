// src/components/GiftCards.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/GiftCards.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const API_BASE = "https://beauty.joyory.com/api/user/giftcards";

export default function MyGiftCard() {
  const [giftCards, setGiftCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [voucherFilter, setVoucherFilter] = useState("all");
  const [valueFilter, setValueFilter] = useState("all");
  const [voucherOptions, setVoucherOptions] = useState([]);
  const navigate = useNavigate();

  // Fetch gift cards
  useEffect(() => {
    axios
      .get(`${API_BASE}/list`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          const cards = res.data.giftCards || [];
          setGiftCards(cards);
          setFilteredCards(cards);

          const types = Array.from(
            new Set(cards.map((c) => c.type?.toLowerCase()))
          ).filter(Boolean);
          setVoucherOptions(["all", ...types]);
        }
      })
      .catch((err) => {
        console.error("Error fetching gift cards:", err);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...giftCards];

    if (voucherFilter !== "all") {
      filtered = filtered.filter(
        (card) => card.type?.toLowerCase() === voucherFilter.toLowerCase()
      );
    }

    if (valueFilter !== "all") {
      filtered = filtered.filter((card) => {
        const amount = Number(card.minAmount || 0);
        if (valueFilter === "low") return amount <= 500;
        if (valueFilter === "mid") return amount > 500 && amount <= 2000;
        if (valueFilter === "high") return amount > 2000;
        return true;
      });
    }

    setFilteredCards(filtered);
  }, [voucherFilter, valueFilter, giftCards]);

  return (
    <>
      <Header />
      <div className="background-colors-for-gifting">
        <h2 className="text-center mb-3">My Gift Cards</h2>
        <p className="text-center text-muted mb-4">
          Choose a gift card for your loved ones and make their day special with Joyory's curated selection.
        </p>
      </div>

      <div className="bg">
        <div className="filter-backenground">
          <div className="container">
            <div className="d-flex align-items-center mb-4">
              <label className="me-2 fw-semibold">Filter by:</label>
              <select
                className="form-select me-3"
                style={{ width: "200px" }}
                value={voucherFilter}
                onChange={(e) => setVoucherFilter(e.target.value)}
              >
                {voucherOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Vouchers"
                      : type.charAt(0).toUpperCase() + type.slice(1) + " Vouchers"}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: "200px" }}
                value={valueFilter}
                onChange={(e) => setValueFilter(e.target.value)}
              >
                <option value="all">All Values</option>
                <option value="low">Below ₹500</option>
                <option value="mid">₹500 - ₹2000</option>
                <option value="high">Above ₹2000</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {filteredCards.map((card) => (
              <div key={card._id} className="col-md-4">
                <div className="card h-100 shadow-sm gift-card">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="card-img-top gift-card-img"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{card.title}</h5>
                    {/* <p className="text-muted">Starts at ₹{card.minAmount}</p> */}

                    {/* ✅ Navigate to details */}
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate(`/Giftcardinnersection/${card._id}`)}
                    >
                      Show Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCards.length === 0 && (
              <p className="text-center text-muted">
                No gift cards match your filter.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
